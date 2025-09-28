import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Phone, Mail, Star, Clock, Shield, ArrowLeft, Navigation, Award, CheckCircle, Pill } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function MedicalStoreDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get medical store details
  const { data: store } = await supabase.from("medical_stores").select("*").eq("id", id).single()

  if (!store) {
    notFound()
  }

  const getOperatingStatus = (operatingHours: string) => {
    if (operatingHours === "24/7") {
      return { status: "Open 24/7", color: "bg-green-100 text-green-700" }
    }
    return { status: "Open", color: "bg-green-100 text-green-700" }
  }


  // Helper for Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ', ' + store.address)}`;

  const operatingStatus = getOperatingStatus(store.operating_hours)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Medisphere</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/medical-stores"
              className="text-gray-700 hover:text-green-600 flex items-center px-4 py-2 rounded transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stores
            </Link>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* Store Details */}
        <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-xl mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-600 p-3 rounded-xl">
                    <Pill className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl text-gray-900">{store.name}</CardTitle>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-5 w-5" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-5 w-5" />
                    <span>{store.phone}</span>
                  </div>
                  {store.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-5 w-5" />
                      <span>{store.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-medium text-lg">{store.rating}</span>
                      <span className="text-gray-600">({Math.floor(Math.random() * 300) + 50} reviews)</span>
                    </div>
                    <Badge className={operatingStatus.color}>
                      <Clock className="h-4 w-4 mr-1" />
                      {operatingStatus.status}
                    </Badge>
                    {store.license_number && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Shield className="h-4 w-4 mr-1" />
                        Licensed Pharmacy
                      </Badge>
                    )}
                    <Badge className="bg-blue-100 text-blue-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Verified Store
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    Store Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operating Hours:</span>
                      <span className="font-medium">{store.operating_hours}</span>
                    </div>
                    {store.license_number && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">License Number:</span>
                        <span className="font-medium">{store.license_number}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{store.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Available Services</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Badge variant="outline" className="justify-center py-2 hover:bg-green-50 transition-colors">
                      Prescription Medicines
                    </Badge>
                    <Badge variant="outline" className="justify-center py-2 hover:bg-green-50 transition-colors">
                      OTC Medications
                    </Badge>
                    <Badge variant="outline" className="justify-center py-2 hover:bg-green-50 transition-colors">
                      Health Supplements
                    </Badge>
                    <Badge variant="outline" className="justify-center py-2 hover:bg-green-50 transition-colors">
                      Medical Devices
                    </Badge>
                    <Badge variant="outline" className="justify-center py-2 hover:bg-green-50 transition-colors">
                      Health Consultation
                    </Badge>
                    <Badge variant="outline" className="justify-center py-2 hover:bg-green-50 transition-colors">
                      Home Delivery
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full bg-green-600 hover:bg-green-700 h-12 shadow-lg hover:shadow-xl transition-all">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Store
                    </Button>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button 
                        variant="outline" 
                        className="w-full border-green-200 hover:bg-green-50 h-12 bg-transparent shadow-md hover:shadow-lg transition-all"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                    </a>
                    <Button variant="outline" className="w-full border-green-200 hover:bg-green-50 h-12 bg-transparent shadow-md hover:shadow-lg transition-all">
                      <Clock className="h-4 w-4 mr-2" />
                      Check Medicine Availability
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Emergency Contact</h3>
                  <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-md">
                    <CardContent className="p-4">
                      <p className="text-sm text-red-700 mb-2">For urgent medicine requirements or emergencies:</p>
                      <p className="font-medium text-red-800">{store.phone}</p>
                      <p className="text-xs text-red-600 mt-2">Available during operating hours</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Popular Medicines</CardTitle>
              <CardDescription>Commonly available medications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span>Paracetamol</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    In Stock
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span>Ibuprofen</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    In Stock
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span>Aspirin</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    In Stock
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span>Cough Syrup</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                    Limited Stock
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Antibiotics</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Prescription Required
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Customer Reviews</CardTitle>
              <CardDescription>What customers are saying</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">John D.</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    "Great service and always have the medicines I need. Staff is very helpful."
                  </p>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-600">Sarah M.</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    "Convenient location and good prices. Sometimes busy during peak hours."
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">Mike R.</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    "Excellent pharmacy with knowledgeable pharmacists. Highly recommended!"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
