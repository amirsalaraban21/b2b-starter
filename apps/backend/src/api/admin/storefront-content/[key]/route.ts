import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { STOREFRONT_CONTENT_MODULE } from "../../../../modules/storefront-content"
import { contentKeys, contentLocales, contentSchemas, type StorefrontContentKey, type StorefrontContentLocale } from "../../../../modules/storefront-content/schemas"
import StorefrontContentModuleService from "../../../../modules/storefront-content/service"
import type { AdminStorefrontContentQueryType, AdminUpsertStorefrontContentType } from "../validators"

const parseKey = (value: string) => contentKeys.includes(value as StorefrontContentKey) ? value as StorefrontContentKey : null
const parseLocale = (value: unknown) => typeof value === "string" && contentLocales.includes(value as StorefrontContentLocale) ? value as StorefrontContentLocale : null

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const key = parseKey(req.params.key)
  const locale = parseLocale((req.validatedQuery as AdminStorefrontContentQueryType).locale)
  if (!key) return res.status(400).json({ message: "Unsupported storefront content key." })
  if (!locale) return res.status(400).json({ message: "Unsupported storefront content locale." })
  const service = req.scope.resolve<StorefrontContentModuleService>(STOREFRONT_CONTENT_MODULE)
  const records = await service.listStorefrontContents({ key, locale }, { take: 1 })
  if (!records[0]) return res.status(404).json({ message: "Storefront content not found." })
  return res.json({ storefront_content: records[0] })
}

export async function PUT(
  req: AuthenticatedMedusaRequest<AdminUpsertStorefrontContentType>,
  res: MedusaResponse
) {
  const key = parseKey(req.params.key)
  if (!key) return res.status(400).json({ message: "Unsupported storefront content key." })
  const parsed = contentSchemas[key].safeParse(req.validatedBody.content)
  if (!parsed.success) return res.status(400).json({ message: "Invalid storefront content payload.", errors: parsed.error.flatten() })

  const service = req.scope.resolve<StorefrontContentModuleService>(STOREFRONT_CONTENT_MODULE)
  const [existing] = await service.listStorefrontContents({ key, locale: req.validatedBody.locale }, { take: 1 })
  const input = { key, locale: req.validatedBody.locale, content: parsed.data, is_published: req.validatedBody.is_published }
  const record = existing
    ? await service.updateStorefrontContents({ id: existing.id, ...input })
    : await service.createStorefrontContents(input)
  return res.status(existing ? 200 : 201).json({ storefront_content: record })
}

export const POST = PUT
