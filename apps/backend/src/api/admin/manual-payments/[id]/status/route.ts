import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MANUAL_PAYMENT_MODULE } from "../../../../../modules/manual-payment"
import ManualPaymentModuleService from "../../../../../modules/manual-payment/service"
import type { ManualPaymentStatus } from "../../../../../modules/manual-payment/transitions"
import { adminPayment, adminReviewStatuses } from "../../utils"

type ReviewBody = {
  status?: unknown
  admin_notes?: unknown
}

export const POST = async (
  req: AuthenticatedMedusaRequest<ReviewBody>,
  res: MedusaResponse
) => {
  const requestedStatus = req.body?.status
  if (
    typeof requestedStatus !== "string" ||
    !adminReviewStatuses.has(requestedStatus as ManualPaymentStatus)
  ) {
    return res.status(400).json({
      message: "status must be under_review, approved, or rejected.",
    })
  }

  const notes = req.body?.admin_notes
  if (notes !== undefined && notes !== null && typeof notes !== "string") {
    return res.status(400).json({ message: "admin_notes must be a string." })
  }
  const normalizedNotes = typeof notes === "string" ? notes.trim() : undefined
  if (normalizedNotes && normalizedNotes.length > 2000) {
    return res.status(400).json({
      message: "admin_notes must be 2000 characters or fewer.",
    })
  }

  const service = req.scope.resolve<ManualPaymentModuleService>(MANUAL_PAYMENT_MODULE)
  const payments = await service.listManualPayments({ id: req.params.id }, { take: 1 })
  if (!payments.length) {
    return res.status(404).json({ message: "Manual payment record not found." })
  }

  try {
    const payment = await service.transition(
      req.params.id,
      requestedStatus as ManualPaymentStatus,
      {
        reviewed_by: req.auth_context.actor_id,
        reviewed_at: new Date(),
        ...(notes !== undefined
          ? { admin_notes: normalizedNotes || null }
          : {}),
      }
    )
    return res.json({ manual_payment: adminPayment(payment) })
  } catch (error) {
    if ((error as Error).message.startsWith("Invalid manual payment transition:")) {
      return res.status(409).json({ message: (error as Error).message })
    }
    throw error
  }
}
