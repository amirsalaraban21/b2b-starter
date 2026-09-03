"use client"

import {
  ManualPayment,
  uploadManualPaymentReceipt,
} from "@/lib/data/manual-payment"
import { Locale } from "@/lib/i18n"
import { ChangeEvent, FormEvent, useState, useTransition } from "react"

const statusCopy = {
  fa: {
    awaiting_payment: "در انتظار پرداخت",
    receipt_submitted: "رسید ارسال شد",
    under_review: "در حال بررسی",
    approved: "پرداخت تأیید شد",
    rejected: "رسید رد شد",
  },
  en: {
    awaiting_payment: "Awaiting payment",
    receipt_submitted: "Receipt submitted",
    under_review: "Under review",
    approved: "Payment approved",
    rejected: "Receipt rejected",
  },
} as const
const accepted = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
const maxBytes = 10 * 1024 * 1024

export default function ManualPaymentStatus({
  initialPayment,
  orderId,
  locale,
}: {
  initialPayment: ManualPayment
  orderId: string
  locale: Locale
}) {
  const fa = locale === "fa"
  const [payment, setPayment] = useState(initialPayment)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()
  const canUpload =
    payment.status === "awaiting_payment" || payment.status === "rejected"
  const select = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] || null
    setError("")
    if (selected && !accepted.includes(selected.type))
      return setError(
        fa
          ? "فقط فایل JPEG، PNG، WebP یا PDF مجاز است."
          : "Choose a JPEG, PNG, WebP, or PDF file."
      )
    if (selected && selected.size > maxBytes)
      return setError(
        fa
          ? "حجم فایل نباید بیشتر از ۱۰ مگابایت باشد."
          : "The file must be 10 MB or smaller."
      )
    if (selected && selected.size === 0)
      return setError(
        fa ? "فایل انتخاب‌شده خالی است." : "The selected file is empty."
      )
    setFile(selected)
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!file)
      return setError(
        fa ? "ابتدا فایل رسید را انتخاب کنید." : "Select a receipt first."
      )
    const form = new FormData(event.currentTarget)
    form.set("file", file)
    startTransition(async () => {
      try {
        const result = await uploadManualPaymentReceipt(orderId, form)
        setPayment(result.manual_payment)
        setFile(null)
        setError("")
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      }
    })
  }
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950/50"
      aria-labelledby="manual-payment-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="manual-payment-heading" className="font-black">
            {fa ? "وضعیت پرداخت کارت‌به‌کارت" : "Manual payment status"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {statusCopy[locale][payment.status]}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            payment.status === "approved"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              : payment.status === "rejected"
              ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
              : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100"
          }`}
        >
          {statusCopy[locale][payment.status]}
        </span>
      </div>
      {payment.status === "receipt_submitted" ||
      payment.status === "under_review" ? (
        <p className="mt-4 text-sm leading-7">
          {fa
            ? "رسید شما دریافت شده و در انتظار بررسی فروشگاه است. ارسال رسید به معنی تأیید پرداخت نیست."
            : "Your receipt was received and is awaiting store review. Submission does not mean payment is approved."}
        </p>
      ) : null}
      {payment.status === "rejected" && (
        <p className="mt-4 text-sm text-red-700 dark:text-red-200">
          {fa
            ? "رسید پذیرفته نشد. می‌توانید یک رسید جایگزین ارسال کنید."
            : "The receipt was rejected. You can submit a replacement."}
        </p>
      )}
      {canUpload && (
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center transition hover:border-teal-500 dark:border-slate-700 dark:bg-slate-900">
            <span className="block text-sm font-bold">
              {file
                ? file.name
                : fa
                ? "انتخاب تصویر یا PDF رسید"
                : "Choose receipt image or PDF"}
            </span>
            {file && (
              <span className="mt-2 block text-xs text-slate-500">
                {file.type} ·{" "}
                {new Intl.NumberFormat(fa ? "fa-IR" : "en-US", {
                  maximumFractionDigits: 1,
                }).format(file.size / 1024)}{" "}
                KB
              </span>
            )}
            <input
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={select}
              className="sr-only"
            />
          </label>
          {file && (
            <button
              type="button"
              className="text-xs font-bold text-red-700 dark:text-red-300"
              onClick={() => setFile(null)}
            >
              {fa ? "حذف فایل" : "Remove file"}
            </button>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="payer_name"
              maxLength={120}
              placeholder={
                fa ? "نام پرداخت‌کننده (اختیاری)" : "Payer name (optional)"
              }
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
            <input
              name="payment_reference"
              maxLength={120}
              placeholder={
                fa ? "شماره پیگیری (اختیاری)" : "Payment reference (optional)"
              }
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <button
            disabled={pending || !file}
            className="h-11 w-full rounded-xl bg-teal-700 font-bold text-white disabled:opacity-50"
          >
            {pending
              ? fa
                ? "در حال ارسال…"
                : "Uploading…"
              : payment.status === "rejected"
              ? fa
                ? "ارسال رسید جایگزین"
                : "Submit replacement"
              : fa
              ? "ارسال رسید"
              : "Submit receipt"}
          </button>
        </form>
      )}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200"
        >
          {error}
        </p>
      )}
    </section>
  )
}
