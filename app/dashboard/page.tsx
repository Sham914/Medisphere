import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
<<<<<<< HEAD
import { Heart, Hospital, MapPin, Pill, Users, Calendar } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
=======
import { Heart, Hospital, MapPin, Pill, Users, Calendar, Sparkles, TrendingUp, Award, Shield } from "lucide-react"
>>>>>>> c8ffa95e10faf42fff027dfa7bfb99e7f6e02398
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

  // Get user profile (fallback to auth user if no profile table)
  // const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const profile = {
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    email: user.email,
    avatar_url: user.user_metadata?.avatar_url || "/placeholder-user.jpg",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Medisphere
              </h1>
              <p className="text-xs text-gray-500">Your Healthcare Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
<<<<<<< HEAD
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-3 py-1.5">
                  <Avatar>
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                    <AvatarFallback>{profile.full_name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-900">Hi, {profile.full_name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <form action="/auth/signout" method="post">
                    <button type="submit" className="w-full text-left">Sign Out</button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
=======
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Welcome back!</p>
              <p className="text-xs text-gray-600">{profile?.full_name || "User"}</p>
            </div>
            <form action="/auth/signout" method="post">
              <Button variant="ghost" type="submit" className="text-gray-700 hover:text-red-600 hover:bg-red-50">
                Sign Out
              </Button>
            </form>
>>>>>>> c8ffa95e10faf42fff027dfa7bfb99e7f6e02398
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Healthcare Dashboard</h2>
              <p className="text-gray-600">Access all your healthcare services in one place</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg shadow-lg">
                  <Hospital className="h-6 w-6 text-blue-600" />
                  <Hospital className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">150+</p>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600">Hospitals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">500+</p>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600">Doctors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg shadow-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">200+</p>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600">Pharmacies</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-red-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-lg shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">1000+</p>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600">Donors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-blue-50 group">
            <CardHeader>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg w-fit shadow-lg group-hover:shadow-xl transition-shadow">
                <Hospital className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                Find Hospitals & Doctors
              </CardTitle>
              <CardDescription>Search for nearby hospitals and connect with qualified doctors</CardDescription>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Shield className="h-4 w-4" />
                <span>Verified Healthcare Providers</span>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/hospitals">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                  <Hospital className="h-4 w-4 mr-2" />
                  Explore Hospitals
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-green-50 group">
            <CardHeader>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg w-fit shadow-lg group-hover:shadow-xl transition-shadow">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900 group-hover:text-green-600 transition-colors">
                Medical Stores
              </CardTitle>
              <CardDescription>Locate nearby pharmacies and medical stores</CardDescription>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Award className="h-4 w-4" />
                <span>Licensed Pharmacies</span>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/medical-stores">
                <Button className="w-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Pharmacies
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-purple-50 group">
            <CardHeader>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg w-fit shadow-lg group-hover:shadow-xl transition-shadow">
                <Pill className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
                Medicine Reminders
              </CardTitle>
              <CardDescription>Manage your medication schedule and reminders</CardDescription>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Shield className="h-4 w-4" />
                <span>Smart & Secure</span>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/reminders">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all">
                  <Pill className="h-4 w-4 mr-2" />
                  Manage Reminders
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-red-50 group">
            <CardHeader>
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-lg w-fit shadow-lg group-hover:shadow-xl transition-shadow">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900 group-hover:text-red-600 transition-colors">
                Blood Donation
              </CardTitle>
              <CardDescription>Join our blood donation network and save lives</CardDescription>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Heart className="h-4 w-4" />
                <span>Save Lives Together</span>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/blood-donation">
                <Button className="w-full bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all">
                  <Heart className="h-4 w-4 mr-2" />
                  Join Network
                </Button>
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

          <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-orange-50 group">
            <CardHeader>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-lg w-fit shadow-lg group-hover:shadow-xl transition-shadow">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900 group-hover:text-orange-600 transition-colors">
                My Profile
              </CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Shield className="h-4 w-4" />
                <span>Secure & Private</span>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button variant="outline" className="w-full border-orange-200 hover:bg-orange-50 bg-transparent shadow-md hover:shadow-lg transition-all">
                  <Calendar className="h-4 w-4 mr-2" />
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
