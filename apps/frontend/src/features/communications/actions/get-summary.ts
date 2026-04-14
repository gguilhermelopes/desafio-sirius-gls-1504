import { SummaryResponse } from "@juscash/shared";
import { apiFetch } from "@/lib/api/fetcher";

export async function getSummary(communicationId: string): Promise<SummaryResponse> {
  return apiFetch<SummaryResponse>(`/communications/${communicationId}/summary`, {
    method: "POST",
  });
}
