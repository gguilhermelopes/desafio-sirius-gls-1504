import { Skeleton } from "@/components/ui/skeleton";

export default function ProcessDetailsLoading() {
  return (
    <>
      <div className="mb-4">
        <Skeleton width={300} height={16} />
      </div>
      <div className="mb-6">
        <Skeleton width={500} height={28} />
        <div className="mt-3 flex gap-4">
          <Skeleton width={60} height={20} />
          <Skeleton width={250} height={20} />
          <Skeleton width={120} height={20} />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div className="bg-neutral-50 border border-neutral-300 rounded-md p-6 mb-4" key={i}>
          <Skeleton width={100} height={16} />
          <div className="mt-3"><Skeleton width={300} height={16} /></div>
          <div className="mt-3">
            <Skeleton width="100%" height={16} />
            <div className="mt-1"><Skeleton width="100%" height={16} /></div>
            <div className="mt-1"><Skeleton width="60%" height={16} /></div>
          </div>
        </div>
      ))}
    </>
  );
}
