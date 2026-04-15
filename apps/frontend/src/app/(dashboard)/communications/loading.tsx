import { Skeleton } from "@/components/ui/skeleton";

export default function CommunicationsLoading() {
  return (
    <>
      <div className="bg-neutral-50 border border-neutral-300 rounded-md p-6 mb-4">
        <Skeleton width={200} height={28} />
        <div className="mt-2">
          <Skeleton width="80%" height={20} />
        </div>
      </div>

      <div className="bg-neutral-50 border border-neutral-300 rounded-md p-6 mb-4 flex items-center gap-3">
        <Skeleton width="100%" height={36} />
      </div>

      {[1, 2].map((i) => (
        <div className="bg-neutral-50 border border-neutral-300 rounded-md p-6 mb-4" key={i}>
          <Skeleton width={350} height={20} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Skeleton width={80} height={16} />
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={16} />
            <Skeleton width={120} height={16} />
          </div>
          <div className="mt-4">
            <Skeleton width="100%" height={16} />
            <div className="mt-1"><Skeleton width="100%" height={16} /></div>
            <div className="mt-1"><Skeleton width="60%" height={16} /></div>
          </div>
        </div>
      ))}
    </>
  );
}
