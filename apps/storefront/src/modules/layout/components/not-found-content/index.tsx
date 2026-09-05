import type { Locale } from "@/lib/i18n"
import Link from "next/link"

const copy = {
  fa: { title: "صفحه پیدا نشد", description: "صفحه‌ای که به دنبال آن بودید وجود ندارد یا جابه‌جا شده است.", home: "بازگشت به خانه", store: "مشاهده فروشگاه" },
  en: { title: "Page not found", description: "The page you requested does not exist or has moved.", home: "Go home", store: "Browse the store" },
} as const

export default function NotFoundContent({ locale }: { locale: Locale }) {
  const t = copy[locale]
  return (
    <div dir={locale === "fa" ? "rtl" : "ltr"} className="content-container flex min-h-[65vh] flex-col items-center justify-center gap-5 py-16 text-center">
      <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">404</p>
      <h1 className="text-3xl font-semibold text-ui-fg-base">{t.title}</h1>
      <p className="max-w-lg text-base leading-7 text-ui-fg-subtle">{t.description}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800" href="/">{t.home}</Link>
        <Link className="rounded-lg border border-ui-border-base px-5 py-3 text-sm font-semibold text-ui-fg-base transition hover:bg-ui-bg-subtle" href="/store">{t.store}</Link>
      </div>
    </div>
  )
}
