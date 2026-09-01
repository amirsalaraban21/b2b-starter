import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid"

export default function Loading() {
  return <div className="content-container py-8"><div className="mb-8 h-8 w-48 animate-pulse rounded bg-ui-bg-subtle motion-reduce:animate-none" /><SkeletonProductGrid /></div>
}
