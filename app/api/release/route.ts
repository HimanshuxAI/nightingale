import { NextResponse } from "next/server";
import { SUPABASE_CONFIGURED } from "@/lib/config";
import { recordAudit } from "@/lib/persist";
import { world } from "@/lib/world";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { deviceId?: string };
  if (!body.deviceId) return NextResponse.json({ error: "deviceId required" }, { status: 400 });
  const ok = world.release(body.deviceId);
  if (!ok) return NextResponse.json({ error: "device unknown or not quarantined" }, { status: 409 });
  if (SUPABASE_CONFIGURED)
    await recordAudit({ actor: "operator", action: "device.release", target: body.deviceId, detail: "returned to production VLAN" });
  return NextResponse.json({ ok: true });
}
