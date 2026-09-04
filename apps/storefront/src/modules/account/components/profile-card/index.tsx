"use client"

import { updateCustomer } from "@/lib/data/customer"
import { Locale } from "@/lib/i18n"
import { normalizeIranianMobile } from "@/lib/iran"
import Button from "@/modules/common/components/button"
import Input from "@/modules/common/components/input"
import { B2BCustomer } from "@/types/global"
import { Container, Text, toast } from "@medusajs/ui"
import { useState } from "react"

const ProfileCard = ({
  customer,
  locale,
}: {
  customer: B2BCustomer
  locale: Locale
}) => {
  const fa = locale === "fa"
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    first_name: customer.first_name || "",
    last_name: customer.last_name || "",
    email: customer.email,
    phone: customer.phone || "",
  })
  const save = async () => {
    const phone = normalizeIranianMobile(data.phone)
    if (!phone)
      return toast.error(
        fa
          ? "شماره موبایل ایران معتبر نیست."
          : "Enter a valid Iranian mobile number."
      )
    setSaving(true)
    try {
      await updateCustomer({
        first_name: data.first_name,
        last_name: data.last_name,
        phone,
      })
      toast.success(fa ? "اطلاعات حساب ذخیره شد." : "Account details saved.")
      setEditing(false)
    } catch {
      toast.error(
        fa ? "ذخیره اطلاعات انجام نشد." : "Could not save account details."
      )
    } finally {
      setSaving(false)
    }
  }
  const fields = [
    { key: "first_name", label: fa ? "نام" : "First name" },
    { key: "last_name", label: fa ? "نام خانوادگی" : "Last name" },
    { key: "email", label: fa ? "ایمیل" : "Email" },
    { key: "phone", label: fa ? "موبایل" : "Mobile" },
  ] as const
  return (
    <Container className="overflow-hidden p-0">
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key}>
            <Text size="small" weight="plus">
              {field.label}
            </Text>
            {editing && field.key !== "email" ? (
              <Input
                className="mt-2"
                label={field.label}
                name={field.key}
                type="text"
                autoComplete={field.key === "phone" ? "tel" : undefined}
                value={data[field.key]}
                onChange={(event) =>
                  setData({ ...data, [field.key]: event.target.value })
                }
              />
            ) : (
              <Text className="mt-2 text-ui-fg-subtle">
                {data[field.key] || "—"}
              </Text>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 border-t bg-ui-bg-subtle p-4">
        {editing ? (
          <>
            <Button
              variant="secondary"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              {fa ? "انصراف" : "Cancel"}
            </Button>
            <Button onClick={() => void save()} isLoading={saving}>
              {fa ? "ذخیره" : "Save"}
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={() => setEditing(true)}>
            {fa ? "ویرایش" : "Edit"}
          </Button>
        )}
      </div>
    </Container>
  )
}
export default ProfileCard
