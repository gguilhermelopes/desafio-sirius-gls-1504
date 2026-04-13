import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";

export default async function HomePage() {
  const authenticated = await getSession();

  redirect(authenticated ? "/communications" : "/login");
}
