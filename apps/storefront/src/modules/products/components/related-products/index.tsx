import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import ProductPreview from "@/modules/products/components/product-preview"
import { HttpTypes } from "@medusajs/types"

export default async function RelatedProducts({
  product,
  countryCode,
}: {
  product: HttpTypes.StoreProduct
  countryCode: string
}) {
  const region = await getRegion(countryCode)
  const categoryId = product.categories?.[0]?.id
  if (!region || !categoryId) return null

  const queryParams: HttpTypes.StoreProductParams & {
    category_id: string[]
    limit: number
  } = {
    category_id: [categoryId],
    limit: 12,
  }
  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) =>
    response.products.filter((item) => item.id !== product.id).slice(0, 4)
  )

  if (!products.length) return null

  return (
    <ul className="grid grid-cols-1 gap-x-4 gap-y-6 min-[360px]:grid-cols-2 small:grid-cols-3 medium:grid-cols-4">
      {products.map((item) => (
        <li key={item.id} className="min-w-0">
          <ProductPreview region={region} product={item} catalogMode />
        </li>
      ))}
    </ul>
  )
}
