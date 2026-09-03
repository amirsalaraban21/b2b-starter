import { Locale } from "@/lib/i18n"
import Button from "@/modules/common/components/button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ShoppingBag from "@/modules/common/icons/shopping-bag"

const EmptyCartMessage = ({ locale }: { locale: Locale }) => {
  const fa = locale === "fa"
  return (
    <section className="mx-auto my-8 flex max-w-2xl flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900" data-testid="empty-cart-message">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300"><ShoppingBag /></span>
      <h1 className="mt-6 text-2xl font-black small:text-3xl">{fa ? "سبد خرید شما خالی است" : "Your cart is empty"}</h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">{fa ? "هنوز محصولی برای خرید انتخاب نکرده‌اید." : "You haven't selected any products yet."}</p>
      <LocalizedClientLink href="/store" className="mt-7"><Button size="large">{fa ? "مشاهده محصولات" : "Browse products"}</Button></LocalizedClientLink>
    </section>
  )
}

export default EmptyCartMessage
