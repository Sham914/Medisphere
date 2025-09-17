import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import BloodDonationNetwork from "@/components/blood-donation-network"
import { Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function BloodDonationPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user's donor profile if exists
  const { data: donorProfile } = await supabase.from("blood_donors").select("*").eq("user_id", user.id).single()

  // Get active blood requests
  const { data: bloodRequests } = await supabase
    .from("blood_requests")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(10)

  // Get available donors
  const { data: availableDonors } = await supabase
    .from("blood_donors")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-red-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Medisphere</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-700 hover:text-red-600">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Blood Donation Network</h2>
          <p className="text-gray-600">Connect donors with those in need and save lives together</p>
        </div>

        <BloodDonationNetwork
          userId={user.id}
          donorProfile={donorProfile}
          bloodRequests={bloodRequests || []}
          availableDonors={availableDonors || []}
        />
      </div>
    </div>
  )
}
