import { createClient } from "@/lib/supabase/server"
import BloodDonationNetwork from "@/components/blood-donation-network"

export default async function BloodDonationPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return null

  const { data: donorProfile } = await supabase.from("blood_donors").select("*").eq("user_id", user.id).single()
  const { data: bloodRequests } = await supabase
    .from("blood_requests")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(10)
  const { data: availableDonors } = await supabase
    .from("blood_donors")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <BloodDonationNetwork
      userId={user.id}
      donorProfile={donorProfile}
      bloodRequests={bloodRequests || []}
      availableDonors={availableDonors || []}
    />
  )
}
