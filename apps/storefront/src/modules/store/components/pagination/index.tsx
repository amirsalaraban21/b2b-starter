"use client"

import { clx } from "@medusajs/ui"
import { getLocale, messages } from "@/lib/i18n"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function Pagination({
  page,
  totalPages,
  'data-testid': dataTestid
}: {
  page: number
  totalPages: number
  'data-testid'?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const locale = getLocale(typeof document === "undefined" ? undefined : document.documentElement.lang)
  const t = messages[locale]

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
      className={clx("grid h-10 min-w-10 place-items-center rounded-md px-2 text-sm text-ui-fg-muted transition hover:bg-ui-bg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700", {
        "bg-teal-700 text-white hover:bg-teal-800": isCurrent,
      })}
      disabled={isCurrent}
      aria-current={isCurrent ? "page" : undefined}
      aria-label={`${locale === "fa" ? "صفحه" : "Page"} ${p}`}
      onClick={() => handlePageChange(p)}
    >
      {label}
    </button>
  )

  // Function to render ellipsis
  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="txt-xlarge-plus text-ui-fg-muted items-center cursor-default"
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
    <nav className="flex justify-center w-full mt-10" aria-label={locale === "fa" ? "صفحه‌بندی محصولات" : "Product pagination"} dir={locale === "fa" ? "rtl" : "ltr"}>
      <div className="flex max-w-full items-center gap-1" data-testid={dataTestid}>
        <button className="hidden xsmall:inline-flex h-10 items-center rounded-md px-3 text-sm disabled:opacity-40 hover:bg-ui-bg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>{locale === "fa" ? "قبلی" : "Previous"}</button>
        {renderPageButtons()}
        <button className="hidden xsmall:inline-flex h-10 items-center rounded-md px-3 text-sm disabled:opacity-40 hover:bg-ui-bg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700" disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>{locale === "fa" ? "بعدی" : "Next"}</button>
      </div>
    </nav>
    </div>
  )
}
