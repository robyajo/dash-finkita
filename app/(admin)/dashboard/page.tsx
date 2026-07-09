
import { Metadata } from "next"
import VPageDashboard from "./_components/v-page"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard Finkita",
}


export default function Page() {
  return (
    <VPageDashboard />
  )
}
