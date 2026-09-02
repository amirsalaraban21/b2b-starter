import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { Text, clx } from "@medusajs/ui"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewAddToCart from "./preview-add-to-cart"
import PreviewPrice from "./price"
import { cookies } from "next/headers"
import { getLocale } from "@/lib/i18n"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  if (!product) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  const inventoryQuantity = product.variants?.reduce((acc, variant) => {
    return acc + (variant?.inventory_quantity || 0)
  }, 0)
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const title = locale === "fa" && typeof product.metadata?.fa_title === "string" ? product.metadata.fa_title : product.title
  const isAvailable = product.variants?.some((variant) => !variant.manage_inventory || (variant.inventory_quantity || 0) > 0)

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
      <div
        data-testid="product-wrapper"
        className="flex h-full min-h-[340px] flex-col gap-4 relative w-full overflow-hidden border border-ui-border-base p-4 bg-white shadow-sm rounded-2xl group-hover:-translate-y-1 group-hover:shadow-[0_14px_32px_rgba(15,118,110,0.16)] transition duration-200 dark:bg-ui-bg-subtle"
      >
        <div className="aspect-square w-full p-6">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            isFeatured={isFeatured}
          />
        </div>
        <div className="flex flex-col txt-compact-medium">
          {typeof product.metadata?.brand === "string" && <Text className="text-neutral-600 text-xs">{product.metadata.brand}</Text>}
          <Text className="text-ui-fg-base" data-testid="product-title">
            {title}
          </Text>
        </div>
        <div className="flex flex-col gap-0">
          {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
        </div>
        <div className="flex justify-between">
          <div className="flex flex-row gap-1 items-center">
            <span
              className={clx({
                "text-green-500": isAvailable,
                "text-red-500": !isAvailable,
              })}
            >
              •
            </span>
            <Text className="text-neutral-600 text-xs">
              {isAvailable ? (locale === "fa" ? "موجود برای سفارش" : "Available to order") : (locale === "fa" ? "ناموجود" : "Unavailable")}
            </Text>
          </div>
          <PreviewAddToCart product={product} region={region} />
        </div>
      </div>
    </LocalizedClientLink>
  )
}
