import { NextResponse } from "next/server";
import { SUPABASE_CONFIGURED } from "@/lib/config";
import { ensureDevicesSeeded, recordIncident, updateIncident } from "@/lib/persist";
import { world } from "@/lib/world";

export const dynamic = "force-dynamic";

const persisted = new Set<string>();

export async function POST() {
  await ensureDevicesSeeded(world.deviceSeedRows());
  world.tick();

  if (SUPABASE_CONFIGURED) {
    for (const inc of world.state.incidents) {
      if (persisted.has(inc.id)) {
        if (inc.status !== "open") await updateIncident(inc);
      } else {
        persisted.add(inc.id);
        await recordIncident(inc);
      }
    }
  }

  return NextResponse.json({ ...world.state, mode: SUPABASE_CONFIGURED ? "supabase" : "demo" });
}
