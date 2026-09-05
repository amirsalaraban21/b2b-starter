export { AdminUpsertStorefrontContent, type AdminUpsertStorefrontContentType } from "../../../modules/storefront-content/schemas"
import { z } from "@medusajs/framework/zod"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { contentLocales } from "../../../modules/storefront-content/schemas"

export const AdminStorefrontContentQuery = createFindParams().merge(
  z.object({ locale: z.enum(contentLocales) }).strict()
)
export type AdminStorefrontContentQueryType = z.infer<typeof AdminStorefrontContentQuery>
