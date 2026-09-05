"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [pathname, searchParams])

  useEffect(() => {
    if (!loading) return
    const fallback = window.setTimeout(() => setLoading(false), 10000)
    return () => window.clearTimeout(fallback)
  }, [loading])

  useEffect(() => {
    const beginNavigation = (event: globalThis.MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as HTMLElement).closest("a")
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return
      const target = new URL(anchor.href, window.location.href)
      const current = new URL(window.location.href)
      if (target.origin !== current.origin || (target.pathname === current.pathname && target.search === current.search)) return
      setLoading(true)
    }
    document.addEventListener("click", beginNavigation, true)
    return () => document.removeEventListener("click", beginNavigation, true)
  }, [])

  return (
    <div className={`pointer-events-none fixed inset-x-0 top-0 z-[1000] h-0.5 overflow-hidden transition-opacity duration-150 motion-reduce:transition-none ${loading ? "opacity-100" : "opacity-0"}`} role="progressbar" aria-label="Page navigation" aria-hidden={!loading}>
      <span className="navigation-progress-bar block h-full w-1/3 bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.7)] motion-reduce:w-full" />
    </div>
  )
}
