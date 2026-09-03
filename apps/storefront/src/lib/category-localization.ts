import { Locale } from "@/lib/i18n"
import { HttpTypes } from "@medusajs/types"

const categoryNames: Record<string, { fa: string; en: string }> = {
  "hearing-aid-batteries": { fa: "باتری سمعک", en: "Hearing Aid Batteries" },
  "cleaning-&-care": { fa: "تمیزکاری و نگهداری", en: "Cleaning & Care" },
  "cleaning-care": { fa: "تمیزکاری و نگهداری", en: "Cleaning & Care" },
  "drying-&-moisture-control": { fa: "خشک‌کن و کنترل رطوبت", en: "Drying & Moisture Control" },
  "drying-moisture-control": { fa: "خشک‌کن و کنترل رطوبت", en: "Drying & Moisture Control" },
  "hearing-aid-consumables": { fa: "قطعات مصرفی سمعک", en: "Hearing Aid Consumables" },
  "care-&-accessories": { fa: "مراقبت و لوازم جانبی", en: "Care & Accessories" },
  "care-accessories": { fa: "مراقبت و لوازم جانبی", en: "Care & Accessories" },
}

export const getLocalizedCategoryName = (
  category: Pick<HttpTypes.StoreProductCategory, "handle" | "name" | "metadata">,
  locale: Locale
) => {
  const known = categoryNames[category.handle]
  if (known) return known[locale]

  if (locale === "fa" && typeof category.metadata?.fa_name === "string") {
    return category.metadata.fa_name
  }

  return category.name
}

export const isEarMedCategory = (
  category: Pick<HttpTypes.StoreProductCategory, "handle" | "metadata">
) =>
  category.metadata?.catalog_source === "earmed_core" ||
  Boolean(categoryNames[category.handle])

export const getCategoryImageKey = (handle: string) => {
  if (handle === "hearing-aid-batteries") return "battery"
  if (handle === "cleaning-&-care" || handle === "cleaning-care") return "cleaning"
  if (handle === "drying-&-moisture-control" || handle === "drying-moisture-control") return "drying"
  return "consumable"
}
