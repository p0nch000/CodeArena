'use client'

import { useAuthRedirect } from '@/core/hooks/useAuthRedirect'

export default function Home() {
  const { loading } = useAuthRedirect('/login', '/home')

  if (loading) {
    return (
      <div className="min-h-screen bg-mahindra-navy-blue flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return null
}
