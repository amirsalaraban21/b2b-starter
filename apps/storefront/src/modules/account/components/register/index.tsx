"use client"

import { signup } from "@/lib/data/customer"
import { Locale } from "@/lib/i18n"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { useActionState, useState } from "react"

const Register = ({ locale, returnTo, countryCode }: { locale: Locale; returnTo?: string; countryCode: string }) => {
  const [message, formAction] = useActionState(signup, null)
  const [showPassword, setShowPassword] = useState(false)
  const fa = locale === "fa"
  const query = returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : ""
  const inputClass = "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white motion-reduce:transition-none"
  const fields = [{ name: "first_name", fa: "نام", en: "First name", type: "text", autoComplete: "given-name" }, { name: "last_name", fa: "نام خانوادگی", en: "Last name", type: "text", autoComplete: "family-name" }, { name: "phone", fa: "شماره موبایل", en: "Mobile number", type: "tel", autoComplete: "tel" }, { name: "email", fa: "ایمیل", en: "Email", type: "email", autoComplete: "email" }]
  return (
    <div className="w-full" data-testid="register-page">
      <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">{fa ? "ساخت حساب EarMed" : "Create your EarMed account"}</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{fa ? "برای خرید و پیگیری سفارش‌ها، اطلاعات پایه خود را وارد کنید." : "Enter your basic details to shop and track orders."}</p>
      <form action={formAction} className="mt-7 space-y-4">
        <input type="hidden" name="return_to" value={returnTo || ""} /><input type="hidden" name="country_code" value={countryCode} /><input type="hidden" name="locale" value={locale} />
        <div className="grid gap-4 xsmall:grid-cols-2">{fields.slice(0, 2).map((field) => <div key={field.name}><label htmlFor={`register-${field.name}`} className="mb-2 block text-sm font-bold">{fa ? field.fa : field.en}</label><input id={`register-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} required className={inputClass} data-testid={`${field.name}-input`} /></div>)}</div>
        {fields.slice(2).map((field) => <div key={field.name}><label htmlFor={`register-${field.name}`} className="mb-2 block text-sm font-bold">{fa ? field.fa : field.en}</label><input id={`register-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} required className={inputClass} dir={field.type === "tel" || field.type === "email" ? "ltr" : undefined} data-testid={`${field.name}-input`} /></div>)}
        <div><label htmlFor="register-password" className="mb-2 block text-sm font-bold">{fa ? "رمز عبور" : "Password"}</label><div className="relative"><input id="register-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={8} required className={`${inputClass} pe-20`} data-testid="password-input" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 end-3 px-2 text-xs font-bold text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:text-teal-300" aria-label={fa ? "نمایش یا پنهان کردن رمز عبور" : "Show or hide password"}>{showPassword ? fa ? "پنهان" : "Hide" : fa ? "نمایش" : "Show"}</button></div><p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{fa ? "حداقل ۸ نویسه" : "At least 8 characters"}</p></div>
        {message && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200" data-testid="register-error">{message.toLowerCase().includes("exist") || message.toLowerCase().includes("identity") ? fa ? "این ایمیل قبلاً ثبت شده است." : "This email is already registered." : fa ? "ثبت‌نام انجام نشد. لطفاً اطلاعات را بررسی کنید." : "Registration failed. Please check your information."}</p>}
        <SubmitButton className="w-full" data-testid="register-button">{fa ? "ثبت‌نام" : "Create account"}</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">{fa ? "قبلاً حساب ساخته‌اید؟" : "Already have an account?"} <LocalizedClientLink href={`/account/login${query}`} className="font-bold text-teal-700 hover:underline dark:text-teal-300">{fa ? "ورود" : "Log in"}</LocalizedClientLink></p>
    </div>
  )
}

export default Register
