import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { getLocale } from "@/lib/i18n"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ProductPreview from "@/modules/products/components/product-preview"
import { cookies } from "next/headers"

const departments = {
  fa: [
    { title: "باتری سمعک", text: "سایزهای ۱۰، ۱۳، ۳۱۲ و ۶۷۵", mark: "10 · 13 · 312 · 675", tone: "bg-amber-50" },
    { title: "نظافت و نگهداری", text: "اسپری، دستمال، برس و ابزار تمیزکاری", mark: "CARE", tone: "bg-cyan-50" },
    { title: "رطوبت‌گیر و خشک‌کن", text: "کپسول، ظرف و کیت خشک‌کن", mark: "DRY", tone: "bg-teal-50" },
    { title: "قطعات مصرفی", text: "فیلتر جرم، دام، تیوب و لوازم جانبی", mark: "PARTS", tone: "bg-slate-100" },
  ],
  en: [
    { title: "Hearing aid batteries", text: "Sizes 10, 13, 312 and 675", mark: "10 · 13 · 312 · 675", tone: "bg-amber-50" },
    { title: "Cleaning & care", text: "Sprays, wipes, brushes and cleaning tools", mark: "CARE", tone: "bg-cyan-50" },
    { title: "Drying & moisture care", text: "Capsules, cups and drying kits", mark: "DRY", tone: "bg-teal-50" },
    { title: "Consumable parts", text: "Wax guards, domes, tubing and accessories", mark: "PARTS", tone: "bg-slate-100" },
  ],
}

