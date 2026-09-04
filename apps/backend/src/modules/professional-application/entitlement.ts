import type { MedusaContainer } from "@medusajs/framework/types";
import { PROFESSIONAL_APPLICATION_MODULE } from ".";
import ProfessionalApplicationModuleService from "./service";

export const isApprovedProfessional = async (
  scope: MedusaContainer,
  customerId: string
) => {
  const service = scope.resolve<ProfessionalApplicationModuleService>(
    PROFESSIONAL_APPLICATION_MODULE
  );
  const applications = await service.listProfessionalApplications(
    { customer_id: customerId, status: "approved" },
    { take: 1 }
  );

  return applications.length > 0;
};
