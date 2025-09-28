import { createClient } from "@/lib/supabase/server"
import MedicineReminders from "@/components/medicine-reminders"

export default async function RemindersPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  // If not logged in, redirect handled by middleware or layout
  if (error || !user) return null

  const { data: reminders } = await supabase
    .from("medicine_reminders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <MedicineReminders initialReminders={reminders || []} userId={user.id} />
  )
}
