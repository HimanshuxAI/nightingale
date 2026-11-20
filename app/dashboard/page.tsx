import { cookies } from "next/headers";
import { SUPABASE_CONFIGURED } from "@/lib/config";
import { HOSPITAL } from "@/lib/world";
import DashboardClient from "@/components/DashboardClient";

type Role = "clinician" | "secops" | "itadmin" | "leadership" | "biomed";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const role = (cookieStore.get("ng_role")?.value as Role) ?? "clinician";
  return <DashboardClient mode={SUPABASE_CONFIGURED ? "supabase" : "demo"} hospital={HOSPITAL} role={role} />;
}
