import { SUPABASE_CONFIGURED } from "@/lib/config";
import { HOSPITAL } from "@/lib/world";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return <DashboardClient mode={SUPABASE_CONFIGURED ? "supabase" : "demo"} hospital={HOSPITAL} />;
}
