import CountrySelect from "@/modules/checkout/components/country-select"
import Input from "@/modules/common/components/input"
import { B2BCart } from "@/types"
import React, { useEffect, useState } from "react"
import { iranProvinces, isIranianPostalCode, normalizeIranianMobile, normalizeIranianPostalCode } from "@/lib/iran"

const BillingAddressForm = ({ cart }: { cart: B2BCart | null }) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    "billing_address.first_name": "",
    "billing_address.last_name": "",
    "billing_address.address_1": "",
    "billing_address.company": cart?.company?.name || "",
    "billing_address.postal_code": "",
    "billing_address.city": "",
    "billing_address.country_code": "",
    "billing_address.province": "",
    "billing_address.phone": "",
  })
  const [errors, setErrors] = useState<{ phone?: string; postal?: string }>({})

  useEffect(() => {
    if (cart?.billing_address) {
      setFormData({
        "billing_address.first_name": cart.billing_address.first_name || "",
        "billing_address.last_name": cart.billing_address.last_name || "",
        "billing_address.address_1": cart.billing_address.address_1 || "",
        "billing_address.company": cart.billing_address.company || "",
        "billing_address.postal_code": cart.billing_address.postal_code || "",
        "billing_address.city": cart.billing_address.city || "",
        "billing_address.country_code": cart.billing_address.country_code || "",
        "billing_address.province": cart.billing_address.province || "",
        "billing_address.phone": cart.billing_address.phone || "",
      })
    }
  }, [cart?.billing_address])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const iranField = e.target.name === "billing_address.phone" ? normalizeIranianMobile(e.target.value) || e.target.value : e.target.name === "billing_address.postal_code" ? normalizeIranianPostalCode(e.target.value) : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: iranField,
    })
    if (e.target.name === "billing_address.phone") setErrors((current) => ({ ...current, phone: e.target.value && !normalizeIranianMobile(e.target.value) ? (document.documentElement.lang === "fa" ? "شماره موبایل ایران نامعتبر است." : "Enter a valid Iranian mobile number.") : undefined }))
    if (e.target.name === "billing_address.postal_code") setErrors((current) => ({ ...current, postal: e.target.value && !isIranianPostalCode(e.target.value) ? (document.documentElement.lang === "fa" ? "کد پستی باید ۱۰ رقم باشد." : "Postal code must contain 10 digits.") : undefined }))
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          name="billing_address.first_name"
          autoComplete="given-name"
          value={formData["billing_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="billing-first-name-input"
        />
        <Input
          label="Last name"
          name="billing_address.last_name"
          autoComplete="family-name"
          value={formData["billing_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="billing-last-name-input"
        />
        <Input
          label="Phone"
          name="billing_address.phone"
          autoComplete="tel"
          value={formData["billing_address.phone"]}
          onChange={handleChange}
          required
          data-testid="billing-phone-input"
          pattern="^\\+989\\d{9}$"
        />
        {errors.phone && <p className="col-span-2 text-sm text-ui-fg-error" role="alert">{errors.phone}</p>}
        <Input
          label="Company name"
          name="billing_address.company"
          value={formData["billing_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="billing-company-input"
          colSpan={2}
        />
        <Input
          label="Address"
          name="billing_address.address_1"
          autoComplete="address-line1"
          value={formData["billing_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="billing-address-input"
          colSpan={2}
        />
        <Input
          label="Postal code"
          name="billing_address.postal_code"
          autoComplete="postal-code"
          value={formData["billing_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="billing-postal-code-input"
          pattern="^\\d{10}$"
          colSpan={2}
        />
        {errors.postal && <p className="col-span-2 text-sm text-ui-fg-error" role="alert">{errors.postal}</p>}
        <div className="grid small:grid-cols-3 grid-cols-2 gap-4 col-span-2">
          <Input
            label="City"
            name="billing_address.city"
            autoComplete="address-level2"
            value={formData["billing_address.city"]}
            onChange={handleChange}
            required
            data-testid="billing-city-input"
          />
          <label className="flex flex-col gap-y-2 text-small-regular"><span>Province</span><select required name="billing_address.province" autoComplete="address-level1" value={formData["billing_address.province"]} onChange={handleChange} className="h-10 rounded-rounded border border-ui-border-base bg-ui-bg-base px-3" data-testid="billing-province-input"><option value="">Select province</option>{iranProvinces.map(([fa, en]) => <option key={en} value={en}>{document.documentElement.lang === "fa" ? fa : en}</option>)}</select></label>
          <CountrySelect
            name="billing_address.country_code"
            autoComplete="country"
            region={cart?.region}
            value={formData["billing_address.country_code"]}
            onChange={handleChange}
            required
            data-testid="billing-country-select"
          />
        </div>
      </div>
    </>
  )
}

export default BillingAddressForm
