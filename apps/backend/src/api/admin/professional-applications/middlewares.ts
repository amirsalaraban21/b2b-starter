import { validateAndTransformBody } from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/medusa"
import { UpdateProfessionalApplication } from "./validators"

export const adminProfessionalApplicationMiddlewares: MiddlewareRoute[] = [
  { method: ["POST"], matcher: "/admin/professional-applications/:id", middlewares: [validateAndTransformBody(UpdateProfessionalApplication)] },
]
