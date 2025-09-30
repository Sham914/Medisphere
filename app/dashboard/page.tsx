
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardContent from "./DashboardContent"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch the full profile from public.profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Optionally handle missing profile (shouldn't happen if triggers are set up)
  if (!profile) {
    redirect("/auth/login");
  }

  return <DashboardContent profile={profile} />
}
