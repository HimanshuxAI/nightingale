import { NextResponse } from "next/server";
import { DEMO_COOKIE, SUPABASE_CONFIGURED } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST() {
  if (SUPABASE_CONFIGURED) {
    try {
      const db = await createSupabaseServerClient();
      await db.auth.signOut();
    } catch {
      // ignore — cookie clearing below is the source of truth for the demo
    }
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DEMO_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
