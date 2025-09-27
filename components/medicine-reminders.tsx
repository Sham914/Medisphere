"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
// Path to the SOS beep sound (only .wav supported for now)
const SOS_BEEP_URL = "/sos-beep.wav"
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
import { Pill, Plus, Clock, Calendar, Edit, Trash2, CheckCircle } from "lucide-react"
import { format, parseISO, isAfter, isBefore } from "date-fns"

interface MedicineRemindersProps {
  initialReminders: any[]
  userId: string
}

export default function MedicineReminders({ initialReminders, userId }: MedicineRemindersProps) {
  // SOS Alert State (must be after reminders is declared)
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  // Handler to unlock audio on user gesture
  const handleEnableAlerts = () => {
    if (!alertsEnabled) {
      const audio = new window.Audio(SOS_BEEP_URL)
      audio.play().then(() => {
        audio.pause()
        setAlertsEnabled(true)
      }).catch(() => {
        setAlertsEnabled(true)
      })
    }
  }
  const [reminders, setReminders] = useState<any[]>(initialReminders)
  // SOS Alert State (must be after reminders is declared)
  const [sosAlert, setSosAlert] = useState<{ medicine: string; time: string } | null>(null)
  /*const sosAudioRef = useRef<HTMLAudioElement | null>(null)
  const sosTimeoutRef = useRef<NodeJS.Timeout | null>(null)*/
  // SOS Alert Effect: check every second for pill time
  // Prevent repeated alerts for the same medicine/time after dismiss
  const lastDismissedRef = useRef<{ medicine: string; time: string; minute: string } | null>(null)
  useEffect(() => {
    if (!alertsEnabled) return
    const interval = setInterval(() => {
      const now = new Date()
      const hhmm = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      // Only alert if not already showing and not just dismissed for this medicine/time/minute
      if (!sosAlert) {
        for (const reminder of getTodaysReminders()) {
          for (const time of reminder.reminder_times) {
            if (time.slice(0,5) === hhmm) {
              const last = lastDismissedRef.current
              if (last && last.medicine === reminder.medicine_name && last.time === time && last.minute === hhmm) {
                continue // skip this alert for this minute
              }
              setSosAlert({ medicine: reminder.medicine_name, time })
              return
            }
          }
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [reminders, sosAlert, alertsEnabled])

  // Play SOS beep and auto-dismiss after 7 seconds
  // --- SOS beep alarm logic ---
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const endedHandlerRef = useRef<(() => void) | null>(null)
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  function startAlarm() {
    stopAlarm();
    const audio = new Audio(SOS_BEEP_URL);
    audioRef.current = audio;
    const endedHandler = () => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    };
    endedHandlerRef.current = endedHandler;
    audio.addEventListener("ended", endedHandler);
    audio.play();
  }

  function stopAlarm() {
    if (audioRef.current) {
      if (endedHandlerRef.current) {
        audioRef.current.removeEventListener("ended", endedHandlerRef.current);
        endedHandlerRef.current = null;
      }
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
  }

  // SOS beep effect: play in loop for up to 8s, or until alert is dismissed
  useEffect(() => {
    if (!alertsEnabled) return;
    stopAlarm();
    if (sosAlert) {
      startAlarm();
      // Vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500, 200, 500, 200, 500, 200, 500]);
      }
      alarmTimeoutRef.current = setTimeout(() => {
        if (sosAlert) {
          // Block this alert for this medicine/time/minute
          const now = new Date();
          const hhmm = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
          lastDismissedRef.current = { medicine: sosAlert.medicine, time: sosAlert.time, minute: hhmm };
        }
        stopAlarm();
        setSosAlert(null);
      }, 8000);
    } else {
      stopAlarm();
    }
    // Cleanup
    return () => {
      stopAlarm();
    };
  }, [sosAlert, alertsEnabled]);
  // ...existing code...
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    medicine_name: "",
    dosage: "",
    frequency: "once_daily",
    start_date: "",
    end_date: "",
    reminder_times: ["09:00"],
    notes: "",
  })

  const supabase = createClient()

  const frequencies = [
    { value: "once_daily", label: "Once Daily", times: 1 },
    { value: "twice_daily", label: "Twice Daily", times: 2 },
    { value: "three_times_daily", label: "Three Times Daily", times: 3 },
    { value: "four_times_daily", label: "Four Times Daily", times: 4 },
    { value: "as_needed", label: "As Needed", times: 1 },
  ]

  const resetForm = () => {
    setFormData({
      medicine_name: "",
      dosage: "",
      frequency: "once_daily",
      start_date: "",
      end_date: "",
      reminder_times: ["09:00"],
      notes: "",
    })
    setEditingReminder(null)
  }

  const handleFrequencyChange = (frequency: string) => {
    const freq = frequencies.find((f) => f.value === frequency)
    const times = freq ? freq.times : 1

    const defaultTimes: string[] = []
    for (let i = 0; i < times; i++) {
      let hour: number
      switch (times) {
        case 1:
          hour = 9 // 9 AM
          break
        case 2:
          hour = i === 0 ? 9 : 21 // 9 AM, 9 PM
          break
        case 3:
          hour = i === 0 ? 8 : i === 1 ? 14 : 20 // 8 AM, 2 PM, 8 PM
          break
        case 4:
          hour = i === 0 ? 8 : i === 1 ? 12 : i === 2 ? 16 : 20 // 8 AM, 12 PM, 4 PM, 8 PM
          break
        default:
          hour = 9
      }
      defaultTimes.push(`${hour.toString().padStart(2, "0")}:00`)
    }

    setFormData((prev) => ({
      ...prev,
      frequency,
      reminder_times: defaultTimes,
    }))
  }

  const handleTimeChange = (index: number, time: string) => {
    if (time && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      console.error("[v0] Invalid time format:", time)
      return
    }

    const newTimes = [...formData.reminder_times]
    newTimes[index] = time
    setFormData((prev) => ({ ...prev, reminder_times: newTimes }))
  }

  // Utility to convert 12-hour or AM/PM time to 24-hour HH:mm:ss
  function to24HourTime(time: string): string {
    // If already in HH:mm:ss or HH:mm, return as HH:mm:ss
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(time)) {
      const [h, m, s] = time.split(":")
      return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:${s ? s.padStart(2, "0") : "00"}`
    }
    // If in 12-hour format with AM/PM
    const match = time.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i)
    if (match) {
      let [_, hour, minute, period] = match
      let h = parseInt(hour, 10)
      if (period.toUpperCase() === "PM" && h !== 12) h += 12
      if (period.toUpperCase() === "AM" && h === 12) h = 0
      return `${h.toString().padStart(2, "0")}:${minute}:00`
    }
    return time // fallback
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Convert all reminder times to 24-hour HH:mm:ss before validation/submission
      const convertedTimes = formData.reminder_times.map(to24HourTime)

      // Validate all reminder times before submission
      const validTimes = convertedTimes.every((time) => {
        const isValid = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time)
        return isValid
      })

      if (!validTimes) {
        throw new Error("Invalid time format detected")
      }

      const reminderData = {
        ...formData,
        reminder_times: convertedTimes,
        user_id: userId,
        is_active: true,
      }

      console.log("[v0] Submitting reminder data:", reminderData)

      if (editingReminder) {
        const { data, error } = await supabase
          .from("medicine_reminders")
          .update(reminderData)
          .eq("id", editingReminder.id)
          .select()
          .single()

        if (error) throw error

        setReminders((prev) => prev.map((reminder) => (reminder.id === editingReminder.id ? data : reminder)))
      } else {
        const { data, error } = await supabase.from("medicine_reminders").insert(reminderData).select().single()

        if (error) throw error

        setReminders((prev) => [data, ...prev])
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving reminder:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (reminder: any) => {
    setEditingReminder(reminder)
    setFormData({
      medicine_name: reminder.medicine_name,
      dosage: reminder.dosage,
      frequency: reminder.frequency,
      start_date: reminder.start_date,
      end_date: reminder.end_date || "",
      reminder_times: reminder.reminder_times,
      notes: reminder.notes || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("medicine_reminders").delete().eq("id", id)

      if (error) throw error

      setReminders((prev) => prev.filter((reminder) => reminder.id !== id))
    } catch (error) {
      console.error("Error deleting reminder:", error)
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { data, error } = await supabase
        .from("medicine_reminders")
        .update({ is_active: !isActive })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      setReminders((prev) => prev.map((reminder) => (reminder.id === id ? data : reminder)))
    } catch (error) {
      console.error("Error updating reminder:", error)
    }
  }

  const getReminderStatus = (reminder: any) => {
    const today = new Date()
    const startDate = parseISO(reminder.start_date)
    const endDate = reminder.end_date ? parseISO(reminder.end_date) : null

    if (isBefore(today, startDate)) {
      return { status: "upcoming", color: "bg-blue-100 text-blue-700" }
    }
    if (endDate && isAfter(today, endDate)) {
      return { status: "completed", color: "bg-gray-100 text-gray-700" }
    }
    if (!reminder.is_active) {
      return { status: "paused", color: "bg-yellow-100 text-yellow-700" }
    }
    return { status: "active", color: "bg-green-100 text-green-700" }
  }

  const getTodaysReminders = () => {
    const today = new Date()
    return reminders.filter((reminder) => {
      const startDate = parseISO(reminder.start_date)
      const endDate = reminder.end_date ? parseISO(reminder.end_date) : null

      return reminder.is_active && !isBefore(today, startDate) && (!endDate || !isAfter(today, endDate))
    })
  }

  const todaysReminders = getTodaysReminders()

  return (
    <div className="space-y-6">
      {/* Enable Alerts Prompt */}
      {!alertsEnabled && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center max-w-xs border-4 border-purple-500">
            <span className="text-xl font-bold text-purple-700 mb-2">Enable Pill Alerts</span>
            <span className="text-gray-700 mb-4 text-center">To receive sound and vibration alerts for your medicine reminders, please click below to enable alerts.</span>
            <Button className="bg-purple-600 hover:bg-purple-700 w-full" onClick={handleEnableAlerts}>
              Enable Alerts
            </Button>
          </div>
        </div>
      )}
      {/* SOS Pill Time Alert Modal */}
      {sosAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center max-w-xs border-4 border-red-500 animate-pulse">
            <span className="text-3xl font-bold text-red-600 mb-2">SOS!</span>
            <span className="text-lg font-semibold text-gray-900 mb-2">Pill Time</span>
            <span className="text-purple-700 font-medium mb-2">{sosAlert.medicine}</span>
            <span className="text-gray-700 mb-4">Take your medicine at <b>{sosAlert.time}</b></span>
            <Button className="bg-red-600 hover:bg-red-700 w-full" onClick={() => {
              if (sosAlert) {
                // Block this alert for this medicine/time/minute
                const now = new Date();
                const hhmm = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
                lastDismissedRef.current = { medicine: sosAlert.medicine, time: sosAlert.time, minute: hhmm };
              }
              stopAlarm();
              setSosAlert(null);
            }}>
              Dismiss Alert
            </Button>
          </div>
        </div>
      )}
      {/* Today's Reminders */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Today's Reminders
          </CardTitle>
          <CardDescription>
            {todaysReminders.length} medication{todaysReminders.length !== 1 ? "s" : ""} scheduled for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaysReminders.length > 0 ? (
            <div className="space-y-3">
              {todaysReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Pill className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{reminder.medicine_name}</p>
                      <p className="text-sm text-gray-600">{reminder.dosage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {reminder.reminder_times.map((time: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-white">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No reminders scheduled for today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Reminder */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">All Reminders</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingReminder ? "Edit" : "Add"} Medicine Reminder</DialogTitle>
              <DialogDescription>Set up a reminder for your medication schedule</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="medicine_name">Medicine Name</Label>
                <Input
                  id="medicine_name"
                  value={formData.medicine_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, medicine_name: e.target.value }))}
                  placeholder="e.g., Paracetamol"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g., 500mg, 2 tablets"
                  required
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={handleFrequencyChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date (Optional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>Reminder Times</Label>
                <div className="space-y-2">
                  {formData.reminder_times.map((time, index) => (
                    <Input
                      key={index}
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional instructions or notes"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                  {isLoading ? "Saving..." : editingReminder ? "Update" : "Add"} Reminder
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* All Reminders */}
      <div className="grid gap-4">
        {reminders.map((reminder) => {
          const status = getReminderStatus(reminder)

          return (
            <Card key={reminder.id} className="bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 mb-2">{reminder.medicine_name}</CardTitle>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={status.color}>{status.status}</Badge>
                      <span className="text-sm text-gray-600">{reminder.dosage}</span>
                      <span className="text-sm text-gray-600 capitalize">{reminder.frequency.replace("_", " ")}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(parseISO(reminder.start_date), "MMM dd, yyyy")}
                        {reminder.end_date && ` - ${format(parseISO(reminder.end_date), "MMM dd, yyyy")}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(reminder)}
                      className="text-gray-600 hover:text-purple-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(reminder.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600 block mb-1">Reminder Times:</span>
                    <div className="flex flex-wrap gap-2">
                      {reminder.reminder_times.map((time: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                          <Clock className="h-3 w-3 mr-1" />
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {reminder.notes && (
                    <div>
                      <span className="text-sm text-gray-600 block mb-1">Notes:</span>
                      <p className="text-sm text-gray-700">{reminder.notes}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive(reminder.id, reminder.is_active)}
                      className={
                        reminder.is_active
                          ? "border-yellow-200 hover:bg-yellow-50 text-yellow-700"
                          : "border-green-200 hover:bg-green-50 text-green-700"
                      }
                    >
                      {reminder.is_active ? "Pause" : "Resume"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {reminders.length === 0 && (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders yet</h3>
              <p className="text-gray-600 mb-4">Add your first medicine reminder to get started</p>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Reminder
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
