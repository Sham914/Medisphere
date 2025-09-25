"use client"
import { useCity } from "@/hooks/city-context"
import { Heart, Hospital, MapPin, Pill, Users, Calendar, Sparkles, TrendingUp, Award, Shield } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardContent({ profile }: { profile: any }) {
  const { city, setCity, cities } = useCity()
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
            {/* City Dropdown */}
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="h-10 rounded border border-blue-300 px-3 text-gray-700 bg-white shadow"
              style={{ minWidth: 180 }}
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {profile.full_name}!</h2>
          <p className="text-gray-600">Your personalized healthcare dashboard. Select your city to see local hospitals, stores, and more.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-0 shadow-lg">
            <CardHeader className="flex items-center gap-2">
              <Hospital className="h-6 w-6 text-blue-600" />
              <CardTitle>Hospitals</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-blue-700">Explore</span>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-0 shadow-lg">
            <CardHeader className="flex items-center gap-2">
              <Pill className="h-6 w-6 text-green-600" />
              <CardTitle>Medical Stores</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-700">Find</span>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-100 to-indigo-100 border-0 shadow-lg">
            <CardHeader className="flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              <CardTitle>Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-purple-700">Browse</span>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-pink-100 to-red-100 border-0 shadow-lg">
            <CardHeader className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-pink-600" />
              <CardTitle>Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-pink-700">Manage</span>
            </CardContent>
          </Card>
        </div>

        {/* Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Find Hospitals</CardTitle>
              <CardDescription>Search for hospitals in your city</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/hospitals">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full h-12 text-lg font-semibold">Search Hospitals</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Find Medical Stores</CardTitle>
              <CardDescription>Locate pharmacies and stores nearby</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/medical-stores">
                <Button className="bg-green-600 hover:bg-green-700 text-white w-full h-12 text-lg font-semibold">Search Stores</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Blood Donation Network</CardTitle>
              <CardDescription>Connect with donors and requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/blood-donation">
                <Button className="bg-red-600 hover:bg-red-700 text-white w-full h-12 text-lg font-semibold">Blood Donation</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Medicine Reminders</CardTitle>
              <CardDescription>Never miss a dose again</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/reminders">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full h-12 text-lg font-semibold">Reminders</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
