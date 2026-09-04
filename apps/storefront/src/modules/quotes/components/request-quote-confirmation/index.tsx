"use client"

import { createQuote } from "@/lib/data/quotes"
import { XCircle } from "@medusajs/icons"
import { toast } from "@medusajs/ui"
import Button from "@/modules/common/components/button"
import * as Dialog from "@radix-ui/react-dialog"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Locale } from "@/lib/i18n"

export const RequestQuoteConfirmation = ({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: Locale
}) => {
  const [requesting, setRequesting] = useState(false)
  const [open, setOpen] = useState(false)
  const { countryCode } = useParams()
  const router = useRouter()
  const fa = locale === "fa"

  const handleCreateQuoteRequest = async () => {
    setRequesting(true)

    try {
      const { quote } = await createQuote()

      router.push(`/${countryCode}/account/quotes/details/${quote.id}`)
    } catch (error) {
      setRequesting(false)
      toast.error(
        fa
          ? "ثبت درخواست پیش‌فاکتور انجام نشد"
          : "Failed to create quote request"
      )
    }

    setOpen(false)
    setRequesting(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-[75]" />
        <Dialog.Content className="z-[100] data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-lg mb-6 flex justify-between">
            {fa ? "ثبت درخواست پیش‌فاکتور" : "Submit request for quote"}
            <Dialog.Close asChild>
              <XCircle className="text-violet11 hover:bg-violet4 focus:shadow-violet7 inline-flex appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] outline-none cursor-pointer" />
            </Dialog.Close>
          </Dialog.Title>

          <div className="flex flex-col gap-y-4">
            <p>
              {fa
                ? "برای کالاهای فعلی سبد خرید یک درخواست پیش‌فاکتور ثبت می‌شود. خرید عادی همچنان در دسترس است."
                : "A quote request will be created for the items currently in your cart. Normal checkout remains available."}
            </p>
          </div>

          <div className="mt-[25px] flex justify-end gap-x-2">
            <Dialog.Close asChild>
              <Button variant="secondary" disabled={requesting}>
                {fa ? "انصراف" : "Cancel"}
              </Button>
            </Dialog.Close>

            <Button onClick={handleCreateQuoteRequest} isLoading={requesting}>
              {fa ? "ثبت درخواست" : "Submit"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
