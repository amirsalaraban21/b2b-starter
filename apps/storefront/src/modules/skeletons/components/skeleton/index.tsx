import { clx } from "@medusajs/ui"

export default function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={clx("rounded-md bg-ui-bg-subtle animate-pulse motion-reduce:animate-none", className)} />
}
