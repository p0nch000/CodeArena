'use client'

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useAuthRedirect } from '@/core/hooks/useAuthRedirect'

export default function RootLayout({ children }) {
  const { loading } = useAuthRedirect()

  if (loading) {
    return (
      <div className="min-h-screen bg-mahindra-navy-blue flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mahindra-red" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="scale-90 origin-top flex-grow transform-gpu">
        {children}
      </main>
      <Footer />
    </div>
  )
}
  