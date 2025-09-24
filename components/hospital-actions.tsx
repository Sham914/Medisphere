"use client"

import { Button } from "@/components/ui/button"
import { Navigation, Phone, Calendar } from "lucide-react"

interface HospitalActionsProps {
  address: string
  name: string
  phone?: string
}

export default function HospitalActions({ address, name, phone }: HospitalActionsProps) {
  const openGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(`${name}, ${address}`)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    window.open(url, '_blank')
  }

  const callHospital = () => {
    if (phone) {
      window.open(`tel:${phone}`)
    }
  }

  return (
    <div className="flex gap-3 pt-4">
      <Button 
        className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
        onClick={openGoogleMaps}
      >
        <Navigation className="h-4 w-4 mr-2" />
        Get Directions
      </Button>
      <Button 
        variant="outline" 
        className="border-blue-200 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all"
        onClick={callHospital}
        disabled={!phone}
      >
        <Phone className="h-4 w-4 mr-2" />
        Call Hospital
      </Button>
      <Button 
        variant="outline" 
        className="border-green-200 hover:bg-green-50 shadow-md hover:shadow-lg transition-all"
      >
        <Calendar className="h-4 w-4 mr-2" />
        Book Appointment
      </Button>
    </div>
  )
}
