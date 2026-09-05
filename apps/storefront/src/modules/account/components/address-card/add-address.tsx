"use client"

import { addCustomerAddress } from "@/lib/data/customer"
import useToggleState from "@/lib/hooks/use-toggle-state"
import CountrySelect from "@/modules/checkout/components/country-select"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Button from "@/modules/common/components/button"
import Input from "@/modules/common/components/input"
import Modal from "@/modules/common/components/modal"
import { Plus } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { useActionState, useEffect, useState } from "react"
import { iranProvinces } from "@/lib/iran"
import { Locale } from "@/lib/i18n"

const AddAddress = ({
  region,
  locale,
}: {
  region: HttpTypes.StoreRegion
  locale: Locale
}) => {
  const fa = locale === "fa"
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
    success: false,
    error: null,
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

  return (
    <>
      <button
        className="border border-ui-border-base rounded-rounded p-5 min-h-[220px] h-full w-full flex flex-col justify-between"
        onClick={open}
        data-testid="add-address-button"
      >
        <span className="text-base-semi">
          {fa ? "آدرس جدید" : "New address"}
        </span>
        <Plus />
      </button>

      <Modal isOpen={state} close={close} data-testid="add-address-modal">
        <Modal.Title>
          <Heading className="mb-2">
            {fa ? "افزودن آدرس" : "Add address"}
          </Heading>
        </Modal.Title>
        <form action={formAction}>
          <input type="hidden" name="locale" value={locale} />
          <Modal.Body>
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-1 gap-2 xsmall:grid-cols-2">
                <Input
                  label={fa ? "نام" : "First name"}
                  name="first_name"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label={fa ? "نام خانوادگی" : "Last name"}
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label={fa ? "شرکت (اختیاری)" : "Company (optional)"}
                name="company"
                autoComplete="organization"
                data-testid="company-input"
              />
              <Input
                label={fa ? "نشانی" : "Address"}
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />
              <Input
                label={
                  fa ? "پلاک، واحد و توضیحات تکمیلی" : "Apartment, suite, etc."
                }
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-1 gap-2 xsmall:grid-cols-[144px_1fr]">
                <Input
                  label={fa ? "کد پستی" : "Postal code"}
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                />
                <Input
                  label={fa ? "شهر" : "City"}
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                />
              </div>
              <label className="flex flex-col gap-y-2 text-small-regular">
                {fa ? "استان" : "Province"}
                <select
                  required
                  name="province"
                  autoComplete="address-level1"
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
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />
              <Input
                label={fa ? "شماره موبایل" : "Mobile number"}
                name="phone"
                autoComplete="phone"
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div
                className="text-rose-500 text-small-regular py-2"
                data-testid="address-error"
              >
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
                {fa ? "ذخیره آدرس" : "Save address"}
              </SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddAddress
