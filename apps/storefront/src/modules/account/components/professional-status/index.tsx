"use client"

import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { useEffect, useState } from "react"
import { Locale } from "@/lib/i18n"

type Application = { status: "pending" | "approved" | "rejected" | "needs_information"; submitted_at?: string; customer_feedback?: string | null }
export default function ProfessionalStatus({ locale }: { locale: Locale }) {
  const fa = locale === "fa"
  const [application, setApplication] = useState<Application | null>(null); const [loaded, setLoaded] = useState(false); const [failed, setFailed] = useState(false)
  useEffect(() => { fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/professional-applications/me`, { credentials: "include" }).then(async response => { if (response.status === 404) return null; if (!response.ok) throw new Error(); return (await response.json()).application }).then(setApplication).catch(() => setFailed(true)).finally(() => setLoaded(true)) }, [])
  if (!loaded) return <div className="h-28 animate-pulse rounded-xl bg-ui-bg-subtle" />
  if (failed) return <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">{fa ? "وضعیت درخواست حرفه‌ای موقتاً در دسترس نیست." : "Professional status is temporarily unavailable."}</section>
  const text = application?.status === "approved" ? fa ? "درخواست حساب حرفه‌ای تأیید شده است." : "Professional application approved." : application?.status === "pending" ? fa ? "درخواست حرفه‌ای در انتظار بررسی است." : "Professional application pending review." : application?.status === "needs_information" ? fa ? "اطلاعات بیشتری برای بررسی لازم است." : "Additional information is required." : application?.status === "rejected" ? fa ? "درخواست حرفه‌ای تأیید نشده است." : "Professional application was not approved." : fa ? "متخصص هستید؟ درخواست حساب حرفه‌ای ثبت کنید." : "Are you a professional? Submit a professional account application."
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h3 className="font-bold">{fa ? "وضعیت حساب حرفه‌ای" : "Professional status"}</h3><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{text}</p>{application?.submitted_at && <p className="mt-1 text-xs text-slate-400">{fa ? "ثبت‌شده در " : "Submitted "}{new Date(application.submitted_at).toLocaleDateString(fa ? "fa-IR" : "en-US")}</p>}{application?.customer_feedback && <p className="mt-3 text-sm">{application.customer_feedback}</p>}{!application && <LocalizedClientLink href="/professional" className="mt-3 inline-block text-sm font-bold text-teal-700 hover:underline dark:text-teal-300">{fa ? "ثبت درخواست حرفه‌ای" : "Submit professional application"}</LocalizedClientLink>}</section>
}
