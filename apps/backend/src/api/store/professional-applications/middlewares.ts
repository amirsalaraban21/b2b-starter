import { authenticate, validateAndTransformBody } from "@medusajs/framework";
import { MiddlewareRoute } from "@medusajs/medusa";
import { CreateProfessionalApplication } from "./validators";

export const storeProfessionalApplicationMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/store/professional-applications",
    middlewares: [
      authenticate("customer", ["session", "bearer"]),
      validateAndTransformBody(CreateProfessionalApplication),
    ],
  },
  {
    method: ["GET"],
    matcher: "/store/professional-applications/me",
    middlewares: [authenticate("customer", ["session", "bearer"])],
  },
];
