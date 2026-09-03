export const manualPaymentStatuses = ["awaiting_payment", "receipt_submitted", "under_review", "approved", "rejected"] as const
export type ManualPaymentStatus = (typeof manualPaymentStatuses)[number]

export const allowedManualPaymentTransitions: Record<ManualPaymentStatus, readonly ManualPaymentStatus[]> = {
  awaiting_payment: ["receipt_submitted"],
  receipt_submitted: ["under_review", "approved", "rejected"],
  under_review: ["approved", "rejected"],
  rejected: ["receipt_submitted"],
  approved: [],
}

export function assertManualPaymentTransition(from: ManualPaymentStatus, to: ManualPaymentStatus) {
  if (!allowedManualPaymentTransitions[from]?.includes(to)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Invalid manual payment transition: ${from} -> ${to}`
    )
  }
}
import { MedusaError } from "@medusajs/framework/utils"
