"use client"

import { getLocale, Locale, localeDirection } from "@/lib/i18n"
import { Moon, Sun } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Theme = "light" | "dark"

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`
}

export default function Preferences({
  initialLocale,
}: {
  initialLocale: Locale
}) {
  const [locale, setLocale] = useState(initialLocale)
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const savedTheme = document.cookie.match(
      /(?:^|; )earmed-theme=([^;]*)/
    )?.[1]
    const nextTheme: Theme = savedTheme === "dark" ? "dark" : "light"
    setTheme(nextTheme)
    document.documentElement.classList.toggle("dark", nextTheme === "dark")
    document.documentElement.dataset.mode = nextTheme
  }, [])

  const changeLocale = () => {
    const next = locale === "fa" ? "en" : "fa"
    setCookie("earmed-locale", next)
    document.documentElement.lang = next
    document.documentElement.dir = localeDirection[next]
    setLocale(next)
    window.location.reload()
  }

  const changeTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light"
    setCookie("earmed-theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
    document.documentElement.dataset.mode = next
    setTheme(next)
  }

  return (
    <div className="flex items-center gap-1" dir="ltr">
      <button
        type="button"
        onClick={changeLocale}
        className="min-h-10 min-w-10 rounded-md px-2 text-xs font-semibold text-ui-fg-subtle hover:bg-ui-bg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
        aria-label="Change language"
      >
        {getLocale(locale) === "fa" ? "EN" : "فا"}
      </button>
      <button
        type="button"
        onClick={changeTheme}
        className="grid min-h-10 min-w-10 place-items-center rounded-md text-ui-fg-subtle hover:bg-ui-bg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
        aria-label={
          theme === "light" ? "Enable dark mode" : "Enable light mode"
        }
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </button>
    </div>
  )
}
