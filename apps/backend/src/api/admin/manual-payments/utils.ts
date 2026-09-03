import type { ManualPaymentStatus } from "../../../modules/manual-payment/transitions"

export const adminPayment = (payment: any) => ({
  id: payment.id,
  order_id: payment.order_id,
  customer_id: payment.customer_id,
  cart_id: payment.cart_id,
  amount: payment.amount,
  currency_code: payment.currency_code,
  status: payment.status,
  receipt_exists: Boolean(payment.receipt_file_id),
  receipt_file_id: payment.receipt_file_id,
  receipt_mime_type: payment.receipt_mime_type,
  payer_name: payment.payer_name,
  payment_reference: payment.payment_reference,
  admin_notes: payment.admin_notes,
  reviewed_by: payment.reviewed_by,
  reviewed_at: payment.reviewed_at,
  created_at: payment.created_at,
  updated_at: payment.updated_at,
})

export const adminReviewStatuses = new Set<ManualPaymentStatus>([
  "under_review",
  "approved",
  "rejected",
])
