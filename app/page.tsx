import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Hospital, MapPin, Pill, Users, Shield, Clock, Star, Sparkles, Award, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg shadow-lg">
              <img src="/main-logo.png" alt="Medisphere Logo" className="h-8 w-8 object-cover rounded-lg" style={{objectPosition: 'center', border: '2px solid #2563eb'}} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Medisphere
              </h1>
              <p className="text-xs text-gray-500">Your Healthcare Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
              <Link href="/auth/login">
                Sign In
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
              <Link href="/auth/register">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-full shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight px-4">
              Your Complete Healthcare Companion
            </h2>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed px-4">
            Connect with hospitals, find doctors, locate pharmacies, manage medications, and join our blood donation
            network - all in one trusted platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">Verified Providers</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <Shield className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">Secure Platform</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">Growing Network</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 px-8 shadow-lg hover:shadow-xl transition-all">
              <Link href="/auth/register">
                <Sparkles className="h-5 w-5 mr-2" />
                Start Your Journey
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 border-blue-200 hover:bg-blue-50 bg-transparent shadow-md hover:shadow-lg transition-all">
              <Link href="/auth/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-green-400 to-blue-400 p-2 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Everything You Need for Better Health</h3>
          </div>
          <p className="text-lg text-gray-600">Comprehensive healthcare services at your fingertips</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-blue-50 group">
            <CardHeader>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg w-fit shadow-lg group-hover:shadow-xl transition-shadow">
                <Hospital className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                Hospital & Doctor Network
              </CardTitle>
              <CardDescription>
                Find nearby hospitals and connect with qualified doctors across all specialities
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

          <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-green-50 group">
            <CardHeader>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg w-fit shadow-lg group-hover:shadow-xl transition-shadow">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900 group-hover:text-green-600 transition-colors">
                Medical Store Locator
              </CardTitle>
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

          <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-purple-50 group">
            <CardHeader>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg w-fit shadow-lg group-hover:shadow-xl transition-shadow">
                <Pill className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
                Medicine Reminders
              </CardTitle>
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

          <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-red-50 group md:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-lg w-fit shadow-lg group-hover:shadow-xl transition-shadow">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900 group-hover:text-red-600 transition-colors">
                Blood Donation Network
              </CardTitle>
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

          <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-600 to-indigo-700 text-white md:col-span-2 group">
            <CardHeader>
              <div className="bg-white/20 p-3 rounded-lg w-fit shadow-lg group-hover:shadow-xl transition-shadow">
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
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-blue-100">
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight px-4">
              Ready to Transform Your Healthcare Experience?
            </h3>
          </div>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Join thousands of users who trust Medisphere for their healthcare needs. Start your journey to better health
            today.
          </p>
          <div className="flex justify-center px-4">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 px-8 shadow-lg hover:shadow-xl transition-all">
                <Heart className="h-5 w-5 mr-2" />
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="p-2 rounded-lg shadow-lg">
              <img src="/main-logo.png" alt="Medisphere Logo" className="h-8 w-8 object-cover rounded-lg" style={{objectPosition: 'center', border: '2px solid #2563eb'}} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Medisphere</h1>
              <p className="text-xs text-gray-400">Your Healthcare Companion</p>
            </div>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Medisphere. All rights reserved.</p>
            <p className="mt-2 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              Your trusted healthcare companion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
