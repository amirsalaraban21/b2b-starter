import {
  getCategoryImageKey,
  getLocalizedCategoryName,
} from "@/lib/category-localization"
import { getLocale } from "@/lib/i18n"
import { departmentImageByKey } from "@/lib/product-demo-images"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid"
import CatalogControls from "@/modules/store/components/catalog-controls"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@/modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { cookies } from "next/headers"
import { Suspense } from "react"

type StoreTemplateProps = {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  categories: HttpTypes.StoreProductCategory[]
  category?: string
  batterySize?: string
  availability?: "in-stock" | "out-of-stock"
  query?: string
}

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  categories,
  category,
  batterySize,
  availability,
  query,
}: StoreTemplateProps) => {
  const pageNumber = Math.max(Number.parseInt(page || "1", 10) || 1, 1)
  const sort = sortBy || "created_at"
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const fa = locale === "fa"
  const selectedCategory = categories.find((item) => item.handle === category)

  const categoryHref = (handle: string) => {
    const params = new URLSearchParams()
    params.set("category", handle)
    if (query) params.set("q", query)
    if (sort !== "created_at") params.set("sortBy", sort)
    return `/store?${params.toString()}`
  }

  return (
    <main
      dir={fa ? "rtl" : "ltr"}
      className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50"
    >
      <section className="border-b border-slate-200 bg-[#f5f8f8] dark:border-slate-800 dark:bg-slate-900/70">
        <div className="content-container py-7 small:py-9">
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <LocalizedClientLink
              href="/"
              className="transition hover:text-teal-700"
            >
              {fa ? "خانه" : "Home"}
            </LocalizedClientLink>
            <span>/</span>
            <span>{fa ? "فروشگاه" : "Store"}</span>
          </div>
          <div className="flex flex-col gap-2 medium:flex-row medium:items-end medium:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight small:text-4xl">
                {fa ? "فروشگاه لوازم سمعک" : "Hearing aid supplies"}
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {fa
                  ? "محصولات مصرفی، نگهداری و مراقبت روزمره سمعک"
                  : "Consumables, maintenance and everyday hearing aid care"}
              </p>
            </div>
            {query && (
              <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">
                {fa
                  ? `نتایج جستجو برای «${query}»`
                  : `Search results for “${query}”`}
              </p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 small:grid-cols-5">
            {categories.map((item) => {
              const selected = item.handle === category
              const imageKey = getCategoryImageKey(item.handle)
              return (
                <LocalizedClientLink
                  key={item.id}
                  href={categoryHref(item.handle)}
                  aria-current={selected ? "page" : undefined}
                  className={`group relative overflow-hidden rounded-xl border bg-white transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 motion-reduce:transition-none dark:bg-slate-900 ${
                    selected
                      ? "border-teal-600 bg-teal-50/40 shadow-sm ring-2 ring-teal-600/15 dark:border-teal-400 dark:bg-teal-950/25"
                      : "border-slate-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md motion-reduce:transform-none dark:border-slate-700 dark:hover:border-teal-700"
                  }`}
                >
                  {selected && (
                    <span
                      className="absolute end-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-teal-700 text-xs font-black text-white shadow-sm"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <img
                      src={departmentImageByKey[imageKey]}
                      alt=""
                      className="h-full w-full object-contain p-2.5 transition duration-300 group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                    />
                  </div>
                  <div
                    className={`border-t p-3 ${
                      selected
                        ? "border-teal-200 dark:border-teal-900"
                        : "border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    <h2 className="text-xs font-bold leading-5 text-slate-900 dark:text-slate-50 small:text-sm">
                      {getLocalizedCategoryName(item, locale)}
                    </h2>
                  </div>
                </LocalizedClientLink>
              )
            })}
          </div>
        </div>
      </section>

      <section
        className="content-container pb-16 pt-7 small:pb-24 small:pt-10"
        data-testid="category-container"
      >
        <div className="grid gap-5 small:grid-cols-[220px_minmax(0,1fr)] medium:grid-cols-[224px_minmax(0,1fr)]">
          <CatalogControls
            categories={categories}
            locale={locale}
            sortBy={sort}
            category={category}
            batterySize={batterySize}
            availability={availability}
            query={query}
          />
          <div className="min-w-0">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                countryCode={countryCode}
                categoryId={selectedCategory?.id}
                batterySize={batterySize}
                availability={availability}
                query={query}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  )
}

export default StoreTemplate
