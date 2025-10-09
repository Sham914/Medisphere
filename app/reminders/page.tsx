import { createClient } from "@/lib/supabase/server"
import MedicineReminders from "@/components/medicine-reminders"
import { Heart, Home, Pill, Shield, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default async function RemindersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let reminders = null
  if (user) {
    const { data } = await supabase
      .from("medicine_reminders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    reminders = data
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-[#a020f0] p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Medisphere</h1>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button asChild variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
              <Link href="/">
                <Home className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            {user ? (
              <Button asChild variant="default" size="sm" className="bg-[#a020f0] hover:bg-[#8b1ad4]">
                <Link href="/">
                  Home
                </Link>
              </Button>
            ) : (
              <Button asChild variant="default" size="sm" className="bg-[#a020f0] hover:bg-[#8b1ad4]">
                <Link href="/auth/login">
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Medicine Reminders</h2>
          <p className="text-gray-600">Manage your medicine reminders and schedules</p>
        </div>
        <div className="max-w-2xl mx-auto">
          {user ? (
            <MedicineReminders initialReminders={reminders || []} userId={user.id} />
          ) : (
            <Card className="bg-white border-0 shadow-xl">
              <CardContent className="p-8 sm:p-12">
                <div className="text-center space-y-6">
                  <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                    <Pill className="h-10 w-10 text-[#a020f0]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Sign In Required</h3>
                    <p className="text-gray-600 text-lg mb-6">
                      You need to sign in to your account to create and manage medicine reminders.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 space-y-3 text-left">
                    <h4 className="font-semibold text-gray-900 mb-3">With Medicine Reminders, you can:</h4>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-[#a020f0] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Never Miss a Dose</p>
                        <p className="text-sm text-gray-600">Set multiple daily reminders for your medications</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-[#a020f0] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Stay on Track</p>
                        <p className="text-sm text-gray-600">Track dosage, duration, and special instructions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Heart className="h-5 w-5 text-[#a020f0] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Audio Alerts</p>
                        <p className="text-sm text-gray-600">Get notified with sound when it's time for your medicine</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button asChild size="lg" className="bg-[#a020f0] hover:bg-[#8b1ad4] text-lg px-8">
                      <Link href="/auth/login">
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-[#a020f0] text-[#a020f0] hover:bg-purple-50 text-lg px-8">
                      <Link href="/auth/register">
                        Create Account
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
