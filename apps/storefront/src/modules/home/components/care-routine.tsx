"use client"

import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { useEffect, useRef, useState } from "react"

const steps = {
  fa: [
    ["۰۱", "تمیزکاری", "پاک‌کردن آلودگی‌های روزمره با محصولات مناسب تمیزکاری", "/products/earmed/cleaning-sheet.png"],
    ["۰۲", "کنترل رطوبت", "استفاده از محصولات خشک‌کن و رطوبت‌گیر برای نگهداری روزمره", "/products/earmed/drying-sheet.png"],
    ["۰۳", "بررسی قطعات مصرفی", "بررسی دوره‌ای فیلتر، دام، تیوب و سایر قطعات مصرفی", "/products/earmed/consumables-sheet.png"],
  ],
  en: [
    ["01", "Cleaning", "Remove everyday residue with suitable cleaning products", "/products/earmed/cleaning-sheet.png"],
    ["02", "Moisture control", "Use drying and moisture-control products for daily care", "/products/earmed/drying-sheet.png"],
    ["03", "Check consumables", "Periodically check filters, domes, tubing and other consumables", "/products/earmed/consumables-sheet.png"],
  ],
} as const

export default function CareRoutine({ locale }: { locale: "fa" | "en" }) {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const node = sectionRef.current
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return }
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(true), { threshold: .15 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  const fa = locale === "fa"
  return (
    <section ref={sectionRef} className="border-y border-slate-200 bg-[#f5f3ee] py-12 dark:border-slate-800 dark:bg-slate-900 small:py-16">
      <div className="content-container"><div className="max-w-2xl"><p className="text-xs font-bold text-teal-700">{fa ? "راهنمای مراقبت" : "CARE ROUTINE"}</p><h2 className="mt-2 text-3xl font-black">{fa ? "مراقبت روزمره از سمعک" : "Everyday hearing-aid care"}</h2><p className="mt-3 text-slate-600 dark:text-slate-300">{fa ? "چند کار ساده برای نگهداری بهتر از تجهیزات و لوازم مصرفی" : "A few simple steps for better care of equipment and consumables"}</p></div>
        <div className="mt-9 space-y-5">{steps[locale].map(([number, title, text, image], index) => <LocalizedClientLink href="/store" key={number} className={`group grid items-center gap-5 border-t border-slate-300 py-5 transition duration-300 motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none small:grid-cols-[90px_1fr_220px] ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`} style={{ transitionDelay: `${index * 90}ms` }}><span className="text-3xl font-black text-teal-700">{number}</span><div><h3 className="text-xl font-bold transition-colors group-hover:text-teal-700">{title}</h3><p className="mt-1 text-sm leading-7 text-slate-600 dark:text-slate-300">{text}</p></div><div className="h-28 overflow-hidden"><img src={image} alt="" className="h-full w-full object-cover transition-transform duration-300 motion-reduce:transform-none group-hover:scale-[1.04]" /></div></LocalizedClientLink>)}</div>
      </div>
    </section>
  )
}
