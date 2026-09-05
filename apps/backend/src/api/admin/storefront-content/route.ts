import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { STOREFRONT_CONTENT_MODULE } from "../../../modules/storefront-content"
import StorefrontContentModuleService from "../../../modules/storefront-content/service"

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const service = req.scope.resolve<StorefrontContentModuleService>(STOREFRONT_CONTENT_MODULE)
  const records = await service.listStorefrontContents({}, { order: { key: "ASC", locale: "ASC" }, take: 100 })
  return res.json({ storefront_content: records, count: records.length })
}
