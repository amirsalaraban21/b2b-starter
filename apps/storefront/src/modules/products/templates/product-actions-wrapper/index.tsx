import { getProductsById } from "@/lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@/modules/products/components/product-actions"
import { Locale } from "@/lib/i18n"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
  locale,
}: {
  id: string
  region: HttpTypes.StoreRegion
  locale: Locale
}) {
  const [product] = await getProductsById({
    ids: [id],
    regionId: region.id,
  })

  if (!product) {
    return null
  }

  return <ProductActions product={product} region={region} locale={locale} />
}
