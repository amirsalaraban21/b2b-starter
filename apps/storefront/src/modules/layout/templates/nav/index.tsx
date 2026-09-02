import { retrieveCart } from "@/lib/data/cart"
import { retrieveCustomer } from "@/lib/data/customer"
import AccountButton from "@/modules/account/components/account-button"
import CartButton from "@/modules/cart/components/cart-button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import FilePlus from "@/modules/common/icons/file-plus"
import Brand from "@/modules/layout/components/brand"
import Preferences from "@/modules/layout/components/preferences"
import { getLocale, messages } from "@/lib/i18n"
import { cookies } from "next/headers"
import { RequestQuoteConfirmation } from "@/modules/quotes/components/request-quote-confirmation"
import { RequestQuotePrompt } from "@/modules/quotes/components/request-quote-prompt"
import SkeletonAccountButton from "@/modules/skeletons/components/skeleton-account-button"
import SkeletonCartButton from "@/modules/skeletons/components/skeleton-cart-button"
import { Suspense } from "react"

export async function NavigationHeader() {
  const customer = await retrieveCustomer().catch(() => null)
  const cart = await retrieveCart()
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

  const quoteButton = (
    <button className="inline-flex min-h-9 items-center gap-1.5 border-s border-ui-border-base px-3 text-xs font-semibold text-ui-fg-subtle transition hover:text-teal-700">
      <FilePlus />
      <span className="hidden medium:inline">{t.quote}</span>
    </button>
  )

  return (
    <div className="sticky inset-x-0 top-0 z-50 border-b border-ui-border-base bg-white/95 text-zinc-900 backdrop-blur dark:bg-slate-950/95 dark:text-white">
      <header className="content-container">
        <div className="flex min-h-16 items-center justify-between gap-4">
          <div className="flex shrink-0 items-center gap-4">
            <Brand className="text-base" />
          </div>

          <div className="hidden min-w-0 flex-1 justify-center small:flex">
            <div className="relative w-full max-w-xl">
              <input
                disabled
                type="text"
                placeholder={t.search}
                title={t.searchUnavailable}
                className="h-10 w-full border border-ui-border-base bg-ui-bg-subtle px-4 text-sm text-ui-fg-base outline-none transition placeholder:text-ui-fg-muted hover:cursor-not-allowed"
              />
              <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-ui-fg-muted" aria-hidden="true">
                ⌕
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <Preferences initialLocale={locale} />

            {customer && cart?.items && cart.items.length > 0 ? (
              <RequestQuoteConfirmation>{quoteButton}</RequestQuoteConfirmation>
            ) : (
              <RequestQuotePrompt>{quoteButton}</RequestQuotePrompt>
            )}

            <Suspense fallback={<SkeletonAccountButton />}>
              <AccountButton customer={customer} />
            </Suspense>

            <Suspense fallback={<SkeletonCartButton />}>
              <CartButton />
            </Suspense>
          </div>
        </div>

        <div className="hidden min-h-11 items-center justify-between border-t border-ui-border-base small:flex">
          <nav aria-label={locale === "fa" ? "ناوبری اصلی" : "Main navigation"}>
            <ul className="flex items-center gap-7">
              {nav.map(([label, href], index) => (
                <li key={label}>
                  <LocalizedClientLink
                    href={href}
                    className={`inline-flex min-h-11 items-center border-b-2 text-sm font-medium transition ${
                      index === 0
                        ? "border-teal-700 text-ui-fg-base"
                        : "border-transparent text-ui-fg-subtle hover:border-teal-600 hover:text-ui-fg-base"
                    }`}
                  >
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-xs text-ui-fg-muted">
            {locale === "fa"
              ? "تجهیزات تخصصی گوش و ادیولوژی"
              : "Specialist ear & audiology equipment"}
          </div>
        </div>
      </header>
    </div>
  )
}
