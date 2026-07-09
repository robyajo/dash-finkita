import { Metadata } from "next"
import PageError from "./error/page-404"
export const metadata: Metadata = {
  title: "404 Not Found",
  description: "Halaman tidak ditemukan",
}
export default function Error() {
  return <PageError />
}
