import { Skeleton } from "@/components/ui/skeleton";

export default function ProcessDetailsLoading() {
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Skeleton width={300} height={16} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <Skeleton width={500} height={28} />
        <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
          <Skeleton width={60} height={20} />
          <Skeleton width={250} height={20} />
          <Skeleton width={120} height={20} />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div className="proc-timeline-entry" key={i} style={{ marginBottom: 16 }}>
          <Skeleton width={100} height={16} />
          <div style={{ marginTop: 12 }}><Skeleton width={300} height={16} /></div>
          <div style={{ marginTop: 12 }}>
            <Skeleton width="100%" height={16} />
            <div style={{ marginTop: 4 }}><Skeleton width="100%" height={16} /></div>
            <div style={{ marginTop: 4 }}><Skeleton width="60%" height={16} /></div>
          </div>
        </div>
      ))}
    </>
  );
}
