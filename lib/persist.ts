// ── Best-effort Supabase persistence ─────────────────────────────────────────
// Every call is safe in demo mode (no credentials → no-op) and never throws:
// the live watch floor must keep running even if the database blinks.

import { SUPABASE_CONFIGURED } from "./config";
import { createSupabaseServerClient } from "./supabase/server";
import type { AuditEntry, Incident } from "./types";

let devicesSeeded = false;

export async function ensureDevicesSeeded(rows: ReturnType<any>[]) {
  if (!SUPABASE_CONFIGURED || devicesSeeded) return;
  devicesSeeded = true;
  try {
    const db = await createSupabaseServerClient();
    const { count } = await db.from("devices").select("device_id", { count: "exact", head: true });
    if ((count ?? 0) === 0) {
      await db.from("devices").insert(rows);
    }
  } catch (e) {
    console.warn("[nightingale] device seed skipped:", (e as Error).message);
  }
}

export async function recordIncident(inc: Incident) {
  if (!SUPABASE_CONFIGURED) return;
  try {
    const db = await createSupabaseServerClient();
    await db.from("incidents").insert({
      incident_ref: inc.id,
      device_ref: inc.deviceId,
      device_name: inc.deviceName,
      kind: inc.kind,
      severity: inc.severity,
      status: inc.status,
      score: inc.score,
      summary: inc.summary,
      evidence: inc.evidence,
    });
  } catch (e) {
    console.warn("[nightingale] incident persist skipped:", (e as Error).message);
  }
}

export async function updateIncident(inc: Incident) {
  if (!SUPABASE_CONFIGURED) return;
  try {
    const db = await createSupabaseServerClient();
    await db
      .from("incidents")
      .update({ status: inc.status, severity: inc.severity, score: inc.score })
      .eq("incident_ref", inc.id);
  } catch (e) {
    console.warn("[nightingale] incident update skipped:", (e as Error).message);
  }
}

export async function recordAudit(entry: Omit<AuditEntry, "id" | "ts">) {
  if (!SUPABASE_CONFIGURED) return;
  try {
    const db = await createSupabaseServerClient();
    await db.from("audit_log").insert({
      actor: entry.actor,
      action: entry.action,
      target: entry.target,
      detail: entry.detail,
    });
  } catch (e) {
    console.warn("[nightingale] audit persist skipped:", (e as Error).message);
  }
}
