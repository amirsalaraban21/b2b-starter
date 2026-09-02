import { listProductsWithSort } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { getLocale } from "@/lib/i18n"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ProductPreview from "@/modules/products/components/product-preview"
import { cookies } from "next/headers"
import { departmentReferenceImages } from "@/lib/product-demo-images"

const heroImage = "/products/earmed/care-assortment-v2.png"

export default async function StorefrontHome({ countryCode }: { countryCode: string }) {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const fa = locale === "fa"
  const region = await getRegion(countryCode)
  const products = region
    ? (await listProductsWithSort({ countryCode, sortBy: "created_at", page: 1, queryParams: { limit: 15 } })).response.products
    : []
  const categories = fa
    ? [["باتری سمعک", "سایزهای ۱۰، ۱۳، ۳۱۲ و ۶۷۵"], ["نظافت و نگهداری", "اسپری، دستمال، برس و ابزار تمیزکاری"], ["خشک‌کن و رطوبت‌گیر", "کپسول، ظرف و کیت مراقبت"], ["قطعات مصرفی", "فیلتر جرم، دام، تیوب و لوازم جانبی"]]
    : [["Hearing aid batteries", "Sizes 10, 13, 312 and 675"], ["Cleaning & care", "Sprays, wipes, brushes and tools"], ["Drying & moisture care", "Capsules, containers and care kits"], ["Consumable parts", "Wax guards, domes, tubing and accessories"]]

  return <main dir={fa ? "rtl" : "ltr"} className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
    <section className="border-b border-slate-200 bg-[#f3f6f5] dark:border-slate-800 dark:bg-slate-900">
      <div className="content-container grid min-h-[470px] items-center gap-8 py-10 small:grid-cols-[45%_55%]">
        <div><p className="text-xs font-bold text-teal-700">{fa ? "تجهیزات تخصصی مراقبت از شنوایی" : "SPECIALIST HEARING CARE SUPPLIES"}</p><h1 className="mt-4 text-4xl font-black leading-[1.35] small:text-5xl">{fa ? <>لوازم ضروری سمعک،<br />برای مراقبت روزمره</> : <>Everyday essentials<br />for hearing-aid care</>}</h1><p className="mt-5 max-w-xl leading-8 text-slate-600 dark:text-slate-300">{fa ? "باتری، محصولات نظافت، رطوبت‌گیر و قطعات مصرفی را در یک فروشگاه تخصصی پیدا کنید." : "Find batteries, cleaning products, moisture care and replacement consumables in one specialist store."}</p><div className="mt-7 flex flex-wrap gap-3"><LocalizedClientLink href="/store" className="bg-teal-700 px-6 py-3 text-sm font-bold text-white hover:bg-teal-800">{fa ? "مشاهده محصولات" : "Browse products"}</LocalizedClientLink><LocalizedClientLink href="/professional" className="border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:border-teal-600">{fa ? "خرید حرفه‌ای" : "Professional purchase"}</LocalizedClientLink></div></div>
        <div className="relative h-[360px] overflow-hidden small:h-[460px]"><img src={heroImage} alt={fa ? "باتری و لوازم مراقبت سمعک" : "Hearing aid batteries and care accessories"} className="h-full w-full scale-110 object-cover" /></div>
      </div>
    </section>

    <section className="border-b border-slate-200 dark:border-slate-800"><div className="content-container grid divide-y divide-slate-200 small:grid-cols-3 small:divide-x small:divide-y-0 rtl:small:divide-x-reverse">{(fa ? [["کاتالوگ تخصصی", "لوازم مصرفی و نگهداری سمعک"], ["قیمت‌گذاری به تومان", "نمایش قیمت مناسب بازار ایران"], ["خرید حرفه‌ای", "مسیر ثبت درخواست برای متخصصان"]] : [["Specialist catalog", "Care and consumable supplies"], ["Toman pricing", "Customer-friendly Iranian pricing"], ["Professional purchase", "Application path for specialists"]]).map(([title, text]) => <div key={title} className="px-6 py-5"><h2 className="text-sm font-bold">{title}</h2><p className="mt-1 text-xs text-slate-500">{text}</p></div>)}</div></section>

    <section className="content-container py-10 small:py-14"><div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-bold text-teal-700">{fa ? "دسته‌بندی‌ها" : "DEPARTMENTS"}</p><h2 className="mt-1 text-2xl font-black">{fa ? "سریع‌تر به محصول مورد نیاز برسید" : "Shop by department"}</h2></div><LocalizedClientLink href="/store" className="text-sm font-bold text-teal-700">{fa ? "همه محصولات" : "View all"}</LocalizedClientLink></div><div className="grid gap-4 xsmall:grid-cols-2 small:grid-cols-4">{categories.map(([title, text], index) => <LocalizedClientLink href="/store" key={title} className="group border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><div className="h-44 overflow-hidden bg-slate-50"><img src={departmentReferenceImages[index]} alt="" className="h-full w-full object-cover transition group-hover:scale-105" /></div><div className="p-4"><h3 className="font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div></LocalizedClientLink>)}</div></section>

    {region && products.length > 0 && <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"><div className="content-container py-10 small:py-14"><div className="mb-6 flex items-center justify-between"><h2 className="text-2xl font-black">{fa ? "محصولات منتخب" : "Selected products"}</h2><LocalizedClientLink href="/store" className="text-sm font-bold text-teal-700">{fa ? "مشاهده فروشگاه" : "Open store"}</LocalizedClientLink></div><ul className="grid grid-cols-2 gap-4 small:grid-cols-4 large:grid-cols-5">{products.slice(0, 5).map(product => <li key={product.id}><ProductPreview product={product} region={region} /></li>)}</ul></div></section>}

    <section className="content-container py-10 small:py-14"><div className="grid gap-8 border-y border-slate-200 py-10 small:grid-cols-[1fr_1.2fr] small:items-center"><div><p className="text-xs font-bold text-teal-700">{fa ? "راهنمای سریع باتری" : "BATTERY SIZE GUIDE"}</p><h2 className="mt-2 text-3xl font-black leading-tight">{fa ? "باتری مناسب سمعک خود را پیدا کنید" : "Find the right battery size"}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{fa ? "برای مشاهده محصولات هر سایز وارد فروشگاه شوید. سازگاری را مطابق راهنمای دستگاه خود بررسی کنید." : "Browse each size in the store and check compatibility against your device guidance."}</p></div><div className="grid grid-cols-2 gap-3 small:grid-cols-4">{[["10", "bg-yellow-400"], ["13", "bg-orange-500"], ["312", "bg-amber-800"], ["675", "bg-blue-600"]].map(([size, color]) => <LocalizedClientLink href="/store" key={size} className="border border-slate-200 bg-white p-4 text-center"><span className={`mx-auto block h-10 w-10 rounded-full ${color}`} /><strong className="mt-3 block text-xl">SIZE {size}</strong></LocalizedClientLink>)}</div></div></section>

    <section className="content-container pb-12"><div className="grid overflow-hidden bg-slate-950 text-white small:grid-cols-[1.25fr_.75fr]"><div className="p-8 small:p-12"><p className="text-xs font-bold text-teal-300">{fa ? "برای متخصصان و مراکز" : "FOR PROFESSIONALS"}</p><h2 className="mt-3 text-3xl font-black">{fa ? "خرید حرفه‌ای برای کلینیک‌ها و متخصصان" : "Professional purchasing for clinics"}</h2><p className="mt-4 max-w-xl leading-7 text-slate-300">{fa ? "درخواست همکاری حرفه‌ای خود را از مسیر موجود ثبت کنید و وضعیت آن را در حساب کاربری پیگیری کنید." : "Submit the existing professional application and follow its status from your account."}</p><LocalizedClientLink href="/professional" className="mt-7 inline-flex bg-white px-6 py-3 text-sm font-bold text-slate-950">{fa ? "ثبت درخواست حرفه‌ای" : "Start professional application"}</LocalizedClientLink></div><div className="min-h-64"><img src={departmentReferenceImages[2]} alt="" className="h-full w-full object-cover opacity-80" /></div></div></section>
  </main>
}
