"use client"

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <div className="content-container flex min-h-[45vh] flex-col items-start justify-center gap-4"><h1 className="text-2xl font-semibold">مشکلی در دریافت اطلاعات رخ داد</h1><p className="text-ui-fg-subtle">Please try again. If the issue continues, return to the store later.</p><button onClick={reset} className="rounded-lg bg-teal-700 px-5 py-3 text-white hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">تلاش مجدد / Retry</button></div>
}
