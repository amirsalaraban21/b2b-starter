import "server-only"

import type { Locale } from "@/lib/i18n"

export type StorefrontContentKey = "home" | "about" | "contact" | "faq"
export type HomeCMSContent = {
  hero_slides: Array<{ eyebrow: string; title: string; description: string; cta_label: string }>
  departments_eyebrow: string; departments_title: string; departments_cta: string
  editorial_eyebrow: string; editorial_title: string; editorial_text: string; editorial_cta: string
  selected_products_title: string; selected_products_cta: string
  battery_finder_eyebrow: string; battery_finder_title: string; battery_finder_text: string
  professional_eyebrow: string; professional_title: string; professional_text: string; professional_cta: string
}
export type AboutCMSContent = {
  eyebrow: string; title: string; intro: string; scope_title: string; scope_body: string
  categories_title: string; categories: string[]; professional_title: string
  professional_body: string; professional_action: string; approach_title: string; approach_items: string[]
}
export type ContactCMSContent = {
  eyebrow: string; title: string; intro: string; phone: string | null; email: string | null
  address: string | null; working_hours: string | null; additional_text: string | null
}
export type FAQCMSContent = {
  eyebrow: string; title: string; intro: string
  items: Array<{ id: string; question: string; answer: string }>
}
type ContentByKey = { home: HomeCMSContent; about: AboutCMSContent; contact: ContactCMSContent; faq: FAQCMSContent }

export async function getStorefrontContent<K extends StorefrontContentKey>(key: K, locale: Locale): Promise<ContentByKey[K] | null> {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  if (!publishableKey) return null
  try {
    const response = await fetch(`${backendUrl}/store/storefront-content/${key}?locale=${locale}`, {
      headers: { "x-publishable-api-key": publishableKey },
      next: { revalidate: 60, tags: [`storefront-content-${key}-${locale}`] },
    })
    if (!response.ok) return null
    const payload = await response.json() as { content?: ContentByKey[K] }
    return payload.content || null
  } catch {
    return null
  }
}
