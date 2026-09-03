import type { IFileModuleService } from "@medusajs/framework/types"
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { MANUAL_PAYMENT_MODULE } from "../../../../../modules/manual-payment"
import ManualPaymentModuleService from "../../../../../modules/manual-payment/service"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const service = req.scope.resolve<ManualPaymentModuleService>(MANUAL_PAYMENT_MODULE)
  const payments = await service.listManualPayments({ id: req.params.id }, { take: 1 })
  const payment = payments[0]

  if (!payment) {
    return res.status(404).json({ message: "Manual payment record not found." })
  }
  if (!payment.receipt_file_id) {
    return res.status(404).json({ message: "Receipt file not found." })
  }

  const fileService = req.scope.resolve<IFileModuleService>(Modules.FILE)
  const stream = await fileService.getDownloadStream(payment.receipt_file_id)
  const extension = payment.receipt_mime_type === "application/pdf" ? "pdf" :
    payment.receipt_mime_type === "image/png" ? "png" :
    payment.receipt_mime_type === "image/webp" ? "webp" : "jpg"

  res.setHeader("Content-Type", payment.receipt_mime_type || "application/octet-stream")
  res.setHeader("Content-Disposition", `inline; filename="receipt-${payment.id}.${extension}"`)
  res.setHeader("Cache-Control", "private, no-store")
  res.setHeader("X-Content-Type-Options", "nosniff")
  stream.pipe(res)
}
