import { describe, expect, it } from "vitest";
import { registerSchema } from "./auth";

describe("registerSchema", () => {
  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "Maria",
      email: "maria@example.com",
      password: "12345678",
      passwordConfirmation: "87654321",
    });

    expect(result.success).toBe(false);
  });
});
