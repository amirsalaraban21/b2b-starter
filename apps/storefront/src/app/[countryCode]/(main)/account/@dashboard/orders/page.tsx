import { listApprovals } from "@/lib/data/approvals"
import { retrieveCompany } from "@/lib/data/companies"
import { retrieveCustomer } from "@/lib/data/customer"
import { listOrders } from "@/lib/data/orders"
import { getManualPayment } from "@/lib/data/manual-payment"
import { getLocale } from "@/lib/i18n"
import { cookies } from "next/headers"
import OrderOverview from "@/modules/account/components/order-overview"
import PendingCustomerApprovals from "@/modules/account/components/pending-customer-approvals"
import { ApprovalStatusType } from "@/types/approval"
import { Heading } from "@medusajs/ui"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const customer = await retrieveCustomer()
  const orders = await listOrders()
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const payments = await Promise.all(
    orders.map((order) => getManualPayment(order.id).catch(() => null))
  )

  const { approval_settings } =
    (customer?.employee?.company_id
      ? await retrieveCompany(customer.employee.company_id)
      : null) || {}

  const approval_required =
    approval_settings?.requires_admin_approval ||
    approval_settings?.requires_sales_manager_approval

  const { carts_with_approvals } = customer?.employee
    ? await listApprovals({ status: ApprovalStatusType.PENDING }).catch(() => ({
        carts_with_approvals: [],
      }))
    : { carts_with_approvals: [] }

  return (
    <div
      className="w-full flex flex-col gap-y-4"
      data-testid="orders-page-wrapper"
    >
      <div className="mb-4">
        <Heading>{locale === "fa" ? "سفارش‌ها" : "Orders"}</Heading>
      </div>
      {approval_required && (
        <div>
          <Heading level="h2" className="text-neutral-700 mb-4">
            {locale === "fa" ? "تأییدهای در انتظار" : "Pending Approvals"}
          </Heading>

          <PendingCustomerApprovals cartsWithApprovals={carts_with_approvals} />
        </div>
      )}
      <div>
        <Heading level="h2" className="text-neutral-700 mb-4">
          {locale === "fa" ? "سفارش‌های ثبت‌شده" : "Orders"}
        </Heading>

        <OrderOverview orders={orders} payments={payments} locale={locale} />
      </div>
    </div>
  )
}
