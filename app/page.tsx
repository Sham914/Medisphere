import { createClient } from "@/lib/supabase/server"
import HomePage from "@/components/HomePage"

// Root page component
export default async function RootPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  return <HomePage user={user} profile={profile} />
}
