export const locales = ["fa", "en"] as const
export type Locale = (typeof locales)[number]
export const localeDirection: Record<Locale, "rtl" | "ltr"> = { fa: "rtl", en: "ltr" }
export const messages = {
  fa: { products: "محصولات", search: "جست‌وجوی محصولات", quote: "درخواست پیش‌فاکتور", account: "حساب کاربری", cart: "سبد خرید", categories: "دسته‌بندی‌ها", collections: "مجموعه‌ها", heroEyebrow: "تجهیزات تخصصی شنوایی", heroTitle: "تجهیزات دقیق برای مراقبت بهتر از شنوایی", heroDescription: "انتخابی کاربردی از تجهیزات معاینه گوش و ادیولوژی برای متخصصان و مراکز درمانی.", exploreProducts: "مشاهده محصولات", searchUnavailable: "جست‌وجو به‌زودی فعال می‌شود", copyright: "تمامی حقوق محفوظ است." },
  en: { products: "Products", search: "Search products", quote: "Request quote", account: "Account", cart: "Cart", categories: "Categories", collections: "Collections", heroEyebrow: "Specialist hearing equipment", heroTitle: "Better equipment for precise hearing care", heroDescription: "A practical selection of ear examination and audiology equipment for specialists and care centers.", exploreProducts: "Explore products", searchUnavailable: "Search is coming soon", copyright: "All rights reserved." },
} as const
export function getLocale(value?: string): Locale { return value === "en" ? "en" : "fa" }
