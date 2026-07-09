
import Page403 from "@/app/error/page-403"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "403 Prohibited",
  description: "403 Prohibited",
}

export default function ProhibitedPage() {
  return <Page403 />
}
