import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_COOKIE, SUPABASE_CONFIGURED } from "@/lib/config";
import { HOSPITAL } from "@/lib/world";
import LoginClient from "@/components/LoginClient";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const cookieStore = await cookies();

  if (!SUPABASE_CONFIGURED && cookieStore.get(DEMO_COOKIE)?.value === "1") {
    redirect("/dashboard");
  }

  if (SUPABASE_CONFIGURED) {
    try {
      const { createSupabaseServerClient } = await import("@/lib/supabase/server");
      const db = await createSupabaseServerClient();
      const {
        data: { user },
      } = await db.auth.getUser();
      if (user) redirect("/dashboard");
    } catch {
      // fall through to the login form
    }
  }

  return <LoginClient mode={SUPABASE_CONFIGURED ? "supabase" : "demo"} hospital={HOSPITAL} />;
}
