import { getLocalizedCategoryName } from "@/lib/category-localization"
import { getLocale } from "@/lib/i18n"
import { getLocalizedProductTitle } from "@/lib/product-localization"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ImageGallery from "@/modules/products/components/image-gallery"
import ProductActions from "@/modules/products/components/product-actions"
import ProductTabs from "@/modules/products/components/product-tabs"
import RelatedProducts from "@/modules/products/components/related-products"
import ProductInfo from "@/modules/products/templates/product-info"
import SkeletonRelatedProducts from "@/modules/skeletons/templates/skeleton-related-products"
import { HttpTypes } from "@medusajs/types"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = { product: HttpTypes.StoreProduct; region: HttpTypes.StoreRegion; countryCode: string }

const batteryAccents: Record<string, { tone: string; fa: string; en: string }> = {
  "10": { tone: "bg-yellow-400", fa: "زرد", en: "Yellow" },
  "13": { tone: "bg-orange-500", fa: "نارنجی", en: "Orange" },
  "312": { tone: "bg-amber-800", fa: "قهوه‌ای", en: "Brown" },
  "675": { tone: "bg-blue-600", fa: "آبی", en: "Blue" },
}

const ProductTemplate = async ({ product, region, countryCode }: ProductTemplateProps) => {
  if (!product?.id) return notFound()
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const fa = locale === "fa"
  const title = getLocalizedProductTitle(product, locale)
  const category = product.categories?.[0]
  const specifications = product.metadata?.specifications
  const rawBatterySize = specifications && typeof specifications === "object" && !Array.isArray(specifications)
    ? (specifications as Record<string, unknown>).battery_size
    : undefined
  const batterySize = typeof rawBatterySize === "string" || typeof rawBatterySize === "number" ? String(rawBatterySize) : undefined
  const batteryAccent = batterySize ? batteryAccents[batterySize] : undefined

  return (
    <main dir={fa ? "rtl" : "ltr"} className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="content-container pb-20 pt-4 small:pt-6">
        <nav aria-label={fa ? "مسیر محصول" : "Product breadcrumb"} className="mb-4 flex min-w-0 items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <LocalizedClientLink href="/store" className="shrink-0 transition hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{fa ? "فروشگاه" : "Store"}</LocalizedClientLink>
          {category && <><span>/</span><LocalizedClientLink href={`/store?category=${encodeURIComponent(category.handle)}`} className="min-w-0 truncate transition hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{getLocalizedCategoryName(category, locale)}</LocalizedClientLink></>}
          <span>/</span><span className="min-w-0 truncate text-slate-700 dark:text-slate-200" aria-current="page">{title}</span>
        </nav>

        <section className="grid items-start gap-5 medium:grid-cols-[1.22fr_1fr]" data-testid="product-container">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900 small:p-4">
            <ImageGallery product={product} locale={locale} />
          </div>

          <div className="flex h-fit flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.07)] dark:border-slate-700 dark:bg-slate-900 small:p-7 medium:sticky medium:top-28">
            <div className="mb-4 flex flex-col items-start gap-2 border-b border-slate-100 pb-3.5 dark:border-slate-800 xsmall:flex-row xsmall:items-center xsmall:justify-between xsmall:gap-3">
              <span className="flex min-w-0 items-center gap-2 text-sm font-bold text-teal-700 dark:text-teal-300">
                {batteryAccent && <span className={`h-3 w-3 rounded-full border border-black/10 ${batteryAccent.tone}`} />}
                {batteryAccent && batterySize ? `${fa ? Number(batterySize).toLocaleString("fa-IR", { useGrouping: false }) : batterySize} — ${fa ? batteryAccent.fa : batteryAccent.en}` : category ? getLocalizedCategoryName(category, locale) : (fa ? "محصول EarMed" : "EarMed catalog")}
              </span>
              <LocalizedClientLink href="/store" className="shrink-0 text-sm font-semibold text-slate-500 transition hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:text-slate-400 dark:hover:text-teal-300">{fa ? "بازگشت به فروشگاه" : "Back to store"}</LocalizedClientLink>
            </div>

            <ProductInfo product={product} locale={locale} />
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60 small:p-5">
              <Suspense fallback={<ProductActions product={product} region={region} locale={locale} />}>
                <ProductActionsWrapper id={product.id} region={region} locale={locale} />
              </Suspense>
            </div>
          </div>
        </section>

        <section className="mt-10 border-t border-slate-200 pt-7 dark:border-slate-800">
          <div className="mb-5"><h2 className="text-xl font-bold small:text-2xl">{fa ? "اطلاعات محصول" : "Product information"}</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{fa ? "توضیحات و مشخصات ثبت‌شده برای این محصول" : "Available product details and specifications"}</p></div>
          <ProductTabs product={product} locale={locale} />
        </section>

        <section className="mt-12 border-t border-slate-200 pt-7 dark:border-slate-800" data-testid="related-products-container">
          <div className="mb-6 flex flex-col items-start gap-3 xsmall:flex-row xsmall:items-end xsmall:justify-between xsmall:gap-4"><div><p className="text-xs font-bold text-teal-700 dark:text-teal-300">{fa ? "از همین دسته‌بندی" : "FROM THE SAME CATEGORY"}</p><h2 className="mt-2 text-xl font-bold small:text-2xl">{fa ? "محصولات مرتبط" : "Related products"}</h2></div><LocalizedClientLink href={category ? `/store?category=${encodeURIComponent(category.handle)}` : "/store"} className="shrink-0 text-sm font-bold text-teal-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:text-teal-300">{fa ? "مشاهده دسته‌بندی" : "View category"}</LocalizedClientLink></div>
          <Suspense fallback={<SkeletonRelatedProducts />}><RelatedProducts product={product} countryCode={countryCode} /></Suspense>
        </section>
      </div>
    </main>
  )
}

export default ProductTemplate
