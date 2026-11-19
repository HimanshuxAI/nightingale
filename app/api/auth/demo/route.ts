import { NextResponse } from "next/server";
import { DEMO_COOKIE } from "@/lib/config";

export const dynamic = "force-dynamic";

/** Demo-mode sign-in: sets the session cookie Supabase would set. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string };
  const res = NextResponse.json({ ok: true, email: body.email ?? "demo@nightingale.local" });
  res.cookies.set(DEMO_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
