import { getLocale } from "@/lib/i18n"
import { getProductPrice } from "@/lib/util/get-product-price"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { cookies } from "next/headers"
import Thumbnail from "../thumbnail"
import PreviewAddToCart from "./preview-add-to-cart"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
  catalogMode = false,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  catalogMode?: boolean
}) {
  if (!product) return null

  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const { cheapestPrice } = getProductPrice({ product, locale: locale === "fa" ? "fa-IR" : "en-US" })
  const fa = locale === "fa"
  const title = fa && typeof product.metadata?.fa_title === "string" ? product.metadata.fa_title : product.title
  const shortDescription = fa
    ? typeof product.metadata?.fa_short_description === "string"
      ? catalogMode && !/[\u0600-\u06ff]/.test(product.metadata.fa_short_description)
        ? null
        : product.metadata.fa_short_description
      : null
    : product.subtitle
  const isAvailable = product.variants?.some(
    (variant) => !variant.manage_inventory || (variant.inventory_quantity || 0) > 0
  )
  const specifications = product.metadata?.specifications
  const rawBatterySize = specifications && typeof specifications === "object" && !Array.isArray(specifications)
    ? (specifications as Record<string, unknown>).battery_size
    : undefined
  const batterySize = typeof rawBatterySize === "string" || typeof rawBatterySize === "number" ? String(rawBatterySize) : undefined
  const batteryTone: Record<string, string> = { "10": "bg-yellow-400", "13": "bg-orange-500", "312": "bg-amber-800", "675": "bg-blue-600" }

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-200 motion-reduce:transform-none motion-reduce:transition-none hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] ${catalogMode ? "dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-700" : ""}`}>
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className={`relative block bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 ${catalogMode ? "dark:bg-slate-800" : ""}`}
      >
        <div className={`absolute start-3 top-3 z-10 rounded-full border border-slate-200 bg-white/95 px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm ${catalogMode ? "dark:border-slate-600 dark:bg-slate-900/95 dark:text-slate-200" : ""}`}>
          {isAvailable ? (fa ? "موجود" : "In stock") : (fa ? "ناموجود" : "Unavailable")}
        </div>
        {catalogMode && batterySize && batteryTone[batterySize] && (
          <span className="absolute end-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-2.5 py-1 text-[11px] font-black text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-900/95 dark:text-slate-100">
            <span className={`h-2 w-2 rounded-full ${batteryTone[batterySize]}`} />
            {fa ? Number(batterySize).toLocaleString("fa-IR", { useGrouping: false }) : batterySize}
          </span>
        )}
        <div className="aspect-square w-full p-5 transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.03] small:p-6">
          <Thumbnail thumbnail={product.thumbnail} images={product.images} productTitle={product.title} size="square" isFeatured={isFeatured} />
        </div>
      </LocalizedClientLink>

      <div className="flex flex-1 flex-col p-4">
        {typeof product.metadata?.brand === "string" && (
          <span className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-teal-700">
            {product.metadata.brand}
          </span>
        )}
        <LocalizedClientLink href={`/products/${product.handle}`} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700">
          <h3 className={`line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-slate-900 transition group-hover:text-teal-800 ${catalogMode ? "dark:text-slate-50 dark:group-hover:text-teal-300" : ""}`}>
            {title}
          </h3>
        </LocalizedClientLink>
        {shortDescription && (
          <p className={`mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500 ${catalogMode ? "dark:text-slate-400" : ""}`}>{shortDescription}</p>
        )}

        <div className={`mt-auto border-t border-slate-100 pt-4 ${catalogMode ? "dark:border-slate-800" : ""}`}>
          <div className="mb-3 min-h-6 font-semibold text-slate-950">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} catalogMode={catalogMode} />}
          </div>
          <div className="flex items-center justify-between gap-2">
            <LocalizedClientLink href={`/products/${product.handle}`} className="text-[11px] text-slate-500 hover:text-teal-700">
              {fa ? "مشاهده جزئیات" : "View details"}
            </LocalizedClientLink>
            <PreviewAddToCart product={product} region={region} label={fa ? "افزودن به سبد خرید" : "Add to cart"} />
          </div>
        </div>
      </div>
    </article>
  )
}
