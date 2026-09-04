import { listApprovals } from "@/lib/data/approvals"
import AccountNav from "@/modules/account/components/account-nav"
import { B2BCustomer } from "@/types"
import { ApprovalStatusType, ApprovalType } from "@/types/approval"
import React from "react"
import { cookies } from "next/headers"
import { getLocale } from "@/lib/i18n"
import { getProfessionalApplication } from "@/lib/data/professional-application"

interface AccountLayoutProps {
  customer: B2BCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = async ({
  customer,
  children,
}) => {
  const { carts_with_approvals } = customer?.employee?.is_admin
    ? await listApprovals({
        type: ApprovalType.ADMIN,
        status: ApprovalStatusType.PENDING,
      }).catch(() => ({ carts_with_approvals: [] }))
    : { carts_with_approvals: [] }

  const numPendingApprovals = carts_with_approvals?.length || 0
  const locale = getLocale((await cookies()).get("earmed-locale")?.value)
  const professionalApplication = customer
    ? await getProfessionalApplication().catch(() => null)
    : null

  return (
    <div
      className="flex-1 bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50 small:py-12"
      data-testid="account-page"
    >
      <div className="flex-1 content-container h-full max-w-7xl mx-auto flex flex-col">
        <div className="grid grid-cols-1 gap-6 py-8 small:grid-cols-[220px_minmax(0,1fr)] small:py-12">
          <div>
            {customer && (
              <AccountNav
                customer={customer}
                numPendingApprovals={numPendingApprovals}
                locale={locale}
                isApprovedProfessional={
                  professionalApplication?.status === "approved"
                }
              />
            )}
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
