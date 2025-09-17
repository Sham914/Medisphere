"use client"

import type React from "react"

import { useState } from "react"
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
  const [reminders, setReminders] = useState<any[]>(initialReminders)
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

    const defaultTimes = []
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("[v0] Form data before submission:", formData)

      // Validate all reminder times before submission
      const validTimes = formData.reminder_times.every((time) => {
        const isValid = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)
        console.log("[v0] Validating time:", time, "Valid:", isValid)
        return isValid
      })

      if (!validTimes) {
        console.error("[v0] Invalid times detected, aborting submission")
        throw new Error("Invalid time format detected")
      }

      const reminderData = {
        ...formData,
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
                    {reminder.reminder_times.map((time, index) => (
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
                      {reminder.reminder_times.map((time, index) => (
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
