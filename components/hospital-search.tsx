"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Star, Clock, Users } from "lucide-react"
import Link from "next/link"

interface HospitalSearchProps {
  initialHospitals: any[]
}

export default function HospitalSearch({ initialHospitals }: HospitalSearchProps) {
  const [hospitals, setHospitals] = useState<any[]>(initialHospitals)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [emergencyOnly, setEmergencyOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  const specialties = [
    "Cardiology",
    "Emergency",
    "Surgery",
    "Pediatrics",
    "Orthopedics",
    "Neurology",
    "Dermatology",
    "Gynecology",
    "Internal Medicine",
    "Radiology",
  ]

  const searchHospitals = async () => {
    setIsLoading(true)

    let query = supabase.from("hospitals").select("*")

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
    }

    if (selectedSpecialty !== "all") {
      query = query.contains("specialties", [selectedSpecialty])
    }

    if (emergencyOnly) {
      query = query.eq("emergency_services", true)
    }

    const { data, error } = await query.order("rating", { ascending: false }).limit(20)
    setHospitals(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchHospitals()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, selectedSpecialty, emergencyOnly])

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 22h20L12 2z"></path>
              <path d="M12 18h.01"></path>
            </svg>
            Search Hospitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by hospital name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11"
              />
            </div>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={emergencyOnly ? "default" : "outline"}
              onClick={() => setEmergencyOnly(!emergencyOnly)}
              className="h-11"
            >
              Emergency Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {isLoading ? "Searching..." : `${hospitals.length} hospitals found`}
          </h3>
        </div>

        <div className="grid gap-6">
          {hospitals.map((hospital) => (
            <Card key={hospital.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 mb-2">{hospital.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {hospital.address}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {hospital.phone}
                      </div>
                      {hospital.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {hospital.email}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{hospital.rating}</span>
                      </div>
                      {hospital.emergency_services && (
                        <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200">
                          <Clock className="h-3 w-3 mr-1" />
                          24/7 Emergency
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {hospital.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="bg-blue-100 text-blue-700">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/hospitals/${hospital.id}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700">View Details</Button>
                    </Link>
                    <Link href={`/hospitals/${hospital.id}/doctors`}>
                      <Button variant="outline" className="border-blue-200 hover:bg-blue-50 bg-transparent">
                        <Users className="h-4 w-4 mr-2" />
                        View Doctors
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {hospitals.length === 0 && !isLoading && (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <svg
                className="h-12 w-12 text-gray-400 mx-auto mb-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 22h20L12 2z"></path>
                <path d="M12 18h.01"></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hospitals found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
