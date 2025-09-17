"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Star, Clock, Shield } from "lucide-react"
import Link from "next/link"

interface MedicalStoreSearchProps {
  initialStores: any[]
}

export default function MedicalStoreSearch({ initialStores }: MedicalStoreSearchProps) {
  const [stores, setStores] = useState<any[]>(initialStores)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  const searchStores = async () => {
    setIsLoading(true)
    let query = supabase.from("medical_stores").select("*")

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
    }

    const { data } = await query.order("rating", { ascending: false }).limit(20)

    setStores(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchStores()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const getOperatingStatus = (operatingHours: string) => {
    if (operatingHours === "24/7") {
      return { status: "Open 24/7", color: "bg-green-100 text-green-700" }
    }
    // Simple check - in real app, you'd parse the hours and check current time
    return { status: "Open", color: "bg-green-100 text-green-700" }
  }

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
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
              <MapPin className="h-4 w-4 mr-2" />
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
              <Card key={store.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 mb-2">{store.name}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {store.address}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {store.phone}
                        </div>
                        {store.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {store.email}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{store.rating}</span>
                        </div>
                        <Badge className={operatingStatus.color}>
                          <Clock className="h-3 w-3 mr-1" />
                          {operatingStatus.status}
                        </Badge>
                        {store.license_number && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            <Shield className="h-3 w-3 mr-1" />
                            Licensed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Operating Hours:</span>
                        <p className="font-medium">{store.operating_hours}</p>
                      </div>
                      {store.license_number && (
                        <div>
                          <span className="text-gray-600">License:</span>
                          <p className="font-medium">{store.license_number}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/medical-stores/${store.id}`}>
                        <Button className="bg-green-600 hover:bg-green-700">View Details</Button>
                      </Link>
                      <Button variant="outline" className="border-green-200 hover:bg-green-50 bg-transparent">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Store
                      </Button>
                      <Button variant="outline" className="border-green-200 hover:bg-green-50 bg-transparent">
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {stores.length === 0 && !isLoading && (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medical stores found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
