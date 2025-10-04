"use client"
import { useCity } from "@/hooks/city-context"
import Image from "next/image"
import { FaHospital, FaUserMd, FaCapsules, FaHeart, FaMapMarkerAlt } from "react-icons/fa"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { MdLocalPharmacy } from "react-icons/md"
import { IoMdMedkit } from "react-icons/io"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function DashboardContent({ profile }: { profile: any }) {
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

  const stats = [
    {
      label: "Hospitals",
      value: counts.hospitals,
      icon: <FaHospital size={32} className="text-blue-600" />,
      color: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      label: "Doctors",
      value: counts.doctors,
      icon: <FaUserMd size={32} className="text-green-600" />,
      color: "bg-green-50",
      text: "text-green-700",
    },
    {
      label: "Pharmacies",
      value: counts.pharmacies,
      icon: <MdLocalPharmacy size={32} className="text-purple-600" />,
      color: "bg-purple-50",
      text: "text-purple-700",
    },
    {
      label: "Donors",
      value: counts.donors,
      icon: <FaHeart size={32} className="text-red-600" />,
      color: "bg-red-50",
      text: "text-red-700",
    },
  ]

  const cards = [
    {
      title: "Find Hospitals & Doctors",
      description: "Search for nearby hospitals and connect with qualified doctors",
      icon: <FaHospital size={28} className="text-blue-600" />,
      badge: "Verified Healthcare Providers",
      badgeColor: "text-green-600",
      button: {
        label: "Explore Hospitals",
        href: "/hospitals",
        color: "bg-blue-600 hover:bg-blue-700",
        icon: <FaHospital size={18} />,
      },
    },
    {
      title: "Medical Stores",
      description: "Locate nearby pharmacies and medical stores",
      icon: <FaMapMarkerAlt size={28} className="text-green-600" />,
      badge: "Licensed Pharmacies",
      badgeColor: "text-green-600",
      button: {
        label: "Find Pharmacies",
        href: "/medical-stores",
        color: "bg-green-600 hover:bg-green-700",
        icon: <MdLocalPharmacy size={18} />,
      },
    },
    {
      title: "Medicine Reminders",
      description: "Manage your medication schedule and reminders",
      icon: <FaCapsules size={28} className="text-purple-600" />,
      badge: "Smart & Secure",
      badgeColor: "text-green-600",
      button: {
        label: "Manage Reminders",
        href: "/reminders",
        color: "bg-purple-600 hover:bg-purple-700",
        icon: <FaCapsules size={18} />,
      },
    },
    {
      title: "Blood Donation Network",
      description: "Connect with donors and requests",
      icon: <FaHeart size={28} className="text-red-600" />,
      badge: "Verified Donors",
      badgeColor: "text-red-600",
      button: {
        label: "Blood Donation",
        href: "/blood-donation",
        color: "bg-red-600 hover:bg-red-700",
        icon: <FaHeart size={18} />,
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg shadow-lg flex-shrink-0">
              <img src="/main-logo.png" alt="Medisphere Logo" className="h-6 w-6 sm:h-8 sm:w-8 object-cover rounded-lg" style={{objectPosition: 'center', border: '2px solid #2563eb'}} />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                Medisphere
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Your Healthcare Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* City Dropdown */}
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="h-8 sm:h-10 rounded border border-blue-300 px-2 sm:px-3 text-sm sm:text-base text-gray-700 bg-white shadow min-w-[120px] sm:min-w-[180px]"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-white rounded shadow hover:bg-blue-50">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                    <AvatarFallback className="text-sm">{profile.full_name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-900 text-sm sm:text-base hidden sm:inline truncate max-w-[100px]">Hi, {profile.full_name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Debug: Show current role */}
                <div className="px-3 py-1 text-xs text-gray-400">Role: {profile.role || 'unknown'}</div>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                {profile.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
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
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {profile.full_name}!</h2>
          <p className="text-gray-600">Your personalized healthcare dashboard. Select your city to see local hospitals, stores, and more.</p>
        </div>

        {/* Enhanced Hero Banner with Gradient */}
        <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 shadow-2xl">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-white">
              <div className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
                ✨ Your Health, Our Priority
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                24/7 Healthcare at Your Fingertips
              </h3>
              <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                Access verified hospitals, qualified doctors, nearby pharmacies, and connect with blood donors instantly. 
                All in one platform designed for your convenience.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/hospitals" className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform">
                  Find Hospitals
                </a>
                <a href="/blood-donation" className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all">
                  Emergency Blood
                </a>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-48 h-48 md:w-64 md:h-64 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <div className="text-6xl md:text-7xl mb-3">🏥</div>
                    <div className="text-white text-lg font-semibold">Healthcare Hub</div>
                    <div className="text-blue-200 text-sm">Trusted by thousands</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-4xl animate-bounce shadow-xl">
                  ⚡
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Strip */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/hospitals" className="flex flex-col items-center p-4 rounded-xl hover:bg-blue-50 transition-all group cursor-pointer">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaHospital size={24} className="text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 text-center">Find Hospital</span>
            </a>
            <a href="/medical-stores" className="flex flex-col items-center p-4 rounded-xl hover:bg-green-50 transition-all group cursor-pointer">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MdLocalPharmacy size={24} className="text-green-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 text-center">Pharmacy</span>
            </a>
            <a href="/reminders" className="flex flex-col items-center p-4 rounded-xl hover:bg-purple-50 transition-all group cursor-pointer">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaCapsules size={24} className="text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 text-center">Reminders</span>
            </a>
            <a href="/blood-donation" className="flex flex-col items-center p-4 rounded-xl hover:bg-red-50 transition-all group cursor-pointer">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FaHeart size={24} className="text-red-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 text-center">Blood Donor</span>
            </a>
          </div>
        </div>

        {/* Stats Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Network Statistics
          </h3>
          <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm">Live Data</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={stat.label + idx} className={`rounded-2xl shadow-sm p-4 sm:p-6 flex items-center gap-3 sm:gap-4 ${stat.color}`}>
              <div className="flex-shrink-0">{stat.icon}</div>
              <div className="min-w-0 flex-1">
                <div className={`text-xl sm:text-2xl font-bold ${stat.text}`}>{stat.value}</div>
                <div className="text-sm sm:text-base text-gray-600 font-medium truncate">{stat.label}</div>
              </div>
              <span className="ml-auto text-green-500 font-bold text-base sm:text-lg flex-shrink-0">↗</span>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
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

        {/* Why Choose Us Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Secure & Private</h4>
            <p className="text-sm text-gray-600">Your health data is encrypted and protected with industry-standard security protocols.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Lightning Fast</h4>
            <p className="text-sm text-gray-600">Find hospitals, doctors, and pharmacies instantly with our optimized search system.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Always Accurate</h4>
            <p className="text-sm text-gray-600">Real-time updates ensure you always get the most accurate and current information.</p>
          </div>
        </div>

        {/* Services Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Explore Our Services
          </h3>
          <p className="text-gray-600">Comprehensive healthcare solutions tailored for your needs</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card, idx) => (
            <div key={card.title + idx} className="rounded-2xl shadow-md p-4 sm:p-6 bg-white flex flex-col justify-between min-h-[200px] sm:min-h-[220px]">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-shrink-0">{card.icon}</div>
                <h2 className="text-lg sm:text-xl font-semibold break-words">{card.title}</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-2">{card.description}</p>
              <div className={`mb-4 font-medium ${card.badgeColor} flex items-center gap-2`}>
                <span className="inline-block bg-green-100 rounded px-2 py-1 text-xs font-semibold whitespace-nowrap">{card.badge}</span>
              </div>
              <a href={card.button.href} className={`mt-auto w-full flex items-center justify-center gap-2 text-white font-semibold py-2 rounded-xl transition ${card.button.color} text-sm sm:text-base`}
                style={{ textDecoration: "none" }}>
                <span className="flex-shrink-0">{card.button.icon}</span>
                <span className="truncate">{card.button.label}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

