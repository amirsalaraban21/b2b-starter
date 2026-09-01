"use client"

import { FormEvent, useState } from "react"

export default function ProfessionalApplicationForm() {
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setMessage(null); setSubmitting(true)
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/professional-applications`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) })
    const body = await response.json().catch(() => ({})); setSubmitting(false)
    if (response.ok) { event.currentTarget.reset(); setMessage("درخواست شما با موفقیت ثبت شد و پس از بررسی نتیجه از طریق حساب کاربری نمایش داده خواهد شد.") } else setMessage(body.message || "ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.")
  }
  const input = "mt-2 w-full rounded-lg border border-ui-border-base bg-ui-bg-base px-3 py-3 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
  return <section className="rounded-2xl border border-ui-border-base bg-ui-bg-subtle p-6 small:p-10"><h2 className="text-2xl font-semibold">درخواست خرید حرفه‌ای</h2><p className="mt-3 text-sm text-ui-fg-subtle">درخواست‌ها پس از بررسی در حساب کاربری نمایش داده می‌شوند.</p><form className="mt-8 grid gap-4 small:grid-cols-2" onSubmit={submit}><label className="text-sm font-medium">نام<input required name="first_name" className={input} /></label><label className="text-sm font-medium">نام خانوادگی<input required name="last_name" className={input} /></label><label className="text-sm font-medium">تلفن<input required name="phone" type="tel" className={input} /></label><label className="text-sm font-medium">ایمیل<input required name="email" type="email" className={input} /></label><label className="text-sm font-medium">نوع فعالیت<select required name="professional_type" className={input}><option value="">—</option><option value="doctor">پزشک</option><option value="audiologist">ادیولوژیست</option><option value="clinic">کلینیک</option><option value="medical_organization">سازمان درمانی</option><option value="other">سایر</option></select></label><label className="text-sm font-medium">سازمان یا کلینیک<input name="organization_name" className={input} /></label><label className="text-sm font-medium">شناسه حرفه‌ای<input name="professional_identifier" className={input} /></label><label className="text-sm font-medium">شهر<input required name="city" className={input} /></label><label className="small:col-span-2 text-sm font-medium">توضیحات<textarea name="notes" rows={4} className={`${input} resize-y`} /></label><div className="small:col-span-2"><button disabled={submitting} className="rounded-lg bg-teal-700 px-5 py-3 text-white disabled:opacity-60">{submitting ? "…" : "ارسال درخواست"}</button>{message && <p role="status" className="mt-3 text-sm text-ui-fg-subtle">{message}</p>}</div></form></section>
}
