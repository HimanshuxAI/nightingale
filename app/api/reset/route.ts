import { NextResponse } from "next/server";
import { SUPABASE_CONFIGURED } from "@/lib/config";
import { recordAudit } from "@/lib/persist";
import { world } from "@/lib/world";

export const dynamic = "force-dynamic";

export async function POST() {
  world.reset();
  if (SUPABASE_CONFIGURED)
    await recordAudit({ actor: "operator", action: "watch.reset", target: "fleet", detail: "simulation state cleared" });
  return NextResponse.json({ ok: true });
}
