import {
  AuthenticatedMedusaRequest,
  authenticate,
  MedusaNextFunction,
  MedusaResponse,
} from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { MiddlewareRoute } from "@medusajs/medusa"

const requireOrderOwnership = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "order",
    fields: ["id", "customer_id"],
    filters: { id: req.params.id },
  })
  const order = data[0] as { customer_id?: string | null } | undefined

  if (!order) {
    return res.status(404).json({ message: "Order not found." })
  }
  if (!order.customer_id || order.customer_id !== req.auth_context.actor_id) {
    return res.status(403).json({ message: "You do not have access to this order." })
  }

  return next()
}

export const storeOrderMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/store/orders/:id",
    middlewares: [
      authenticate("customer", ["session", "bearer"]),
      requireOrderOwnership,
    ],
  },
]
