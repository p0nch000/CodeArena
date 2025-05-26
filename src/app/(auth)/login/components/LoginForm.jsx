'use client'

import { useState } from 'react'
import { FaUser, FaLock } from 'react-icons/fa'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/core/context/AuthContext'

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [credentials, setCredentials] = useState({
    mail: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login')
      }

      // Update auth context
      login(data.user)
      
      router.push('/home')
      router.refresh()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    
    <div className="min-h-screen bg-mahindra-navy-blue flex items-center justify-center p-4">
      
      <div className="bg-[#1a202c] p-8 rounded-xl w-full max-w-[550px] flex flex-col gap-6">
        
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative w-7 h-6">
              <Image
                src="/CodeArenaLogoNoText.png"
                alt="CodeArena Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-white font-mono text-xl tracking-tight">CodeArena</span>
          </div>
          <p className="text-sm text-mahindra-light-gray">Please enter your credentials</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-mahindra-light-gray">Email</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-mahindra-light-gray text-sm" />
              <input
                id="email"
                type="email"
                value={credentials.mail}
                onChange={(e) => setCredentials({ ...credentials, mail: e.target.value })}
                className="w-full bg-mahindra-black/60 text-mahindra-white text-sm pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-mahindra-red border border-transparent focus:border-mahindra-red/30 transition-all"
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm text-mahindra-light-gray">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-mahindra-light-gray text-sm" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full bg-mahindra-black/60 text-mahindra-white text-sm pl-9 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-mahindra-red border border-transparent focus:border-mahindra-red/30 transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mahindra-light-gray hover:text-mahindra-white transition-colors"
              >
                {showPassword ? <AiFillEyeInvisible className="text-lg" /> : <AiFillEye className="text-lg" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {/* <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-3.5 h-3.5 rounded bg-[#1e2330] border-mahindra-light-gray/30 text-mahindra-red focus:ring-2 focus:ring-mahindra-red"
              />
              <label htmlFor="remember" className="ml-2 text-xs text-mahindra-light-gray">
                Remember me
              </label>
            </div>
            <a 
              href="/forgot-password" 
              className="text-xs text-mahindra-red hover:text-mahindra-red/80 transition-colors"
            >
              Forgot Password?
            </a> */}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-mahindra-red text-mahindra-white py-2.5 rounded-lg hover:bg-mahindra-red/90 transition-all text-sm font-semibold shadow-lg hover:shadow-mahindra-red/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-mahindra-light-gray/20">
          <p className="text-sm text-mahindra-light-gray">
            Don't have an account?{' '}
            <a 
              href="/signup" 
              className="text-mahindra-red hover:text-mahindra-red/80 transition-colors font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 