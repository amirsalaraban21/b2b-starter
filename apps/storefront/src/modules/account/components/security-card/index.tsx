"use client"

import Button from "@/modules/common/components/button"
import { B2BCustomer } from "@/types"
import { Container, Text, toast } from "@medusajs/ui"
import { Locale } from "@/lib/i18n"

const SecurityCard = ({ customer: _customer, locale }: { customer: B2BCustomer; locale: Locale }) => {
  const fa = locale === "fa"
  return (
    <div className="h-fit">
      <Container className="overflow-hidden border border-slate-200 bg-white p-0 text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50">
        <div className="grid gap-4 border-b border-slate-200 p-5 dark:border-slate-800 xsmall:grid-cols-2">
          <div className="flex flex-col gap-y-2">
            <Text className="font-medium text-slate-950 dark:text-slate-50">{fa ? "رمز عبور" : "Password"}</Text>
            <Text className="text-slate-500 dark:text-slate-400">***************</Text>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 bg-slate-50 p-4 dark:bg-slate-950/60">
          <Button
            variant="secondary"
            onClick={() => toast.info(fa ? "ویرایش رمز عبور هنوز فعال نیست." : "Password editing is not available yet.")}
          >
            {fa ? "ویرایش" : "Edit"}
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default SecurityCard
