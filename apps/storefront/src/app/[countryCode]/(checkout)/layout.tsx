import Brand from "@/modules/layout/components/brand"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-white relative min-h-screen dark:bg-slate-950">
      <div className="h-16 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <nav className="flex h-full items-center content-container justify-between">
          <Brand />
        </nav>
      </div>
      <div className="relative bg-neutral-100" data-testid="checkout-container">
        {children}
      </div>
    </div>
  )
}
