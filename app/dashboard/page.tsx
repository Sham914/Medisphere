
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

  const profile = {
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    email: user.email,
    avatar_url: user.user_metadata?.avatar_url || "/placeholder-user.jpg",
  }

  return <DashboardContent profile={profile} />
}
