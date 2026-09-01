import { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { PROFESSIONAL_APPLICATION_MODULE } from "../../../modules/professional-application"
import ProfessionalApplicationModuleService from "../../../modules/professional-application/service"
import { CreateProfessionalApplicationType } from "./validators"

const optional = (value?: string) => value?.trim() || null
const safe = (application: { id: string; status: string; professional_type: string; organization_name?: string | null; created_at?: Date; reviewed_at?: Date | null }) => ({ id: application.id, status: application.status, professional_type: application.professional_type, organization_name: application.organization_name, submitted_at: application.created_at, reviewed_at: application.reviewed_at })

export async function POST(req: MedusaRequest<CreateProfessionalApplicationType>, res: MedusaResponse) {
  const service = req.scope.resolve<ProfessionalApplicationModuleService>(PROFESSIONAL_APPLICATION_MODULE)
  const email = req.validatedBody.email.trim().toLowerCase()
  const pending = await service.listProfessionalApplications({ email, status: "pending" })
  if (pending.length) return res.status(409).json({ message: "An application is already pending for this email." })
  const actorId = (req as AuthenticatedMedusaRequest).auth_context?.actor_id
  const application = await service.createProfessionalApplications({ ...req.validatedBody, email, organization_name: optional(req.validatedBody.organization_name), professional_identifier: optional(req.validatedBody.professional_identifier), notes: optional(req.validatedBody.notes), customer_id: actorId || null })
  return res.status(201).json({ application: safe(application) })
}
