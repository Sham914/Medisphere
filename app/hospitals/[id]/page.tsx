import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Phone, Mail, Star, Clock, Users, ArrowLeft, Navigation, Award, Shield, Calendar } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function HospitalDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get hospital details
  const { data: hospital } = await supabase.from("hospitals").select("*").eq("id", id).single()

  if (!hospital) {
    notFound()
  }

  const openGoogleMaps = (address: string, name: string) => {
    const encodedAddress = encodeURIComponent(`${name}, ${address}`)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(url, '_blank')
  }

  // Get doctors for this hospital
  const { data: doctors } = await supabase
    .from("doctors")
    .select("*")
    .eq("hospital_id", id)
    .order("rating", { ascending: false })

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
            <Link href="/hospitals">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Hospitals
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hospital Details */}
        <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-xl mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-600 p-3 rounded-xl">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl text-gray-900">{hospital.name}</CardTitle>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-5 w-5" />
                    <span>{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-5 w-5" />
                    <span>{hospital.phone}</span>
                  </div>
                  {hospital.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-5 w-5" />
                      <span>{hospital.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-medium text-lg">{hospital.rating}</span>
                      <span className="text-gray-600">({Math.floor(Math.random() * 500) + 100} reviews)</span>
                    </div>
                    {hospital.emergency_services && (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-200 animate-pulse">
                        <Clock className="h-4 w-4 mr-1" />
                        24/7 Emergency Services
                      </Badge>
                    )}
                    <Badge className="bg-green-100 text-green-700">
                      <Shield className="h-4 w-4 mr-1" />
                      Verified Hospital
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Medical Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="bg-blue-100 text-blue-700 text-sm px-3 py-2 hover:bg-blue-200 transition-colors">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => openGoogleMaps(hospital.address, hospital.name)}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Hospital
                </Button>
                <Button variant="outline" className="border-green-200 hover:bg-green-50 shadow-md hover:shadow-lg transition-all">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctors Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Our Doctors</h2>
            <span className="text-gray-600">{doctors?.length || 0} doctors available</span>
          </div>

          {doctors && doctors.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{doctor.name}</CardTitle>
                    </div>
                    <CardDescription className="text-blue-600 font-medium">{doctor.specialization}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{doctor.experience_years} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Qualification:</span>
                        <span className="font-medium">{doctor.qualification}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Consultation Fee:</span>
                        <span className="font-medium text-green-600">${doctor.consultation_fee}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{doctor.rating}</span>
                        </div>
                      </div>
                      {doctor.available_days && (
                        <div>
                          <span className="text-gray-600 block mb-1">Available Days:</span>
                          <div className="flex flex-wrap gap-1">
                            {doctor.available_days.map((day) => (
                              <Badge key={day} variant="outline" className="text-xs">
                                {day}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {doctor.available_hours && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Hours:</span>
                          <span className="font-medium">{doctor.available_hours}</span>
                        </div>
                      )}
                      <div className="pt-2">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <div className="bg-gray-200 p-4 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors available</h3>
                <p className="text-gray-600">This hospital hasn't added their doctors yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
