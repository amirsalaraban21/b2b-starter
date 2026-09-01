import Skeleton from "@/modules/skeletons/components/skeleton"

const SkeletonProductPreview = () => {
  return (
    <div className="min-h-[320px] rounded-xl border border-ui-border-base bg-ui-bg-base p-4">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="mt-5 h-3 w-1/4" />
      <Skeleton className="mt-3 h-4 w-4/5" />
      <Skeleton className="mt-5 h-5 w-2/5" />
      <div className="mt-5 flex justify-between"><Skeleton className="h-3 w-1/3" /><Skeleton className="h-8 w-8 rounded-full" /></div>
    </div>
  )
}

export default SkeletonProductPreview
