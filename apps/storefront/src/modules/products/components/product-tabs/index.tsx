import { Locale } from "@/lib/i18n"
import { getLocalizedProductDescription } from "@/lib/product-localization"
import { HttpTypes } from "@medusajs/types"

const labels: Record<string, { fa: string; en: string }> = {
  battery_size: { fa: "سایز باتری", en: "Battery size" },
  color_code: { fa: "کد رنگ", en: "Color code" },
  compatibility: { fa: "سازگاری", en: "Compatibility" },
  weight: { fa: "وزن", en: "Weight" },
  dimensions: { fa: "ابعاد", en: "Dimensions" },
}

const localizedValue = (value: unknown, locale: Locale) => {
  const raw = String(value)
  if (locale === "en") return raw
  const translations: Record<string, string> = { yellow: "زرد", orange: "نارنجی", brown: "قهوه‌ای", blue: "آبی", "model dependent": "وابسته به مدل" }
  return translations[raw.toLowerCase()] || (/^\d+$/.test(raw) ? Number(raw).toLocaleString("fa-IR", { useGrouping: false }) : raw)
}

export default function ProductTabs({ product, locale }: { product: HttpTypes.StoreProduct; locale: Locale }) {
  const description = getLocalizedProductDescription(product, locale)
  const rawSpecifications = product.metadata?.specifications
  const specifications: [string, unknown][] = rawSpecifications && typeof rawSpecifications === "object" && !Array.isArray(rawSpecifications)
    ? Object.entries(rawSpecifications as Record<string, unknown>).filter(([, value]) => value !== null && value !== undefined && value !== "")
    : []

  if (product.weight) specifications.push(["weight", `${product.weight} ${locale === "fa" ? "گرم" : "g"}`])
  if (product.height || product.width || product.length) {
    specifications.push(["dimensions", [product.height, product.width, product.length].filter(Boolean).join(" × ") + (locale === "fa" ? " میلی‌متر" : " mm")])
  }

  if (!description && !specifications.length) return null

  return (
    <div className="grid items-start gap-5 medium:grid-cols-[1.1fr_.9fr]">
      {description && (
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 small:p-6">
          <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50">{locale === "fa" ? "توضیحات محصول" : "Product description"}</h3>
          <p className="mt-3 whitespace-pre-line text-sm leading-8 text-slate-600 dark:text-slate-300">{description}</p>
        </section>
      )}
      {specifications.length > 0 && (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h3 className="border-b border-slate-200 px-5 py-4 text-lg font-bold text-slate-950 dark:border-slate-700 dark:text-slate-50">{locale === "fa" ? "مشخصات" : "Specifications"}</h3>
          <dl className="divide-y divide-slate-100 dark:divide-slate-800">
            {specifications.map(([key, value]) => (
              <div key={key} className="grid grid-cols-[minmax(0,.8fr)_minmax(0,1fr)] gap-4 px-5 py-3 text-sm">
                <dt className="font-semibold text-slate-500 dark:text-slate-400">{labels[key]?.[locale] || key.replaceAll("_", " ")}</dt>
                <dd className="text-slate-900 dark:text-slate-100">{localizedValue(value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  )
}
