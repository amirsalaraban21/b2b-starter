import { MiddlewareRoute } from "@medusajs/medusa";
import { adminCompaniesMiddlewares } from "./companies/middlewares";
import { adminQuotesMiddlewares } from "./quotes/middlewares";
import { adminApprovalsMiddlewares } from "./approvals/middlewares";
import { adminProfessionalApplicationMiddlewares } from "./professional-applications/middlewares";
import { adminManualPaymentMiddlewares } from "./manual-payments/middlewares";

export const adminMiddlewares: MiddlewareRoute[] = [
  ...adminCompaniesMiddlewares,
  ...adminQuotesMiddlewares,
  ...adminApprovalsMiddlewares,
  ...adminProfessionalApplicationMiddlewares,
  ...adminManualPaymentMiddlewares,
];
