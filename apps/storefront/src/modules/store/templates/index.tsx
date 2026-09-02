import { getLocale } from "@/lib/i18n"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@/modules/store/components/refinement-list"
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@/modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { cookies } from "next/headers"
import { Suspense } from "react"

const StoreTemplate = async ({ sortBy, page, countryCode, categories }: {
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
    ? [["باتری سمعک", "۱۰ · ۱۳ · ۳۱۲ · ۶۷۵", "bg-amber-50"], ["نظافت و نگهداری", "اسپری · دستمال · برس", "bg-cyan-50"], ["رطوبت‌گیر و خشک‌کن", "کپسول · ظرف · کیت", "bg-teal-50"], ["قطعات مصرفی", "فیلتر · دام · تیوب", "bg-slate-100"]]
    : [["Hearing aid batteries", "10 · 13 · 312 · 675", "bg-amber-50"], ["Cleaning & care", "Spray · wipes · brushes", "bg-cyan-50"], ["Drying & moisture care", "Capsules · cups · kits", "bg-teal-50"], ["Consumable parts", "Guards · domes · tubing", "bg-slate-100"]]

  return (
    <main dir={fa ? "rtl" : "ltr"} className="bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-[#f6f9f9]">
        <div className="content-container py-8 small:py-10">
          <div className="flex flex-col gap-5 medium:flex-row medium:items-end medium:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-500"><LocalizedClientLink href="/" className="hover:text-teal-700">{fa ? "خانه" : "Home"}</LocalizedClientLink><span>/</span><span>{fa ? "فروشگاه" : "Store"}</span></div>
              <h1 className="text-3xl font-bold small:text-4xl">{fa ? "فروشگاه لوازم سمعک" : "Hearing aid supplies"}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{fa ? "باتری، لوازم نگهداری و قطعات مصرفی؛ همه در یک کاتالوگ تخصصی." : "Batteries, care products and replacement consumables in one focused catalog."}</p>
            </div>
            <LocalizedClientLink href="/account" className="w-fit rounded-lg border border-teal-200 bg-white px-4 py-2.5 text-sm font-bold text-teal-800 hover:border-teal-400">{fa ? "خرید حرفه‌ای برای مراکز" : "Professional purchasing"}</LocalizedClientLink>
          </div>

          <div className="mt-7 grid gap-3 xsmall:grid-cols-2 medium:grid-cols-4">
            {departments.map(([title, subtitle, tone], index) => (
              <LocalizedClientLink href="/store" key={title} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-teal-300 hover:shadow-sm">
                <div className={`${tone} flex h-20 items-center justify-between px-4`}><span className="text-xs font-black text-slate-400">0{index + 1}</span><span className="text-xl font-black text-slate-300">{index === 0 ? "312" : index === 1 ? "CARE" : index === 2 ? "DRY" : "PARTS"}</span></div>
                <div className="p-4"><h2 className="text-sm font-bold">{title}</h2><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>

      <section className="content-container py-8 small:py-10" data-testid="category-container">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div><h2 className="text-xl font-bold">{fa ? "همه محصولات" : "All products"}</h2><p className="mt-1 text-xs text-slate-500">{fa ? "برای پیدا کردن سریع‌تر، جستجو یا مرتب‌سازی کنید." : "Search or sort to find products faster."}</p></div>
          <LocalizedClientLink href="/" className="text-xs font-bold text-teal-700 hover:underline">{fa ? "بازگشت به خانه" : "Back home"}</LocalizedClientLink>
        </div>
        <div className="grid gap-7 small:grid-cols-[220px_minmax(0,1fr)] medium:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="min-w-0"><div className="rounded-xl border border-slate-200 bg-white p-4 small:sticky small:top-24"><div className="mb-4 border-b border-slate-100 pb-3"><p className="text-sm font-bold">{fa ? "جستجو و مرتب‌سازی" : "Search & sort"}</p></div><RefinementList sortBy={sort} categories={categories} /></div></aside>
          <div className="min-w-0"><Suspense fallback={<SkeletonProductGrid />}><PaginatedProducts sortBy={sort} page={pageNumber} countryCode={countryCode} /></Suspense></div>
        </div>
      </section>
    </main>
  )
}

export default StoreTemplate
