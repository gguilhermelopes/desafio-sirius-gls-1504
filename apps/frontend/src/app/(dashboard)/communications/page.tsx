import { cookies } from "next/headers";
import { CommunicationListResponse } from "@juscash/shared";
import { apiFetch } from "@/lib/api/fetcher";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { FiltersBar } from "@/features/communications/components/filters-bar";
import { CommunicationCard } from "@/features/communications/components/communication-card";
import { EmptyState } from "@/features/communications/components/empty-state";
import { Pagination } from "@/features/communications/components/pagination";
import { buildCookieHeader } from "@/lib/auth/get-session";

export default async function CommunicationsPage(props: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const messages = getMessages(DEFAULT_LOCALE);
  const cookieStore = await cookies();

  const queryParams = new URLSearchParams();
  if (searchParams.page) queryParams.set("page", searchParams.page);
  if (searchParams.search) queryParams.set("search", searchParams.search);
  if (searchParams.tribunalId) queryParams.set("tribunalId", searchParams.tribunalId);
  if (searchParams.startDate) queryParams.set("startDate", searchParams.startDate);
  if (searchParams.endDate) queryParams.set("endDate", searchParams.endDate);

  const data = await apiFetch<CommunicationListResponse>(
    `/communications?${queryParams.toString()}`,
    { headers: { Cookie: buildCookieHeader(cookieStore.getAll()) } },
  );

  return (
    <>
      <div className="bg-neutral-50 border border-neutral-300 rounded-md p-6 mb-4 max-md:p-4">
        <h1 className="font-sans font-bold text-xl leading-[1.2] text-neutral-800 m-0 mb-2 max-[430px]:text-lg">{messages.communications.title}</h1>
        <p className="font-sans text-base leading-[1.4] text-neutral-800 m-0 max-[430px]:text-sm">{messages.communications.description}</p>
      </div>

      <FiltersBar messages={messages.communications} />

      {data.items.length === 0 ? (
        <EmptyState
          title={messages.communications.emptyTitle}
          description={messages.communications.emptyDescription}
        />
      ) : (
        <>
          {data.items.map((item) => (
            <CommunicationCard
              key={item.id}
              item={item}
              messages={messages.communications}
            />
          ))}
          <Pagination
            meta={data.meta}
            searchParams={searchParams}
            previousLabel={messages.communications.previous}
            nextLabel={messages.communications.next}
          />
        </>
      )}
    </>
  );
}
