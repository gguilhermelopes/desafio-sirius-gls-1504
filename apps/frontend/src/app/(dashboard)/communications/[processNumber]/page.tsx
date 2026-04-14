import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ProcessDetailResponse } from "@juscash/shared";
import { apiFetch, ApiError } from "@/lib/api/fetcher";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProcessHeader } from "@/features/communications/components/process-header";
import { CommunicationTimeline } from "@/features/communications/components/communication-timeline";
import { buildCookieHeader } from "@/lib/auth/get-session";

export default async function ProcessDetailsPage(props: {
  params: Promise<{ processNumber: string }>;
}) {
  const { processNumber } = await props.params;
  const messages = getMessages(DEFAULT_LOCALE);
  const cookieStore = await cookies();

  let data: ProcessDetailResponse;
  try {
    data = await apiFetch<ProcessDetailResponse>(
      `/communications/process/${encodeURIComponent(processNumber)}`,
      { headers: { Cookie: buildCookieHeader(cookieStore.getAll()) } },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: messages.communications.diarioOficial, href: "/communications" },
          { label: messages.communications.processDetails },
        ]}
      />
      <ProcessHeader data={data} messages={messages.communications} />
      <CommunicationTimeline
        communications={data.communications}
        messages={messages.communications}
      />
    </>
  );
}
