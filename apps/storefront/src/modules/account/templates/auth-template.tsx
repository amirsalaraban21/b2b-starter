import { Locale } from "@/lib/i18n"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Image from "next/image"

const AuthTemplate = ({ children, locale }: { children: React.ReactNode; locale: Locale }) => {
  const fa = locale === "fa"
  return (
    <main dir={fa ? "rtl" : "ltr"} className="bg-slate-50 py-8 text-slate-950 dark:bg-slate-950 dark:text-slate-50 small:py-14">
      <div className="content-container">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.09)] dark:border-slate-800 dark:bg-slate-900 small:grid-cols-[42%_58%]">
          <aside className="relative hidden min-h-[620px] overflow-hidden bg-gradient-to-br from-teal-950 via-teal-800 to-slate-900 p-9 text-white small:flex small:flex-col small:justify-between">
            <div><p className="text-sm font-bold text-teal-200">EarMed</p><h2 className="mt-4 text-3xl font-black leading-relaxed">{fa ? "خرید ساده‌تر، پیگیری روشن‌تر" : "Simpler shopping, clearer order tracking"}</h2><p className="mt-4 text-sm leading-7 text-teal-50/85">{fa ? "حساب شخصی شما برای مدیریت سفارش‌ها و آدرس‌ها؛ بدون فرم‌های غیرضروری کسب‌وکار." : "Your personal account for orders and addresses, without unnecessary business forms."}</p></div>
            <Image src="/products/earmed/care-assortment-v2.png" alt="" width={640} height={420} className="mt-8 h-64 w-full rounded-2xl border border-white/15 object-cover" />
          </aside>
          <section className="flex items-center p-6 xsmall:min-h-[560px] xsmall:p-9 small:p-12"><div className="mx-auto min-w-0 w-full max-w-md">{children}<div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800"><p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{fa ? "متخصص هستید؟ پس از ساخت حساب معمولی، درخواست حساب حرفه‌ای ثبت کنید." : "Are you a professional? Create a regular account first, then submit a professional application."}</p><LocalizedClientLink href="/professional" className="mt-2 inline-block max-w-full break-words text-sm font-bold text-teal-700 hover:underline dark:text-teal-300">{fa ? "ثبت درخواست حرفه‌ای" : "Submit professional application"}</LocalizedClientLink></div></div></section>
        </div>
      </div>
    </main>
  )
}

export default AuthTemplate
