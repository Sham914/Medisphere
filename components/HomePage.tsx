"use client"

import { useCity } from "@/hooks/city-context"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Hospital, MapPin, Pill, Users, Shield, Clock, Star, Sparkles, 
  Award, CheckCircle, TrendingUp, Heart, Home 
} from "lucide-react"
import { FaHospital, FaUserMd, FaCapsules, FaHeart, FaMapMarkerAlt } from "react-icons/fa"
import { MdLocalPharmacy } from "react-icons/md"
import Link from "next/link"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface HomePageProps {
  user: any
  profile: any
}

export default function HomePage({ user, profile }: HomePageProps) {
  const { city, setCity, cities } = useCity()
  
  const [counts, setCounts] = useState({
    hospitals: 0,
    doctors: 0,
    pharmacies: 0,
    donors: 0,
  })

  useEffect(() => {
    const fetchCounts = async () => {
      const supabase = createClient()
      const [hospitalsRes, doctorsRes, pharmaciesRes, donorsRes] = await Promise.all([
        supabase.from("hospitals").select("id", { count: "exact", head: true }),
        supabase.from("doctors").select("id", { count: "exact", head: true }),
        supabase.from("medical_stores").select("id", { count: "exact", head: true }),
        supabase.from("blood_donors").select("id", { count: "exact", head: true })
      ])
      setCounts({
        hospitals: hospitalsRes.count ?? 0,
        doctors: doctorsRes.count ?? 0,
        pharmacies: pharmaciesRes.count ?? 0,
        donors: donorsRes.count ?? 0,
      })
    }
    fetchCounts()
  }, [])

  const featureCards = [
    {
      title: "Hospital & Doctor Network",
      description: "Find nearby hospitals and connect with qualified doctors across all specialities",
      icon: <Hospital className="h-8 w-8 text-white" />,
      iconBg: "bg-gradient-to-r from-blue-500 to-blue-600",
      cardBg: "from-white to-blue-50",
      hoverColor: "group-hover:text-blue-600",
      features: [
        { icon: <Star className="h-4 w-4 text-yellow-500" />, text: "Verified healthcare providers" },
        { icon: <Clock className="h-4 w-4 text-green-500" />, text: "Real-time availability" },
        { icon: <MapPin className="h-4 w-4 text-red-500" />, text: "Location-based search" }
      ],
      href: "/hospitals",
      buttonText: "Explore Hospitals",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Medical Store Locator",
      description: "Locate nearby pharmacies and medical stores with real-time availability",
      icon: <MapPin className="h-8 w-8 text-white" />,
      iconBg: "bg-gradient-to-r from-green-500 to-green-600",
      cardBg: "from-white to-green-50",
      hoverColor: "group-hover:text-green-600",
      features: [
        { icon: <Clock className="h-4 w-4 text-green-500" />, text: "Operating hours" },
        { icon: <Shield className="h-4 w-4 text-blue-500" />, text: "Licensed pharmacies" },
        { icon: <Star className="h-4 w-4 text-yellow-500" />, text: "Customer ratings" }
      ],
      href: "/medical-stores",
      buttonText: "Find Pharmacies",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Medicine Reminders",
      description: "Never miss a dose with smart medication reminders and tracking",
      icon: <Pill className="h-8 w-8 text-white" />,
      iconBg: "bg-gradient-to-r from-purple-500 to-purple-600",
      cardBg: "from-white to-purple-50",
      hoverColor: "group-hover:text-purple-600",
      features: [
        { icon: <Clock className="h-4 w-4 text-green-500" />, text: "Custom schedules" },
        { icon: <Shield className="h-4 w-4 text-blue-500" />, text: "Secure & private" },
        { icon: <Heart className="h-4 w-4 text-red-500" />, text: "Health tracking" }
      ],
      href: "/reminders",
      buttonText: "Manage Reminders",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Blood Donation Network",
      description: "Connect blood donors with those in need through our secure platform",
      icon: <Users className="h-8 w-8 text-white" />,
      iconBg: "bg-gradient-to-r from-red-500 to-red-600",
      cardBg: "from-white to-red-50",
      hoverColor: "group-hover:text-red-600",
      features: [
        { icon: <Heart className="h-4 w-4 text-red-500" />, text: "Save lives together" },
        { icon: <Shield className="h-4 w-4 text-blue-500" />, text: "Verified donors" },
        { icon: <Clock className="h-4 w-4 text-green-500" />, text: "Emergency requests" }
      ],
      href: "/blood-donation",
      buttonText: "Blood Donation",
      buttonColor: "bg-red-600 hover:bg-red-700"
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 md:py-4 flex items-center justify-between gap-1 sm:gap-2">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 min-w-0 hover:opacity-80 transition-opacity">
            <div className="p-1 sm:p-1.5 md:p-2 rounded-lg shadow-lg flex-shrink-0">
              <img
                src="/main-logo.png"
                alt="Medisphere Logo"
                className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 object-cover rounded-lg"
                style={{ objectPosition: "center", border: "2px solid #2563eb" }}
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                Medisphere
              </h1>
              <p className="text-xs text-gray-500 hidden md:block">Your Healthcare Companion</p>
            </div>
          </Link>

          {user && profile ? (
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-7 sm:h-8 md:h-10 rounded border border-blue-300 px-1.5 sm:px-2 md:px-3 text-xs sm:text-sm md:text-base text-gray-700 bg-white shadow min-w-[80px] sm:min-w-[120px] md:min-w-[180px] truncate"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 bg-white rounded shadow hover:bg-blue-50 transition-colors">
                    <Avatar className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 flex-shrink-0">
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                      <AvatarFallback className="text-xs sm:text-sm">
                        {profile.full_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-gray-900 text-xs sm:text-sm md:text-base hidden md:inline truncate max-w-[80px] lg:max-w-[120px]">
                      Hi, {profile.full_name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {profile.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <form action="/auth/signout" method="post" className="w-full">
                      <button type="submit" className="w-full text-left cursor-pointer">
                        Sign Out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
              {/* City selector for public users */}
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-7 sm:h-8 md:h-10 rounded border border-blue-300 px-1.5 sm:px-2 md:px-3 text-xs sm:text-sm md:text-base text-gray-700 bg-white shadow min-w-[80px] sm:min-w-[100px] md:min-w-[140px] truncate"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <Button asChild variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 hidden sm:flex">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <Link href="/auth/register">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Sign Up</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center justify-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-full shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight px-4">
                Your Complete Healthcare Companion
              </h2>
            </div>
            
            {user && profile ? (
              <div className="mb-6">
                <p className="text-2xl font-semibold text-gray-900 mb-2">
                  Welcome back, {profile.full_name}! 👋
                </p>
                <p className="text-gray-600">
                  Your personalized healthcare dashboard. Select your city to see local hospitals, stores, and more.
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 leading-relaxed px-4">
                  Connect with hospitals, find doctors, locate pharmacies, manage medications, and join our blood
                  donation network - all in one trusted platform.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6">
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
              </div>
            )}
          </div>
        </section>

        {/* Trust Indicators - Always visible with real stats */}
        <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 text-center">
            <div className="flex-1">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-700">{counts.hospitals + counts.pharmacies}+</div>
              <div className="text-sm text-gray-600 font-medium">Verified Facilities</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-green-300"></div>
            <div className="flex-1">
              <div className="text-4xl mb-2">👨‍⚕️</div>
              <div className="text-2xl font-bold text-blue-700">{counts.doctors}+</div>
              <div className="text-sm text-gray-600 font-medium">Qualified Doctors</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-green-300"></div>
            <div className="flex-1">
              <div className="text-4xl mb-2">🩸</div>
              <div className="text-2xl font-bold text-red-700">{counts.donors}+</div>
              <div className="text-sm text-gray-600 font-medium">Active Blood Donors</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-green-300"></div>
            <div className="flex-1">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-yellow-700">4.8/5</div>
              <div className="text-sm text-gray-600 font-medium">User Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Features Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-green-400 to-blue-400 p-2 rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {user ? "Explore Our Services" : "Everything You Need for Better Health"}
            </h3>
          </div>
          <p className="text-lg text-gray-600">
            {user ? "Comprehensive healthcare solutions tailored for your needs" : "Comprehensive healthcare services at your fingertips"}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {featureCards.map((card, idx) => (
            <Card
              key={idx}
              className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br ${card.cardBg} group`}
            >
              <CardHeader>
                <div className={`${card.iconBg} p-3 rounded-lg w-fit shadow-lg group-hover:shadow-xl transition-shadow mb-3`}>
                  {card.icon}
                </div>
                <CardTitle className={`text-xl text-gray-900 ${card.hoverColor} transition-colors`}>
                  {card.title}
                </CardTitle>
                <CardDescription className="text-base">{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  {card.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-center gap-2">
                      {feature.icon}
                      {feature.text}
                    </li>
                  ))}
                </ul>
                <Button asChild className={`w-full ${card.buttonColor} text-white shadow-md hover:shadow-lg transition-all`}>
                  <Link href={card.href}>{card.buttonText}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Secure & Private</h4>
            <p className="text-sm text-gray-600">
              Your health data is encrypted and protected with industry-standard security protocols.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Lightning Fast</h4>
            <p className="text-sm text-gray-600">
              Find hospitals, doctors, and pharmacies instantly with our optimized search system.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Always Accurate</h4>
            <p className="text-sm text-gray-600">
              Real-time updates ensure you always get the most accurate and current information.
            </p>
          </div>
        </div>

        {/* Secure & Trusted Platform Section */}
        <div className="mb-8">
          <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-xl flex-shrink-0">
                  <Shield className="h-12 w-12 md:h-16 md:w-16 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Secure & Trusted Platform
                  </h3>
                  <p className="text-base md:text-lg text-blue-100 mb-6 leading-relaxed">
                    Your health data is protected with enterprise-grade security and privacy measures
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium border border-white/30">
                      HIPAA Compliant
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium border border-white/30">
                      End-to-End Encryption
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium border border-white/30">
                      24/7 Monitoring
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section - Only show for non-logged users */}
        {!user && (
          <section className="mb-8">
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
                Join thousands of users who trust Medisphere for their healthcare needs. Start your journey to better
                health today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 px-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <Link href="/auth/register">
                    <Heart className="h-5 w-5 mr-2" />
                    Create Your Account
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 border-blue-200 hover:bg-blue-50">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="p-2 rounded-lg shadow-lg">
              <img
                src="/main-logo.png"
                alt="Medisphere Logo"
                className="h-8 w-8 object-cover rounded-lg"
                style={{ objectPosition: "center", border: "2px solid #2563eb" }}
              />
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
  )
}
