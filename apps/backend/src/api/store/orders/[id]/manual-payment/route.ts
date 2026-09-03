import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { MANUAL_PAYMENT_MODULE } from "../../../../../modules/manual-payment"
import ManualPaymentModuleService from "../../../../../modules/manual-payment/service"

type OrderForManualPayment = {
  id: string
  customer_id: string | null
  total: number
  currency_code: string
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
  reviewed_at: payment.reviewed_at,
  created_at: payment.created_at,
  updated_at: payment.updated_at,
})

async function ownedOrder(req: AuthenticatedMedusaRequest) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "order",
    fields: ["id", "customer_id", "total", "currency_code"],
    filters: { id: req.params.id },
  })
  const order = data[0] as unknown as OrderForManualPayment | undefined

  if (!order) return { error: 404 as const, order: null }
  if (!order.customer_id || order.customer_id !== req.auth_context.actor_id) {
    return { error: 403 as const, order: null }
  }
  return { error: null, order }
}

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const ownership = await ownedOrder(req)
  if (ownership.error === 404) return res.status(404).json({ message: "Order not found." })
  if (ownership.error === 403) return res.status(403).json({ message: "You do not have access to this order." })

  const service = req.scope.resolve<ManualPaymentModuleService>(MANUAL_PAYMENT_MODULE)
  const records = await service.listManualPayments(
    { order_id: ownership.order!.id },
    { take: 1, order: { created_at: "DESC" } }
  )
  if (!records.length) return res.status(404).json({ message: "Manual payment record not found." })
  return res.json({ manual_payment: customerSafePayment(records[0]) })
}

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const ownership = await ownedOrder(req)
  if (ownership.error === 404) return res.status(404).json({ message: "Order not found." })
  if (ownership.error === 403) return res.status(403).json({ message: "You do not have access to this order." })

  const order = ownership.order!
  const service = req.scope.resolve<ManualPaymentModuleService>(MANUAL_PAYMENT_MODULE)
  const existing = await service.listManualPayments(
    { order_id: order.id },
    { take: 1, order: { created_at: "DESC" } }
  )
  if (existing.length) return res.status(200).json({ manual_payment: customerSafePayment(existing[0]), created: false })

  // This idempotent module write is guarded by the unique active-order index.
  // eslint-disable-next-line @medusajs/no-service-mutations-in-api-route
  const payment = await service.createManualPayments({
    order_id: order.id,
    customer_id: req.auth_context.actor_id,
    cart_id: null,
    amount: order.total,
    currency_code: order.currency_code.toLowerCase(),
    status: "awaiting_payment",
  })
  return res.status(201).json({ manual_payment: customerSafePayment(payment), created: true })
}
