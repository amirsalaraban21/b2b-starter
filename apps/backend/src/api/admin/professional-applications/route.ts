import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { PROFESSIONAL_APPLICATION_MODULE } from "../../../modules/professional-application"
import ProfessionalApplicationModuleService from "../../../modules/professional-application/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service = req.scope.resolve<ProfessionalApplicationModuleService>(PROFESSIONAL_APPLICATION_MODULE)
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100)
  const offset = Math.max(Number(req.query.offset) || 0, 0)
  const status = typeof req.query.status === "string" ? req.query.status : undefined
  const [applications, count] = await service.listAndCountProfessionalApplications(status ? { status } : {}, { skip: offset, take: limit, order: { created_at: "DESC" } })
  return res.json({ professional_applications: applications, count, limit, offset })
}
