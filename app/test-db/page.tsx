import { createClient } from "@/lib/supabase/server"

export default async function TestDBPage() {
  const supabase = await createClient()

  // Test basic connection
  const { data: hospitals, error: hospitalsError } = await supabase.from("hospitals").select("*").limit(5)

  const { data: doctors, error: doctorsError } = await supabase.from("doctors").select("*").limit(5)

  const { data: stores, error: storesError } = await supabase.from("medical_stores").select("*").limit(5)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>

      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Hospitals</h2>
          <p>Count: {hospitals?.length || 0}</p>
          <p>Error: {hospitalsError?.message || "None"}</p>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-2">{JSON.stringify(hospitals, null, 2)}</pre>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Doctors</h2>
          <p>Count: {doctors?.length || 0}</p>
          <p>Error: {doctorsError?.message || "None"}</p>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-2">{JSON.stringify(doctors, null, 2)}</pre>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Medical Stores</h2>
          <p>Count: {stores?.length || 0}</p>
          <p>Error: {storesError?.message || "None"}</p>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-2">{JSON.stringify(stores, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
