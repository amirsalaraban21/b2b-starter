import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { getLocale } from "@/lib/i18n"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ProductPreview from "@/modules/products/components/product-preview"
import { cookies } from "next/headers"
import Image from "next/image"

const categoryLabels = {
  fa: [
    "باتری سمعک",
    "تمیزکاری و نگهداری",
    "خشک‌کن و رطوبت‌گیر",
    "قطعات مصرفی سمعک",
    "مراقبت و لوازم جانبی",
  ],
  en: [
    "Hearing aid batteries",
    "Cleaning & care",
    "Drying & moisture control",
    "Hearing aid consumables",
    "Care & accessories",
  ],
}

const copy = {
  fa: {
    heroKicker: "فروشگاه تخصصی لوازم و اقلام مصرفی سمعک",
    heroTitle: "باتری، مراقبت و قطعات مصرفی سمعک؛ ساده و مشخص",
    heroBody:
      "محصولات روزمره مورد نیاز کاربران و متخصصان؛ از باتری‌های سایز ۱۰، ۱۳، ۳۱۲ و ۶۷۵ تا لوازم تمیزکاری، رطوبت‌گیر و قطعات مصرفی.",
    shopNow: "مشاهده محصولات",
    professional: "خرید حرفه‌ای",
    browse: "دسته‌بندی محصولات",
    browseLead: "محصول مورد نیازتان را سریع‌تر پیدا کنید.",
    selected: "محصولات منتخب",
    allProducts: "همه محصولات",
    examTitle: "باتری‌های سمعک",
    examBody:
      "چهار سایز رایج باتری سمعک در یک بخش مشخص قرار گرفته‌اند تا انتخاب و مقایسه ساده‌تر باشد. برند، تعداد در بسته و قیمت نهایی بعد از ورود اطلاعات واقعی تأمین‌کننده تکمیل می‌شود.",
    examCta: "مشاهده باتری‌ها",
    professionalEyebrow: "برای متخصصان و مراکز شنوایی",
    professionalTitle: "مسیر خرید حرفه‌ای برای سفارش‌های تخصصی",
    professionalBody:
      "حساب حرفه‌ای برای سفارش‌های کلینیکی، خریدهای تعداد بالاتر و مدیریت بهتر سفارش‌ها در نظر گرفته شده است.",
    professionalCta: "ثبت درخواست حرفه‌ای",
    quoteCta: "ورود به حساب حرفه‌ای",
    catalogTitle: "کاتالوگ EarMed",
    catalogBody:
      "تمرکز فروشگاه روی اقلام واقعی و پرمصرف مرتبط با سمعک است؛ بدون فروش خود سمعک و بدون محصولات نامرتبط با هویت اصلی فروشگاه.",
    catalogCta: "ورود به فروشگاه",
  },
  en: {
    heroKicker: "Hearing aid care & consumables store",
    heroTitle: "Batteries, care products and hearing aid consumables",
    heroBody:
      "Everyday essentials for users and professionals, from size 10, 13, 312 and 675 batteries to cleaning, drying and replacement consumables.",
    shopNow: "Shop products",
    professional: "Professional purchasing",
    browse: "Browse departments",
    browseLead: "Find the product category you need faster.",
    selected: "Selected products",
    allProducts: "View all products",
    examTitle: "Hearing aid batteries",
    examBody:
      "The four common hearing aid battery sizes are grouped in one clear department. Brand, pack size and final pricing will be completed when real supplier data is available.",
    examCta: "Browse batteries",
    professionalEyebrow: "For hearing-care professionals",
    professionalTitle: "A professional purchasing path for specialist orders",
    professionalBody:
      "Professional accounts are intended for clinic purchasing, larger quantities and easier order management.",
    professionalCta: "Apply for professional access",
    quoteCta: "Professional account",
    catalogTitle: "The EarMed catalog",
    catalogBody:
      "The store now focuses on practical hearing aid essentials and consumables, without selling hearing aids themselves or unrelated clinical equipment.",
    catalogCta: "Enter the store",
  },
}

