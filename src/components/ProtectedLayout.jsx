'use client'
import React from 'react';
import { useAuthRedirect } from '@/core/hooks/useAuthRedirect'

export default function ProtectedLayout({ children }) {
  const { loading } = useAuthRedirect()

  if (loading) {
  return (
    <div className="min-h-screen bg-mahindra-navy-blue flex items-center justify-center">
      <div
        role="status" 
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mahindra-red"
      />
    </div>
  )
}
  return children
} 