export default async function StorefrontHome({ countryCode }: { countryCode: string }) {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const fa = locale === "fa"
  const region = await getRegion(countryCode)
  const products = region ? (await listProducts({ countryCode, queryParams: { limit: 8 } })).response.products : []

  return (
    <main dir={fa ? "rtl" : "ltr"} className="bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-[#f4f8f8]">
        <div className="content-container grid min-h-[500px] items-center gap-10 py-12 small:grid-cols-[1.05fr_.95fr] small:py-16">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              {fa ? "فروشگاه تخصصی لوازم مصرفی سمعک" : "Hearing aid care & consumables"}
            </div>
            <h1 className="text-4xl font-bold leading-[1.35] tracking-tight small:text-5xl large:text-[58px]">
              {fa ? "لوازم مورد نیاز سمعک، بدون سردرگمی" : "Hearing aid essentials, made easier to find"}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 small:text-lg">
              {fa ? "باتری، محصولات نظافت و نگهداری، رطوبت‌گیر و قطعات مصرفی را در یک کاتالوگ مشخص و ساده پیدا کنید." : "Find batteries, cleaning products, moisture care and replacement consumables in one focused catalog."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LocalizedClientLink href="/store" className="rounded-lg bg-teal-700 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-teal-800">{fa ? "خرید محصولات" : "Shop products"}</LocalizedClientLink>
              <LocalizedClientLink href="/account" className="rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:border-teal-500">{fa ? "خرید حرفه‌ای" : "Professional purchasing"}</LocalizedClientLink>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="relative grid grid-cols-2 gap-3 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
              {departments[locale].map((item, index) => (
                <LocalizedClientLink key={item.title} href="/store" className={`${item.tone} group flex min-h-44 flex-col justify-between rounded-2xl p-5 transition hover:-translate-y-1`}>
                  <span className="text-[11px] font-bold tracking-[.12em] text-slate-500">0{index + 1}</span>
                  <div><div className="mb-4 text-xl font-black tracking-tight text-slate-300 small:text-2xl">{item.mark}</div><h2 className="font-bold text-slate-900">{item.title}</h2><p className="mt-1 text-xs leading-5 text-slate-600">{item.text}</p></div>
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200">
        <div className="content-container grid small:grid-cols-3">
          {[
            fa ? ["کاتالوگ تخصصی", "فقط اقلام مرتبط با نگهداری و مصرف سمعک"] : ["Focused catalog", "Only hearing aid care and consumable essentials"],
            fa ? ["قیمت به تومان", "نمایش قیمت متناسب با فروشگاه ایران"] : ["Local pricing", "Pricing displayed for the selected region"],
            fa ? ["خرید حرفه‌ای", "مسیر جداگانه برای متخصصان و مراکز"] : ["Professional access", "A separate path for hearing-care professionals"],
          ].map(([title, text]) => <div key={title} className="border-b border-slate-200 px-6 py-6 small:border-b-0 small:border-e"><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>)}
        </div>
      </section>

      <section className="content-container py-12 small:py-16">
        <div className="mb-7 flex items-end justify-between gap-5"><div><p className="text-xs font-bold text-teal-700">{fa ? "دسته‌بندی‌ها" : "DEPARTMENTS"}</p><h2 className="mt-2 text-2xl font-bold small:text-3xl">{fa ? "از کجا شروع می‌کنید؟" : "What are you looking for?"}</h2></div><LocalizedClientLink href="/store" className="text-sm font-bold text-teal-700 hover:underline">{fa ? "همه محصولات ←" : "All products →"}</LocalizedClientLink></div>
        <div className="grid gap-4 xsmall:grid-cols-2 small:grid-cols-4">
          {departments[locale].map((item, index) => <LocalizedClientLink key={item.title} href="/store" className="group overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-md"><div className={`${item.tone} flex aspect-[1.55] items-center justify-center p-5`}><span className="text-2xl font-black tracking-tight text-slate-300 small:text-3xl">{item.mark}</span></div><div className="p-4"><div className="mb-2 flex items-center justify-between gap-2"><h3 className="text-sm font-bold">{item.title}</h3><span className="text-xs text-slate-400">0{index + 1}</span></div><p className="text-xs leading-5 text-slate-500">{item.text}</p></div></LocalizedClientLink>)}
        </div>
      </section>

      {products.length > 0 && region && <section className="border-y border-slate-200 bg-slate-50/70"><div className="content-container py-12 small:py-16"><div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-bold text-teal-700">{fa ? "فروشگاه" : "SHOP"}</p><h2 className="mt-2 text-2xl font-bold small:text-3xl">{fa ? "محصولات پیشنهادی" : "Featured products"}</h2></div><LocalizedClientLink href="/store" className="text-sm font-bold text-teal-700 hover:underline">{fa ? "مشاهده همه" : "View all"}</LocalizedClientLink></div><ul className="grid grid-cols-2 gap-3 small:grid-cols-4 small:gap-5">{products.slice(0,4).map((product) => <li key={product.id}><ProductPreview product={product} region={region} isFeatured /></li>)}</ul></div></section>}

      <section className="content-container py-12 small:py-16"><div className="grid overflow-hidden rounded-2xl bg-slate-950 text-white small:grid-cols-[1.25fr_.75fr]"><div className="p-7 small:p-10 large:p-12"><span className="text-xs font-bold text-teal-300">{fa ? "ویژه متخصصان" : "FOR PROFESSIONALS"}</span><h2 className="mt-3 max-w-xl text-2xl font-bold leading-10 small:text-3xl">{fa ? "برای کلینیک یا مرکز شنوایی خرید می‌کنید؟" : "Purchasing for a clinic or hearing-care center?"}</h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">{fa ? "درخواست حساب حرفه‌ای را ثبت کنید تا مسیر سفارش‌های حرفه‌ای از خرید عادی جدا باشد." : "Apply for professional access so specialist purchasing can stay separate from regular retail orders."}</p><LocalizedClientLink href="/account" className="mt-7 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-teal-50">{fa ? "ورود به بخش حرفه‌ای" : "Professional access"}</LocalizedClientLink></div><div className="hidden border-s border-slate-800 p-10 small:flex small:flex-col small:justify-between"><span className="text-6xl font-black text-slate-800">PRO</span><p className="text-sm leading-7 text-slate-400">{fa ? "سفارش‌های تخصصی · حساب حرفه‌ای · مدیریت سفارش" : "Specialist orders · Professional account · Order management"}</p></div></div></section>

      {products.length > 4 && region && <section className="border-t border-slate-200"><div className="content-container py-12 small:py-16"><div className="mb-7 flex items-center justify-between"><h2 className="text-2xl font-bold">{fa ? "محصولات بیشتر" : "More products"}</h2><LocalizedClientLink href="/store" className="text-sm font-bold text-teal-700 hover:underline">{fa ? "فروشگاه" : "Store"}</LocalizedClientLink></div><ul className="grid grid-cols-2 gap-3 small:grid-cols-4 small:gap-5">{products.slice(4,8).map((product) => <li key={product.id}><ProductPreview product={product} region={region} /></li>)}</ul></div></section>}
    </main>
  )
}
