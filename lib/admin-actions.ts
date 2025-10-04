"use server"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing environment variables:", { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!serviceRoleKey 
    })
    throw new Error("Missing Supabase environment variables")
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Hospital operations
export async function createHospital(hospitalData: {
  name: string
  address: string
  city: string
  phone: string
  email: string
  specialities: string[]
  emergency_services: boolean
  rating: number
  latitude?: number
  longitude?: number
}) {
  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("hospitals").insert(hospitalData).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error creating hospital:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateHospital(
  id: string,
  hospitalData: {
    name: string
    address: string
    city: string
    phone: string
    email: string
    specialities: string[]
    emergency_services: boolean
    rating: number
    latitude?: number
    longitude?: number
  },
) {
  try {
    const supabase = createServiceRoleClient()
    
    const { error: updateError } = await supabase
      .from("hospitals")
      .update(hospitalData)
      .eq("id", id)

    if (updateError) throw updateError
    
    const { data: updatedRow, error: fetchError } = await supabase
      .from("hospitals")
      .select("*")
      .eq("id", id)
      .single()
    
    if (fetchError) throw fetchError
    
    revalidatePath("/admin")
    return { success: true, data: [updatedRow] }
  } catch (error) {
    console.error("Error updating hospital - Full error:", error)
    console.error("Error type:", typeof error)
    console.error("Error details:", JSON.stringify(error, null, 2))
    return { 
      success: false, 
      error: error instanceof Error ? error.message : (typeof error === 'string' ? error : JSON.stringify(error))
    }
  }
}

export async function deleteHospital(id: string) {
  try {
    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("hospitals").delete().eq("id", id)

    if (error) throw error
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error deleting hospital:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Doctor operations
export async function createDoctor(doctorData: {
  name: string
  specialization: string
  hospital_id: string
  phone: string
  email: string
  rating: number
  qualification?: string
  experience_years?: number
  consultation_fee?: number
  available_hours?: string
  available_days?: string[]
}) {
  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("doctors").insert(doctorData).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error creating doctor:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateDoctor(
  id: string,
  doctorData: {
    name: string
    specialization: string
    hospital_id: string
    phone: string
    email: string
    rating: number
    qualification?: string
    experience_years?: number
    consultation_fee?: number
    available_hours?: string
    available_days?: string[]
  },
) {
  try {
    const supabase = createServiceRoleClient()
    
    const { error: updateError } = await supabase
      .from("doctors")
      .update(doctorData)
      .eq("id", id)

    if (updateError) throw updateError
    
    const { data: updatedRow, error: fetchError } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", id)
      .single()
    
    if (fetchError) throw fetchError
    
    revalidatePath("/admin")
    return { success: true, data: [updatedRow] }
  } catch (error) {
    console.error("Error updating doctor:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function deleteDoctor(id: string) {
  try {
    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("doctors").delete().eq("id", id)

    if (error) throw error
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error deleting doctor:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Medical Store operations
export async function createMedicalStore(storeData: {
  name: string
  address: string
  city: string
  phone: string
  email: string
  license_number: string
  operating_hours: string
  rating: number
  latitude?: number
  longitude?: number
}) {
  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("medical_stores").insert(storeData).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error creating medical store:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateMedicalStore(
  id: string,
  storeData: {
    name: string
    address: string
    city: string
    phone: string
    email: string
    license_number: string
    operating_hours: string
    rating: number
    latitude?: number
    longitude?: number
  },
) {
  try {
    const supabase = createServiceRoleClient()
    
    const { error: updateError } = await supabase
      .from("medical_stores")
      .update(storeData)
      .eq("id", id)

    if (updateError) throw updateError
    
    const { data: updatedRow, error: fetchError } = await supabase
      .from("medical_stores")
      .select("*")
      .eq("id", id)
      .single()
    
    if (fetchError) throw fetchError
    
    revalidatePath("/admin")
    return { success: true, data: [updatedRow] }
  } catch (error) {
    console.error("Error updating medical store:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function deleteMedicalStore(id: string) {
  try {
    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("medical_stores").delete().eq("id", id)

    if (error) throw error
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error deleting medical store:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Blood Donor operations
export async function createBloodDonor(donorData: {
  user_id: string
  blood_type: string
  age: number
  weight: number
  location: string
  is_available: boolean
  emergency_contact: string
  medical_conditions?: string
  last_donation_date?: string
  latitude?: number
  longitude?: number
}) {
  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("blood_donors").insert(donorData).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error creating blood donor:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateBloodDonor(
  id: string,
  donorData: {
    blood_type: string
    age: number
    weight: number
    location: string
    is_available: boolean
    emergency_contact: string
    medical_conditions?: string
    last_donation_date?: string
    latitude?: number
    longitude?: number
  },
) {
  try {
    const supabase = createServiceRoleClient()
    
    const { error: updateError } = await supabase
      .from("blood_donors")
      .update(donorData)
      .eq("id", id)

    if (updateError) throw updateError
    
    const { data: updatedRow, error: fetchError } = await supabase
      .from("blood_donors")
      .select("*")
      .eq("id", id)
      .single()
    
    if (fetchError) throw fetchError
    
    revalidatePath("/admin")
    return { success: true, data: [updatedRow] }
  } catch (error) {
    console.error("Error updating blood donor:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function deleteBloodDonor(id: string) {
  try {
    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("blood_donors").delete().eq("id", id)

    if (error) throw error
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error deleting blood donor:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Blood Request operations
export async function createBloodRequest(requestData: {
  requester_id: string
  blood_type: string
  units_needed: number
  urgency: string
  hospital_name: string
  hospital_address: string
  contact_phone: string
  patient_name: string
  additional_info?: string
  status?: string
}) {
  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("blood_requests")
      .insert({
        ...requestData,
        status: requestData.status || "pending",
      })
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error creating blood request:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateBloodRequest(
  id: string,
  requestData: {
    blood_type: string
    units_needed: number
    urgency: string
    hospital_name: string
    hospital_address: string
    contact_phone: string
    patient_name: string
    additional_info?: string
    status: string
  },
) {
  try {
    const supabase = createServiceRoleClient()
    
    const { error: updateError } = await supabase
      .from("blood_requests")
      .update(requestData)
      .eq("id", id)

    if (updateError) throw updateError
    
    const { data: updatedRow, error: fetchError } = await supabase
      .from("blood_requests")
      .select("*")
      .eq("id", id)
      .single()
    
    if (fetchError) throw fetchError
    
    revalidatePath("/admin")
    return { success: true, data: [updatedRow] }
  } catch (error) {
    console.error("Error updating blood request:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function deleteBloodRequest(id: string) {
  try {
    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("blood_requests").delete().eq("id", id)

    if (error) throw error
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error deleting blood request:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Medicine Reminder operations
export async function createMedicineReminder(reminderData: {
  user_id: string
  medicine_name: string
  dosage: string
  frequency: string
  start_date: string
  end_date: string
  reminder_times: string[]
  notes?: string
  is_active?: boolean
}) {
  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("medicine_reminders")
      .insert({
        ...reminderData,
        is_active: reminderData.is_active ?? true,
      })
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error creating medicine reminder:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateMedicineReminder(
  id: string,
  reminderData: {
    medicine_name: string
    dosage: string
    frequency: string
    start_date: string
    end_date: string
    reminder_times: string[]
    notes?: string
    is_active: boolean
  },
) {
  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("medicine_reminders").update(reminderData).eq("id", id).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error updating medicine reminder:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function deleteMedicineReminder(id: string) {
  try {
    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("medicine_reminders").delete().eq("id", id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error deleting medicine reminder:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Profile operations
export async function createProfile(profileData: {
  id: string
  full_name: string
  email: string
  phone?: string
  role?: string
}) {
  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        ...profileData,
        role: profileData.role || "user",
      })
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error creating profile:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateProfile(
  id: string,
  profileData: {
    full_name: string
    email: string
    phone?: string
    role: string
  },
) {
  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase.from("profiles").update(profileData).eq("id", id).select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function deleteProfile(id: string) {
  try {
    const supabase = createServiceRoleClient()
    const { error } = await supabase.from("profiles").delete().eq("id", id)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error deleting profile:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Bulk operations for admin convenience
export async function getAllData() {
  try {
    const supabase = createServiceRoleClient()

    const [hospitals, doctors, medicalStores, bloodDonors, bloodRequests, medicineReminders, profiles] =
      await Promise.all([
        supabase.from("hospitals").select("*"),
        supabase.from("doctors").select("*"),
        supabase.from("medical_stores").select("*"),
        supabase.from("blood_donors").select("*"),
        supabase.from("blood_requests").select("*"),
        supabase.from("medicine_reminders").select("*"),
        supabase.from("profiles").select("*"),
      ])

    return {
      success: true,
      data: {
        hospitals: hospitals.data || [],
        doctors: doctors.data || [],
        medicalStores: medicalStores.data || [],
        bloodDonors: bloodDonors.data || [],
        bloodRequests: bloodRequests.data || [],
        medicineReminders: medicineReminders.data || [],
        profiles: profiles.data || [],
      },
    }
  } catch (error) {
    console.error("Error fetching all data:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

