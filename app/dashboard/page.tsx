import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Hospital, MapPin, Pill, Users, Calendar } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Medisphere</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {profile?.full_name || "User"}</span>
            <form action="/auth/signout" method="post">
              <Button variant="ghost" type="submit" className="text-gray-700 hover:text-red-600">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Healthcare Dashboard</h2>
          <p className="text-gray-600">Access all your healthcare services in one place</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Hospital className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">150+</p>
                  <p className="text-sm text-gray-600">Hospitals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-600">Doctors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">200+</p>
                  <p className="text-sm text-gray-600">Pharmacies</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">1000+</p>
                  <p className="text-sm text-gray-600">Donors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="bg-blue-100 p-3 rounded-lg w-fit">
                <Hospital className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Find Hospitals & Doctors</CardTitle>
              <CardDescription>Search for nearby hospitals and connect with qualified doctors</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/hospitals">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Explore Hospitals</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="bg-green-100 p-3 rounded-lg w-fit">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Medical Stores</CardTitle>
              <CardDescription>Locate nearby pharmacies and medical stores</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/medical-stores">
                <Button className="w-full bg-green-600 hover:bg-green-700">Find Pharmacies</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="bg-purple-100 p-3 rounded-lg w-fit">
                <Pill className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Medicine Reminders</CardTitle>
              <CardDescription>Manage your medication schedule and reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/reminders">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Manage Reminders</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="bg-red-100 p-3 rounded-lg w-fit">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Blood Donation</CardTitle>
              <CardDescription>Join our blood donation network and save lives</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/blood-donation">
                <Button className="w-full bg-red-600 hover:bg-red-700">Join Network</Button>
              </Link>
            </CardContent>
          </Card>

          {profile?.role === "admin" && (
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
              <CardHeader>
                <div className="bg-white/20 p-3 rounded-lg w-fit">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Admin Dashboard</CardTitle>
                <CardDescription className="text-indigo-100">
                  Manage hospitals, doctors, and platform data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin">
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                    Access Admin Panel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="bg-orange-100 p-3 rounded-lg w-fit">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">My Profile</CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button variant="outline" className="w-full border-orange-200 hover:bg-orange-50 bg-transparent">
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
