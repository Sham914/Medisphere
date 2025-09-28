import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/admin-dashboard"
import { Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Get statistics
  const [
    { count: hospitalsCount },
    { count: doctorsCount },
    { count: medicalStoresCount },
    { count: usersCount },
    { count: bloodRequestsCount },
    { count: donorsCount },
  ] = await Promise.all([
    supabase.from("hospitals").select("*", { count: "exact", head: true }),
    supabase.from("doctors").select("*", { count: "exact", head: true }),
    supabase.from("medical_stores").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("blood_requests").select("*", { count: "exact", head: true }),
    supabase.from("blood_donors").select("*", { count: "exact", head: true }),
  ])

  // Get recent data
  const { data: recentHospitals } = await supabase
    .from("hospitals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentDoctors } = await supabase
    .from("doctors")
    .select("*, hospitals(name)")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentStores } = await supabase
    .from("medical_stores")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Medisphere Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-gray-700 hover:text-indigo-600">
              <Link href="/dashboard">
                User Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Manage hospitals, doctors, medical stores, and platform data</p>
        </div>

        <AdminDashboard
          stats={{
            hospitals: hospitalsCount || 0,
            doctors: doctorsCount || 0,
            medicalStores: medicalStoresCount || 0,
            users: usersCount || 0,
            bloodRequests: bloodRequestsCount || 0,
            donors: donorsCount || 0,
          }}
          recentData={{
            hospitals: recentHospitals || [],
            doctors: recentDoctors || [],
            stores: recentStores || [],
            users: recentUsers || [],
          }}
        />
      </div>
    </div>
  );
}
