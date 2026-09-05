import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { STOREFRONT_CONTENT_MODULE } from "../../../../modules/storefront-content"
import { contentKeys, contentLocales, type StorefrontContentKey, type StorefrontContentLocale } from "../../../../modules/storefront-content/schemas"
import StorefrontContentModuleService from "../../../../modules/storefront-content/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const key = req.params.key as StorefrontContentKey
  const locale = new URL(req.originalUrl, "http://localhost").searchParams.get("locale")
  if (!contentKeys.includes(key)) return res.status(400).json({ message: "Unsupported storefront content key." })
  if (!contentLocales.includes(locale as StorefrontContentLocale)) return res.status(400).json({ message: "Unsupported storefront content locale." })

  const service = req.scope.resolve<StorefrontContentModuleService>(STOREFRONT_CONTENT_MODULE)
  const records = await service.listStorefrontContents(
    { key, locale: locale as StorefrontContentLocale, is_published: true },
    { take: 1 }
  )
  const record = records[0]
  if (!record) return res.status(404).json({ message: "Published storefront content is unavailable." })

  return res.json({ key: record.key, locale: record.locale, content: record.content })
}
