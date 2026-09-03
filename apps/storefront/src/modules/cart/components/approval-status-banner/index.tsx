import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { B2BCart } from "@/types"
import { ApprovalStatusType } from "@/types/approval"
import { CheckMini, LockClosedSolid, XMarkMini } from "@medusajs/icons"
import { Container, Text } from "@medusajs/ui"
import { Locale } from "@/lib/i18n"

const ApprovalStatusBanner = ({ cart, locale = "en" }: { cart: B2BCart; locale?: Locale }) => {
  const cartApprovalStatus = cart.approval_status?.status
  const fa = locale === "fa"

  if (!cartApprovalStatus) {
    return null
  }

  return (
    <Container className="flex gap-2 self-stretch relative w-full h-fit overflow-hidden items-center">
      {cartApprovalStatus === ApprovalStatusType.PENDING && (
        <>
          <LockClosedSolid className="w-4 h-4" />
          <Text>{fa ? "این سبد خرید برای بررسی تأیید قفل شده است." : "This cart is locked for approval."}</Text>
        </>
      )}

      {cartApprovalStatus === ApprovalStatusType.REJECTED && (
        <>
          <XMarkMini className="w-4 h-4" />
          <Text>
            {fa ? "این سبد خرید تأیید نشده است. می‌توانید دوباره از " : "This cart has been rejected. You can re-request approval from the "}
            <LocalizedClientLink
              href="/checkout"
              className="text-ui-bg-interactive hover:text-ui-fg-interactive-hover"
            >
              {fa ? "صفحه ثبت سفارش" : "checkout page"}
            </LocalizedClientLink>
            {fa ? " درخواست بررسی کنید." : "."}
          </Text>
        </>
      )}

      {cartApprovalStatus === ApprovalStatusType.APPROVED && (
        <>
          <CheckMini className="w-4 h-4" />
          <Text>{fa ? "این سبد خرید تأیید شده و آماده تکمیل است." : "This cart has been approved and can now be completed."}</Text>
        </>
      )}
    </Container>
  )
}

export default ApprovalStatusBanner
