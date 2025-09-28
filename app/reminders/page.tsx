import { createClient } from "@/lib/supabase/server"

import MedicineReminders from "@/components/medicine-reminders"
import { Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function RemindersPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  // If not logged in, redirect handled by middleware or layout
  if (error || !user) return null

  const { data: reminders } = await supabase
    .from("medicine_reminders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

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
            <Button asChild variant="ghost" className="text-gray-700 hover:text-blue-600">
              <Link href="/dashboard">
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Medicine Reminders</h2>
          <p className="text-gray-600">Manage your medicine reminders and schedules</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <MedicineReminders initialReminders={reminders || []} userId={user.id} />
        </div>
      </div>
    </div>
  )
}
