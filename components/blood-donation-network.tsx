"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Plus, MapPin, Phone, Clock, AlertTriangle, Users, Droplets } from "lucide-react"
import { format, parseISO } from "date-fns"

interface BloodDonationNetworkProps {
  userId: string
  donorProfile: any
  bloodRequests: any[]
  availableDonors: any[]
}

export default function BloodDonationNetwork({
  userId,
  donorProfile,
  bloodRequests: initialBloodRequests,
  availableDonors: initialAvailableDonors,
}: BloodDonationNetworkProps) {
  const [bloodRequests, setBloodRequests] = useState<any[]>(initialBloodRequests)
  const [availableDonors, setAvailableDonors] = useState<any[]>(initialAvailableDonors)
  const [isDonorDialogOpen, setIsDonorDialogOpen] = useState(false)
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [donorFormData, setDonorFormData] = useState({
    name: "",
    blood_type: "",
    age: "",
    weight: "",
    last_donation_date: "",
    medical_conditions: "",
    emergency_contact: "",
    location: "",
  })

  const [requestFormData, setRequestFormData] = useState({
    patient_name: "",
    blood_type: "",
    units_needed: "",
    urgency: "medium",
    hospital_name: "",
    hospital_address: "",
    contact_phone: "",
    additional_info: "",
  })

  const supabase = createClient()

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const urgencyLevels = [
    { value: "low", label: "Low", color: "bg-blue-100 text-blue-700" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-700" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-700" },
    { value: "critical", label: "Critical", color: "bg-red-100 text-red-700" },
  ]

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const donorData = {
        ...donorFormData,
        user_id: userId,
        age: Number.parseInt(donorFormData.age),
        weight: Number.parseFloat(donorFormData.weight),
        is_available: true,
        last_donation_date: donorFormData.last_donation_date || null,
      }

      if (donorProfile) {
        const { data, error } = await supabase
          .from("blood_donors")
          .update(donorData)
          .eq("id", donorProfile.id)
          .select()
          .single()

        if (error) throw error
      } else {
        const { data, error } = await supabase.from("blood_donors").insert(donorData).select().single()

        if (error) throw error
      }

      setIsDonorDialogOpen(false)
      window.location.reload() // Refresh to get updated data
    } catch (error) {
      console.error("Error saving donor profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const requestData = {
        ...requestFormData,
        requester_id: userId,
        units_needed: Number.parseInt(requestFormData.units_needed),
        status: "active",
      }

      const { data, error } = await supabase.from("blood_requests").insert(requestData).select().single()

      if (error) throw error

      setBloodRequests((prev) => [data, ...prev])
      setIsRequestDialogOpen(false)
      setRequestFormData({
        patient_name: "",
        blood_type: "",
        units_needed: "",
        urgency: "medium",
        hospital_name: "",
        hospital_address: "",
        contact_phone: "",
        additional_info: "",
      })
    } catch (error) {
      console.error("Error creating blood request:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDonorAvailability = async () => {
    if (!donorProfile) return

    try {
      const { data, error } = await supabase
        .from("blood_donors")
        .update({ is_available: !donorProfile.is_available })
        .eq("id", donorProfile.id)
        .select()
        .single()

      if (error) throw error

      window.location.reload() // Refresh to get updated data
    } catch (error) {
      console.error("Error updating availability:", error)
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    const level = urgencyLevels.find((l) => l.value === urgency)
    return level || urgencyLevels[1]
  }

  const getCompatibleDonors = (bloodType: string) => {
    const compatibility = {
      "A+": ["A+", "A-", "O+", "O-"],
      "A-": ["A-", "O-"],
      "B+": ["B+", "B-", "O+", "O-"],
      "B-": ["B-", "O-"],
      "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      "AB-": ["A-", "B-", "AB-", "O-"],
      "O+": ["O+", "O-"],
      "O-": ["O-"],
    }

    return availableDonors.filter((donor) =>
      compatibility[bloodType as keyof typeof compatibility]?.includes(donor.blood_type),
    )
  }

  // Initialize donor form if profile exists
  useEffect(() => {
    if (donorProfile) {
      setDonorFormData({
        name: donorProfile.name || "",
        blood_type: donorProfile.blood_type,
        age: donorProfile.age?.toString() || "",
        weight: donorProfile.weight?.toString() || "",
        last_donation_date: donorProfile.last_donation_date || "",
        medical_conditions: donorProfile.medical_conditions || "",
        emergency_contact: donorProfile.emergency_contact || "",
        location: donorProfile.location || "",
      })
    }
  }, [donorProfile])

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{bloodRequests.length}</p>
                <p className="text-sm text-gray-600">Active Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{availableDonors.length}</p>
                <p className="text-sm text-gray-600">Available Donors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Droplets className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {donorProfile?.is_available ? "Available" : "Not Available"}
                </p>
                <p className="text-sm text-gray-600">Your Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donor Profile Section */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-600" />
            Your Donor Profile
          </CardTitle>
          <CardDescription>
            {donorProfile
              ? "Manage your blood donor information and availability"
              : "Join our blood donation network and help save lives"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {donorProfile ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Blood Type:</span>
                  <p className="font-medium text-lg">{donorProfile.blood_type}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Age:</span>
                  <p className="font-medium">{donorProfile.age} years</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Weight:</span>
                  <p className="font-medium">{donorProfile.weight} kg</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Last Donation:</span>
                  <p className="font-medium">
                    {donorProfile.last_donation_date
                      ? format(parseISO(donorProfile.last_donation_date), "MMM dd, yyyy")
                      : "Never"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Dialog open={isDonorDialogOpen} onOpenChange={setIsDonorDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-red-200 hover:bg-red-50 bg-transparent">
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Update Donor Profile</DialogTitle>
                      <DialogDescription>Update your blood donor information</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleDonorSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={donorFormData.name}
                          onChange={(e) => setDonorFormData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="blood_type">Blood Type</Label>
                        <Select
                          value={donorFormData.blood_type}
                          onValueChange={(value) => setDonorFormData((prev) => ({ ...prev, blood_type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                          <SelectContent>
                            {bloodTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            value={donorFormData.age}
                            onChange={(e) => setDonorFormData((prev) => ({ ...prev, age: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            value={donorFormData.weight}
                            onChange={(e) => setDonorFormData((prev) => ({ ...prev, weight: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="last_donation_date">Last Donation Date</Label>
                        <Input
                          id="last_donation_date"
                          type="date"
                          value={donorFormData.last_donation_date}
                          onChange={(e) =>
                            setDonorFormData((prev) => ({ ...prev, last_donation_date: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={donorFormData.location}
                          onChange={(e) => setDonorFormData((prev) => ({ ...prev, location: e.target.value }))}
                          placeholder="City, State"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergency_contact">Emergency Contact</Label>
                        <Input
                          id="emergency_contact"
                          value={donorFormData.emergency_contact}
                          onChange={(e) => setDonorFormData((prev) => ({ ...prev, emergency_contact: e.target.value }))}
                          placeholder="Phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="medical_conditions">Medical Conditions</Label>
                        <Textarea
                          id="medical_conditions"
                          value={donorFormData.medical_conditions}
                          onChange={(e) =>
                            setDonorFormData((prev) => ({ ...prev, medical_conditions: e.target.value }))
                          }
                          placeholder="Any medical conditions or medications"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700" disabled={isLoading}>
                          {isLoading ? "Updating..." : "Update Profile"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDonorDialogOpen(false)}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={toggleDonorAvailability}
                  className={
                    donorProfile.is_available ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
                  }
                >
                  {donorProfile.is_available ? "Mark Unavailable" : "Mark Available"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Become a Blood Donor</h3>
              <p className="text-gray-600 mb-4">Join our network and help save lives in your community</p>
              <Dialog open={isDonorDialogOpen} onOpenChange={setIsDonorDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Register as Donor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Register as Blood Donor</DialogTitle>
                    <DialogDescription>Join our blood donation network</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleDonorSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="blood_type">Blood Type</Label>
                      <Select
                        value={donorFormData.blood_type}
                        onValueChange={(value) => setDonorFormData((prev) => ({ ...prev, blood_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={donorFormData.age}
                          onChange={(e) => setDonorFormData((prev) => ({ ...prev, age: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          value={donorFormData.weight}
                          onChange={(e) => setDonorFormData((prev) => ({ ...prev, weight: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={donorFormData.location}
                        onChange={(e) => setDonorFormData((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="City, State"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_contact">Emergency Contact</Label>
                      <Input
                        id="emergency_contact"
                        value={donorFormData.emergency_contact}
                        onChange={(e) => setDonorFormData((prev) => ({ ...prev, emergency_contact: e.target.value }))}
                        placeholder="Phone number"
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDonorDialogOpen(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="requests" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="requests">Blood Requests</TabsTrigger>
            <TabsTrigger value="donors">Available Donors</TabsTrigger>
          </TabsList>
          <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Request Blood
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Blood Request</DialogTitle>
                <DialogDescription>Request blood for a patient in need</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="patient_name">Patient Name</Label>
                  <Input
                    id="patient_name"
                    value={requestFormData.patient_name}
                    onChange={(e) => setRequestFormData((prev) => ({ ...prev, patient_name: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="blood_type">Blood Type</Label>
                    <Select
                      value={requestFormData.blood_type}
                      onValueChange={(value) => setRequestFormData((prev) => ({ ...prev, blood_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="units_needed">Units Needed</Label>
                    <Input
                      id="units_needed"
                      type="number"
                      value={requestFormData.units_needed}
                      onChange={(e) => setRequestFormData((prev) => ({ ...prev, units_needed: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select
                    value={requestFormData.urgency}
                    onValueChange={(value) => setRequestFormData((prev) => ({ ...prev, urgency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hospital_name">Hospital Name</Label>
                  <Input
                    id="hospital_name"
                    value={requestFormData.hospital_name}
                    onChange={(e) => setRequestFormData((prev) => ({ ...prev, hospital_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hospital_address">Hospital Address</Label>
                  <Input
                    id="hospital_address"
                    value={requestFormData.hospital_address}
                    onChange={(e) => setRequestFormData((prev) => ({ ...prev, hospital_address: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={requestFormData.contact_phone}
                    onChange={(e) => setRequestFormData((prev) => ({ ...prev, contact_phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="additional_info">Additional Information</Label>
                  <Textarea
                    id="additional_info"
                    value={requestFormData.additional_info}
                    onChange={(e) => setRequestFormData((prev) => ({ ...prev, additional_info: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Request"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRequestDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="requests" className="space-y-4">
          {bloodRequests.length > 0 ? (
            <div className="grid gap-4">
              {bloodRequests.map((request) => {
                const urgencyBadge = getUrgencyBadge(request.urgency)
                const compatibleDonors = getCompatibleDonors(request.blood_type)

                return (
                  <Card key={request.id} className="bg-white border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900 mb-2">
                            Blood Needed for {request.patient_name}
                          </CardTitle>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-red-100 text-red-700 text-sm px-3 py-1">{request.blood_type}</Badge>
                            <Badge className={urgencyBadge.color}>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {urgencyBadge.label}
                            </Badge>
                            <span className="text-sm text-gray-600">{request.units_needed} units needed</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {request.hospital_name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {request.contact_phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {format(parseISO(request.created_at), "MMM dd, yyyy")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600 block mb-1">Hospital Address:</span>
                          <p className="text-sm text-gray-700">{request.hospital_address}</p>
                        </div>
                        {request.additional_info && (
                          <div>
                            <span className="text-sm text-gray-600 block mb-1">Additional Information:</span>
                            <p className="text-sm text-gray-700">{request.additional_info}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm text-gray-600">
                            {compatibleDonors.length} compatible donors available
                          </span>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <Phone className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active blood requests</h3>
                <p className="text-gray-600">Blood requests will appear here when posted</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="donors" className="space-y-4">
          {availableDonors.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {availableDonors.map((donor) => (
                <Card key={donor.id} className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 mb-2">Blood Type: {donor.blood_type}</CardTitle>
                        <div className="mt-1 text-base font-semibold text-gray-900">{donor.name || "Unknown Donor"}</div>
                        <div className="flex items-center gap-3 mb-2 mt-1">
                          <Badge className="bg-green-100 text-green-700">Available</Badge>
                          <span className="text-sm text-gray-600">{donor.age} years old</span>
                          {donor.weight && <span className="text-sm text-gray-600">{donor.weight} kg</span>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {donor.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {donor.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Last donation: {donor.last_donation_date
                              ? format(parseISO(donor.last_donation_date), "MMM yyyy")
                              : "Never"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Donor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No available donors</h3>
                <p className="text-gray-600">Available donors will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
