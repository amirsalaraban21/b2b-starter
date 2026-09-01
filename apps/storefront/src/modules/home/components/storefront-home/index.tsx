import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { getLocale, messages } from "@/lib/i18n"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ProductPreview from "@/modules/products/components/product-preview"
import { cookies } from "next/headers"

const categoryLabels = {
  fa: ["تجهیزات معاینه گوش", "لوازم ادیولوژی", "تجهیزات کلینیکی", "لوازم مصرفی", "قطعات و جانبی"],
  en: ["Ear examination", "Audiology supplies", "Clinical equipment", "Consumables", "Parts & accessories"],
}

const benefits = {
  fa: ["محصولات تخصصی", "پشتیبانی حرفه‌ای", "خرید امن", "پردازش سریع سفارش"],
  en: ["Specialist products", "Professional support", "Secure purchasing", "Fast order processing"],
}

export default async function StorefrontHome({ countryCode }: { countryCode: string }) {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const t = messages[locale]
  const region = await getRegion(countryCode)
  const products = region
    ? (await listProducts({ countryCode, queryParams: { limit: 8 } })).response.products
    : []

  return (
    <div className="bg-ui-bg-base">
      <section className="relative overflow-hidden border-b border-ui-border-base bg-gradient-to-br from-teal-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950">
        <div className="content-container grid min-h-[500px] items-center gap-10 py-16 small:grid-cols-[1.15fr_.85fr] small:py-24">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold text-teal-700">{t.heroEyebrow}</p>
            <h1 className="text-4xl font-semibold leading-tight text-ui-fg-base small:text-6xl">{t.heroTitle}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ui-fg-subtle">{t.heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LocalizedClientLink href="/store" className="rounded-lg bg-teal-700 px-5 py-3 font-medium text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{t.exploreProducts}</LocalizedClientLink>
              <LocalizedClientLink href="/account" className="rounded-lg border border-ui-border-base px-5 py-3 font-medium text-ui-fg-base transition hover:bg-ui-bg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{locale === "fa" ? "خرید سازمانی و کلینیکی" : "Professional & clinic purchasing"}</LocalizedClientLink>
            </div>
          </div>
          <div className="relative mx-auto grid aspect-square w-full max-w-md place-items-center rounded-3xl border border-teal-100 bg-white/70 p-10 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
            <div className="grid h-48 w-48 place-items-center rounded-full bg-teal-700 text-7xl text-white" aria-hidden="true">◖</div>
            <span className="absolute bottom-8 rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-100">EarMed Store</span>
          </div>
        </div>
      </section>

      <section className="content-container py-14 small:py-20">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-teal-700">{locale === "fa" ? "دسته‌بندی‌ها" : "Categories"}</p><h2 className="mt-2 text-3xl font-semibold">{locale === "fa" ? "برای هر محیط درمانی" : "For every care setting"}</h2></div><LocalizedClientLink href="/store" className="text-sm font-medium text-teal-700 hover:underline">{t.exploreProducts}</LocalizedClientLink></div>
        <div className="grid gap-4 xsmall:grid-cols-2 small:grid-cols-5">
          {categoryLabels[locale].map((label, index) => <LocalizedClientLink key={label} href="/store" className="group min-h-36 rounded-2xl border border-ui-border-base bg-ui-bg-subtle p-5 transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"><span className="mb-8 block text-2xl text-teal-700" aria-hidden="true">{["◉", "◌", "✦", "□", "◇"][index]}</span><span className="font-medium text-ui-fg-base">{label}</span></LocalizedClientLink>)}
        </div>
      </section>

      <section className="border-y border-ui-border-base bg-ui-bg-subtle"><div className="content-container py-14 small:py-20"><div className="mb-8"><p className="text-sm font-medium text-teal-700">{locale === "fa" ? "محصولات منتخب" : "Featured products"}</p><h2 className="mt-2 text-3xl font-semibold">{locale === "fa" ? "محصولات پرمراجعه" : "Popular products"}</h2></div>{products.length && region ? <ul className="grid grid-cols-2 gap-3 small:grid-cols-4 small:gap-5">{products.map(product => <li key={product.id}><ProductPreview product={product} region={region} isFeatured /></li>)}</ul> : <p className="rounded-xl border border-dashed border-ui-border-base p-8 text-ui-fg-subtle">{locale === "fa" ? "محصولی برای نمایش موجود نیست." : "No products are available to display yet."}</p>}</div></section>

      <section className="content-container py-14 small:py-20"><div className="grid gap-8 rounded-3xl bg-teal-800 p-8 text-white small:grid-cols-[1.1fr_.9fr] small:p-14"><div><p className="text-sm font-medium text-teal-100">{locale === "fa" ? "برای متخصصان" : "For professionals"}</p><h2 className="mt-3 text-3xl font-semibold">{locale === "fa" ? "خرید حرفه‌ای برای پزشکان و کلینیک‌ها" : "Professional purchasing for doctors and clinics"}</h2><p className="mt-4 max-w-xl leading-7 text-teal-50">{locale === "fa" ? "برای سفارش‌های عمده، درخواست پیش‌فاکتور و خرید سازمانی از مسیر حساب کاربری اقدام کنید." : "Use your account for bulk orders, quote requests and organization purchasing."}</p><LocalizedClientLink href="/account" className="mt-7 inline-block rounded-lg bg-white px-5 py-3 font-medium text-teal-800 hover:bg-teal-50">{locale === "fa" ? "ورود و خرید حرفه‌ای" : "Sign in for professional purchasing"}</LocalizedClientLink></div><ul className="grid content-center gap-4 text-teal-50">{[locale === "fa" ? "درخواست پیش‌فاکتور" : "Quote requests", locale === "fa" ? "سفارش عمده" : "Bulk orders", locale === "fa" ? "خرید سازمانی" : "Organization purchasing"].map(item => <li key={item} className="rounded-xl border border-teal-600 bg-teal-700/50 p-4">{item}</li>)}</ul></div></section>

      <section className="border-t border-ui-border-base"><div className="content-container grid gap-4 py-12 xsmall:grid-cols-2 small:grid-cols-4">{benefits[locale].map((benefit, index) => <div key={benefit} className="rounded-xl p-4"><span className="text-xl text-teal-700">{["✓", "◌", "◈", "→"][index]}</span><h3 className="mt-3 font-semibold">{benefit}</h3><p className="mt-1 text-sm text-ui-fg-subtle">{locale === "fa" ? "جزئیات این بخش پیش از راه‌اندازی نهایی تکمیل می‌شود." : "Details for this area will be completed before launch."}</p></div>)}</div></section>
    </div>
  )
}
