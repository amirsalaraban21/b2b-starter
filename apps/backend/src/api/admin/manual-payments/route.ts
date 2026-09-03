import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MANUAL_PAYMENT_MODULE } from "../../../modules/manual-payment"
import ManualPaymentModuleService from "../../../modules/manual-payment/service"
import {
  manualPaymentStatuses,
  type ManualPaymentStatus,
} from "../../../modules/manual-payment/transitions"
import { adminPayment } from "./utils"

const singleQueryValue = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : undefined

const integerQueryValue = (
  value: unknown,
  fallback: number,
  maximum: number
) => {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 0) return fallback
  return Math.min(parsed, maximum)
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const service = req.scope.resolve<ManualPaymentModuleService>(MANUAL_PAYMENT_MODULE)
  const status = singleQueryValue(req.query.status)
  const orderId = singleQueryValue(req.query.order_id)
  const customerId = singleQueryValue(req.query.customer_id)
  const limit = integerQueryValue(req.query.limit, 20, 100)
  const offset = integerQueryValue(req.query.offset, 0, Number.MAX_SAFE_INTEGER)

  if (status && !manualPaymentStatuses.includes(status as ManualPaymentStatus)) {
    return res.status(400).json({ message: "Invalid manual payment status filter." })
  }

  const filters: Record<string, unknown> = {}
  if (status) filters.status = status as ManualPaymentStatus
  if (orderId) filters.order_id = orderId
  if (customerId) filters.customer_id = customerId

  const [payments, count] = await service.listAndCountManualPayments(filters, {
    take: limit,
    skip: offset,
    order: { created_at: "DESC" },
  })

  return res.json({
    manual_payments: payments.map(adminPayment),
    count,
    limit,
    offset,
  })
}
