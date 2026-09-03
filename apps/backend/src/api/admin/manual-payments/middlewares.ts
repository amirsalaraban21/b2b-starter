import { authenticate } from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/medusa"

export const adminManualPaymentMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/manual-payments*",
    middlewares: [authenticate("user", ["session", "bearer"])],
  },
]
