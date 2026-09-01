import Skeleton from "@/modules/skeletons/components/skeleton"

export default function SkeletonProductPage() {
  return <div className="content-container grid grid-cols-1 gap-4 py-6 small:grid-cols-2"><Skeleton className="aspect-[4/5] w-full rounded-2xl" /><div className="rounded-2xl bg-ui-bg-subtle p-6 small:p-12"><Skeleton className="h-5 w-1/4" /><Skeleton className="mt-5 h-10 w-4/5" /><Skeleton className="mt-5 h-5 w-full" /><Skeleton className="mt-2 h-5 w-3/4" /><Skeleton className="mt-10 h-12 w-full" /></div></div>
}
