"use client"

import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { useEffect, useRef, useState } from "react"
import type { HomeCMSContent } from "@/lib/data/storefront-content"

const slides = {
  fa: [
    ["تجهیزات تخصصی مراقبت از شنوایی", "باتری‌های مورد نیاز برای مراقبت روزمره", "سایزهای رایج باتری را در کاتالوگ محصولات بررسی کنید.", "/products/earmed/batteries-sheet.png", "مشاهده باتری‌ها"],
    ["نظافت و نگهداری", "مراقبت روزانه با ابزارهای مناسب", "اسپری، دستمال، برس و ابزارهای تمیزکاری را یک‌جا ببینید.", "/products/earmed/cleaning-sheet.png", "مشاهده محصولات مراقبتی"],
    ["خشک‌کن و رطوبت‌گیر", "کنترل رطوبت برای نگهداری بهتر", "کپسول، ظرف خشک‌کن و کیت‌های نگهداری را بررسی کنید.", "/products/earmed/drying-sheet.png", "مشاهده محصولات خشک‌کن"],
  ],
  en: [
    ["Specialist hearing care supplies", "Everyday hearing-aid batteries", "Browse common battery sizes in the product catalog.", "/products/earmed/batteries-sheet.png", "Browse batteries"],
    ["Cleaning and care", "The right tools for daily care", "Explore sprays, wipes, brushes and cleaning tools.", "/products/earmed/cleaning-sheet.png", "Browse care products"],
    ["Drying and moisture care", "Products for moisture control", "Explore drying capsules, containers and maintenance kits.", "/products/earmed/drying-sheet.png", "Browse drying products"],
  ],
} as const

export default function CommerceHero({ locale, content }: { locale: "fa" | "en"; content?: HomeCMSContent | null }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef<number | null>(null)
  const slideCount = content?.hero_slides.length || slides[locale].length
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => setActive(value => (value + 1) % slideCount), 8000)
    return () => window.clearInterval(timer)
  }, [paused, slideCount])
  const move = (delta: number) => setActive(value => (value + delta + slideCount) % slideCount)
  const staticSlide = slides[locale][active % slides[locale].length]
  const cmsSlide = content?.hero_slides[active]
  const slide = cmsSlide
    ? [cmsSlide.eyebrow, cmsSlide.title, cmsSlide.description, staticSlide[3], cmsSlide.cta_label] as const
    : staticSlide
  return <section aria-roledescription="carousel" aria-label={locale === "fa" ? "پیشنهادهای فروشگاه" : "Store highlights"} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} onTouchStart={event => { touchStart.current = event.touches[0].clientX }} onTouchEnd={event => { if (touchStart.current === null) return; const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1); touchStart.current = null }} className="border-b border-slate-200 bg-[#f3f6f5] dark:border-slate-800 dark:bg-slate-900">
    <div className="content-container grid items-center gap-7 py-8 xsmall:gap-8 xsmall:py-10 small:min-h-[470px] small:grid-cols-[45%_55%]"><div className="min-w-0"><p className="text-xs font-bold text-teal-700">{slide[0]}</p><h1 className="mt-4 text-3xl font-black leading-[1.35] xsmall:text-4xl small:text-5xl">{slide[1]}</h1><p className="mt-4 max-w-xl leading-8 text-slate-600 dark:text-slate-300 xsmall:mt-5">{slide[2]}</p><div className="mt-6 flex flex-col items-stretch gap-3 xsmall:mt-7 xsmall:flex-row xsmall:flex-wrap xsmall:items-center"><LocalizedClientLink href="/store" className="bg-teal-700 px-5 py-3 text-center text-sm font-bold text-white hover:bg-teal-800 xsmall:px-6">{slide[4]}</LocalizedClientLink><LocalizedClientLink href="/professional" className="border border-slate-300 bg-white px-5 py-3 text-center text-sm font-bold text-slate-900 hover:border-teal-600 xsmall:px-6">{locale === "fa" ? "خرید حرفه‌ای" : "Professional purchase"}</LocalizedClientLink></div><div className="mt-7 flex items-center gap-2 xsmall:mt-8"><button onClick={() => move(-1)} aria-label={locale === "fa" ? "اسلاید قبلی" : "Previous slide"} className="h-9 w-9 shrink-0 border border-slate-300 bg-white text-slate-900">‹</button><button onClick={() => move(1)} aria-label={locale === "fa" ? "اسلاید بعدی" : "Next slide"} className="h-9 w-9 shrink-0 border border-slate-300 bg-white text-slate-900">›</button>{Array.from({ length: slideCount }).map((_, index) => <button key={index} onClick={() => setActive(index)} aria-label={`${locale === "fa" ? "اسلاید" : "Slide"} ${index + 1}`} aria-current={active === index} className={`h-2 shrink-0 transition-all motion-reduce:transition-none ${active === index ? "w-7 bg-teal-700" : "w-2 bg-slate-300"}`} />)}</div></div><div className="relative h-[280px] min-w-0 overflow-hidden xsmall:h-[340px] small:h-[460px]"><img src={slide[3]} alt="" className="h-full w-full object-cover transition-opacity duration-300 motion-reduce:transition-none" /></div></div><span className="sr-only" aria-live="polite">{slide[1]}</span>
  </section>
}
