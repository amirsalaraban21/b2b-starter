"use client"

import Image from "next/image"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { useEffect, useState } from "react"

const slides = {
  fa: [
    ["تجهیزات تخصصی گوش و ادیولوژی", "برای کلینیک‌ها، متخصصان و مصرف‌کنندگان حرفه‌ای.", "مشاهده محصولات", "/store"],
    ["انتخاب دقیق برای معاینه", "ابزارهای معاینه و لوازم مصرفی برای فضای درمانی.", "دسته‌بندی‌ها", "/store"],
    ["خرید حرفه‌ای برای کلینیک‌ها", "برای سفارش سازمانی و درخواست پیش‌فاکتور، مسیر حرفه‌ای را آغاز کنید.", "خرید حرفه‌ای", "/professional"],
  ],
  en: [
    ["Specialist ear and audiology equipment", "For clinics, specialists and professional buyers.", "Explore products", "/store"],
    ["Precise examination choices", "Examination tools and consumables for clinical settings.", "Browse categories", "/store"],
    ["Professional purchasing for clinics", "Start a professional path for organization orders and quote requests.", "Professional purchase", "/professional"],
  ],
} as const

export default function HeroSlider() {
  const [active, setActive] = useState(0)
  const [locale, setLocale] = useState<"fa" | "en">("fa")
  useEffect(() => setLocale(document.documentElement.lang === "en" ? "en" : "fa"), [])
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(() => setActive((value) => (value + 1) % slides[locale].length), 6500)
    return () => window.clearInterval(id)
  }, [locale])
  const slide = slides[locale][active]
  return <section aria-roledescription="carousel" aria-label={locale === "fa" ? "معرفی فروشگاه" : "Store introduction"} className="overflow-hidden border-b border-teal-100 bg-gradient-to-br from-teal-950 via-teal-800 to-slate-900 text-white dark:border-slate-700">
    <div className="content-container grid min-h-[500px] items-center gap-8 py-10 small:grid-cols-2 small:py-16">
      <div className="relative z-10 max-w-2xl"><p className="mb-4 text-sm font-semibold text-teal-200">EarMed</p><h1 className="text-4xl font-semibold leading-tight small:text-6xl">{slide[0]}</h1><p className="mt-5 max-w-xl text-lg leading-8 text-teal-50">{slide[1]}</p><LocalizedClientLink href={slide[3]} className="mt-8 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-teal-900 transition hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">{slide[2]}</LocalizedClientLink><div className="mt-10 flex gap-2">{slides[locale].map((_, index) => <button key={index} type="button" aria-label={`${locale === "fa" ? "اسلاید" : "Slide"} ${index + 1}`} aria-current={active === index} onClick={() => setActive(index)} className={`h-2.5 rounded-full transition ${active === index ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"}`} />)}</div></div>
      <div className="relative mx-auto h-[320px] w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/20 bg-teal-900/30 shadow-2xl small:h-[420px]"><Image src="/products/earmed/hero-clinic-equipment.png" alt={locale === "fa" ? "تجهیزات عمومی معاینه و ادیولوژی" : "Generic ear examination and audiology equipment"} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-700" /></div>
      <div className="sr-only" aria-live="polite">{slide[0]}</div>
    </div>
  </section>
}
