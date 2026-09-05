import { cookies } from "next/headers"
import { getLocale } from "@/lib/i18n"

import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Brand from "@/modules/layout/components/brand"
import { getSiteConfig } from "@/lib/site-config"

const footerCopy = {
  fa: {
    store: "فروشگاه",
    professional: "حرفه‌ای",
    account: "حساب کاربری",
    information: "اطلاعات",
    products: "همه محصولات",
    examination: "تجهیزات معاینه گوش",
    audiology: "تجهیزات ادیولوژی",
    consumables: "لوازم مصرفی",
    accessories: "قطعات و لوازم جانبی",
    professionalPurchase: "خرید حرفه‌ای",
    quote: "درخواست پیش‌فاکتور",
    signIn: "ورود به حساب",
    orders: "سفارش‌ها",
    cart: "سبد خرید",
    about: "درباره ما",
    contact: "تماس با ما",
    faq: "سوالات متداول",
  },
  en: {
    store: "Store",
    professional: "Professional",
    account: "Account",
    information: "Information",
    products: "All products",
    examination: "Ear examination equipment",
    audiology: "Audiology equipment",
    consumables: "Consumables",
    accessories: "Parts & accessories",
    professionalPurchase: "Professional purchasing",
    quote: "Request a quote",
    signIn: "Sign in",
    orders: "Orders",
    cart: "Cart",
    about: "About Us",
    contact: "Contact Us",
    faq: "FAQ",
  },
}

export default async function Footer() {
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const f = footerCopy[locale]
  const site = getSiteConfig(locale)

  const groups = [
    {
      title: f.store,
      links: [
        [f.products, "/store"],
        [f.examination, "/store"],
        [f.audiology, "/store"],
        [f.consumables, "/store"],
        [f.accessories, "/store"],
      ],
    },
    {
      title: f.professional,
      links: [
        [f.professionalPurchase, "/professional"],
        [f.quote, "/account"],
      ],
    },
    {
      title: f.account,
      links: [
        [f.signIn, "/account"],
        [f.orders, "/account/orders"],
        [f.cart, "/cart"],
      ],
    },
    {
      title: f.information,
      links: [
        [f.about, "/about"],
        [f.contact, "/contact"],
        [f.faq, "/faq"],
      ],
    },
  ]

  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-white">
      <div className="content-container">
        <div className="grid gap-12 py-14 small:grid-cols-[1.15fr_2fr] small:py-16">
          <div className="max-w-sm">
            <Brand className="text-white" />
            <p className="mt-5 text-sm leading-7 text-slate-400">{site.description}</p>
            <div className="mt-8 h-px w-16 bg-teal-500" />
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 xsmall:grid-cols-2 small:grid-cols-4">
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-white">
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      <LocalizedClientLink
                        href={href}
                        className="text-sm text-slate-400 transition hover:text-teal-300"
                      >
                        {label}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-800 py-6 text-xs text-slate-500 small:flex-row small:items-center small:justify-between">
          <p>
            © {new Date().getFullYear()} {site.copyrightOwner}. {site.copyright}
          </p>
          <p>
            {locale === "fa"
              ? "تجهیزات تخصصی برای محیط‌های درمانی"
              : "Specialist equipment for care environments"}
          </p>
        </div>
      </div>
    </footer>
  )
}
