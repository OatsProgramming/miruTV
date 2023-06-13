import { notFound } from "next/navigation";

// No traditional global not-found.ts file yet in app directory
// Temp method
export default function NotFound() {
    notFound()
}