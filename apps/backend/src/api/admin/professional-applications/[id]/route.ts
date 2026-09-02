import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { PROFESSIONAL_APPLICATION_MODULE } from "../../../../modules/professional-application"
import ProfessionalApplicationModuleService from "../../../../modules/professional-application/service"
import { UpdateProfessionalApplicationType } from "../validators"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service = req.scope.resolve<ProfessionalApplicationModuleService>(PROFESSIONAL_APPLICATION_MODULE)
  const application = await service.retrieveProfessionalApplication(req.params.id)
  return res.json({ professional_application: application })
}

export async function POST(req: MedusaRequest<UpdateProfessionalApplicationType>, res: MedusaResponse) {
  const service = req.scope.resolve<ProfessionalApplicationModuleService>(PROFESSIONAL_APPLICATION_MODULE)
  const existing = await service.retrieveProfessionalApplication(req.params.id)
  const allowed: Record<string, string[]> = { pending: ["approved", "rejected", "needs_information"], needs_information: ["pending", "approved", "rejected"], approved: [], rejected: [] }
  if (!allowed[existing.status]?.includes(req.validatedBody.status)) return res.status(409).json({ message: "Invalid professional application status transition." })
  const application = await service.updateProfessionalApplications({ id: existing.id, status: req.validatedBody.status, admin_notes: req.validatedBody.admin_notes?.trim() || null, customer_feedback: req.validatedBody.status === "needs_information" ? req.validatedBody.customer_feedback?.trim() || null : null, reviewed_at: new Date(), reviewed_by: req.auth_context?.actor_id || null })
  return res.json({ professional_application: application })
}
