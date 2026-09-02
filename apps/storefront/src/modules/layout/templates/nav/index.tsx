import { retrieveCustomer } from "@/lib/data/customer"
import AccountButton from "@/modules/account/components/account-button"
import CartButton from "@/modules/cart/components/cart-button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Brand from "@/modules/layout/components/brand"
import Preferences from "@/modules/layout/components/preferences"
import { getLocale, messages } from "@/lib/i18n"
import { cookies } from "next/headers"
import SkeletonAccountButton from "@/modules/skeletons/components/skeleton-account-button"
import SkeletonCartButton from "@/modules/skeletons/components/skeleton-cart-button"
import { Suspense } from "react"

export async function NavigationHeader() {
  const customer = await retrieveCustomer().catch(() => null)
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const t = messages[locale]

  const nav =
    locale === "fa"
      ? [
          ["فروشگاه", "/store"],
          ["معاینه گوش", "/store"],
          ["ادیولوژی", "/store"],
          ["مصرفی و جانبی", "/store"],
          ["خرید حرفه‌ای", "/professional"],
        ]
      : [
          ["Store", "/store"],
          ["Ear examination", "/store"],
          ["Audiology", "/store"],
          ["Consumables & accessories", "/store"],
          ["Professional", "/professional"],
        ]

  return (
    <div className="sticky inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-950 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:text-white">
      <header className="content-container">
        <div className="grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-5">
          <Brand className="text-base" />

          <div className="hidden min-w-0 justify-center small:flex">
            <div className="relative w-full max-w-2xl">
              <input
                disabled
                type="text"
                placeholder={t.search}
                title={t.searchUnavailable}
                className="h-11 w-full border border-slate-300 bg-slate-50 px-4 pe-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-slate-400" aria-hidden="true">
                ⌕
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-1">
            <Preferences initialLocale={locale} />
            <Suspense fallback={<SkeletonAccountButton />}>
              <AccountButton customer={customer} />
            </Suspense>
            <Suspense fallback={<SkeletonCartButton />}>
              <CartButton />
            </Suspense>
          </div>
        </div>

        <div className="hidden min-h-11 items-center justify-between border-t border-slate-200 dark:border-slate-800 small:flex">
          <nav aria-label={locale === "fa" ? "ناوبری اصلی" : "Main navigation"}>
            <ul className="flex items-center gap-7">
              {nav.map(([label, href], index) => (
                <li key={label}>
                  <LocalizedClientLink
                    href={href}
                    className={`inline-flex min-h-11 items-center border-b-2 text-sm font-medium transition ${
                      index === 0
                        ? "border-teal-700 text-slate-950 dark:text-white"
                        : "border-transparent text-slate-600 hover:border-teal-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                    }`}
                  >
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            {locale === "fa"
              ? "تجهیزات تخصصی گوش و ادیولوژی"
              : "Specialist ear & audiology equipment"}
          </div>
        </div>
      </header>
    </div>
  )
}
