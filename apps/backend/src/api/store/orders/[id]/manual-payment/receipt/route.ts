import { deleteFilesWorkflow, uploadFilesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { MANUAL_PAYMENT_MODULE } from "../../../../../../modules/manual-payment"
import ManualPaymentModuleService from "../../../../../../modules/manual-payment/service"
import type { ManualPaymentStatus } from "../../../../../../modules/manual-payment/transitions"

type UploadedReceipt = {
  buffer: Buffer
  mimetype: string
  size: number
}

type ReceiptRequestBody = {
  payer_name?: unknown
  payment_reference?: unknown
}

type OrderForReceipt = {
  id: string
  customer_id: string | null
}

const allowedUploadStatuses = new Set<ManualPaymentStatus>([
  "awaiting_payment",
  "rejected",
])

const signatures: Record<string, (buffer: Buffer) => boolean> = {
  "image/jpeg": (buffer) =>
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff,
  "image/png": (buffer) =>
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    ),
  "image/webp": (buffer) =>
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP",
  "application/pdf": (buffer) =>
    buffer.length >= 5 && buffer.subarray(0, 5).toString("ascii") === "%PDF-",
}

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
}

const optionalText = (value: unknown, field: string, maxLength: number) => {
  if (value === undefined || value === null || value === "") {
    return { value: null, error: null }
  }
  if (typeof value !== "string") {
    return { value: null, error: `${field} must be a string.` }
  }

  const normalized = value.trim()
  if (!normalized) return { value: null, error: null }
  if (normalized.length > maxLength) {
    return {
      value: null,
      error: `${field} must be ${maxLength} characters or fewer.`,
    }
  }
  return { value: normalized, error: null }
}

const customerSafePayment = (payment: any) => ({
  id: payment.id,
  order_id: payment.order_id,
  amount: payment.amount,
  currency_code: payment.currency_code,
  status: payment.status,
  receipt_exists: Boolean(payment.receipt_file_id),
  receipt_mime_type: payment.receipt_mime_type,
  payer_name: payment.payer_name,
  payment_reference: payment.payment_reference,
  created_at: payment.created_at,
  updated_at: payment.updated_at,
})

export async function POST(
  req: AuthenticatedMedusaRequest<ReceiptRequestBody>,
  res: MedusaResponse
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "order",
    fields: ["id", "customer_id"],
    filters: { id: req.params.id },
  })
  const order = data[0] as unknown as OrderForReceipt | undefined

  if (!order) return res.status(404).json({ message: "Order not found." })
  if (!order.customer_id || order.customer_id !== req.auth_context.actor_id) {
    return res.status(403).json({ message: "You do not have access to this order." })
  }

  const service = req.scope.resolve<ManualPaymentModuleService>(MANUAL_PAYMENT_MODULE)
  const records = await service.listManualPayments(
    { order_id: order.id },
    { take: 1, order: { created_at: "DESC" } }
  )
  const payment = records[0]

  if (!payment) {
    return res.status(404).json({ message: "Manual payment record not found." })
  }

  const status = payment.status as ManualPaymentStatus
  if (!allowedUploadStatuses.has(status)) {
    return res.status(409).json({
      message: `A receipt cannot be submitted while payment status is ${status}.`,
    })
  }

  const file = (req as AuthenticatedMedusaRequest<ReceiptRequestBody> & {
    file?: UploadedReceipt
  }).file
  if (!file || !file.buffer || file.size === 0) {
    return res.status(400).json({ message: "A non-empty receipt file is required." })
  }

  const hasValidSignature = signatures[file.mimetype]?.(file.buffer) ?? false
  if (!hasValidSignature) {
    return res.status(400).json({ message: "The receipt file content is invalid." })
  }

  const payerName = optionalText(req.body?.payer_name, "payer_name", 120)
  const paymentReference = optionalText(
    req.body?.payment_reference,
    "payment_reference",
    120
  )
  const textError = payerName.error || paymentReference.error
  if (textError) {
    return res.status(400).json({ message: textError })
  }

  const { result: uploadedFiles } = await uploadFilesWorkflow(req.scope).run({
    input: {
      files: [{
        filename: `manual-payment-${payment.id}-${Date.now()}.${extensions[file.mimetype]}`,
        mimeType: file.mimetype,
        content: file.buffer.toString("base64"),
        access: "private",
      }],
    },
  })
  const uploaded = uploadedFiles[0]

  let updated
  try {
    updated = await service.transition(payment.id, "receipt_submitted", {
      receipt_file_id: uploaded.id,
      receipt_url: uploaded.url,
      receipt_mime_type: file.mimetype,
      payer_name: payerName.value,
      payment_reference: paymentReference.value,
    })
  } catch (error) {
    await deleteFilesWorkflow(req.scope)
      .run({ input: { ids: [uploaded.id] } })
      .catch(() => undefined)
    if ((error as Error).message.startsWith("Invalid manual payment transition:")) {
      return res.status(409).json({
        message: "The payment status no longer allows receipt submission.",
      })
    }
    throw error
  }

  if (payment.receipt_file_id && payment.receipt_file_id !== uploaded.id) {
    await deleteFilesWorkflow(req.scope)
      .run({ input: { ids: [payment.receipt_file_id] } })
      .catch(() => undefined)
  }

  return res.status(200).json({ manual_payment: customerSafePayment(updated) })
}
