import Brand from "@/modules/layout/components/brand"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mb-2 w-full bg-white relative small:min-h-screen">
      <div className="h-16 bg-white">
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
