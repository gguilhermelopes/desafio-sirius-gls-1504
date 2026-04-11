import { cookies } from "next/headers";

export async function hasSession() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get("access_token")?.value);
}
