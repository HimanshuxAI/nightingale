import { NextResponse } from "next/server";
import { SUPABASE_CONFIGURED } from "@/lib/config";
import { recordAudit } from "@/lib/persist";
import { world } from "@/lib/world";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    deviceId?: string;
    profile?: "standard" | "fast" | "stealth";
  };
  if (!body.deviceId) return NextResponse.json({ error: "deviceId required" }, { status: 400 });
  const ok = world.inject(body.deviceId, body.profile ?? "standard");
  if (!ok) return NextResponse.json({ error: "device unknown or drill already armed" }, { status: 409 });
  if (SUPABASE_CONFIGURED)
    await recordAudit({ actor: "operator", action: "attack.inject", target: body.deviceId, detail: `profile=${body.profile ?? "standard"}` });
  return NextResponse.json({ ok: true });
}
