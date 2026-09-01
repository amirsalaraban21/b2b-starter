export const locales = ["fa", "en"] as const
export type Locale = (typeof locales)[number]

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  fa: "rtl",
  en: "ltr",
}

export const messages = {
  fa: {
    products: "محصولات",
    search: "جستجوی محصولات",
    quote: "درخواست پیش‌فاکتور",
    account: "حساب کاربری",
    cart: "سبد خرید",
    categories: "دسته‌بندی‌ها",
    collections: "مجموعه‌ها",
    heroEyebrow: "تجهیزات تخصصی شنوایی",
    heroTitle: "تجهیزات بهتر برای مراقبت دقیق‌تر از شنوایی",
    heroDescription: "انتخابی مطمئن از محصولات و تجهیزات شنوایی برای متخصصان و مراکز درمانی.",
    exploreProducts: "مشاهده محصولات",
    searchUnavailable: "جستجو به‌زودی فعال می‌شود",
    copyright: "تمامی حقوق محفوظ است.",
  },
  en: {
    products: "Products",
    search: "Search products",
    quote: "Request quote",
    account: "Account",
    cart: "Cart",
    categories: "Categories",
    collections: "Collections",
    heroEyebrow: "Specialist hearing equipment",
    heroTitle: "Better equipment for more precise hearing care",
    heroDescription: "A dependable selection of hearing products and equipment for specialists and care centers.",
    exploreProducts: "Explore products",
    searchUnavailable: "Search is coming soon",
    copyright: "All rights reserved.",
  },
} as const

export function getLocale(value?: string): Locale {
  return value === "en" ? "en" : "fa"
}
