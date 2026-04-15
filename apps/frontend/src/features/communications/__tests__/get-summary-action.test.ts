import { beforeEach, describe, expect, it, vi } from "vitest";

const apiFetchMock = vi.fn();

vi.mock("@/lib/api/fetcher", () => ({
  apiFetch: apiFetchMock,
}));

describe("getSummary", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("should request the summary endpoint with POST", async () => {
    apiFetchMock.mockResolvedValueOnce({ summary: "Resumo", cached: false });

    const { getSummary } = await import("../actions/get-summary");

    await expect(getSummary("comm-1")).resolves.toEqual({
      summary: "Resumo",
      cached: false,
    });
    expect(apiFetchMock).toHaveBeenCalledWith("/communications/comm-1/summary", {
      method: "POST",
    });
  });
});
