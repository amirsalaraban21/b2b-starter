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
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold">
          {fa ? "وضعیت حساب حرفه‌ای" : "Professional status"}
        </h3>
        {application && (
          <span className="max-w-full break-words rounded-full bg-teal-50 px-3 py-1 text-center text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-200">
            {labels[locale][application.status]}
          </span>
        )}
      </div>
      {application ? (
        <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
          <p>
            {fa ? "نوع فعالیت" : "Professional type"}:{" "}
            <strong className="break-all">{application.professional_type}</strong>
          </p>
          <p>
            {fa ? "سازمان" : "Organization"}:{" "}
            <strong className="break-words">{application.organization_name || "—"}</strong>
          </p>
          <p>
            {fa ? "شماره نظام پزشکی / شناسه حرفه‌ای" : "Medical Council / Professional ID"}:{" "}
            <strong className="break-all">{application.professional_identifier || "—"}</strong>
          </p>
          <p>
            {fa ? "شهر" : "City"}: <strong>{application.city || "—"}</strong>
          </p>
          {application.customer_feedback && (
            <p className="break-words sm:col-span-2 rounded-xl bg-amber-50 p-3 text-amber-900 dark:bg-amber-950 dark:text-amber-100">
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
      {application?.status === "approved" && (
        <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950/50">
          <p className="font-bold text-teal-900 dark:text-teal-100">
            {fa
              ? "حساب حرفه‌ای شما تأیید شده است"
              : "Your professional account is verified"}
          </p>
          <p className="mt-1 text-sm text-teal-800 dark:text-teal-200">
            {fa
              ? "می‌توانید از سبد خرید، درخواست پیش‌فاکتور ثبت کنید یا خرید عادی را ادامه دهید."
              : "You can request a quote from your cart or continue with normal checkout."}
          </p>
          <LocalizedClientLink
            href="/cart"
            className="mt-3 inline-block text-sm font-bold text-teal-800 underline-offset-4 hover:underline dark:text-teal-200"
          >
            {fa ? "رفتن به سبد خرید" : "Go to cart"}
          </LocalizedClientLink>
        </div>
      )}
    </section>
  )
}
export default ProfessionalStatus
