import { Locale } from "@/lib/i18n"
import { HttpTypes } from "@medusajs/types"

const faDescriptions: Record<string, string> = {
  "Hearing Aid Battery Size 10": "باتری زینک‌ایر سمعک در سایز ۱۰.",
  "Hearing Aid Battery Size 13": "باتری زینک‌ایر سمعک در سایز ۱۳.",
  "Hearing Aid Battery Size 312": "باتری زینک‌ایر سمعک در سایز ۳۱۲.",
  "Hearing Aid Battery Size 675": "باتری زینک‌ایر سمعک در سایز ۶۷۵.",
  "Hearing Aid Cleaning Spray": "اسپری تمیزکننده برای مراقبت روزمره از سطح خارجی سمعک.",
  "Hearing Aid Cleaning Wipes": "دستمال تمیزکننده برای مراقبت روزمره از سطح خارجی سمعک.",
  "Hearing Aid Cleaning Brush": "برس کوچک برای تمیزکردن روزمره سطح و منافذ سمعک.",
  "Hearing Aid Cleaning Multi Tool": "ابزار چندمنظوره و جمع‌وجور برای تمیزکاری روزمره سمعک.",
  "Hearing Aid Drying Capsules": "کپسول کنترل رطوبت برای استفاده در ظروف خشک‌کن سازگار.",
  "Hearing Aid Drying Container": "ظرف نگهداری ساده برای خشک‌کردن غیرفعال و روزمره سمعک.",
  "Hearing Aid Drying Care Kit": "کیت پایه برای کنترل روزمره رطوبت و نگهداری سمعک.",
  "Hearing Aid Wax Guard Filters": "فیلتر جرم‌گیر جایگزین برای سیستم‌های سمعک سازگار.",
  "Hearing Aid Domes": "دام جایگزین برای رسیور و سمعک‌های تیوب‌باریک سازگار.",
  "Hearing Aid Tubing": "تیوب جایگزین برای قالب گوش و اتصالات سمعک سازگار.",
  "Hearing Aid Storage Case": "کیف جمع‌وجور برای نگهداری سمعک و لوازم کوچک مراقبتی.",
}

const hasPersian = (value: unknown): value is string =>
  typeof value === "string" && /[\u0600-\u06ff]/.test(value)

export const getLocalizedProductTitle = (
  product: Pick<HttpTypes.StoreProduct, "title" | "metadata">,
  locale: Locale
) => locale === "fa" && hasPersian(product.metadata?.fa_title)
  ? product.metadata.fa_title
  : product.title

export const getLocalizedProductDescription = (
  product: Pick<HttpTypes.StoreProduct, "title" | "subtitle" | "description" | "metadata">,
  locale: Locale
) => {
  if (locale === "en") return product.subtitle || product.description || null
  if (hasPersian(product.metadata?.fa_short_description)) {
    return product.metadata.fa_short_description
  }
  return faDescriptions[product.title] || null
}
