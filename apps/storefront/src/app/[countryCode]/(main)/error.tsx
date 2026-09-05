"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const [locale, setLocale] = useState<"fa" | "en">("fa")

  useEffect(() => {
    setLocale(document.documentElement.lang === "en" ? "en" : "fa")
  }, [])

  const t = locale === "fa"
    ? { title: "مشکلی در دریافت اطلاعات رخ داد", body: "لطفاً دوباره تلاش کنید. اگر مشکل ادامه داشت، به فروشگاه بازگردید.", retry: "تلاش مجدد", home: "خانه", store: "فروشگاه" }
    : { title: "We couldn't load this page", body: "Please try again. If the problem continues, return to the store.", retry: "Retry", home: "Home", store: "Store" }

  return (
    <div dir={locale === "fa" ? "rtl" : "ltr"} className="content-container flex min-h-[55vh] flex-col items-start justify-center gap-4 py-16">
      <h1 className="text-2xl font-semibold text-ui-fg-base">{t.title}</h1>
      <p className="max-w-xl leading-7 text-ui-fg-subtle">{t.body}</p>
      <div className="flex flex-wrap gap-3">
        <button onClick={reset} className="rounded-lg bg-teal-700 px-5 py-3 text-white transition hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">{t.retry}</button>
        <Link href="/" className="rounded-lg border border-ui-border-base px-5 py-3 text-ui-fg-base transition hover:bg-ui-bg-subtle">{t.home}</Link>
        <Link href="/store" className="rounded-lg border border-ui-border-base px-5 py-3 text-ui-fg-base transition hover:bg-ui-bg-subtle">{t.store}</Link>
      </div>
    </div>
  )
}
