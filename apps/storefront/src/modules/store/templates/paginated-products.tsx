import { getLocale } from "@/lib/i18n"
import { listProductsWithSort } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import ProductPreview from "@/modules/products/components/product-preview"
import { Pagination } from "@/modules/store/components/pagination"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import { B2BCustomer } from "@/types"
import { cookies } from "next/headers"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  customer_group_id?: string
  q?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  customer,
  optionValueIds,
  batterySize,
  availability,
  query,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  customer?: B2BCustomer | null
  optionValueIds?: string[]
  batterySize?: string
  availability?: "in-stock" | "out-of-stock"
  query?: string
}) {
  const queryParams: PaginatedProductsParams = { limit: PRODUCT_LIMIT }

  if (collectionId) queryParams["collection_id"] = [collectionId]
  else if (categoryId) queryParams["category_id"] = [categoryId]
  if (productsIds) queryParams["id"] = productsIds
  if (sortBy === "created_at") queryParams["order"] = "created_at"

  const region = await getRegion(countryCode)
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  if (!region) return null

  const {
    response: { products, count },
  } = await listProductsWithSort({ page, queryParams, sortBy, countryCode, optionValueIds, batterySize, availability, searchQuery: query })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <div className="mb-5 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
        <span>
          {locale === "fa" ? `${count.toLocaleString("fa-IR")} محصول` : `${count} products`}
        </span>
        <span className="hidden small:inline">
          {locale === "fa" ? "قیمت‌ها بر اساس منطقه انتخاب‌شده نمایش داده می‌شوند" : "Prices are shown for your selected region"}
        </span>
      </div>

      {products.length > 0 ? (
        <ul className="grid w-full grid-cols-2 gap-x-3 gap-y-6 small:grid-cols-3 medium:grid-cols-4" data-testid="products-list">
          {products.map((product) => (
            <li key={product.id} className="min-w-0">
              <ProductPreview product={product} region={region} catalogMode />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex min-h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <div>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">⌕</div>
            <p className="font-semibold text-slate-900 dark:text-slate-50">
              {locale === "fa" ? "محصولی با این فیلترها پیدا نشد." : "No products match these filters."}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <LocalizedClientLink href={query ? `/store?q=${encodeURIComponent(query)}` : "/store"} className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold transition hover:border-teal-600 dark:border-slate-700">{locale === "fa" ? "پاک کردن فیلترها" : "Clear filters"}</LocalizedClientLink>
              <LocalizedClientLink href="/store" className="rounded-lg bg-teal-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-800">{locale === "fa" ? "بازگشت به همه محصولات" : "Browse all products"}</LocalizedClientLink>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {locale === "fa" ? "فیلترها را تغییر دهید یا دوباره همه محصولات را ببینید." : "Try changing the filters or browse all products again."}
            </p>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 border-t border-slate-200 pt-7">
          <Pagination data-testid="product-pagination" page={page} totalPages={totalPages} />
        </div>
      )}
    </>
  )
}
