import { isEmpty } from "@/lib/util/isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  // Medusa keeps the configured ISO currency amount authoritative. IRR has no
  // ISO fractional unit; Iranian customers see the display-only 10:1 Toman conversion.
  if (currency_code?.toLowerCase() === "irr") {
    const localeCode = locale.startsWith("fa") ? "fa-IR" : "en-US"
    const label = locale.startsWith("fa") ? "تومان" : "Toman"
    return `${new Intl.NumberFormat(localeCode, { maximumFractionDigits: 0 }).format(amount / 10)} ${label}`
  }
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}
