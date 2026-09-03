import { Locale } from "@/lib/i18n"
import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({ product, locale }: { product: HttpTypes.StoreProduct; locale: Locale }) {
  const localizedLocale = locale === "fa" ? "fa-IR" : "en-US"
  const { cheapestPrice } = getProductPrice({ product, locale: localizedLocale })
  const amounts = (product.variants || [])
    .map((variant) => variant.calculated_price?.calculated_amount)
    .filter((amount): amount is number => typeof amount === "number")
  const hasRange = new Set(amounts).size > 1

  if (!cheapestPrice) {
    return <div className="h-9 w-32 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
  }

  return (
    <div className="flex flex-col text-slate-950 dark:text-slate-50">
      <p className="text-2xl font-black leading-9 small:text-3xl" data-testid="product-price" data-value={cheapestPrice.calculated_price_number}>
        {hasRange && <span className="me-1 text-base font-semibold text-slate-500 dark:text-slate-400">{locale === "fa" ? "از" : "From"}</span>}
        {cheapestPrice.calculated_price}
      </p>
      {cheapestPrice.price_type === "sale" && (
        <p className="mt-1 text-sm text-slate-500 line-through" data-testid="original-product-price" data-value={cheapestPrice.original_price_number}>
          {cheapestPrice.original_price}
        </p>
      )}
    </div>
  )
}
