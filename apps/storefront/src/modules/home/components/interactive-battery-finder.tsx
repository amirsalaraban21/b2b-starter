"use client"

import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { useState } from "react"

const batteries = [
  { size: "10", faSize: "۱۰", color: "#facc15", position: "0% 0%" },
  { size: "13", faSize: "۱۳", color: "#f97316", position: "100% 0%" },
  { size: "312", faSize: "۳۱۲", color: "#92400e", position: "0% 100%" },
  { size: "675", faSize: "۶۷۵", color: "#2563eb", position: "100% 100%" },
] as const

export default function InteractiveBatteryFinder({ locale }: { locale: "fa" | "en" }) {
  const [active, setActive] = useState(0)
  const battery = batteries[active]
  const fa = locale === "fa"

  return (
    <section className="content-container py-10 small:py-14">
      <div className="grid overflow-hidden border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 small:grid-cols-[.9fr_1.1fr]">
        <div className="relative min-h-64 overflow-hidden p-5 xsmall:min-h-72 xsmall:p-7 small:min-h-[420px] small:p-10" style={{ backgroundColor: `${battery.color}14` }}>
          <div className="absolute end-6 top-5 text-[76px] font-black leading-none opacity-10 small:text-[120px]">{fa ? battery.faSize : battery.size}</div>
          <div className="relative mx-auto h-56 max-w-md overflow-hidden xsmall:h-64 small:h-80">
            <img src="/products/earmed/batteries-sheet.png" alt={`${fa ? "باتری سمعک سایز" : "Hearing aid battery size"} ${fa ? battery.faSize : battery.size}`} className="absolute h-[200%] w-[200%] max-w-none object-cover transition-all duration-300 motion-reduce:transition-none" style={{ objectPosition: battery.position, insetInlineStart: battery.position.startsWith("100") ? "-100%" : "0", top: battery.position.endsWith("100%") ? "-100%" : "0" }} />
          </div>
        </div>
        <div className="flex min-w-0 flex-col justify-center p-5 xsmall:p-7 small:p-10">
          <p className="text-xs font-bold text-teal-700">{fa ? "راهنمای سریع باتری" : "BATTERY SIZE GUIDE"}</p>
          <h2 className="mt-2 text-2xl font-black leading-tight xsmall:text-3xl">{fa ? "باتری مناسب سمعک خود را پیدا کنید" : "Find the right battery size"}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{fa ? "سازگاری باتری را مطابق راهنمای دستگاه خود بررسی کنید." : "Check battery compatibility against your device guidance."}</p>
          <div className="mt-7 grid grid-cols-4 gap-1.5 xsmall:gap-2" role="tablist" aria-label={fa ? "انتخاب سایز باتری" : "Select battery size"}>
            {batteries.map((item, index) => (
              <button key={item.size} type="button" role="tab" aria-selected={active === index} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} className={`min-w-0 border bg-white px-1 py-3 text-center transition duration-200 motion-reduce:transition-none xsmall:px-2 xsmall:py-4 ${active === index ? "border-slate-900 shadow-sm dark:border-white" : "border-slate-200 hover:-translate-y-0.5 dark:border-slate-700"}`}>
                <span className="mx-auto block h-4 w-4 rounded-full" style={{ backgroundColor: item.color }} />
                <strong className="mt-2 block text-lg">{fa ? item.faSize : item.size}</strong>
              </button>
            ))}
          </div>
          <LocalizedClientLink href="/store" className="mt-5 w-fit border-b-2 border-teal-700 pb-1 text-sm font-bold text-teal-700">{fa ? `مشاهده باتری سایز ${battery.faSize}` : `Browse size ${battery.size} batteries`}</LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
