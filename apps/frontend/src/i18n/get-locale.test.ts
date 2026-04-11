import { describe, expect, it } from "vitest";
import { resolveLocale } from "./get-locale";

describe("resolveLocale", () => {
  it("returns pt-BR when no locale is provided", () => {
    expect(resolveLocale()).toBe("pt-BR");
  });

  it("returns the provided locale when it is supported", () => {
    expect(resolveLocale("en")).toBe("en");
  });

  it("falls back to pt-BR when the provided locale is unsupported", () => {
    expect(resolveLocale("de-DE")).toBe("pt-BR");
  });
});
