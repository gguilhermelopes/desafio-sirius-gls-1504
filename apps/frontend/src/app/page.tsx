import { redirect } from "next/navigation";
import { hasSession } from "@/lib/auth/get-session";

export default async function HomePage() {
  const authenticated = await hasSession();

  redirect(authenticated ? "/communications" : "/login");
}
