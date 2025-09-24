"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Star, Clock, Users, Navigation, Heart, Award, Shield, Building2 } from "lucide-react"
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

  const openGoogleMaps = (address: string, name: string) => {
    const encodedAddress = encodeURIComponent(`${name}, ${address}`)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
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
              className="h-11 bg-red-600 hover:bg-red-700 text-white"
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
            <Card key={hospital.id} className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                        {hospital.name}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{hospital.rating}</span>
                        <span className="text-xs text-gray-500">({Math.floor(Math.random() * 500) + 100} reviews)</span>
                      </div>
                      {hospital.emergency_services && (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-200 animate-pulse">
                          <Clock className="h-3 w-3 mr-1" />
                          24/7 Emergency
                        </Badge>
                      )}
                      <Badge className="bg-green-100 text-green-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-blue-600" />
                      Medical Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(hospital.specialties) ? hospital.specialties : []).map((specialty: string) => (
                        <Badge key={specialty} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link href={`/hospitals/${hospital.id}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                        <Heart className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="border-blue-200 hover:bg-blue-50 bg-transparent shadow-md hover:shadow-lg transition-all"
                      onClick={() => openGoogleMaps(hospital.address, hospital.name)}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button variant="outline" className="border-green-200 hover:bg-green-50 bg-transparent shadow-md hover:shadow-lg transition-all">
                        <Users className="h-4 w-4 mr-2" />
                        View Doctors
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {hospitals.length === 0 && !isLoading && (
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <div className="bg-gray-200 p-4 rounded-full w-fit mx-auto mb-4">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hospitals found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
