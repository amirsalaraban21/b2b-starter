import { model } from "@medusajs/framework/utils"

export const ManualPayment = model.define("manual_payment", {
  id: model.id({ prefix: "manpay" }).primaryKey(),
  order_id: model.text(),
  customer_id: model.text(),
  cart_id: model.text().nullable(),
  amount: model.bigNumber(),
  currency_code: model.text(),
  status: model.enum(["awaiting_payment", "receipt_submitted", "under_review", "approved", "rejected"]).default("awaiting_payment"),
  receipt_file_id: model.text().nullable(),
  receipt_url: model.text().nullable(),
  receipt_mime_type: model.text().nullable(),
  payer_name: model.text().nullable(),
  payment_reference: model.text().nullable(),
  admin_notes: model.text().nullable(),
  reviewed_by: model.text().nullable(),
  reviewed_at: model.dateTime().nullable(),
})
