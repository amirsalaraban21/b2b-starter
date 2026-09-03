import { Locale } from "@/lib/i18n"
import { getLocalizedProductDescription, getLocalizedProductTitle } from "@/lib/product-localization"
import { HttpTypes } from "@medusajs/types"

const ProductInfo = ({ product, locale }: { product: HttpTypes.StoreProduct; locale: Locale }) => {
  const title = getLocalizedProductTitle(product, locale)
  const description = getLocalizedProductDescription(product, locale)

  return (
    <div id="product-info">
      <h1 className="text-3xl font-black leading-[1.3] tracking-tight text-slate-950 dark:text-slate-50 small:text-[2.6rem]" data-testid="product-title">
        {title}
      </h1>
      {description && (
        <p className="mt-3.5 max-w-xl whitespace-pre-line text-base leading-8 text-slate-600 dark:text-slate-300" data-testid="product-description">
          {description}
        </p>
      )}
    </div>
  )
}

export default ProductInfo
