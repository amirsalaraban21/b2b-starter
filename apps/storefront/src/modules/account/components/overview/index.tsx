import { ManualPayment } from "@/lib/data/manual-payment"
import { ProfessionalApplication } from "@/lib/data/professional-application"
import { Locale } from "@/lib/i18n"
import OrderCard from "@/modules/account/components/order-card"
import ProfessionalStatus from "@/modules/account/components/professional-status"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { B2BCustomer } from "@/types/global"
import { HttpTypes } from "@medusajs/types"

const Overview = ({
  customer,
  orders,
  locale,
  application,
  latestPayment,
}: {
  customer: B2BCustomer
  orders: HttpTypes.StoreOrder[]
  locale: Locale
  application: ProfessionalApplication | null
  latestPayment: ManualPayment | null
}) => {
  const fa = locale === "fa"
  const cards = [
    {
      href: "/account/orders",
      title: fa ? "سفارش‌های من" : "My orders",
      detail: fa
        ? `${orders.length.toLocaleString("fa-IR")} سفارش`
        : `${orders.length} orders`,
    },
    {
      href: "/account/addresses",
      title: fa ? "آدرس‌های من" : "My addresses",
      detail: fa
        ? `${(customer.addresses?.length || 0).toLocaleString(
            "fa-IR"
          )} آدرس ذخیره‌شده`
        : `${customer.addresses?.length || 0} saved addresses`,
    },
    {
      href: "/account/profile",
      title: fa ? "اطلاعات حساب" : "Account details",
      detail: [customer.email, customer.phone].filter(Boolean).join(" · "),
    },
  ]
  return (
    <div dir={fa ? "rtl" : "ltr"} data-testid="overview-page-wrapper">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 small:p-8">
        <p className="text-sm font-bold text-teal-700 dark:text-teal-300">
          EarMed
        </p>
        <h1 className="mt-2 text-3xl font-black" data-testid="welcome-message">
          {fa
            ? `سلام، ${customer.first_name || "دوست عزیز"}`
            : `Hello, ${customer.first_name || "there"}`}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {fa
            ? "سفارش‌ها، آدرس‌ها و اطلاعات حساب خود را مدیریت کنید."
            : "Manage your orders, addresses, and account details."}
        </p>
      </div>
      <div className="mt-5 grid gap-4 medium:grid-cols-3">
        {cards.map((card) => (
          <LocalizedClientLink
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:border-slate-800 dark:bg-slate-900 motion-reduce:transform-none motion-reduce:transition-none"
          >
            <h2 className="text-lg font-black">{card.title}</h2>
            <p className="mt-2 break-all text-sm text-slate-500 dark:text-slate-400">
              {card.detail}
            </p>
          </LocalizedClientLink>
        ))}
      </div>
      {orders.length > 0 && (
        <section className="mt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-black">
              {fa ? "سفارش‌های اخیر" : "Recent orders"}
            </h2>
            <LocalizedClientLink
              href="/account/orders"
              className="text-sm font-bold text-teal-700 hover:underline dark:text-teal-300"
            >
              {fa ? "مشاهده همه" : "View all"}
            </LocalizedClientLink>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 3).map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                locale={locale}
                manualPayment={index === 0 ? latestPayment : null}
              />
            ))}
          </div>
        </section>
      )}
      <div className="mt-5">
        <ProfessionalStatus locale={locale} application={application} />
      </div>
    </div>
  )
}
export default Overview
