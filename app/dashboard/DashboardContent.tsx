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
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white rounded shadow hover:bg-blue-50">
                  <Avatar>
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                    <AvatarFallback>{profile.full_name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-900">Hi, {profile.full_name}</span>
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={stat.label + idx} className={`rounded-2xl shadow-sm p-6 flex items-center gap-4 ${stat.color}`}>
              <div>{stat.icon}</div>
              <div>
                <div className={`text-2xl font-bold ${stat.text}`}>{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
              <span className="ml-auto text-green-500 font-bold text-lg">↗</span>
            </div>
          ))}
        </div>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div key={card.title + idx} className="rounded-2xl shadow-md p-6 bg-white flex flex-col justify-between min-h-[220px]">
              <div className="flex items-center gap-3 mb-2">
                {card.icon}
                <h2 className="text-xl font-semibold">{card.title}</h2>
              </div>
              <p className="text-gray-600 mb-2">{card.description}</p>
              <div className={`mb-4 font-medium ${card.badgeColor} flex items-center gap-2`}>
                <span className="inline-block bg-green-100 rounded px-2 py-1 text-xs font-semibold">{card.badge}</span>
              </div>
              <a href={card.button.href} className={`mt-auto w-full flex items-center justify-center gap-2 text-white font-semibold py-2 rounded-xl transition ${card.button.color}`}
                style={{ textDecoration: "none" }}>
                {card.button.icon}
                {card.button.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

