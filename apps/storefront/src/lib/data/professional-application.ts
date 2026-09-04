"use server"

import { sdk } from "@/lib/config"
import { getAuthHeaders } from "@/lib/data/cookies"

export type ProfessionalApplication = {
  id: string
  status: "pending" | "approved" | "rejected" | "needs_information"
  professional_type: string
  organization_name?: string | null
  professional_identifier?: string | null
  city?: string | null
  submitted_at?: string
  reviewed_at?: string | null
  customer_feedback?: string | null
}

export const getProfessionalApplication = async () => {
  const headers = await getAuthHeaders()
  return sdk.client
    .fetch<{ application: ProfessionalApplication }>(
      "/store/professional-applications/me",
      { method: "GET", headers }
    )
    .then(({ application }) => application)
    .catch((error) => {
      if (error?.status === 404) return null
      throw error
    })
}
