import { Skeleton } from "@/components/ui/skeleton";

export default function CommunicationsLoading() {
  return (
    <>
      <div className="comm-header-card">
        <Skeleton width={200} height={28} />
        <div style={{ marginTop: 8 }}>
          <Skeleton width="80%" height={20} />
        </div>
      </div>

      <div className="comm-filters-card">
        <Skeleton width="100%" height={36} />
      </div>

      {[1, 2].map((i) => (
        <div className="comm-card" key={i}>
          <Skeleton width={350} height={20} />
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Skeleton width={80} height={16} />
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={16} />
            <Skeleton width={120} height={16} />
          </div>
          <div style={{ marginTop: 16 }}>
            <Skeleton width="100%" height={16} />
            <div style={{ marginTop: 4 }}><Skeleton width="100%" height={16} /></div>
            <div style={{ marginTop: 4 }}><Skeleton width="60%" height={16} /></div>
          </div>
        </div>
      ))}
    </>
  );
}
