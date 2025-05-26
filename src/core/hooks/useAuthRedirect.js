'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export function useAuthRedirect(redirectPath = '/login', successPath = null) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user && successPath) {
        router.push(successPath)
      } else if (!user) {
        router.push(redirectPath)
      }
    }
  }, [user, loading, router, redirectPath, successPath])

  return { user, loading }
} 