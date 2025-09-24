
"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
  type Profile = {
    full_name: string;
    email: string;
    phone: string;
    city?: string;
  }
  type Reminder = {
    medicine_name: string;
    dosage: string;
    frequency: string;
    start_date: string;
    end_date?: string;
    reminder_times?: string[];
    notes?: string;
    is_active: boolean;
  }
  type Blood = {
    blood_type: string;
    last_donation_date?: string;
    is_available: boolean;
  }
  const [profile, setProfile] = useState<Profile | null>(null)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [blood, setBlood] = useState<Blood | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ full_name: "", phone: "", city: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const supabase = createClient()
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        window.location.href = "/auth/login"
        return
      }
      // Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, email, phone, city")
        .eq("id", user.id)
        .single()
      setProfile(profileData)
      setForm({
        full_name: profileData?.full_name || "",
        phone: profileData?.phone || "",
        city: profileData?.city || "",
      })
      // Reminders
      const { data: remindersData } = await supabase
        .from("medicine_reminders")
        .select("medicine_name, dosage, frequency, start_date, end_date, reminder_times, notes, is_active")
        .eq("user_id", user.id)
      setReminders(remindersData || [])
      // Blood
      const { data: bloodData } = await supabase
        .from("blood_donors")
        .select("blood_type, last_donation_date, is_available")
        .eq("user_id", user.id)
        .single()
      setBlood(bloodData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleEdit = () => setEditMode(true)
  const handleCancel = () => {
    setEditMode(false)
    setForm({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      city: profile?.city || "",
    })
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleSave = async () => {
    const supabase = createClient()
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        city: form.city,
      })
      .eq("id", user.id)
    setProfile({ ...profile!, ...form, email: profile?.email || "" })
    setEditMode(false)
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="mb-8 shadow-2xl border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <span role="img" aria-label="profile">👤</span> My Profile
          </CardTitle>
          {!editMode && (
            <Button variant="outline" onClick={handleEdit} className="hover:bg-blue-200">Edit</Button>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-lg">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <span className="font-semibold">Full Name:</span>
                  {editMode ? (
                    <Input name="full_name" value={form.full_name} onChange={handleChange} className="mt-1" />
                  ) : (
                    <span className="ml-2">{profile?.full_name || "-"}</span>
                  )}
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Mobile:</span>
                  {editMode ? (
                    <Input name="phone" value={form.phone} onChange={handleChange} className="mt-1" />
                  ) : (
                    <span className="ml-2">{profile?.phone || "-"}</span>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <span className="font-semibold">Email:</span>
                  {editMode ? (
                    <Input name="email" value={profile?.email || "-"} readOnly className="mt-1 bg-gray-100 cursor-not-allowed" />
                  ) : (
                    <span className="ml-2">{profile?.email || "-"}</span>
                  )}
                </div>
                <div className="mb-4">
                  <span className="font-semibold">City:</span>
                  {editMode ? (
                    <Input name="city" value={form.city} onChange={handleChange} className="mt-1" />
                  ) : (
                    <span className="ml-2">{profile?.city || "-"}</span>
                  )}
                </div>
              </div>
            </div>
          )}
          {editMode && (
            <div className="flex gap-4 mt-6">
              <Button variant="default" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Save</Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <span role="img" aria-label="pill">💊</span> Medicine Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reminders && reminders.length > 0 ? (
              <ul className="space-y-3">
                {reminders.map((reminder, idx) => (
                  <li key={idx} className="bg-white rounded p-3 shadow flex flex-col">
                    <span className="font-bold text-blue-700">{reminder.medicine_name}</span>
                    <span className="text-sm">{reminder.dosage}, {reminder.frequency}</span>
                    <span className="text-xs text-gray-500">{reminder.start_date} to {reminder.end_date || "Ongoing"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No medicine reminders added.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <span role="img" aria-label="blood">🩸</span> Blood Donor Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            {blood ? (
              <div className="space-y-2">
                <div><span className="font-semibold">Blood Group:</span> <span className="ml-2">{blood.blood_type}</span></div>
                <div><span className="font-semibold">Last Donation:</span> <span className="ml-2">{blood.last_donation_date || "-"}</span></div>
                <div><span className="font-semibold">Available:</span> <span className="ml-2">{blood.is_available ? "Yes" : "No"}</span></div>
              </div>
            ) : (
              <p className="text-gray-500">No blood donor info.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