export default async function StorefrontHome({
  countryCode,
}: {
  countryCode: string
}) {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const c = copy[locale]
  const region = await getRegion(countryCode)
  const products = region
    ? (await listProducts({ countryCode, queryParams: { limit: 8 } })).response
        .products
    : []

  return (
    <div className="bg-ui-bg-base text-ui-fg-base">
      <section className="border-b border-ui-border-base bg-slate-950 text-white">
        <div className="content-container grid min-h-[520px] small:grid-cols-[.9fr_1.1fr]">
          <div className="relative min-h-[300px] overflow-hidden small:min-h-[520px]">
            <Image
              src="/hero-image.jpg"
              alt={locale === "fa" ? "لوازم و اقلام مصرفی سمعک" : "Hearing aid care products"}
              fill
              priority
              sizes="(max-width: 767px) 100vw, 48vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
          </div>

          <div className="flex items-center px-6 py-12 small:px-12 large:px-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
                {c.heroKicker}
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.2] small:text-5xl large:text-6xl">
                {c.heroTitle}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 small:text-lg">
                {c.heroBody}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LocalizedClientLink
                  href="/store"
                  className="bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {c.shopNow}
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/account"
                  className="border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:border-teal-300 hover:text-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {c.professional}
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ui-border-base">
        <div className="content-container py-10 small:py-12">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                {c.browse}
              </p>
              <p className="mt-1 text-sm text-ui-fg-subtle">{c.browseLead}</p>
            </div>
            <LocalizedClientLink
              href="/store"
              className="hidden text-sm font-semibold text-ui-fg-base hover:text-teal-700 small:inline"
            >
              {c.allProducts} ←
            </LocalizedClientLink>
          </div>

          <div className="grid border-y border-ui-border-base xsmall:grid-cols-2 small:grid-cols-5">
            {categoryLabels[locale].map((label, index) => (
              <LocalizedClientLink
                key={label}
                href="/store"
                className="group flex min-h-28 items-end border-b border-ui-border-base p-4 transition hover:bg-ui-bg-subtle xsmall:[&:nth-child(odd)]:border-e small:min-h-32 small:border-b-0 small:border-e small:last:border-e-0"
              >
                <div>
                  <span className="mb-4 block text-xs font-medium text-teal-700 dark:text-teal-300">
                    0{index + 1}
                  </span>
                  <span className="text-sm font-semibold leading-6 group-hover:text-teal-700">
                    {label}
                  </span>
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </section>

      {products.length > 0 && region ? (
        <section className="content-container py-12 small:py-16">
          <div className="mb-7 flex items-center justify-between gap-6">
            <h2 className="text-2xl font-semibold small:text-3xl">{c.selected}</h2>
            <LocalizedClientLink
              href="/store"
              className="text-sm font-semibold text-teal-700 hover:underline dark:text-teal-300"
            >
              {c.allProducts}
            </LocalizedClientLink>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 small:grid-cols-4 small:gap-x-6">
            {products.slice(0, 4).map((product) => (
              <li key={product.id}>
                <ProductPreview product={product} region={region} isFeatured />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="border-y border-ui-border-base bg-ui-bg-subtle">
        <div className="content-container grid small:grid-cols-[1.15fr_.85fr]">
          <div className="relative min-h-[340px] overflow-hidden small:min-h-[460px]">
            <Image
              src="/hero-image.jpg"
              alt={locale === "fa" ? "باتری و لوازم سمعک" : "Hearing aid batteries and care products"}
              fill
              sizes="(max-width: 767px) 100vw, 58vw"
              className="object-cover object-left"
            />
          </div>
          <div className="flex items-center px-6 py-10 small:px-10 large:px-14">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                {locale === "fa" ? "۰۱ / باتری سمعک" : "01 / HEARING AID BATTERIES"}
              </span>
              <h2 className="mt-4 text-3xl font-semibold leading-tight small:text-4xl">
                {c.examTitle}
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-ui-fg-subtle">
                {c.examBody}
              </p>
              <LocalizedClientLink
                href="/store"
                className="mt-7 inline-flex border-b border-ui-fg-base pb-1 text-sm font-semibold transition hover:border-teal-700 hover:text-teal-700"
              >
                {c.examCta}
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </section>

      <section className="content-container py-12 small:py-16">
        <div className="grid overflow-hidden bg-teal-900 text-white small:grid-cols-[1fr_.72fr]">
          <div className="px-7 py-10 small:px-12 small:py-14">
            <p className="text-sm font-medium text-teal-200">{c.professionalEyebrow}</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight small:text-4xl">
              {c.professionalTitle}
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-teal-50/80">
              {c.professionalBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LocalizedClientLink
                href="/account"
                className="bg-white px-5 py-3 text-sm font-semibold text-teal-950 transition hover:bg-teal-50"
              >
                {c.professionalCta}
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/account"
                className="border border-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-teal-300"
              >
                {c.quoteCta}
              </LocalizedClientLink>
            </div>
          </div>
          <div className="hidden border-s border-teal-800 p-10 small:flex small:flex-col small:justify-between">
            <span className="text-6xl font-light text-teal-400">02</span>
            <div className="space-y-3 text-sm text-teal-100/80">
              <p>{locale === "fa" ? "سفارش حرفه‌ای" : "Professional orders"}</p>
              <p>{locale === "fa" ? "خرید تعداد بالاتر" : "Larger quantity purchasing"}</p>
              <p>{locale === "fa" ? "حساب کلینیک و مرکز شنوایی" : "Clinic & hearing-care accounts"}</p>
            </div>
          </div>
        </div>
      </section>

      {products.length > 4 && region ? (
        <section className="border-y border-ui-border-base">
          <div className="content-container py-12 small:py-16">
            <div className="mb-7 flex items-center justify-between gap-6">
              <h2 className="text-2xl font-semibold small:text-3xl">
                {locale === "fa" ? "بیشتر از کاتالوگ" : "More from the catalog"}
              </h2>
              <LocalizedClientLink
                href="/store"
                className="text-sm font-semibold text-teal-700 hover:underline dark:text-teal-300"
              >
                {c.allProducts}
              </LocalizedClientLink>
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 small:grid-cols-4 small:gap-x-6">
              {products.slice(4, 8).map((product) => (
                <li key={product.id}>
                  <ProductPreview product={product} region={region} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="bg-slate-950 text-white">
        <div className="content-container grid gap-8 py-12 small:grid-cols-[1fr_auto] small:items-end small:py-16">
          <div>
            <p className="text-sm font-medium text-teal-300">EarMed Store</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold small:text-4xl">
              {c.catalogTitle}
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-400">{c.catalogBody}</p>
          </div>
          <LocalizedClientLink
            href="/store"
            className="inline-flex w-fit bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-teal-50"
          >
            {c.catalogCta}
          </LocalizedClientLink>
        </div>
      </section>
    </div>
  )
}
