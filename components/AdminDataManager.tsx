"use client"

import React, { useState, useTransition, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { 
  updateHospital, 
  deleteHospital, 
  updateDoctor, 
  deleteDoctor, 
  updateMedicalStore, 
  deleteMedicalStore,
  updateBloodRequest,
  deleteBloodRequest,
  updateBloodDonor,
  deleteBloodDonor
} from "@/lib/admin-actions"

interface AdminDataManagerProps {
  table: string
  row: any
  displayName?: string
}

const AdminDataManager = React.memo(function AdminDataManager({ table, row, displayName }: AdminDataManagerProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>(row)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Map display table names to actual database table names
  const getTableName = (table: string) => {
    const tableMap: Record<string, string> = {
      hospitals: "hospitals",
      doctors: "doctors",
      stores: "medical_stores",
      users: "users",
      blood: "blood_requests",
      donors: "blood_donors",
    }
    return tableMap[table] || table
  }

  // Get fields to exclude from editing - memoized to prevent recalculation
  const excludedFields = useMemo(() => {
    return ["id", "created_at", "updated_at", "user_id", "hospitals", "requester_id"]
  }, [])

  // Get display name for the record - memoized
  const recordName = useMemo(() => {
    if (displayName) return displayName
    return row.name || row.patient_name || row.full_name || row.email || "this record"
  }, [displayName, row.name, row.patient_name, row.full_name, row.email])

  // Handle field rendering based on type - memoized with useCallback
  const renderField = useCallback((key: string, value: any) => {
    if (excludedFields.includes(key)) return null

    // Handle boolean fields
    if (typeof value === "boolean") {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">
            {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={key}
              checked={formData[key] || false}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor={key} className="text-sm text-gray-600 font-normal">
              {formData[key] ? "Yes" : "No"}
            </Label>
          </div>
        </div>
      )
    }

    // Handle array fields (like specialities, medicines, available_days)
    if (Array.isArray(value)) {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">
            {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Label>
          <Textarea
            id={key}
            value={Array.isArray(formData[key]) ? formData[key].join(", ") : formData[key] || ""}
            onChange={(e) => {
              const arrayValue = e.target.value.split(",").map((item) => item.trim()).filter(Boolean)
              setFormData({ ...formData, [key]: arrayValue })
            }}
            placeholder="Enter items separated by commas"
            rows={3}
          />
          <p className="text-xs text-gray-500">Separate multiple items with commas</p>
        </div>
      )
    }

    // Handle object fields (like medicines in medical_stores)
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">
            {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Label>
          <Textarea
            id={key}
            value={formData[key] ? JSON.stringify(formData[key], null, 2) : ""}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                setFormData({ ...formData, [key]: parsed })
              } catch {
                setFormData({ ...formData, [key]: e.target.value })
              }
            }}
            placeholder="JSON object"
            rows={4}
          />
          <p className="text-xs text-gray-500">Enter valid JSON format</p>
        </div>
      )
    }

    // Handle long text fields
    if (typeof value === "string" && value.length > 100) {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">
            {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Label>
          <Textarea
            id={key}
            value={formData[key] || ""}
            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
            rows={3}
          />
        </div>
      )
    }

    // Handle numeric fields
    if (typeof value === "number") {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">
            {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Label>
          <Input
            id={key}
            type="number"
            step={key.includes("fee") || key.includes("rating") ? "0.01" : "1"}
            value={formData[key] ?? ""}
            onChange={(e) => setFormData({ ...formData, [key]: parseFloat(e.target.value) || 0 })}
          />
        </div>
      )
    }

    // Default: regular text input
    return (
      <div key={key} className="space-y-2">
        <Label htmlFor={key} className="text-sm font-medium">
          {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </Label>
        <Input
          id={key}
          type="text"
          value={formData[key] ?? ""}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        />
      </div>
    )
  }, [excludedFields, formData])

  // Handle edit submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Remove excluded fields and nested objects
      const { id, created_at, updated_at, hospitals, requester_id, ...rawData } = formData
      
      // Filter out any remaining nested objects or null values
      const updateData = Object.keys(rawData).reduce((acc, key) => {
        const value = rawData[key]
        // Only include primitive values and arrays, exclude nested objects
        if (value !== null && value !== undefined && (typeof value !== 'object' || Array.isArray(value))) {
          acc[key] = value
        }
        return acc
      }, {} as Record<string, any>)
      
      let result

      // Use appropriate admin action based on table
      switch (table) {
        case "hospitals":
          result = await updateHospital(row.id, updateData as any)
          break
        case "doctors":
          result = await updateDoctor(row.id, updateData as any)
          break
        case "stores":
          result = await updateMedicalStore(row.id, updateData as any)
          break
        case "blood":
          result = await updateBloodRequest(row.id, updateData as any)
          break
        case "donors":
          result = await updateBloodDonor(row.id, updateData as any)
          break
        default:
          throw new Error("Invalid table")
      }

      if (!result.success) throw new Error(result.error)

      setIsEditOpen(false)
      
      // Use startTransition for smooth UI updates
      startTransition(() => {
        router.refresh()
      })

      toast({
        title: "Success",
        description: `${recordName} has been updated successfully!`,
      })
    } catch (error: any) {
      console.error("Error updating record:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update record. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    try {
      let result

      // Use appropriate admin action based on table
      switch (table) {
        case "hospitals":
          result = await deleteHospital(row.id)
          break
        case "doctors":
          result = await deleteDoctor(row.id)
          break
        case "stores":
          result = await deleteMedicalStore(row.id)
          break
        case "blood":
          result = await deleteBloodRequest(row.id)
          break
        case "donors":
          result = await deleteBloodDonor(row.id)
          break
        default:
          throw new Error("Invalid table")
      }

      if (!result.success) throw new Error(result.error)

      setIsDeleteOpen(false)
      
      // Use startTransition for smooth UI updates
      startTransition(() => {
        router.refresh()
      })

      toast({
        title: "Deleted",
        description: `${recordName} has been deleted successfully!`,
      })
    } catch (error: any) {
      console.error("Error deleting record:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete record. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {/* Edit Button */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setFormData(row)
          setIsEditOpen(true)
        }}
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
      >
        <Edit className="h-4 w-4" />
      </Button>

      {/* Delete Button */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsDeleteOpen(true)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {recordName}</DialogTitle>
            <DialogDescription>
              Make changes to the record below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(row)
                .filter((key) => !excludedFields.includes(key))
                .map((key) => renderField(key, row[key]))}
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold text-red-600">{recordName}</span> from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
})

export default AdminDataManager

