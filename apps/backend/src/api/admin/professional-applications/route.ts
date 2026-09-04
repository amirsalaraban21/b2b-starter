import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { PROFESSIONAL_APPLICATION_MODULE } from "../../../modules/professional-application";
import ProfessionalApplicationModuleService from "../../../modules/professional-application/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service = req.scope.resolve<ProfessionalApplicationModuleService>(
    PROFESSIONAL_APPLICATION_MODULE
  );
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  const status =
    typeof req.query.status === "string" ? req.query.status : undefined;
  const customerId =
    typeof req.query.customer_id === "string"
      ? req.query.customer_id
      : undefined;
  const filters = {
    ...(status ? { status } : {}),
    ...(customerId ? { customer_id: customerId } : {}),
  };
  const [applications, count] =
    await service.listAndCountProfessionalApplications(filters, {
      skip: offset,
      take: limit,
      order: { created_at: "DESC" },
    });
  return res.json({
    professional_applications: applications,
    count,
    limit,
    offset,
  });
}
