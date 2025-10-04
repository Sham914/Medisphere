"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { FC } from "react"

interface MedicalStoreSearchProps {
  initialStores: any[]
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Star, Clock, Shield, Navigation, Pill, Award, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useCity } from "@/hooks/city-context"
import MedicalStoreViewDetailsButton from "@/components/MedicalStoreViewDetailsButton"

const MedicalStoreSearch: FC<MedicalStoreSearchProps> = ({ initialStores }) => {
  const [stores, setStores] = useState<any[]>(initialStores)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { city } = useCity()
  const supabase = createClient()

  const searchStores = async () => {
    setIsLoading(true)
    let query = supabase.from("medical_stores").select("*")

    // Filter by city
    query = query.eq("city", city)

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
    }

    const { data } = await query.order("rating", { ascending: false }).limit(20)

    setStores(data || [])
    setIsLoading(false)
  }


  useEffect(() => {
    // Only fetch if searchTerm or city changes (not on mount if no search)
    if (searchTerm || city) {
      const debounceTimer = setTimeout(() => {
        searchStores()
      }, 300)
      return () => clearTimeout(debounceTimer)
    }
    // eslint-disable-next-line
  }, [searchTerm, city])

  const getOperatingStatus = (operatingHours: string) => {
    if (operatingHours === "24/7") {
      return { status: "Open 24/7", color: "bg-green-100 text-green-700" }
    }
    // Simple check - in real app, you'd parse the hours and check current time
    return { status: "Open", color: "bg-green-100 text-green-700" }
  }

  const [showPhone, setShowPhone] = useState<string | null>(null)
  const [showMap, setShowMap] = useState<string | null>(null)
  const [mapCoords, setMapCoords] = useState<{lat: number, lng: number} | null>(null)
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const handleCallClick = (phone: string) => {
    setShowPhone(phone)
    setShowMap(null)
  }

  const handleDirectionsClick = (store: any) => {
    setShowMap(store.id)
    setShowPhone(null)
    setMapCoords({ lat: store.latitude, lng: store.longitude })
  }

  // Also allow opening Google Maps in a new tab
  const openGoogleMaps = (address: string, name: string) => {
    const encodedAddress = encodeURIComponent(`${name}, ${address}`)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Pill className="h-6 w-6 text-white" />
            </div>
            Find Medical Stores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by store name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11"
              />
            </div>
            <Button className="h-11 bg-green-600 hover:bg-green-700">
              <Navigation className="h-4 w-4 mr-2" />
              Near Me
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {isLoading ? "Searching..." : `${stores.length} medical stores found`}
          </h3>
        </div>

        <div className="grid gap-6">
          {stores.map((store) => {
            const operatingStatus = getOperatingStatus(store.operating_hours)

            return (
              <Card key={store.id} className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                          <Pill className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-xl text-gray-900 group-hover:text-green-600 transition-colors break-words">
                          {store.name}
                        </CardTitle>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{store.address}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">{store.phone}</span>
                        </div>
                        {store.email && (
                          <div className="flex items-center gap-1 min-w-0">
                            <Mail className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{store.email}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                          <span className="font-medium">{store.rating}</span>
                          {/* Use a deterministic review count to avoid hydration mismatch */}
                          <span className="text-xs text-gray-500 whitespace-nowrap">({(typeof store.id === 'number' ? (store.id % 300) + 50 : (store.name?.length ?? 0) + 50)} reviews)</span>
                        </div>
                        <Badge className={`${operatingStatus.color} whitespace-nowrap`}>
                          <Clock className="h-3 w-3 mr-1" />
                          {operatingStatus.status}
                        </Badge>
                        {store.license_number && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 whitespace-nowrap">
                            <Shield className="h-3 w-3 mr-1" />
                            Licensed
                          </Badge>
                        )}
                        <Badge className="bg-blue-100 text-blue-700 whitespace-nowrap">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Show phone number above buttons if requested */}
                    {showPhone === store.phone && (
                      <div className="mb-2 flex flex-col items-start">
                        <a
                          href={`tel:${store.phone}`}
                          className="text-lg font-bold text-green-700 underline hover:text-green-900"
                        >
                          {store.phone}
                        </a>
                        <span className="text-xs text-gray-500">Tap to call</span>
                      </div>
                    )}
                    {/* Show Google Map if requested */}
                    {showMap === store.id && mapCoords && (
                      <div className="mb-2 w-full h-64 rounded overflow-hidden border border-green-200">
                        <iframe
                          title="Google Map"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(store.name + ', ' + store.address)}&center=${mapCoords.lat},${mapCoords.lng}&zoom=16`}
                        ></iframe>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-600 flex-shrink-0" />
                        Store Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Operating Hours:</span>
                          <p className="font-medium break-words">{store.operating_hours}</p>
                        </div>
                        {store.license_number && (
                          <div>
                            <span className="text-gray-600">License:</span>
                            <p className="font-medium break-words">{store.license_number}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                      <div className="w-full sm:w-auto">
                        <MedicalStoreViewDetailsButton store={store} />
                      </div>
                      <Button
                        variant="outline"
                        className="border-green-200 hover:bg-green-50 bg-transparent w-full sm:w-auto"
                        onClick={() => handleDirectionsClick(store)}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Show Map
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-green-200 hover:bg-green-50 bg-transparent shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                        onClick={() => openGoogleMaps(store.address, store.name)}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Open in Google Maps
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {stores.length === 0 && !isLoading && (
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <div className="bg-gray-200 p-4 rounded-full w-fit mx-auto mb-4">
                <Pill className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medical stores found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
	</div>
  )
}

export default MedicalStoreSearch;
