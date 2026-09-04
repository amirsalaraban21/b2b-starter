"use client"

import {
  ProfessionalApplication,
  submitProfessionalApplication,
} from "@/lib/data/professional-application"
import { Locale } from "@/lib/i18n"
import { B2BCustomer } from "@/types"
import { useActionState } from "react"

export default function ProfessionalApplicationForm({
  locale,
  customer,
  application,
}: {
  locale: Locale
  customer: B2BCustomer
  application: ProfessionalApplication | null
}) {
  const fa = locale === "fa"
  const [state, action, pending] = useActionState(
    submitProfessionalApplication,
    { success: false, error: null }
  )
  const input =
    "mt-2 w-full rounded-lg border border-ui-border-base bg-ui-bg-base px-3 py-3 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
  if (state.success)
    return (
      <div
        role="status"
        className="mt-8 rounded-2xl border border-teal-200 bg-teal-50 p-6 text-teal-900 dark:border-teal-900 dark:bg-teal-950/50 dark:text-teal-100"
      >
        {fa
          ? "درخواست شما ثبت شد و در انتظار بررسی است."
          : "Your application was submitted and is awaiting review."}
      </div>
    )
  return (
    <section
      dir={fa ? "rtl" : "ltr"}
      className="mt-8 rounded-2xl border border-ui-border-base bg-ui-bg-subtle p-6 small:p-10"
    >
      <h2 className="text-2xl font-semibold">
        {fa ? "درخواست حساب حرفه‌ای" : "Professional account application"}
      </h2>
      <p className="mt-3 text-sm text-ui-fg-subtle">
        {fa
          ? "درخواست پس از بررسی مدیر، در حساب کاربری نمایش داده می‌شود."
          : "Your application status will appear in your account after admin review."}
      </p>
      <form className="mt-8 grid gap-4 small:grid-cols-2" action={action}>
        <label className="text-sm font-medium">
          {fa ? "نام" : "First name"}
          <input
            required
            name="first_name"
            defaultValue={customer.first_name || ""}
            className={input}
          />
        </label>
        <label className="text-sm font-medium">
          {fa ? "نام خانوادگی" : "Last name"}
          <input
            required
            name="last_name"
            defaultValue={customer.last_name || ""}
            className={input}
          />
        </label>
        <label className="text-sm font-medium">
          {fa ? "تلفن" : "Phone"}
          <input
            required
            name="phone"
            type="tel"
            defaultValue={customer.phone || ""}
            className={input}
          />
        </label>
        <label className="text-sm font-medium">
          {fa ? "ایمیل حساب" : "Account email"}
          <input
            required
            readOnly
            name="email"
            type="email"
            defaultValue={customer.email}
            className={input}
          />
        </label>
        <label className="text-sm font-medium">
          {fa ? "نوع فعالیت" : "Professional type"}
          <select
            required
            name="professional_type"
            defaultValue={application?.professional_type || ""}
            className={input}
          >
            <option value="">—</option>
            <option value="doctor">{fa ? "پزشک" : "Doctor"}</option>
            <option value="audiologist">
              {fa ? "شنوایی‌شناس" : "Audiologist"}
            </option>
            <option value="clinic">{fa ? "کلینیک" : "Clinic"}</option>
            <option value="medical_organization">
              {fa ? "سازمان درمانی" : "Medical organization"}
            </option>
            <option value="other">{fa ? "سایر" : "Other"}</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          {fa ? "سازمان یا کلینیک" : "Organization or clinic"}
          <input
            name="organization_name"
            defaultValue={application?.organization_name || ""}
            className={input}
          />
        </label>
        <label className="text-sm font-medium">
          {fa ? "شناسه حرفه‌ای" : "Professional identifier"}
          <input
            name="professional_identifier"
            defaultValue={application?.professional_identifier || ""}
            className={input}
          />
        </label>
        <label className="text-sm font-medium">
          {fa ? "شهر" : "City"}
          <input
            required
            name="city"
            defaultValue={application?.city || ""}
            className={input}
          />
        </label>
        <label className="small:col-span-2 text-sm font-medium">
          {fa ? "توضیحات" : "Notes"}
          <textarea name="notes" rows={4} className={`${input} resize-y`} />
        </label>
        <div className="small:col-span-2">
          <button
            disabled={pending}
            className="rounded-lg bg-teal-700 px-5 py-3 text-white disabled:opacity-60"
          >
            {pending
              ? fa
                ? "در حال ارسال…"
                : "Submitting…"
              : fa
              ? "ارسال درخواست"
              : "Submit application"}
          </button>
          {state.error && (
            <p role="alert" className="mt-3 text-sm text-rose-600">
              {state.error}
            </p>
          )}
        </div>
      </form>
    </section>
  )
}
