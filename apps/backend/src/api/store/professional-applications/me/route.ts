import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { PROFESSIONAL_APPLICATION_MODULE } from "../../../../modules/professional-application";
import ProfessionalApplicationModuleService from "../../../../modules/professional-application/service";

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const service = req.scope.resolve<ProfessionalApplicationModuleService>(
    PROFESSIONAL_APPLICATION_MODULE
  );
  const applications = await service.listProfessionalApplications(
    { customer_id: req.auth_context.actor_id },
    { order: { created_at: "DESC" }, take: 1 }
  );
  const application = applications[0];
  if (!application)
    return res
      .status(404)
      .json({ message: "No professional application found." });
  return res.json({
    application: {
      id: application.id,
      status: application.status,
      professional_type: application.professional_type,
      organization_name: application.organization_name,
      professional_identifier: application.professional_identifier,
      city: application.city,
      submitted_at: application.created_at,
      reviewed_at: application.reviewed_at,
      customer_feedback:
        application.status === "needs_information"
          ? application.customer_feedback
          : null,
    },
  });
}
