import { z } from "@medusajs/framework/zod"

export const contentKeys = ["home", "about", "contact", "faq"] as const
export const contentLocales = ["fa", "en"] as const
export type StorefrontContentKey = (typeof contentKeys)[number]
export type StorefrontContentLocale = (typeof contentLocales)[number]

const short = z.string().trim().min(1).max(200)
const text = z.string().trim().min(1).max(4000)
const nullableText = z.string().trim().max(1000).nullable()

const heroSlide = z.object({
  eyebrow: short,
  title: short,
  description: text,
  cta_label: short,
}).strict()

export const HomeContentSchema = z.object({
  hero_slides: z.array(heroSlide).min(1).max(5),
  departments_eyebrow: short,
  departments_title: short,
  departments_cta: short,
  editorial_eyebrow: short,
  editorial_title: short,
  editorial_text: text,
  editorial_cta: short,
  selected_products_title: short,
  selected_products_cta: short,
  battery_finder_eyebrow: short,
  battery_finder_title: short,
  battery_finder_text: text,
  professional_eyebrow: short,
  professional_title: short,
  professional_text: text,
  professional_cta: short,
}).strict()

export const AboutContentSchema = z.object({
  eyebrow: short,
  title: short,
  intro: text,
  scope_title: short,
  scope_body: text,
  categories_title: short,
  categories: z.array(short).min(1).max(12),
  professional_title: short,
  professional_body: text,
  professional_action: short,
  approach_title: short,
  approach_items: z.array(short).min(1).max(12),
}).strict()

export const ContactContentSchema = z.object({
  eyebrow: short,
  title: short,
  intro: text,
  phone: nullableText,
  email: z.union([z.string().trim().email().max(320), z.literal(""), z.null()]),
  address: nullableText,
  working_hours: nullableText,
  additional_text: nullableText,
}).strict()

const FAQItemSchema = z.object({
  id: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/),
  question: z.string().trim().min(1).max(500),
  answer: text,
}).strict()

export const FAQContentSchema = z.object({
  eyebrow: short,
  title: short,
  intro: text,
  items: z.array(FAQItemSchema).min(1).max(50).superRefine((items, context) => {
    const seen = new Set<string>()
    items.forEach((item, index) => {
      if (seen.has(item.id)) context.addIssue({ code: z.ZodIssueCode.custom, path: [index, "id"], message: "FAQ item IDs must be unique." })
      seen.add(item.id)
    })
  }),
}).strict()

export const contentSchemas = {
  home: HomeContentSchema,
  about: AboutContentSchema,
  contact: ContactContentSchema,
  faq: FAQContentSchema,
} as const

export const AdminUpsertStorefrontContent = z.object({
  locale: z.enum(contentLocales),
  content: z.unknown(),
  is_published: z.boolean(),
}).strict()

export type AdminUpsertStorefrontContentType = z.infer<typeof AdminUpsertStorefrontContent>
