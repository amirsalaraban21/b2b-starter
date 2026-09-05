import { model } from "@medusajs/framework/utils"

export const StorefrontContent = model.define("storefront_content", {
  id: model.id({ prefix: "stcontent" }).primaryKey(),
  key: model.enum(["home", "about", "contact", "faq"]),
  locale: model.enum(["fa", "en"]),
  content: model.json(),
  is_published: model.boolean().default(false),
})
