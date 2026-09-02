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
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  if (!product) return null

  const { cheapestPrice } = getProductPrice({ product })
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const fa = locale === "fa"
  const title = fa && typeof product.metadata?.fa_title === "string" ? product.metadata.fa_title : product.title
  const shortDescription = fa && typeof product.metadata?.fa_short_description === "string"
    ? product.metadata.fa_short_description
    : product.subtitle
  const isAvailable = product.variants?.some(
    (variant) => !variant.manage_inventory || (variant.inventory_quantity || 0) > 0
  )

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-200 hover:border-teal-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="relative block bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
      >
        <div className="absolute start-3 top-3 z-10 rounded-full border border-slate-200 bg-white/95 px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm">
          {isAvailable ? (fa ? "موجود" : "In stock") : (fa ? "ناموجود" : "Unavailable")}
        </div>
        <div className="aspect-square w-full p-5 small:p-6">
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
          <h3 className="line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-slate-900 transition group-hover:text-teal-800">
            {title}
          </h3>
        </LocalizedClientLink>
        {shortDescription && (
          <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{shortDescription}</p>
        )}

        <div className="mt-auto border-t border-slate-100 pt-4">
          <div className="mb-3 min-h-6 font-semibold text-slate-950">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
          <div className="flex items-center justify-between gap-2">
            <LocalizedClientLink href={`/products/${product.handle}`} className="text-[11px] text-slate-500 hover:text-teal-700">
              {fa ? "مشاهده جزئیات" : "View details"}
            </LocalizedClientLink>
            <PreviewAddToCart product={product} region={region} />
          </div>
        </div>
      </div>
    </article>
  )
}
