"use server"

import { sdk } from "@/lib/config"
import { getAuthHeaders } from "@/lib/data/cookies"
import { revalidatePath } from "next/cache"

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

export type ProfessionalApplicationFormState = {
  success: boolean
  error: string | null
}

export const submitProfessionalApplication = async (
  _state: ProfessionalApplicationFormState,
  formData: FormData
): Promise<ProfessionalApplicationFormState> => {
  const body = Object.fromEntries(
    [
      "first_name",
      "last_name",
      "phone",
      "email",
      "professional_type",
      "organization_name",
      "professional_identifier",
      "city",
      "notes",
    ].map((key) => [key, String(formData.get(key) || "")])
  )
  try {
    await sdk.client.fetch("/store/professional-applications", {
      method: "POST",
      headers: await getAuthHeaders(),
      body,
    })
    revalidatePath("/account/professional")
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to submit application.",
    }
  }
}
