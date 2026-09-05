import { MiddlewareRoute } from "@medusajs/medusa";
import { storeApprovalsMiddlewares } from "./approvals/middlewares";
import { storeCartsMiddlewares } from "./carts/middlewares";
import { storeCompaniesMiddlewares } from "./companies/middlewares";
import { storeFreeShippingMiddlewares } from "./free-shipping/middlewares";
import { storeQuotesMiddlewares } from "./quotes/middlewares";
import { storeProfessionalApplicationMiddlewares } from "./professional-applications/middlewares";
import { storeManualPaymentMiddlewares } from "./manual-payment/middlewares";
import { storeOrderMiddlewares } from "./orders/middlewares";

export const storeMiddlewares: MiddlewareRoute[] = [
  ...storeCartsMiddlewares,
  ...storeCompaniesMiddlewares,
  ...storeQuotesMiddlewares,
  ...storeFreeShippingMiddlewares,
  ...storeApprovalsMiddlewares,
  ...storeProfessionalApplicationMiddlewares,
  ...storeManualPaymentMiddlewares,
  ...storeOrderMiddlewares,
];
