import LocalizedClientLink from "@/modules/common/components/localized-client-link"

type BrandProps = { className?: string }

/** Temporary brand lockup. Replace the icon/text here when the final identity is ready. */
export default function Brand({ className = "" }: BrandProps) {
  return (
    <LocalizedClientLink
      className={`inline-flex items-center gap-2 font-semibold tracking-tight text-ui-fg-base ${className}`}
      href="/"
      aria-label="EarMed Store"
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-700 text-white" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16.5 10.5a4.5 4.5 0 0 0-9 0c0 4.5 4.5 4 4.5 7" />
          <path d="M12 20.5a2 2 0 0 0 2-2" />
          <path d="M18.5 5.5 20 4" />
        </svg>
      </span>
      <span>EarMed Store</span>
    </LocalizedClientLink>
  )
}
