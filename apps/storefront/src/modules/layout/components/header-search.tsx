"use client"
import { FormEvent, useState } from "react"
import { useParams, useRouter } from "next/navigation"
export default function HeaderSearch({ placeholder }: { placeholder: string }) {
  const router = useRouter()
  const params = useParams<{ countryCode: string }>()
  const [value, setValue] = useState("")
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const query = value.trim()
    router.push(
      `/${params.countryCode}/store${
        query ? `?q=${encodeURIComponent(query)}` : ""
      }`
    )
  }
  return (
    <form onSubmit={submit} role="search" className="relative w-full max-w-2xl">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 pe-10 text-sm outline-none transition focus:border-teal-600 dark:border-slate-700 dark:bg-slate-900"
      />
      <button
        type="submit"
        aria-label={placeholder}
        className="absolute inset-y-0 end-0 min-w-11 px-3 text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-teal-600"
      >
        ⌕
      </button>
    </form>
  )
}
