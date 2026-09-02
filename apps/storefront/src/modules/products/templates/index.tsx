import { HttpTypes } from "@medusajs/types"
import ImageGallery from "@/modules/products/components/image-gallery"
import ProductActions from "@/modules/products/components/product-actions"
import ProductTabs from "@/modules/products/components/product-tabs"
import RelatedProducts from "@/modules/products/components/related-products"
import ProductInfo from "@/modules/products/templates/product-info"
import SkeletonRelatedProducts from "@/modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import React, { Suspense } from "react"
import ProductActionsWrapper from "./product-actions-wrapper"
import ProductFacts from "../components/product-facts"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { cookies } from "next/headers"
import { getLocale } from "@/lib/i18n"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate = async ({ product, region, countryCode }: ProductTemplateProps) => {
  if (!product || !product.id) return notFound()

  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const fa = locale === "fa"

  return (
    <main dir={fa ? "rtl" : "ltr"} className="bg-white text-slate-950">
      <div className="content-container py-5 small:py-8">
        <div className="mb-5 flex items-center gap-2 text-xs text-slate-500">
          <LocalizedClientLink href="/" className="hover:text-teal-700">{fa ? "خانه" : "Home"}</LocalizedClientLink>
          <span>/</span>
          <LocalizedClientLink href="/store" className="hover:text-teal-700">{fa ? "فروشگاه" : "Store"}</LocalizedClientLink>
          <span>/</span>
          <span className="truncate">{fa && typeof product.metadata?.fa_title === "string" ? product.metadata.fa_title : product.title}</span>
        </div>

        <section className="grid gap-7 medium:grid-cols-[1.05fr_.95fr]" data-testid="product-container">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 small:p-5">
            <ImageGallery product={product} />
          </div>

          <div className="flex h-fit flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] small:p-8 medium:sticky medium:top-24">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-teal-700">{fa ? "محصول EarMed" : "EarMed catalog"}</span>
              <LocalizedClientLink href="/store" className="text-xs font-semibold text-slate-500 hover:text-teal-700">{fa ? "بازگشت به فروشگاه" : "Back to store"}</LocalizedClientLink>
            </div>

            <ProductInfo product={product} />

            <div className="mt-6 rounded-xl bg-slate-50 p-4 small:p-5">
              <Suspense fallback={<ProductActions product={product} region={region} />}>
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <ProductFacts product={product} />
            </div>
          </div>
        </section>

        <section className="mt-10 border-t border-slate-200 pt-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold">{fa ? "اطلاعات محصول" : "Product information"}</h2>
            <p className="mt-1 text-sm text-slate-500">{fa ? "جزئیات، مشخصات و اطلاعات تکمیلی محصول" : "Details, specifications and additional product information"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 small:p-7">
            <ProductTabs product={product} />
          </div>
        </section>

        <section className="mt-12 border-t border-slate-200 pt-8" data-testid="related-products-container">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-teal-700">{fa ? "پیشنهادهای بیشتر" : "MORE TO EXPLORE"}</p>
              <h2 className="mt-2 text-xl font-bold small:text-2xl">{fa ? "محصولات مرتبط" : "Related products"}</h2>
            </div>
            <LocalizedClientLink href="/store" className="text-sm font-bold text-teal-700 hover:underline">{fa ? "همه محصولات" : "View all"}</LocalizedClientLink>
          </div>
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </section>
      </div>
    </main>
  )
}

export default ProductTemplate
