"use client"

import {
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@/lib/data/customer"
import useToggleState from "@/lib/hooks/use-toggle-state"
import CountrySelect from "@/modules/checkout/components/country-select"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Button from "@/modules/common/components/button"
import Input from "@/modules/common/components/input"
import Modal from "@/modules/common/components/modal"
import Spinner from "@/modules/common/icons/spinner"
import { B2BCustomer } from "@/types/global"
import { PencilSquare as Edit, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, clx } from "@medusajs/ui"
import React, { useActionState, useEffect, useState } from "react"
import { iranProvinces } from "@/lib/iran"
import { Locale } from "@/lib/i18n"

type EditAddressProps = {
  region: HttpTypes.StoreRegion
  address: HttpTypes.StoreCustomerAddress
  customer: B2BCustomer
  isActive?: boolean
  locale: Locale
}

const EditAddress: React.FC<EditAddressProps> = ({
  region,
  address,
  customer,
  isActive = false,
  locale,
}) => {
  const fa = locale === "fa"
  const [removing, setRemoving] = useState(false)
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(updateCustomerAddress, {
    success: false,
    error: null,
    addressId: address.id,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  const removeAddress = async () => {
    setRemoving(true)
    await deleteCustomerAddress(address.id)
    setRemoving(false)
  }

  return (
    <>
      <div
        className={clx(
          "border rounded-rounded p-5 min-h-[220px] h-full w-full flex flex-col justify-between transition-colors",
          {
            "border-gray-900": isActive,
          }
        )}
        data-testid="address-container"
      >
        <div className="flex flex-col">
          <Heading
            className="break-words text-start text-base-semi"
            data-testid="address-name"
          >
            {address.first_name} {address.last_name}
          </Heading>
          {address.company && (
            <Text
              className="break-words txt-compact-small text-ui-fg-base"
              data-testid="address-company"
            >
              {address.company}
            </Text>
          )}
          <Text className="flex flex-col break-words text-start text-base-regular mt-2">
            <span data-testid="address-address">
              {address.address_1}
              {address.address_2 && <span>, {address.address_2}</span>}
            </span>
            <span data-testid="address-postal-city">
              {address.postal_code}, {address.city}
            </span>
            <span data-testid="address-province-country">
              {address.province && `${address.province}, `}
              {address.country_code?.toUpperCase()}
            </span>
          </Text>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            className="text-small-regular text-ui-fg-base flex items-center gap-x-2"
            onClick={open}
            data-testid="address-edit-button"
          >
            <Edit />
            {fa ? "ویرایش" : "Edit"}
          </button>
          <button
            className="text-small-regular text-ui-fg-base flex items-center gap-x-2"
            onClick={removeAddress}
            data-testid="address-delete-button"
          >
            {removing ? <Spinner /> : <Trash />}
            {fa ? "حذف" : "Remove"}
          </button>
        </div>
      </div>

      <Modal isOpen={state} close={close} data-testid="edit-address-modal">
        <Modal.Title>
          <Heading className="mb-2">
            {fa ? "ویرایش آدرس" : "Edit address"}
          </Heading>
        </Modal.Title>
        <form action={formAction}>
          <input type="hidden" name="locale" value={locale} />
          <Modal.Body>
            <div className="grid grid-cols-1 gap-y-2">
              <div className="grid grid-cols-1 gap-2 xsmall:grid-cols-2">
                <Input
                  label={fa ? "نام" : "First name"}
                  name="first_name"
                  required
                  autoComplete="given-name"
                  defaultValue={address.first_name || undefined}
                  data-testid="first-name-input"
                />
                <Input
                  label={fa ? "نام خانوادگی" : "Last name"}
                  name="last_name"
                  required
                  autoComplete="family-name"
                  defaultValue={address.last_name || undefined}
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label={fa ? "شرکت (اختیاری)" : "Company (optional)"}
                name="company"
                autoComplete="organization"
                defaultValue={address.company || undefined}
                data-testid="company-input"
              />
              <Input
                label={fa ? "نشانی" : "Address"}
                name="address_1"
                required
                autoComplete="address-line1"
                defaultValue={address.address_1 || undefined}
                data-testid="address-1-input"
              />
              <Input
                label={
                  fa ? "پلاک، واحد و توضیحات تکمیلی" : "Apartment, suite, etc."
                }
                name="address_2"
                autoComplete="address-line2"
                defaultValue={address.address_2 || undefined}
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-1 gap-2 xsmall:grid-cols-[144px_1fr]">
                <Input
                  label={fa ? "کد پستی" : "Postal code"}
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  defaultValue={address.postal_code || undefined}
                  data-testid="postal-code-input"
                />
                <Input
                  label={fa ? "شهر" : "City"}
                  name="city"
                  required
                  autoComplete="locality"
                  defaultValue={address.city || undefined}
                  data-testid="city-input"
                />
              </div>
              <label className="flex flex-col gap-y-2 text-small-regular">
                {fa ? "استان" : "Province"}
                <select
                  required
                  name="province"
                  autoComplete="address-level1"
                  defaultValue={address.province || undefined}
                  className="h-10 rounded-rounded border border-ui-border-base bg-ui-bg-base px-3"
                  data-testid="state-input"
                >
                  <option value="">
                    {fa ? "انتخاب استان" : "Select province"}
                  </option>
                  {iranProvinces.map(([faName, en]) => (
                    <option key={en} value={en}>
                      {fa ? faName : en}
                    </option>
                  ))}
                </select>
              </label>
              <CountrySelect
                name="country_code"
                region={region}
                required
                autoComplete="country"
                defaultValue={address.country_code || undefined}
                data-testid="country-select"
              />
              <Input
                label={fa ? "شماره موبایل" : "Mobile number"}
                name="phone"
                autoComplete="phone"
                defaultValue={address.phone || undefined}
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div className="text-rose-500 text-small-regular py-2">
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 mt-6">
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className="h-10"
                data-testid="cancel-button"
              >
                {fa ? "انصراف" : "Cancel"}
              </Button>
              <SubmitButton data-testid="save-button">
                {fa ? "ذخیره تغییرات" : "Save changes"}
              </SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default EditAddress
