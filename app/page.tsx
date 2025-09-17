import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Hospital, MapPin, Pill, Users, Shield, Clock, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">Your Complete Healthcare Companion</h2>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Connect with hospitals, find doctors, locate pharmacies, manage medications, and join our blood donation
            network - all in one trusted platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="h-12 px-8 border-blue-200 hover:bg-blue-50 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need for Better Health</h3>
          <p className="text-lg text-gray-600">Comprehensive healthcare services at your fingertips</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="bg-blue-100 p-3 rounded-lg w-fit">
                <Hospital className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Hospital & Doctor Network</CardTitle>
              <CardDescription>
                Find nearby hospitals and connect with qualified doctors across all specialties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Verified healthcare providers
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  Real-time availability
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  Location-based search
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="bg-green-100 p-3 rounded-lg w-fit">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Medical Store Locator</CardTitle>
              <CardDescription>Locate nearby pharmacies and medical stores with real-time availability</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  Operating hours
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  Licensed pharmacies
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Customer ratings
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
            <CardHeader>
              <div className="bg-purple-100 p-3 rounded-lg w-fit">
                <Pill className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Medicine Reminders</CardTitle>
              <CardDescription>Never miss a dose with smart medication reminders and tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  Custom schedules
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  Secure & private
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Health tracking
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="bg-red-100 p-3 rounded-lg w-fit">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Blood Donation Network</CardTitle>
              <CardDescription>Connect blood donors with those in need through our secure platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Save lives together
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  Verified donors
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  Emergency requests
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-600 to-indigo-700 text-white md:col-span-2">
            <CardHeader>
              <div className="bg-white/20 p-3 rounded-lg w-fit">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Secure & Trusted Platform</CardTitle>
              <CardDescription className="text-blue-100">
                Your health data is protected with enterprise-grade security and privacy measures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">HIPAA Compliant</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">End-to-End Encryption</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">24/7 Monitoring</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Healthcare Experience?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Medisphere for their healthcare needs. Start your journey to better health
            today.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Medisphere</h1>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Medisphere. All rights reserved.</p>
            <p className="mt-2">Your trusted healthcare companion</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
