'use client'

import { useState } from 'react'
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignUpForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [credentials, setCredentials] = useState({
    mail: '',
    password: '',
    username: ''
  })
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!acceptTerms) {
      setError('Please accept the Terms and Conditions')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
      }
      router.push('/login?registered=true') 
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
          <div className="relative w-14 h-14">
            <Image
              src="/logo.webp"
              alt="Tech Mahindra Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-mahindra-white mb-1">CodeArena</h1>
            <p className="text-sm text-mahindra-light-gray">Create a new account</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-sm text-mahindra-light-gray">Username</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-mahindra-light-gray text-sm" />
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full bg-mahindra-black/60 text-mahindra-white text-sm pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-mahindra-red border border-transparent focus:border-mahindra-red/30 transition-all"
                placeholder="Enter your username"
                disabled={isLoading}
                required
                minLength={3}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-mahindra-light-gray">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-mahindra-light-gray text-sm" />
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
                disabled={isLoading}
                required
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
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#1e2330] border-mahindra-light-gray/30 text-mahindra-red focus:ring-2 focus:ring-mahindra-red"
                required
              />
              <label htmlFor="terms" className="ml-2 text-xs text-mahindra-light-gray">
                I agree to the Terms and Conditions
              </label>
            </div>
          </div>


          <button
            type="submit"
            disabled={isLoading || !acceptTerms}
            className="w-full bg-mahindra-red text-mahindra-white py-2.5 rounded-lg hover:bg-mahindra-red/90 transition-all text-sm font-semibold shadow-lg hover:shadow-mahindra-red/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}