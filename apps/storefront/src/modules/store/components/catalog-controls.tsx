"use client"

import { getLocalizedCategoryName } from "@/lib/category-localization"
import { Locale } from "@/lib/i18n"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
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

  useEffect(() => setSearchValue(query || ""), [query])
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", close)
    return () => document.removeEventListener("keydown", close)
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
    if (query) params.set("q", query)
    if (sortBy !== "created_at") params.set("sortBy", sortBy)
    router.push(`${pathname}${params.size ? `?${params}` : ""}`)
  }

  const activeCount = [category, batterySize, availability].filter(Boolean).length
  const activeCategory = categories.find((item) => item.handle === category)
  const filters = (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{fa ? "دسته‌بندی" : "Category"}</legend>
        <div className="space-y-2">
          {categories.map((item) => (
            <button key={item.id} type="button" aria-pressed={category === item.handle} onClick={() => update("category", category === item.handle ? undefined : item.handle)} className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-start text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800">
              <span className={`h-4 w-4 rounded-full border p-0.5 ${category === item.handle ? "border-teal-700 bg-teal-700 shadow-[inset_0_0_0_3px_white]" : "border-slate-300 dark:border-slate-600"}`} />
              <span>{getLocalizedCategoryName(item, locale)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-t border-slate-200 pt-5 dark:border-slate-700">
        <legend className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{fa ? "سایز باتری" : "Battery size"}</legend>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(batteryColors).map(([size, color]) => (
            <button key={size} type="button" aria-pressed={batterySize === size} onClick={() => update("batterySize", batterySize === size ? undefined : size)} className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition ${batterySize === size ? "border-teal-700 bg-teal-50 text-teal-900 dark:bg-teal-950/50 dark:text-teal-100" : "border-slate-200 hover:border-slate-400 dark:border-slate-700"}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
              {fa ? Number(size).toLocaleString("fa-IR", { useGrouping: false }) : size}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-t border-slate-200 pt-5 dark:border-slate-700">
        <legend className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{fa ? "وضعیت موجودی" : "Availability"}</legend>
        <div className="space-y-2">
          {[["in-stock", fa ? "موجود" : "In stock"], ["out-of-stock", fa ? "ناموجود" : "Unavailable"]].map(([value, label]) => (
            <button key={value} type="button" aria-pressed={availability === value} onClick={() => update("availability", availability === value ? undefined : value)} className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-start text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800">
              <span className={`h-4 w-4 rounded-full border p-0.5 ${availability === value ? "border-teal-700 bg-teal-700 shadow-[inset_0_0_0_3px_white]" : "border-slate-300 dark:border-slate-600"}`} />
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
          <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder={fa ? "جست‌وجو در محصولات" : "Search products"} aria-label={fa ? "جست‌وجو در محصولات" : "Search products"} className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pe-10 text-sm outline-none transition focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950" />
          <button type="submit" className="absolute inset-y-0 end-0 px-3 text-teal-700" aria-label={fa ? "جست‌وجو" : "Search"}>⌕</button>
        </form>
        <div className="flex gap-2">
          <button type="button" onClick={() => setOpen(true)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-bold transition hover:border-teal-600 small:hidden dark:border-slate-700">
            {fa ? "فیلترها" : "Filters"}{activeCount > 0 && <span className="rounded-full bg-teal-700 px-2 py-0.5 text-xs text-white">{fa ? activeCount.toLocaleString("fa-IR") : activeCount}</span>}
          </button>
          <label className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm dark:border-slate-700 small:flex-none">
            <span className="whitespace-nowrap text-slate-500">{fa ? "مرتب‌سازی" : "Sort"}</span>
            <select value={sortBy} onChange={(event) => update("sortBy", event.target.value)} className="min-w-0 flex-1 bg-transparent font-semibold outline-none">
              <option value="created_at">{fa ? "جدیدترین" : "Newest"}</option>
              <option value="price_asc">{fa ? "قیمت: کم به زیاد" : "Price: low to high"}</option>
              <option value="price_desc">{fa ? "قیمت: زیاد به کم" : "Price: high to low"}</option>
            </select>
          </label>
        </div>
      </div>

      {(activeCount > 0 || query) && (
        <div className="mb-5 flex flex-wrap items-center gap-2 small:col-span-2" aria-label={fa ? "فیلترهای فعال" : "Active filters"}>
          {query && <button onClick={() => update("q")} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs transition hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">{fa ? `جست‌وجو: «${query}»` : `Search: “${query}”`} ×</button>}
          {activeCategory && <button onClick={() => update("category")} className="rounded-full bg-teal-50 px-3 py-1.5 text-xs text-teal-900 transition hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-100">{getLocalizedCategoryName(activeCategory, locale)} ×</button>}
          {batterySize && <button onClick={() => update("batterySize")} className="rounded-full bg-teal-50 px-3 py-1.5 text-xs text-teal-900 transition hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-100">{fa ? "سایز" : "Size"} {fa ? Number(batterySize).toLocaleString("fa-IR", { useGrouping: false }) : batterySize} ×</button>}
          {availability && <button onClick={() => update("availability")} className="rounded-full bg-teal-50 px-3 py-1.5 text-xs text-teal-900 transition hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-100">{availability === "in-stock" ? (fa ? "موجود" : "In stock") : (fa ? "ناموجود" : "Unavailable")} ×</button>}
          {activeCount > 0 && <button onClick={clearAll} className="px-2 py-1.5 text-xs font-bold text-slate-500 underline-offset-4 hover:text-teal-700 hover:underline">{fa ? "پاک کردن همه" : "Clear all"}</button>}
        </div>
      )}

      <aside className="hidden rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 small:block">{filters}</aside>

      {open && (
        <div className="fixed inset-0 z-[80] small:hidden" role="dialog" aria-modal="true" aria-label={fa ? "فیلتر محصولات" : "Product filters"}>
          <button aria-label={fa ? "بستن فیلترها" : "Close filters"} className="absolute inset-0 bg-slate-950/45" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-2xl bg-white p-5 text-slate-950 shadow-2xl dark:bg-slate-900 dark:text-slate-50">
            <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700"><h2 className="font-bold">{fa ? "فیلترها" : "Filters"}</h2><button onClick={() => setOpen(false)} className="h-9 w-9 rounded-full bg-slate-100 text-lg dark:bg-slate-800" aria-label={fa ? "بستن" : "Close"}>×</button></div>
            {filters}
            <button onClick={() => setOpen(false)} className="mt-6 h-12 w-full rounded-lg bg-teal-700 font-bold text-white transition hover:bg-teal-800">{fa ? "نمایش محصولات" : "Show products"}</button>
          </div>
        </div>
      )}
    </>
  )
}
