
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  // Redirect to the unified root page
  // The root page now serves as both landing page and dashboard
  redirect("/")
}
