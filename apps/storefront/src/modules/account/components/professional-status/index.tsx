"use client"

import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { useEffect, useState } from "react"

type Application = { status: "pending" | "approved" | "rejected" | "needs_information"; submitted_at?: string; customer_feedback?: string | null }
export default function ProfessionalStatus() {
  const [application, setApplication] = useState<Application | null>(null); const [loaded, setLoaded] = useState(false); const [failed, setFailed] = useState(false)
  useEffect(() => { fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/professional-applications/me`, { credentials: "include" }).then(async response => { if (response.status === 404) return null; if (!response.ok) throw new Error(); return (await response.json()).application }).then(setApplication).catch(() => setFailed(true)).finally(() => setLoaded(true)) }, [])
  if (!loaded) return <div className="h-28 animate-pulse rounded-xl bg-ui-bg-subtle" />
  if (failed) return <section className="rounded-xl border border-ui-border-base p-5 text-sm text-ui-fg-subtle">Professional status is temporarily unavailable.</section>
  const text = application?.status === "approved" ? "Professional application approved" : application?.status === "pending" ? "Professional application pending review" : application?.status === "needs_information" ? "Additional information is required" : application?.status === "rejected" ? "Professional application was not approved" : "Apply for professional purchasing"
  return <section className="rounded-xl border border-ui-border-base bg-ui-bg-subtle p-5"><h3 className="font-semibold">Professional status</h3><p className="mt-2 text-sm text-ui-fg-subtle">{text}</p>{application?.submitted_at && <p className="mt-1 text-xs text-ui-fg-muted">Submitted {new Date(application.submitted_at).toLocaleDateString()}</p>}{application?.customer_feedback && <p className="mt-3 text-sm">{application.customer_feedback}</p>}{!application && <LocalizedClientLink href="/professional" className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline">Apply now</LocalizedClientLink>}</section>
}
