"use client"

import { clx } from "@medusajs/ui"
import { Locale } from "@/lib/i18n"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function Pagination({
  page,
  totalPages,
  locale,
  'data-testid': dataTestid
}: {
  page: number
  totalPages: number
  locale: Locale
  'data-testid'?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const fa = locale === "fa"
  const formatPage = (value: number) => fa ? value.toLocaleString("fa-IR", { useGrouping: false }) : value

  // Helper function to generate an array of numbers within a range
  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`, { scroll: true })
  }

  // Function to render a page button
  const renderPageButton = (
    p: number,
    label: string | number,
    isCurrent: boolean
  ) => (
    <button
      key={p}
      className={clx("grid h-10 min-w-10 place-items-center rounded-lg border border-transparent px-2 text-sm font-semibold text-slate-600 transition duration-200 hover:border-slate-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 motion-reduce:transition-none dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800", {
        "border-teal-700 bg-teal-700 text-white shadow-sm hover:border-teal-800 hover:bg-teal-800 dark:text-white": isCurrent,
      })}
      disabled={isCurrent}
      aria-current={isCurrent ? "page" : undefined}
      aria-label={`${locale === "fa" ? "صفحه" : "Page"} ${p}`}
      onClick={() => handlePageChange(p)}
    >
      {typeof label === "number" ? formatPage(label) : label}
    </button>
  )

  // Function to render ellipsis
  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="flex h-10 min-w-7 cursor-default items-center justify-center text-slate-400"
    >
      ...
    </span>
  )

  // Function to render page buttons based on the current page and total pages
  const renderPageButtons = () => {
    const buttons = []

    if (totalPages <= 7) {
      // Show all pages
      buttons.push(
        ...arrayRange(1, totalPages).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
    } else {
      // Handle different cases for displaying pages and ellipses
      if (page <= 4) {
        // Show 1, 2, 3, 4, 5, ..., lastpage
        buttons.push(
          ...arrayRange(1, 5).map((p) => renderPageButton(p, p, p === page))
        )
        buttons.push(renderEllipsis("ellipsis1"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      } else if (page >= totalPages - 3) {
        // Show 1, ..., lastpage - 4, lastpage - 3, lastpage - 2, lastpage - 1, lastpage
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis2"))
        buttons.push(
          ...arrayRange(totalPages - 4, totalPages).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
      } else {
        // Show 1, ..., page - 1, page, page + 1, ..., lastpage
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis3"))
        buttons.push(
          ...arrayRange(page - 1, page + 1).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
        buttons.push(renderEllipsis("ellipsis4"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      }
    }

    return buttons
  }

  // Render the component
  return (
    <nav className="mt-8 flex w-full justify-center" aria-label={fa ? "صفحه‌بندی محصولات" : "Product pagination"} dir={fa ? "rtl" : "ltr"}>
      <div className="flex max-w-full items-center gap-1 rounded-xl bg-slate-50 p-1.5 dark:bg-slate-900" data-testid={dataTestid}>
        <button aria-label={fa ? "صفحه قبلی" : "Previous page"} className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-lg transition duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 motion-reduce:transition-none dark:hover:bg-slate-800" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}><span aria-hidden="true">{fa ? "›" : "‹"}</span><span className="sr-only">{fa ? "قبلی" : "Previous"}</span></button>
        {renderPageButtons()}
        <button aria-label={fa ? "صفحه بعدی" : "Next page"} className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-lg transition duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 motion-reduce:transition-none dark:hover:bg-slate-800" disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}><span aria-hidden="true">{fa ? "‹" : "›"}</span><span className="sr-only">{fa ? "بعدی" : "Next"}</span></button>
      </div>
    </nav>
  )
}
