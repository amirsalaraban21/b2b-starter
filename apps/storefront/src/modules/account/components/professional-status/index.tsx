import { ProfessionalApplication } from "@/lib/data/professional-application"
import { Locale } from "@/lib/i18n"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"

const labels = {
  fa: {
    pending: "در انتظار بررسی",
    needs_information: "نیاز به اطلاعات بیشتر",
    approved: "تأیید شده",
    rejected: "رد شده",
  },
  en: {
    pending: "Pending review",
    needs_information: "More information required",
    approved: "Approved",
    rejected: "Rejected",
  },
}

const ProfessionalStatus = ({
  locale,
  application,
}: {
  locale: Locale
  application: ProfessionalApplication | null
}) => {
  const fa = locale === "fa"
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold">
          {fa ? "وضعیت حساب حرفه‌ای" : "Professional status"}
        </h3>
        {application && (
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-200">
            {labels[locale][application.status]}
          </span>
        )}
      </div>
      {application ? (
        <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
          <p>
            {fa ? "نوع فعالیت" : "Professional type"}:{" "}
            <strong>{application.professional_type}</strong>
          </p>
          <p>
            {fa ? "سازمان" : "Organization"}:{" "}
            <strong>{application.organization_name || "—"}</strong>
          </p>
          <p>
            {fa ? "شناسه حرفه‌ای" : "Professional identifier"}:{" "}
            <strong>{application.professional_identifier || "—"}</strong>
          </p>
          <p>
            {fa ? "شهر" : "City"}: <strong>{application.city || "—"}</strong>
          </p>
          {application.customer_feedback && (
            <p className="sm:col-span-2 rounded-xl bg-amber-50 p-3 text-amber-900 dark:bg-amber-950 dark:text-amber-100">
              {application.customer_feedback}
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {fa
              ? "اگر پزشک، شنوایی‌شناس یا نماینده مرکز درمانی هستید می‌توانید درخواست حساب حرفه‌ای ثبت کنید."
              : "Doctors, audiologists, and medical organizations can submit a professional application."}
          </p>
          <LocalizedClientLink
            href="/professional"
            className="mt-3 inline-block text-sm font-bold text-teal-700 hover:underline dark:text-teal-300"
          >
            {fa ? "ثبت درخواست حرفه‌ای" : "Submit professional application"}
          </LocalizedClientLink>
        </>
      )}
      {application?.status === "needs_information" && (
        <LocalizedClientLink
          href="/professional"
          className="mt-4 inline-block text-sm font-bold text-teal-700 hover:underline dark:text-teal-300"
        >
          {fa ? "ارسال اطلاعات تکمیلی" : "Submit additional information"}
        </LocalizedClientLink>
      )}
    </section>
  )
}
export default ProfessionalStatus
