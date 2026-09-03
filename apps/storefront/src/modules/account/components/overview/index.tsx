import { Locale } from "@/lib/i18n"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ProfessionalStatus from "@/modules/account/components/professional-status"
import { B2BCustomer } from "@/types/global"
import { HttpTypes } from "@medusajs/types"

const Overview = ({ customer, orders, locale }: { customer: B2BCustomer; orders: HttpTypes.StoreOrder[] | null; locale: Locale }) => {
  const fa = locale === "fa"
  const cards = [
    { href: "/account/orders", title: fa ? "سفارش‌های من" : "My orders", detail: fa ? `${(orders?.length || 0).toLocaleString("fa-IR")} سفارش` : `${orders?.length || 0} orders` },
    { href: "/account/addresses", title: fa ? "آدرس‌های من" : "My addresses", detail: fa ? `${(customer.addresses?.length || 0).toLocaleString("fa-IR")} آدرس ذخیره‌شده` : `${customer.addresses?.length || 0} saved addresses` },
    { href: "/account/profile", title: fa ? "اطلاعات حساب" : "Account details", detail: customer.email },
  ]
  return (
    <div dir={fa ? "rtl" : "ltr"} data-testid="overview-page-wrapper">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 small:p-8">
        <p className="text-sm font-bold text-teal-700 dark:text-teal-300">EarMed</p>
        <h1 className="mt-2 text-3xl font-black" data-testid="welcome-message">{fa ? `سلام، ${customer.first_name || "دوست عزیز"}` : `Hello, ${customer.first_name || "there"}`}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{fa ? "سفارش‌ها، آدرس‌ها و اطلاعات حساب خود را مدیریت کنید." : "Manage your orders, addresses and account details."}</p>
      </div>
      <div className="mt-5 grid gap-4 medium:grid-cols-3">{cards.map((card) => <LocalizedClientLink key={card.href} href={card.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:border-slate-800 dark:bg-slate-900 motion-reduce:transform-none motion-reduce:transition-none"><h2 className="text-lg font-black">{card.title}</h2><p className="mt-2 truncate text-sm text-slate-500 dark:text-slate-400">{card.detail}</p></LocalizedClientLink>)}</div>
      <div className="mt-5"><ProfessionalStatus locale={locale} /></div>
    </div>
  )
}

export default Overview
