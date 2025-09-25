import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import MedicalStoreSearch from "@/components/medical-store-search"
import { Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function MedicalStoresPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get initial medical stores data
  const { data: medicalStores } = await supabase
    .from("medical_stores")
    .select("*")
    .order("rating", { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Medisphere</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-700 hover:text-green-600">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Medical Stores & Pharmacies</h2>
          <p className="text-gray-600">Locate nearby pharmacies and medical stores</p>
        </div>

  <MedicalStoreSearch />
      </div>
    </div>
  )
}
