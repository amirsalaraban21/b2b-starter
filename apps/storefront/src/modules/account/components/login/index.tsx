"use client"

import { login } from "@/lib/data/customer"
import { Locale } from "@/lib/i18n"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { useActionState, useState } from "react"

const friendlyError = (error: string | null, fa: boolean) => {
  if (!error) return null
  if (!fa) return "The email or password is incorrect."
  return "ایمیل یا رمز عبور صحیح نیست."
}

const Login = ({ locale, returnTo, countryCode }: { locale: Locale; returnTo?: string; countryCode: string }) => {
  const [message, formAction] = useActionState(login, null)
  const [showPassword, setShowPassword] = useState(false)
  const fa = locale === "fa"
  const query = returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : ""
  const inputClass = "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white motion-reduce:transition-none"

  return (
    <div className="w-full" data-testid="login-page">
      <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">{fa ? "ورود به حساب کاربری" : "Log in to your account"}</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{fa ? "برای مشاهده سفارش‌ها و ادامه خرید وارد حساب خود شوید." : "Log in to view your orders and continue shopping."}</p>
      <form action={formAction} className="mt-7 space-y-5">
        <input type="hidden" name="return_to" value={returnTo || ""} /><input type="hidden" name="country_code" value={countryCode} />
        <div><label htmlFor="login-email" className="mb-2 block text-sm font-bold">{fa ? "ایمیل" : "Email"}</label><input id="login-email" name="email" type="email" autoComplete="email" required className={inputClass} data-testid="email-input" /></div>
        <div><label htmlFor="login-password" className="mb-2 block text-sm font-bold">{fa ? "رمز عبور" : "Password"}</label><div className="relative"><input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required className={`${inputClass} pe-20`} data-testid="password-input" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 end-3 px-2 text-xs font-bold text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:text-teal-300" aria-label={fa ? "نمایش یا پنهان کردن رمز عبور" : "Show or hide password"}>{showPassword ? fa ? "پنهان" : "Hide" : fa ? "نمایش" : "Show"}</button></div></div>
        {message && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200" data-testid="login-error-message">{friendlyError(message, fa)}</p>}
        <SubmitButton className="w-full" data-testid="sign-in-button">{fa ? "ورود" : "Log in"}</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">{fa ? "حساب ندارید؟" : "Don't have an account?"} <LocalizedClientLink href={`/account/register${query}`} className="font-bold text-teal-700 hover:underline dark:text-teal-300" data-testid="register-link">{fa ? "ثبت‌نام" : "Register"}</LocalizedClientLink></p>
    </div>
  )
}

export default Login
