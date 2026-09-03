"use server"

import { sdk } from "@/lib/config"
import { getAuthHeaders, getCacheTag, removeCartId } from "@/lib/data/cookies"
import {
  initiatePaymentSession,
  retrieveCart,
  updateCart,
} from "@/lib/data/cart"
import { listCartPaymentMethods } from "@/lib/data/payment"
import { retrieveCustomer } from "@/lib/data/customer"
import type { Locale } from "@/lib/i18n"
import {
  isIranianPostalCode,
  normalizeIranianMobile,
  normalizeIranianPostalCode,
} from "@/lib/iran"
import { revalidateTag } from "next/cache"

export type ManualPaymentStatus =
  | "awaiting_payment"
  | "receipt_submitted"
  | "under_review"
  | "approved"
  | "rejected"
export type ManualPayment = {
  id: string
  order_id: string
  amount: number
  currency_code: string
  status: ManualPaymentStatus
  receipt_exists: boolean
  receipt_mime_type?: string | null
  payer_name?: string | null
  payment_reference?: string | null
  created_at: string
  updated_at: string
}
export type ManualPaymentConfig = {
  configured: boolean
  card_number?: string
  account_holder?: string
  bank_name?: string | null
  instructions?: string | null
}

const apiError = async (response: Response) => {
  const body = await response.json().catch(() => ({}))
  throw new Error(body.message || `Request failed (${response.status})`)
}

export const getManualPaymentConfig = async (locale: Locale) =>
  sdk.client.fetch<ManualPaymentConfig>("/store/manual-payment/config", {
    method: "GET",
    query: { locale },
  })

export const getManualPayment = async (orderId: string) => {
  const headers = await getAuthHeaders()
  return sdk.client
    .fetch<{ manual_payment: ManualPayment }>(
      `/store/orders/${orderId}/manual-payment`,
      { method: "GET", headers }
    )
    .then((data) => data.manual_payment)
}

export const saveCheckoutAddress = async (formData: FormData) => {
  const customer = await retrieveCustomer()
  if (!customer) throw new Error("UNAUTHORIZED")
  const phone = normalizeIranianMobile(String(formData.get("phone") || ""))
  const postalCode = normalizeIranianPostalCode(
    String(formData.get("postal_code") || "")
  )
  if (!phone) throw new Error("INVALID_MOBILE")
  if (!isIranianPostalCode(postalCode)) throw new Error("INVALID_POSTAL_CODE")
  const required = [
    "first_name",
    "last_name",
    "province",
    "city",
    "address_1",
  ] as const
  if (required.some((key) => !String(formData.get(key) || "").trim()))
    throw new Error("INCOMPLETE_ADDRESS")
  const address = {
    first_name: String(formData.get("first_name")).trim(),
    last_name: String(formData.get("last_name")).trim(),
    phone,
    province: String(formData.get("province")).trim(),
    city: String(formData.get("city")).trim(),
    address_1: String(formData.get("address_1")).trim(),
    postal_code: postalCode,
    country_code: "ir",
  }
  await updateCart({
    email: customer.email,
    shipping_address: address,
    billing_address: address,
  })
}

export const completeManualCheckout = async (cartId: string) => {
  let freshCart = await retrieveCart(cartId)
  if (!freshCart || freshCart.completed_at) throw new Error("CART_CHANGED")
  if (
    !freshCart.shipping_address ||
    !freshCart.billing_address ||
    !freshCart.email
  )
    throw new Error("INCOMPLETE_ADDRESS")
  if (!freshCart.shipping_methods?.length) throw new Error("MISSING_SHIPPING")
  const phone = normalizeIranianMobile(freshCart.shipping_address.phone || "")
  if (
    !phone ||
    !isIranianPostalCode(freshCart.shipping_address.postal_code || "")
  )
    throw new Error("INVALID_ADDRESS")
  const paymentProviders = await listCartPaymentMethods(
    freshCart.region_id || freshCart.region?.id || ""
  )
  const manualProvider = paymentProviders?.find((provider) =>
    provider.id.startsWith("pp_system_default")
  )
  if (!manualProvider) throw new Error("MISSING_MANUAL_PROVIDER")
  const activeSession = freshCart.payment_collection?.payment_sessions?.find(
    (session) => session.status === "pending"
  )
  if (!activeSession || activeSession.provider_id !== manualProvider.id) {
    await initiatePaymentSession(freshCart, { provider_id: manualProvider.id })
    freshCart = await retrieveCart(cartId)
    if (!freshCart) throw new Error("CART_CHANGED")
  }
  const headers = await getAuthHeaders()
  const response = await sdk.store.cart.complete(cartId, {}, headers)
  if (response.type === "cart") throw new Error(response.error.message)
  const payment = await sdk.client
    .fetch<{ manual_payment: ManualPayment }>(
      `/store/orders/${response.order.id}/manual-payment`,
      { method: "POST", headers, body: {} }
    )
    .then((data) => data.manual_payment)
  await removeCartId()
  for (const tagName of ["carts", "orders"]) {
    const tag = await getCacheTag(tagName)
    if (tag) revalidateTag(tag)
  }
  return { orderId: response.order.id, payment }
}

export const uploadManualPaymentReceipt = async (
  orderId: string,
  formData: FormData
) => {
  const headers = (await getAuthHeaders()) as Record<string, string>
  const backend =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  const response = await fetch(
    `${backend}/store/orders/${orderId}/manual-payment/receipt`,
    {
      method: "POST",
      body: formData,
      cache: "no-store",
      headers: {
        ...headers,
        ...(publishableKey ? { "x-publishable-api-key": publishableKey } : {}),
      },
    }
  )
  if (!response.ok) return apiError(response)
  return (await response.json()) as { manual_payment: ManualPayment }
}
