import AddressSelect from "@/modules/checkout/components/address-select"
import CountrySelect from "@/modules/checkout/components/country-select"
import Input from "@/modules/common/components/input"
import { B2BCart, B2BCustomer } from "@/types"
import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import { mapKeys } from "lodash"
import { iranProvinces, isIranianPostalCode, normalizeIranianMobile, normalizeIranianPostalCode } from "@/lib/iran"
import React, { useEffect, useMemo, useState } from "react"

const ShippingAddressForm = ({
  customer,
  cart,
}: {
  customer: B2BCustomer | null
  cart: B2BCart | null
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    "shipping_address.first_name": "",
    "shipping_address.last_name": "",
    "shipping_address.address_1": "",
    "shipping_address.company": cart?.company?.name || "",
    "shipping_address.postal_code": "",
    "shipping_address.city": "",
    "shipping_address.country_code": "",
    "shipping_address.province": "",
    "shipping_address.phone": "",
    email: "",
  })
  const [errors, setErrors] = useState<{ phone?: string; postal?: string }>({})

  const countriesInRegion = useMemo(
    () => cart?.region?.countries?.map((c) => c.iso_2),
    [cart?.region]
  )

  // check if customer has saved addresses that are in the current region
  const addressesInRegion = useMemo(
    () =>
      customer?.addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code)
      ),
    [customer?.addresses, countriesInRegion]
  )

  const setFormAddress = (
    address?: HttpTypes.StoreCartAddress,
    email?: string
  ) => {
    address &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        "shipping_address.first_name": address?.first_name?.toString() || "",
        "shipping_address.last_name": address?.last_name?.toString() || "",
        "shipping_address.address_1": address?.address_1?.toString() || "",
        "shipping_address.company": address?.company?.toString() || "",
        "shipping_address.postal_code": address?.postal_code?.toString() || "",
        "shipping_address.city": address?.city?.toString() || "",
        "shipping_address.country_code":
          address?.country_code?.toString() || "",
        "shipping_address.province": address?.province?.toString() || "",
        "shipping_address.phone": address?.phone?.toString() || "",
      }))

    email &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        email: email.toString() || "",
      }))
  }

  useEffect(() => {
    if (cart && cart.shipping_address) {
      setFormAddress(cart?.shipping_address)
    }
  }, [cart])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const iranField = e.target.name === "shipping_address.phone" ? normalizeIranianMobile(e.target.value) || e.target.value : e.target.name === "shipping_address.postal_code" ? normalizeIranianPostalCode(e.target.value) : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: iranField,
    })
    if (e.target.name === "shipping_address.phone") setErrors((current) => ({ ...current, phone: e.target.value && !normalizeIranianMobile(e.target.value) ? (document.documentElement.lang === "fa" ? "شماره موبایل ایران نامعتبر است." : "Enter a valid Iranian mobile number.") : undefined }))
    if (e.target.name === "shipping_address.postal_code") setErrors((current) => ({ ...current, postal: e.target.value && !isIranianPostalCode(e.target.value) ? (document.documentElement.lang === "fa" ? "کد پستی باید ۱۰ رقم باشد." : "Postal code must contain 10 digits.") : undefined }))
  }

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </p>
          <AddressSelect
            addresses={customer.addresses}
            addressInput={
              mapKeys(formData, (_, key) =>
                key.replace("shipping_address.", "")
              ) as HttpTypes.StoreCartAddress
            }
            onSelect={setFormAddress}
          />
        </Container>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-first-name-input"
        />
        <Input
          label="Last name"
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-last-name-input"
        />
        <Input
          label="Phone"
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          required
          data-testid="shipping-phone-input"
          pattern="^\\+989\\d{9}$"
        />
        {errors.phone && <p className="col-span-2 text-sm text-ui-fg-error" role="alert">{errors.phone}</p>}
        <Input
          label="Company name"
          name="shipping_address.company"
          value={formData["shipping_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="shipping-company-input"
          colSpan={2}
        />
        <Input
          label="Address"
          name="shipping_address.address_1"
          autoComplete="address-line1"
          value={formData["shipping_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="shipping-address-input"
          colSpan={2}
        />
        <Input
          label="Postal code"
          name="shipping_address.postal_code"
          autoComplete="postal-code"
          value={formData["shipping_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="shipping-postal-code-input"
          pattern="^\\d{10}$"
          colSpan={2}
        />
        {errors.postal && <p className="col-span-2 text-sm text-ui-fg-error" role="alert">{errors.postal}</p>}
        <div className="grid small:grid-cols-3 grid-cols-2 gap-4 col-span-2">
          <Input
            label="City"
            name="shipping_address.city"
            autoComplete="address-level2"
            value={formData["shipping_address.city"]}
            onChange={handleChange}
            required
            data-testid="shipping-city-input"
          />
          <label className="flex flex-col gap-y-2 text-small-regular"><span>Province</span><select required name="shipping_address.province" autoComplete="address-level1" value={formData["shipping_address.province"]} onChange={handleChange} className="h-10 rounded-rounded border border-ui-border-base bg-ui-bg-base px-3" data-testid="shipping-province-input"><option value="">Select province</option>{iranProvinces.map(([fa, en]) => <option key={en} value={en}>{document.documentElement.lang === "fa" ? fa : en}</option>)}</select></label>
          <CountrySelect
            className="col-span-2"
            name="shipping_address.country_code"
            autoComplete="country"
            region={cart?.region}
            value={formData["shipping_address.country_code"]}
            onChange={handleChange}
            required
            data-testid="shipping-country-select"
          />
        </div>
      </div>
    </>
  )
}

export default ShippingAddressForm
