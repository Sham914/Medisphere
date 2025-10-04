import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Heart, Hospital, User, Stethoscope, Store, Droplet, Bell, Syringe } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import AdminDataManager from "@/components/AdminDataManager"

// Disable caching for admin page to always show fresh data
export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }
  // Check if user is admin based on role in public.profiles
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch all data for dashboard
  const [
    { count: hospitalsCount },
    { count: doctorsCount },
    { count: medicalStoresCount },
    { count: usersCount },
    { count: bloodRequestsCount },
    { count: donorsCount },
    { data: hospitals },
    { data: doctors },
    { data: stores },
    { data: bloodRequests },
    { data: bloodDonors },
  ] = await Promise.all([
    supabase.from("hospitals").select("*", { count: "exact", head: true }),
    supabase.from("doctors").select("*", { count: "exact", head: true }),
    supabase.from("medical_stores").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("blood_requests").select("*", { count: "exact", head: true }),
    supabase.from("blood_donors").select("*", { count: "exact", head: true }),
    supabase.from("hospitals").select("*"),
    supabase.from("doctors").select("*, hospitals(name)"),
    supabase.from("medical_stores").select("*"),
    supabase.from("blood_requests").select("*"),
    supabase.from("blood_donors").select("*")
  ])

  // Fetch users from public.users
  type UserRow = {
    id: string;
    email: string;
    full_name: string | null;
    created_at: string;
    role: string;
  };
  let allUsers: UserRow[] = [];
  let usersError: string | null = null;
  try {
    const { data, error } = await supabase.from("users").select("id, email, full_name, created_at, role");
    if (error) {
      usersError = error.message;
    } else if (data) {
      allUsers = data as UserRow[];
    }
  } catch (e) {
    if (e instanceof Error) {
      usersError = e.message;
    } else {
      usersError = "Unknown error fetching users.";
    }
  }

  // Helper for medicine badge
  function getMedicineBadge(status: string) {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-700">Available</Badge>;
      case "low_stock":
        return <Badge className="bg-yellow-100 text-yellow-700">Low Stock</Badge>;
      case "out_of_stock":
        return <Badge className="bg-red-100 text-red-700">Out of Stock</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>;
    }
  }

  // Chart data
  const chartData = {
    labels: ["Hospitals", "Doctors", "Medical Stores", "Users", "Blood Requests", "Donors"],
    datasets: [
      {
        label: "Count",
        data: [hospitalsCount, doctorsCount, medicalStoresCount, usersCount, bloodRequestsCount, donorsCount],
        backgroundColor: [
          "#6366f1",
          "#818cf8",
          "#a5b4fc",
          "#fbbf24",
          "#f87171",
          "#34d399",
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Medisphere Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-gray-700 hover:text-indigo-600">
              <Link href="/dashboard">User Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Manage all platform data, users, and resources visually</p>
          
          {/* Stats Grid - Full Width & Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            <Card className="p-4 flex flex-col items-center bg-indigo-50 border-0 hover:shadow-lg transition-shadow">
              <Hospital className="text-indigo-600 mb-2 h-8 w-8" />
              <span className="font-bold text-3xl">{hospitalsCount}</span>
              <span className="text-sm text-gray-600">Hospitals</span>
            </Card>
            <Card className="p-4 flex flex-col items-center bg-indigo-50 border-0 hover:shadow-lg transition-shadow">
              <Stethoscope className="text-indigo-600 mb-2 h-8 w-8" />
              <span className="font-bold text-3xl">{doctorsCount}</span>
              <span className="text-sm text-gray-600">Doctors</span>
            </Card>
            <Card className="p-4 flex flex-col items-center bg-indigo-50 border-0 hover:shadow-lg transition-shadow">
              <Store className="text-indigo-600 mb-2 h-8 w-8" />
              <span className="font-bold text-3xl">{medicalStoresCount}</span>
              <span className="text-sm text-gray-600">Medical Stores</span>
            </Card>
            <Card className="p-4 flex flex-col items-center bg-indigo-50 border-0 hover:shadow-lg transition-shadow">
              <User className="text-indigo-600 mb-2 h-8 w-8" />
              <span className="font-bold text-3xl">{usersCount}</span>
              <span className="text-sm text-gray-600">Users</span>
            </Card>
            <Card className="p-4 flex flex-col items-center bg-indigo-50 border-0 hover:shadow-lg transition-shadow">
              <Droplet className="text-indigo-600 mb-2 h-8 w-8" />
              <span className="font-bold text-3xl">{bloodRequestsCount}</span>
              <span className="text-sm text-gray-600">Blood Requests</span>
            </Card>
            <Card className="p-4 flex flex-col items-center bg-indigo-50 border-0 hover:shadow-lg transition-shadow">
              <Syringe className="text-indigo-600 mb-2 h-8 w-8" />
              <span className="font-bold text-3xl">{donorsCount}</span>
              <span className="text-sm text-gray-600">Donors</span>
            </Card>
          </div>
        </div>
        {/* Tabs for each model */}
        <Tabs defaultValue="hospitals" className="w-full mt-8">
          <TabsList className="w-full flex flex-wrap gap-2 bg-indigo-100 rounded-2xl overflow-x-auto justify-between">
            <TabsTrigger value="hospitals" className="flex-1 min-w-[120px]">Hospitals</TabsTrigger>
            <TabsTrigger value="doctors" className="flex-1 min-w-[120px]">Doctors</TabsTrigger>
            <TabsTrigger value="stores" className="flex-1 min-w-[120px]">Medical Stores</TabsTrigger>
            <TabsTrigger value="users" className="flex-1 min-w-[120px]">Users</TabsTrigger>
            <TabsTrigger value="blood" className="flex-1 min-w-[120px]">Blood Requests</TabsTrigger>
            <TabsTrigger value="donors" className="flex-1 min-w-[120px]">Blood Donors</TabsTrigger>
          </TabsList>
          {/* Hospitals Tab */}
          <TabsContent value="hospitals">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Hospitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-indigo-50">
                        <th className="p-2">Name</th>
                        <th className="p-2">Location</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hospitals?.map(h => (
                        <tr key={h.id} className="border-b">
                          <td className="p-2 font-medium">{h.name}</td>
                          <td className="p-2">{h.city}</td>
                          <td className="p-2">{new Date(h.created_at).toLocaleDateString()}</td>
                          <td className="p-2 flex gap-2">
                            <AdminDataManager table="hospitals" row={h} displayName={h.name} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Doctors Tab */}
          <TabsContent value="doctors">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-indigo-50">
                        <th className="p-2">Name</th>
                        <th className="p-2">Specialty</th>
                        <th className="p-2">Hospital</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors?.map(d => (
                        <tr key={d.id} className="border-b">
                          <td className="p-2 font-medium">{d.name}</td>
                          <td className="p-2">{d.specialization}</td>
                          <td className="p-2">{d.hospitals?.name}</td>
                          <td className="p-2">{new Date(d.created_at).toLocaleDateString()}</td>
                          <td className="p-2 flex gap-2">
                            <AdminDataManager table="doctors" row={d} displayName={d.name} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Medical Stores Tab */}
          <TabsContent value="stores">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Medical Stores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-indigo-50">
                        <th className="p-2">Name</th>
                        <th className="p-2">Location</th>
                        <th className="p-2">Medicines</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stores?.map(s => (
                        <tr key={s.id} className="border-b">
                          <td className="p-2 font-medium">{s.name}</td>
                          <td className="p-2">{s.city}</td>
                          <td className="p-2">
                            <div className="flex flex-col gap-1">
                              {Array.isArray(s.medicines) && s.medicines?.length > 0 ? (
                                s.medicines?.map((m: { name: string; status: string }, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <span className="font-medium">{m.name}</span>
                                    {getMedicineBadge(m.status)}
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-400">No medicines</span>
                              )}
                            </div>
                          </td>
                          <td className="p-2">{new Date(s.created_at).toLocaleDateString()}</td>
                          <td className="p-2 flex gap-2">
                            <AdminDataManager table="stores" row={s} displayName={s.name} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                {usersError ? (
                  <div className="text-red-600 font-semibold">Error fetching users: {usersError}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-indigo-50">
                          <th className="p-2">Email</th>
                          <th className="p-2">Full Name</th>
                          <th className="p-2">Role</th>
                          <th className="p-2">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers?.map((u: UserRow) => (
                          <tr key={u.id} className="border-b">
                            <td className="p-2">{u.email}</td>
                            <td className="p-2">{u.full_name || '-'}</td>
                            <td className="p-2">
                              <Badge className={u.role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"}>{u.role}</Badge>
                            </td>
                            <td className="p-2">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Blood Requests Tab */}
          <TabsContent value="blood">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Blood Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-indigo-50">
                        <th className="p-2">Patient</th>
                        <th className="p-2">Blood Group</th>
                        <th className="p-2">Hospital</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bloodRequests?.map(b => (
                        <tr key={b.id} className="border-b">
                          <td className="p-2 font-medium">{b.patient_name}</td>
                          <td className="p-2">{b.blood_type}</td>
                          <td className="p-2">{b.hospital_name}</td>
                          <td className="p-2">{b.status}</td>
                          <td className="p-2">{new Date(b.created_at).toLocaleDateString()}</td>
                          <td className="p-2 flex gap-2">
                            <AdminDataManager table="blood" row={b} displayName={b.patient_name} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Blood Donors Tab */}
          <TabsContent value="donors">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Blood Donors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-indigo-50">
                        <th className="p-2">Name</th>
                        <th className="p-2">Blood Group</th>
                        <th className="p-2">Location</th>
                        <th className="p-2">Contact</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bloodDonors?.map(d => (
                        <tr key={d.id} className="border-b">
                          <td className="p-2 font-medium">{d.name}</td>
                          <td className="p-2">{d.blood_type}</td>
                          <td className="p-2">{d.location}</td>
                          <td className="p-2">{d.emergency_contact}</td>
                          <td className="p-2">{new Date(d.created_at).toLocaleDateString()}</td>
                          <td className="p-2 flex gap-2">
                            <AdminDataManager table="donors" row={d} displayName={d.name} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
