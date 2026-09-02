import { isEmpty } from "@/lib/util/isEmpty"

type ConvertToLocaleParams = { amount: number; currency_code: string; minimumFractionDigits?: number; maximumFractionDigits?: number; locale?: string }

export const convertToLocale = ({ amount, currency_code, minimumFractionDigits, maximumFractionDigits, locale = "en-US" }: ConvertToLocaleParams) => {
  if (currency_code?.toLowerCase() === "irr") {
    const persian = locale.startsWith("fa")
    const value = new Intl.NumberFormat(persian ? "fa-IR" : "en-US", { maximumFractionDigits: 0 }).format(amount / 10)
    return `${value} ${persian ? "تومان" : "Toman"}`
  }
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, { style: "currency", currency: currency_code, minimumFractionDigits, maximumFractionDigits }).format(amount)
    : new Intl.NumberFormat(locale).format(amount)
}
