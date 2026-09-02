import { model } from "@medusajs/framework/utils"

export const ProfessionalApplication = model.define("professional_application", {
  id: model.id({ prefix: "proapp" }).primaryKey(),
  first_name: model.text(),
  last_name: model.text(),
  email: model.text(),
  phone: model.text(),
  professional_type: model.enum(["doctor", "audiologist", "clinic", "medical_organization", "other"]),
  organization_name: model.text().nullable(),
  professional_identifier: model.text().nullable(),
  city: model.text(),
  notes: model.text().nullable(),
  status: model.enum(["pending", "approved", "rejected", "needs_information"]).default("pending"),
  admin_notes: model.text().nullable(),
  customer_feedback: model.text().nullable(),
  customer_id: model.text().nullable(),
  company_id: model.text().nullable(),
  reviewed_by: model.text().nullable(),
  reviewed_at: model.dateTime().nullable(),
})
