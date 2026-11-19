import { NextResponse } from "next/server";
import { SUPABASE_CONFIGURED } from "@/lib/config";
import { recordAudit, updateIncident } from "@/lib/persist";
import { world } from "@/lib/world";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { deviceId?: string };
  if (!body.deviceId) return NextResponse.json({ error: "deviceId required" }, { status: 400 });

  const openInc = world.state.incidents.find((i) => i.deviceId === body.deviceId && i.status === "open");
  const ok = world.contain(body.deviceId);
  if (!ok) return NextResponse.json({ error: "device unknown or already quarantined" }, { status: 409 });

  if (SUPABASE_CONFIGURED) {
    if (openInc) await updateIncident(openInc);
    await recordAudit({ actor: "operator", action: "device.contain", target: body.deviceId, detail: "network quarantine enforced" });
  }
  return NextResponse.json({ ok: true });
}
