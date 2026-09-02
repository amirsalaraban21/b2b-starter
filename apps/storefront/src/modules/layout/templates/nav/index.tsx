import { retrieveCustomer } from "@/lib/data/customer"
import AccountButton from "@/modules/account/components/account-button"
import CartButton from "@/modules/cart/components/cart-button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Brand from "@/modules/layout/components/brand"
import Preferences from "@/modules/layout/components/preferences"
import HeaderSearch from "@/modules/layout/components/header-search"
import { getLocale, messages } from "@/lib/i18n"
import { cookies } from "next/headers"
import SkeletonAccountButton from "@/modules/skeletons/components/skeleton-account-button"
import SkeletonCartButton from "@/modules/skeletons/components/skeleton-cart-button"
import { Suspense } from "react"

export async function NavigationHeader() {
  const customer = await retrieveCustomer().catch(() => null)
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const t = messages[locale]
  const nav = locale === "fa" ? [["فروشگاه", "/store"], ["معاینه گوش", "/store"], ["ادیولوژی", "/store"], ["مصرفی و جانبی", "/store"], ["خرید حرفه‌ای", "/professional"]] : [["Store", "/store"], ["Ear examination", "/store"], ["Audiology", "/store"], ["Consumables & accessories", "/store"], ["Professional", "/professional"]]
  return <div className="sticky inset-x-0 top-0 z-50 border-b border-slate-200 bg-white text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-white"><div className="border-b border-slate-100 dark:border-slate-800"><div className="content-container flex min-h-8 items-center justify-end gap-4 text-xs text-slate-500"><LocalizedClientLink href="/professional">{locale === "fa" ? "خرید حرفه‌ای" : "Professional purchase"}</LocalizedClientLink><span>{locale === "fa" ? "فروشگاه تخصصی تجهیزات گوش" : "Specialist ear equipment store"}</span></div></div><header className="content-container"><div className="grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-5"><Brand className="text-base" /><div className="hidden min-w-0 justify-center small:flex"><HeaderSearch placeholder={t.search} /></div><div className="flex items-center justify-end gap-1"><Preferences initialLocale={locale} /><Suspense fallback={<SkeletonAccountButton />}><AccountButton customer={customer} /></Suspense><Suspense fallback={<SkeletonCartButton />}><CartButton /></Suspense></div></div><nav aria-label={locale === "fa" ? "ناوبری اصلی" : "Main navigation"} className="hidden min-h-11 items-center border-t border-slate-100 dark:border-slate-800 small:flex"><ul className="flex items-center gap-7">{nav.map(([label, href], index) => <li key={label}><LocalizedClientLink href={href} className={`inline-flex min-h-11 items-center border-b-2 text-sm font-medium transition ${index === 0 ? "border-teal-700" : "border-transparent hover:border-teal-600"}`}>{label}</LocalizedClientLink></li>)}</ul></nav></header></div>
}
