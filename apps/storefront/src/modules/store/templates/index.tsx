import { getLocale } from "@/lib/i18n"
import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@/modules/store/components/refinement-list"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import StoreBreadcrumb from "@/modules/store/components/store-breadcrumb"
import PaginatedProducts from "@/modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { cookies } from "next/headers"
import { Suspense } from "react"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  categories,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  categories?: HttpTypes.StoreProductCategory[]
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const fa = locale === "fa"

  const departments = fa
    ? [
        ["باتری سمعک", "سایزهای ۱۰، ۱۳، ۳۱۲ و ۶۷۵"],
        ["تمیزکننده", "اسپری، دستمال، برس و ابزار نگهداری"],
        ["رطوبت‌گیر و خشک‌کن", "لوازم نگهداری روزانه"],
        ["فیلتر و قطعات مصرفی", "Wax guard، dome و tubing"],
      ]
    : [
        ["Hearing aid batteries", "Sizes 10, 13, 312 and 675"],
        ["Cleaning", "Sprays, wipes, brushes and care tools"],
        ["Drying & moisture care", "Everyday maintenance supplies"],
        ["Filters & consumables", "Wax guards, domes and tubing"],
      ]

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="content-container py-8 small:py-12">
          <StoreBreadcrumb />
          <div className="mt-6 grid gap-7 medium:grid-cols-[1fr_auto] medium:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-teal-700">EarMed Store</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 small:text-4xl">
                {fa ? "لوازم مصرفی و نگهداری سمعک" : "Hearing aid care & supplies"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 small:text-base">
                {fa
                  ? "باتری، لوازم تمیزکاری، رطوبت‌گیر و قطعات مصرفی را در یک کاتالوگ ساده و قابل مقایسه پیدا کنید."
                  : "Find batteries, cleaning supplies, moisture care and everyday consumable parts in one focused catalog."}
              </p>
            </div>
            <div className="rounded-xl border border-teal-100 bg-teal-50 px-5 py-4 text-sm text-teal-950">
              <strong>{fa ? "خرید حرفه‌ای" : "Professional purchasing"}</strong>
              <span className="mt-1 block text-teal-800">
                {fa ? "برای کلینیک‌ها و متخصصان از حساب حرفه‌ای استفاده کنید." : "Professional accounts are available for clinics and specialists."}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-3 xsmall:grid-cols-2 medium:grid-cols-4">
            {departments.map(([title, subtitle], index) => (
              <div key={title} className="group min-h-32 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-teal-300 hover:shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">0{index + 1}</span>
                  <span className="text-slate-300 transition group-hover:text-teal-600">←</span>
                </div>
                <h2 className="font-semibold text-slate-950">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-container py-8 small:py-12" data-testid="category-container">
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{fa ? "همه محصولات" : "All products"}</h2>
            <p className="mt-1 text-sm text-slate-500">{fa ? "مرتب‌سازی و فیلتر برای پیدا کردن سریع‌تر محصول" : "Sort and filter to find the right item faster"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 small:flex-row small:items-start">
          <aside className="w-full shrink-0 small:w-56 medium:w-64">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 small:sticky small:top-24">
              <p className="mb-4 text-sm font-semibold text-slate-900">{fa ? "فیلتر و مرتب‌سازی" : "Filter & sort"}</p>
              <RefinementList sortBy={sort} categories={categories} />
            </div>
          </aside>
          <div className="min-w-0 flex-1">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts sortBy={sort} page={pageNumber} countryCode={countryCode} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  )
}

export default StoreTemplate
