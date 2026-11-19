import { NextResponse } from "next/server";
import { SUPABASE_CONFIGURED } from "@/lib/config";
import { ensureDevicesSeeded } from "@/lib/persist";
import { world } from "@/lib/world";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureDevicesSeeded(world.deviceSeedRows());
  return NextResponse.json({ ...world.state, mode: SUPABASE_CONFIGURED ? "supabase" : "demo" });
}
