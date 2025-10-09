import { createClient } from "@/lib/supabase/server"
import HospitalSearch from "@/components/hospital-search"
import { Heart, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function HospitalsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public access - no authentication required
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Medisphere</h1>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button asChild variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
              <Link href="/">
                <Home className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            {user ? (
              <Button asChild variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/">
                  Home
                </Link>
              </Button>
            ) : (
              <Button asChild variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Hospitals & Doctors</h2>
          <p className="text-gray-600">Search for healthcare providers near you</p>
        </div>
        <HospitalSearch />
      </div>
    </div>
  );
}
