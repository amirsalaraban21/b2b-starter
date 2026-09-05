import { authenticate, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework"
import type { MiddlewareRoute } from "@medusajs/medusa"
import { AdminStorefrontContentQuery, AdminUpsertStorefrontContent } from "./validators"

export const adminStorefrontContentMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/storefront-content/:key",
    middlewares: [validateAndTransformQuery(AdminStorefrontContentQuery, { isList: false })],
  },
  {
    matcher: "/admin/storefront-content*",
    middlewares: [authenticate("user", ["session", "bearer"])],
  },
  {
    method: ["PUT", "POST"],
    matcher: "/admin/storefront-content/:key",
    middlewares: [validateAndTransformBody(AdminUpsertStorefrontContent)],
  },
]
