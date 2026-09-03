"use client"

import { getLocalizedCategoryName } from "@/lib/category-localization"
import { Locale } from "@/lib/i18n"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { SortOptions } from "./refinement-list/sort-products"

type CatalogControlsProps = {
  categories: HttpTypes.StoreProductCategory[]
  locale: Locale
  sortBy: SortOptions
  category?: string
  batterySize?: string
  availability?: string
  query?: string
}

const batteryColors: Record<string, string> = {
  "10": "bg-yellow-400",
  "13": "bg-orange-500",
  "312": "bg-amber-800",
  "675": "bg-blue-600",
}

export default function CatalogControls(props: CatalogControlsProps) {
  const { categories, locale, sortBy, category, batterySize, availability, query } = props
  const fa = locale === "fa"
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(query || "")
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setSearchValue(query || ""), [query])
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()
    document.addEventListener("keydown", close)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", close)
    }
  }, [open])

  const update = (name: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(name, value)
    else params.delete(name)
    params.delete("page")
    router.push(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false })
  }

  const clearAll = () => {
    const params = new URLSearchParams()
    if (sortBy !== "created_at") params.set("sortBy", sortBy)
    router.push(`${pathname}${params.size ? `?${params}` : ""}`)
  }

  const activeCount = [category, batterySize, availability].filter(Boolean).length
  const activeCategory = categories.find((item) => item.handle === category)
  const filters = (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2.5 text-xs font-black tracking-[0.08em] text-slate-600 dark:text-slate-300">{fa ? "دسته‌بندی" : "CATEGORY"}</legend>
        <div className="space-y-1">
          {categories.map((item) => (
            <button key={item.id} type="button" aria-pressed={category === item.handle} onClick={() => update("category", category === item.handle ? undefined : item.handle)} className={`flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-start text-sm transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 motion-reduce:transition-none ${category === item.handle ? "bg-teal-50 font-bold text-teal-900 dark:bg-teal-950/60 dark:text-teal-100" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${category === item.handle ? "border-teal-700 bg-teal-700" : "border-slate-300 dark:border-slate-600"}`}>{category === item.handle && <span className="h-1.5 w-1.5 rounded-full bg-white" />}</span>
              <span className="leading-5">{getLocalizedCategoryName(item, locale)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-t border-slate-200 pt-4 dark:border-slate-700">
        <legend className="mb-2.5 text-xs font-black tracking-[0.08em] text-slate-600 dark:text-slate-300">{fa ? "سایز باتری" : "BATTERY SIZE"}</legend>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(batteryColors).map(([size, color]) => (
            <button key={size} type="button" aria-pressed={batterySize === size} onClick={() => update("batterySize", batterySize === size ? undefined : size)} className={`flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 motion-reduce:transition-none ${batterySize === size ? "border-teal-700 bg-teal-50 text-teal-900 shadow-sm dark:border-teal-500 dark:bg-teal-950/50 dark:text-teal-100" : "border-slate-200 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500"}`}>
              <span className={`h-3 w-3 rounded-full border border-black/10 ${color}`} />
              {fa ? Number(size).toLocaleString("fa-IR", { useGrouping: false }) : size}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-t border-slate-200 pt-4 dark:border-slate-700">
        <legend className="mb-2.5 text-xs font-black tracking-[0.08em] text-slate-600 dark:text-slate-300">{fa ? "وضعیت موجودی" : "AVAILABILITY"}</legend>
        <div className="space-y-1">
          {[["in-stock", fa ? "موجود" : "In stock"], ["out-of-stock", fa ? "ناموجود" : "Unavailable"]].map(([value, label]) => (
            <button key={value} type="button" aria-pressed={availability === value} onClick={() => update("availability", availability === value ? undefined : value)} className={`flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-start text-sm transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 motion-reduce:transition-none ${availability === value ? "bg-teal-50 font-bold text-teal-900 dark:bg-teal-950/60 dark:text-teal-100" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${availability === value ? "border-teal-700 bg-teal-700" : "border-slate-300 dark:border-slate-600"}`}>{availability === value && <span className="h-1.5 w-1.5 rounded-full bg-white" />}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  )

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 small:col-span-2 small:flex-row small:items-center">
        <form className="relative flex-1" onSubmit={(event) => { event.preventDefault(); update("q", searchValue.trim() || undefined) }} role="search">
          <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder={fa ? "جست‌وجو در محصولات" : "Search products"} aria-label={fa ? "جست‌وجو در محصولات" : "Search products"} className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pe-10 text-sm outline-none transition duration-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500" />
          <button type="submit" className="absolute inset-y-0 end-0 min-w-11 px-3 text-teal-700 transition hover:text-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-teal-700 dark:text-teal-400" aria-label={fa ? "جست‌وجو" : "Search"}>⌕</button>
        </form>
        <div className="flex gap-2">
          <button type="button" onClick={() => setOpen(true)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-bold transition duration-200 hover:border-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 small:hidden dark:border-slate-700 dark:hover:border-teal-500">
            {fa ? "فیلترها" : "Filters"}{activeCount > 0 && <span className="rounded-full bg-teal-700 px-2 py-0.5 text-xs text-white">{fa ? activeCount.toLocaleString("fa-IR") : activeCount}</span>}
          </button>
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm transition focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/15 dark:border-slate-700 small:flex-none">
            <span className="whitespace-nowrap text-slate-500 dark:text-slate-400">{fa ? "مرتب‌سازی" : "Sort"}</span>
            <select value={sortBy} onChange={(event) => update("sortBy", event.target.value)} aria-label={fa ? "مرتب‌سازی محصولات" : "Sort products"} className="min-w-0 flex-1 bg-transparent font-semibold outline-none dark:bg-slate-900 dark:text-slate-100">
              <option value="created_at">{fa ? "جدیدترین" : "Newest"}</option>
              <option value="price_asc">{fa ? "قیمت: کم به زیاد" : "Price: low to high"}</option>
              <option value="price_desc">{fa ? "قیمت: زیاد به کم" : "Price: high to low"}</option>
            </select>
          </label>
        </div>
      </div>

      {(activeCount > 0 || query) && (
        <div className="mb-5 flex flex-wrap items-center gap-2 small:col-span-2" aria-label={fa ? "فیلترهای فعال" : "Active filters"}>
          {query && <button onClick={() => update("q")} className="min-h-9 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs transition hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">{fa ? `جست‌وجو: «${query}»` : `Search: “${query}”`} ×</button>}
          {activeCategory && <button onClick={() => update("category")} className="min-h-9 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-900 transition hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 dark:border-teal-900 dark:bg-teal-950/60 dark:text-teal-100 dark:hover:bg-teal-900/60">{getLocalizedCategoryName(activeCategory, locale)} ×</button>}
          {batterySize && <button onClick={() => update("batterySize")} className="min-h-9 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-900 transition hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 dark:border-teal-900 dark:bg-teal-950/60 dark:text-teal-100 dark:hover:bg-teal-900/60">{fa ? "سایز" : "Size"} {fa ? Number(batterySize).toLocaleString("fa-IR", { useGrouping: false }) : batterySize} ×</button>}
          {availability && <button onClick={() => update("availability")} className="min-h-9 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-900 transition hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 dark:border-teal-900 dark:bg-teal-950/60 dark:text-teal-100 dark:hover:bg-teal-900/60">{availability === "in-stock" ? (fa ? "موجود" : "In stock") : (fa ? "ناموجود" : "Unavailable")} ×</button>}
          {activeCount > 0 && <button onClick={clearAll} className="min-h-9 px-2 py-1.5 text-xs font-bold text-slate-500 underline-offset-4 hover:text-teal-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 dark:text-slate-400 dark:hover:text-teal-300">{fa ? "پاک کردن همه" : "Clear all"}</button>}
        </div>
      )}

      <aside className="hidden self-start rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 small:sticky small:top-28 small:block">{filters}</aside>

      {open && (
        <div className="fixed inset-0 z-[80] small:hidden" role="dialog" aria-modal="true" aria-label={fa ? "فیلتر محصولات" : "Product filters"}>
          <button aria-label={fa ? "بستن فیلترها" : "Close filters"} className="absolute inset-0 bg-slate-950/45" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col overflow-hidden rounded-t-2xl bg-white text-slate-950 shadow-2xl dark:bg-slate-900 dark:text-slate-50">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700"><h2 className="font-bold">{fa ? "فیلترها" : "Filters"}</h2><button ref={closeButtonRef} onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg transition hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 dark:bg-slate-800 dark:hover:bg-slate-700" aria-label={fa ? "بستن" : "Close"}>×</button></div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">{filters}</div>
            <div className="shrink-0 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-slate-700 dark:bg-slate-900"><button onClick={() => setOpen(false)} className="h-12 w-full rounded-lg bg-teal-700 font-bold text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{fa ? "بستن و مشاهده محصولات" : "Close and view products"}</button></div>
          </div>
        </div>
      )}
    </>
  )
}
