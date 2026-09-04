import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import type { ICustomerModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { PROFESSIONAL_APPLICATION_MODULE } from "../../../modules/professional-application";
import ProfessionalApplicationModuleService from "../../../modules/professional-application/service";
import { CreateProfessionalApplicationType } from "./validators";

const optional = (value?: string) => value?.trim() || null;
const safe = (application: {
  id: string;
  status: string;
  professional_type: string;
  organization_name?: string | null;
  created_at?: Date;
  reviewed_at?: Date | null;
}) => ({
  id: application.id,
  status: application.status,
  professional_type: application.professional_type,
  organization_name: application.organization_name,
  submitted_at: application.created_at,
  reviewed_at: application.reviewed_at,
});

export async function POST(
  req: AuthenticatedMedusaRequest<CreateProfessionalApplicationType>,
  res: MedusaResponse
) {
  const service = req.scope.resolve<ProfessionalApplicationModuleService>(
    PROFESSIONAL_APPLICATION_MODULE
  );
  const actorId = req.auth_context.actor_id;
  const customerService = req.scope.resolve<ICustomerModuleService>(
    Modules.CUSTOMER
  );
  const customer = await customerService.retrieveCustomer(actorId);
  const [current] = await service.listProfessionalApplications(
    { customer_id: actorId },
    { order: { created_at: "DESC" }, take: 1 }
  );
  if (current && current.status !== "needs_information") {
    return res
      .status(409)
      .json({
        message: "This application cannot be resubmitted in its current state.",
      });
  }
  const input = {
    ...req.validatedBody,
    email: customer.email.toLowerCase(),
    organization_name: optional(req.validatedBody.organization_name),
    professional_identifier: optional(
      req.validatedBody.professional_identifier
    ),
    notes: optional(req.validatedBody.notes),
    customer_id: actorId,
  };
  const application = current
    ? await service.updateProfessionalApplications({
        id: current.id,
        ...input,
        status: "pending",
        customer_feedback: null,
        reviewed_at: null,
        reviewed_by: null,
      })
    : await service.createProfessionalApplications(input);
  return res.status(201).json({ application: safe(application) });
}
