import { describe, expect, it } from "vitest";
import { isAuthenticatedRoute } from "./session";

describe("session helpers", () => {
  it("marks communications as protected", () => {
    expect(isAuthenticatedRoute("/communications")).toBe(true);
  });

  it("marks nested communications routes as protected", () => {
    expect(isAuthenticatedRoute("/communications/1234567-89")).toBe(true);
  });

  it("marks login as public", () => {
    expect(isAuthenticatedRoute("/login")).toBe(false);
  });
});
