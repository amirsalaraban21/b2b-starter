import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MANUAL_PAYMENT_MODULE } from "../../../../modules/manual-payment"
import ManualPaymentModuleService from "../../../../modules/manual-payment/service"
import { adminPayment } from "../utils"

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

  return res.json({
    manual_payment: {
      ...adminPayment(payment),
      receipt_download_url: payment.receipt_file_id
        ? `/admin/manual-payments/${payment.id}/receipt`
        : null,
    },
  })
}
