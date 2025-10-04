"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Hospital, Users, MapPin, Heart, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import { format, parseISO } from "date-fns"

import {
  createHospital,
  updateHospital,
  deleteHospital,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  createMedicalStore,
  updateMedicalStore,
  deleteMedicalStore,
} from "@/lib/admin-actions"

interface AdminDashboardProps {
  stats: {
    hospitals: number
    doctors: number
    medicalStores: number
    users: number
    bloodRequests: number
    donors: number
  }
  recentData: {
    hospitals: any[]
    doctors: any[]
    stores: any[]
    users: any[]
  }
}

export default function AdminDashboard({ stats: initialStats, recentData: initialData }: AdminDashboardProps) {
  const [stats, setStats] = useState(initialStats)
  const [recentData, setRecentData] = useState(initialData)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const [isHospitalDialogOpen, setIsHospitalDialogOpen] = useState(false)
  const [isDoctorDialogOpen, setIsDoctorDialogOpen] = useState(false)
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [hospitalFormData, setHospitalFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    specialities: "",
    emergency_services: false,
  })

  const [doctorFormData, setDoctorFormData] = useState({
    hospital_id: "",
    name: "",
    specialization: "",
    qualification: "",
    experience_years: "",
    phone: "",
    email: "",
    consultation_fee: "",
    available_days: [] as string[],
    available_hours: "",
  })

  const [storeFormData, setStoreFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    license_number: "",
    operating_hours: "",
  })

  const supabase = createClient()

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const refreshData = async () => {
    try {
      console.log("[v0] Starting data refresh...")

      // Fetch updated stats
      const [hospitalsCount, doctorsCount, storesCount, usersCount, bloodRequestsCount, donorsCount] =
        await Promise.all([
          supabase.from("hospitals").select("*", { count: "exact", head: true }),
          supabase.from("doctors").select("*", { count: "exact", head: true }),
          supabase.from("medical_stores").select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("blood_requests").select("*", { count: "exact", head: true }),
          supabase.from("blood_donors").select("*", { count: "exact", head: true }),
        ])

      console.log("[v0] Stats fetched:", {
        hospitals: hospitalsCount.count,
        doctors: doctorsCount.count,
        stores: storesCount.count,
        users: usersCount.count,
        bloodRequests: bloodRequestsCount.count,
        donors: donorsCount.count,
      })

      setStats({
        hospitals: hospitalsCount.count || 0,
        doctors: doctorsCount.count || 0,
        medicalStores: storesCount.count || 0,
        users: usersCount.count || 0,
        bloodRequests: bloodRequestsCount.count || 0,
        donors: donorsCount.count || 0,
      })

      // Fetch updated recent data
      const [hospitals, doctors, stores, users] = await Promise.all([
        supabase.from("hospitals").select("*").order("created_at", { ascending: false }).limit(10),
        supabase.from("doctors").select("*, hospitals(name)").order("created_at", { ascending: false }).limit(10),
        supabase.from("medical_stores").select("*").order("created_at", { ascending: false }).limit(10),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(10),
      ])

      console.log("[v0] Recent data fetched:", {
        hospitals: hospitals.data?.length || 0,
        doctors: doctors.data?.length || 0,
        stores: stores.data?.length || 0,
        users: users.data?.length || 0,
      })

      setRecentData({
        hospitals: hospitals.data || [],
        doctors: doctors.data || [],
        stores: stores.data || [],
        users: users.data || [],
      })

      console.log("[v0] Data refresh completed successfully")
    } catch (error) {
      console.error("[v0] Error refreshing data:", error)
    }
  }

  const specialities = [
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

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const resetForms = () => {
    setHospitalFormData({
      name: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      specialities: "",
      emergency_services: false,
    })
    setDoctorFormData({
      hospital_id: "",
      name: "",
      specialization: "",
      qualification: "",
      experience_years: "",
      phone: "",
      email: "",
      consultation_fee: "",
      available_days: [],
      available_hours: "",
    })
    setStoreFormData({
      name: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      license_number: "",
      operating_hours: "",
    })
    setEditingItem(null)
  }

  const handleHospitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const hospitalData = {
        ...hospitalFormData,
        specialities: hospitalFormData.specialities.split(",").map((s) => s.trim()),
        rating: 0,
      }

      console.log("[v0] Submitting hospital data:", hospitalData)

      let result
      if (editingItem) {
        result = await updateHospital(editingItem.id, hospitalData)
      } else {
        result = await createHospital(hospitalData)
      }

      if (result.success) {
        console.log("[v0] Hospital operation successful")
        showNotification("success", editingItem ? "Hospital updated successfully!" : "Hospital added successfully!")
        setIsHospitalDialogOpen(false)
        resetForms()
        console.log("[v0] Refreshing data after hospital operation...")
        await refreshData()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("[v0] Error saving hospital:", error)
      showNotification("error", "Failed to save hospital. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const doctorData = {
        ...doctorFormData,
        experience_years: parseInt(doctorFormData.experience_years) || 0,
        consultation_fee: parseFloat(doctorFormData.consultation_fee) || 0,
        rating: 0,
      }

      let result
      if (editingItem) {
        result = await updateDoctor(editingItem.id, doctorData)
      } else {
        result = await createDoctor(doctorData)
      }

      if (result.success) {
        showNotification("success", editingItem ? "Doctor updated successfully!" : "Doctor added successfully!")
        setIsDoctorDialogOpen(false)
        resetForms()
        await refreshData()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error saving doctor:", error)
      showNotification("error", "Failed to save doctor. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const storeData = {
        ...storeFormData,
        rating: 0,
      }

      let result
      if (editingItem) {
        result = await updateMedicalStore(editingItem.id, storeData)
      } else {
        result = await createMedicalStore(storeData)
      }

      if (result.success) {
        showNotification(
          "success",
          editingItem ? "Medical store updated successfully!" : "Medical store added successfully!",
        )
        setIsStoreDialogOpen(false)
        resetForms()
        await refreshData()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error saving store:", error)
      showNotification("error", "Failed to save medical store. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (table: string, id: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete this ${itemName}?`)) return

    try {
      let result
      if (table === "hospitals") {
        result = await deleteHospital(id)
      } else if (table === "doctors") {
        result = await deleteDoctor(id)
      } else if (table === "medical_stores") {
        result = await deleteMedicalStore(id)
      } else {
        throw new Error("Unknown table type")
      }

      if (result.success) {
        showNotification("success", `${itemName} deleted successfully!`)
        await refreshData()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      showNotification("error", `Failed to delete ${itemName}. Please try again.`)
    }
  }

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item)

    if (type === "hospital") {
      setHospitalFormData({
        name: item.name,
        address: item.address,
        city: item.city || "",
        phone: item.phone,
        email: item.email || "",
        specialities: item.specialities.join(", "),
        emergency_services: item.emergency_services,
      })
      setIsHospitalDialogOpen(true)
    } else if (type === "doctor") {
      setDoctorFormData({
        hospital_id: item.hospital_id,
        name: item.name,
        specialization: item.specialization,
        qualification: item.qualification,
        experience_years: item.experience_years.toString(),
        phone: item.phone || "",
        email: item.email || "",
        consultation_fee: item.consultation_fee?.toString() || "",
        available_days: item.available_days || [],
        available_hours: item.available_hours || "",
      })
      setIsDoctorDialogOpen(true)
    } else if (type === "store") {
      setStoreFormData({
        name: item.name,
        address: item.address,
        city: item.city || "",
        phone: item.phone,
        email: item.email || "",
        license_number: item.license_number || "",
        operating_hours: item.operating_hours || "",
      })
      setIsStoreDialogOpen(true)
    }
  }

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {notification.type === "success" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Hospital className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.hospitals}</p>
                <p className="text-sm text-gray-600">Hospitals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.doctors}</p>
                <p className="text-sm text-gray-600">Doctors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.medicalStores}</p>
                <p className="text-sm text-gray-600">Stores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
                <p className="text-sm text-gray-600">Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.bloodRequests}</p>
                <p className="text-sm text-gray-600">Blood Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.donors}</p>
                <p className="text-sm text-gray-600">Donors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="hospitals" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="stores">Medical Stores</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        {/* Hospitals Tab */}
        <TabsContent value="hospitals" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Manage Hospitals</h3>
            <Dialog open={isHospitalDialogOpen} onOpenChange={setIsHospitalDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={resetForms}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hospital
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit" : "Add"} Hospital</DialogTitle>
                  <DialogDescription>{editingItem ? "Update" : "Add a new"} hospital to the platform</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleHospitalSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Hospital Name</Label>
                    <Input
                      id="name"
                      value={hospitalFormData.name}
                      onChange={(e) => setHospitalFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={hospitalFormData.address}
                      onChange={(e) => setHospitalFormData((prev) => ({ ...prev, address: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={hospitalFormData.city}
                      onChange={(e) => setHospitalFormData((prev) => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={hospitalFormData.phone}
                      onChange={(e) => setHospitalFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={hospitalFormData.email}
                      onChange={(e) => setHospitalFormData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>specialities</Label>
                    <Input
                      id="specialities"
                      value={hospitalFormData.specialities}
                      onChange={(e) => setHospitalFormData((prev) => ({ ...prev, specialities: e.target.value }))}
                      placeholder="Enter specialities separated by commas"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emergency_services"
                      checked={hospitalFormData.emergency_services}
                      onChange={(e) =>
                        setHospitalFormData((prev) => ({ ...prev, emergency_services: e.target.checked }))
                      }
                    />
                    <Label htmlFor="emergency_services">24/7 Emergency Services</Label>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                      {isLoading ? "Saving..." : editingItem ? "Update" : "Add"} Hospital
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsHospitalDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Hospitals</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Emergency</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentData.hospitals.map((hospital) => (
                    <TableRow key={hospital.id}>
                      <TableCell className="font-medium">{hospital.name}</TableCell>
                      <TableCell>{hospital.address}</TableCell>
                      <TableCell>{hospital.phone}</TableCell>
                      <TableCell>
                        {hospital.emergency_services ? (
                          <Badge className="bg-green-100 text-green-700">Yes</Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(hospital, "hospital")}
                            className="text-gray-600 hover:text-indigo-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("hospitals", hospital.id, "hospital")}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Doctors Tab */}
        <TabsContent value="doctors" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Manage Doctors</h3>
            <Dialog open={isDoctorDialogOpen} onOpenChange={setIsDoctorDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={resetForms}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Doctor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit" : "Add"} Doctor</DialogTitle>
                  <DialogDescription>{editingItem ? "Update" : "Add a new"} doctor to the platform</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleDoctorSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="hospital_id">Hospital</Label>
                    <Select
                      value={doctorFormData.hospital_id}
                      onValueChange={(value) => setDoctorFormData((prev) => ({ ...prev, hospital_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hospital" />
                      </SelectTrigger>
                      <SelectContent>
                        {recentData.hospitals.map((hospital) => (
                          <SelectItem key={hospital.id} value={hospital.id}>
                            {hospital.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="name">Doctor Name</Label>
                    <Input
                      id="name"
                      value={doctorFormData.name}
                      onChange={(e) => setDoctorFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Select
                      value={doctorFormData.specialization}
                      onValueChange={(value) => setDoctorFormData((prev) => ({ ...prev, specialization: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialities.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input
                      id="qualification"
                      value={doctorFormData.qualification}
                      onChange={(e) => setDoctorFormData((prev) => ({ ...prev, qualification: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience_years">Experience (years)</Label>
                      <Input
                        id="experience_years"
                        type="number"
                        value={doctorFormData.experience_years}
                        onChange={(e) => setDoctorFormData((prev) => ({ ...prev, experience_years: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="consultation_fee">Consultation Fee</Label>
                      <Input
                        id="consultation_fee"
                        type="number"
                        step="0.01"
                        value={doctorFormData.consultation_fee}
                        onChange={(e) => setDoctorFormData((prev) => ({ ...prev, consultation_fee: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={doctorFormData.phone}
                      onChange={(e) => setDoctorFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={doctorFormData.email}
                      onChange={(e) => setDoctorFormData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="available_hours">Available Hours</Label>
                    <Input
                      id="available_hours"
                      value={doctorFormData.available_hours}
                      onChange={(e) => setDoctorFormData((prev) => ({ ...prev, available_hours: e.target.value }))}
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                      {isLoading ? "Saving..." : editingItem ? "Update" : "Add"} Doctor
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDoctorDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentData.doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">{doctor.name}</TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>{doctor.hospitals?.name}</TableCell>
                      <TableCell>{doctor.experience_years} years</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(doctor, "doctor")}
                            className="text-gray-600 hover:text-indigo-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("doctors", doctor.id, "doctor")}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Stores Tab */}
        <TabsContent value="stores" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Manage Medical Stores</h3>
            <Dialog open={isStoreDialogOpen} onOpenChange={setIsStoreDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={resetForms}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Store
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit" : "Add"} Medical Store</DialogTitle>
                  <DialogDescription>
                    {editingItem ? "Update" : "Add a new"} medical store to the platform
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleStoreSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Store Name</Label>
                    <Input
                      id="name"
                      value={storeFormData.name}
                      onChange={(e) => setStoreFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={storeFormData.address}
                      onChange={(e) => setStoreFormData((prev) => ({ ...prev, address: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={storeFormData.city}
                      onChange={(e) => setStoreFormData((prev) => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={storeFormData.phone}
                      onChange={(e) => setStoreFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={storeFormData.email}
                      onChange={(e) => setStoreFormData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="license_number">License Number</Label>
                    <Input
                      id="license_number"
                      value={storeFormData.license_number}
                      onChange={(e) => setStoreFormData((prev) => ({ ...prev, license_number: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="operating_hours">Operating Hours</Label>
                    <Input
                      id="operating_hours"
                      value={storeFormData.operating_hours}
                      onChange={(e) => setStoreFormData((prev) => ({ ...prev, operating_hours: e.target.value }))}
                      placeholder="e.g., 8:00 AM - 10:00 PM"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                      {isLoading ? "Saving..." : editingItem ? "Update" : "Add"} Store
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsStoreDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Medical Stores</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentData.stores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell>{store.address}</TableCell>
                      <TableCell>{store.phone}</TableCell>
                      <TableCell>{store.license_number || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(store, "store")}
                            className="text-gray-600 hover:text-indigo-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("medical_stores", store.id, "medical store")}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Platform Users</h3>
          </div>

          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentData.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(parseISO(user.created_at), "MMM dd, yyyy")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
