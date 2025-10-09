import { createClient } from "@/lib/supabase/server"
import BloodDonationNetwork from "@/components/blood-donation-network"
import { Heart, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function BloodDonationPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch donor profile only if user is logged in
  let donorProfile = null
  if (user) {
    const { data } = await supabase.from("blood_donors").select("*").eq("user_id", user.id).single()
    donorProfile = data
  }

  // Fetch public data - available to everyone
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-red-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-red-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Medisphere</h1>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button asChild variant="ghost" size="sm" className="text-gray-700 hover:text-red-600">
              <Link href="/">
                <Home className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            {user ? (
              <Button asChild variant="default" size="sm" className="bg-red-600 hover:bg-red-700">
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild variant="default" size="sm" className="bg-red-600 hover:bg-red-700">
                <Link href="/auth/login">
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Blood Donation Network</h2>
          <p className="text-gray-600">Connect with donors and respond to urgent requests</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <BloodDonationNetwork
            userId={user?.id || null}
            donorProfile={donorProfile}
            bloodRequests={bloodRequests || []}
            availableDonors={availableDonors || []}
          />
        </div>
      </div>
    </div>
  )
}
