'use client'

import { useState } from 'react'
import { FaUser, FaLock } from 'react-icons/fa'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import axios from 'axios'
import Image from 'next/image'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/auth/login', credentials)
      //TODO: HANDLE SUCCESSFUL LOGIN
    } catch (error) {
      //TODO: HANDLE ERROR
    }
  }

  return (
    <div className="min-h-screen bg-mahindra-navy-blue flex items-center justify-center">
      <div className="bg-[#1a202c] p-8 rounded-lg w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-3">
          <Image
            src="/logo.jpeg"
            alt="Tech Mahindra Logo"
            width={56}
            height={56}
          />
          <h1 className="text-xl font-semibold text-mahindra-white">CodeArena</h1>
          <p className="text-xs text-mahindra-light-gray">Please enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs text-mahindra-light-gray">Email</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-mahindra-light-gray text-sm" />
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full bg-mahindra-black/60 text-mahindra-white text-sm pl-9 pr-4 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-mahindra-red border border-transparent focus:border-mahindra-red/30"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs text-mahindra-light-gray">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-mahindra-light-gray text-sm" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full bg-mahindra-black/60 text-mahindra-white text-sm pl-9 pr-10 py-2.5 rounded-md focus:outline-none focus:ring-1 focus:ring-mahindra-red border border-transparent focus:border-mahindra-red/30"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-3.5 h-3.5 rounded bg-[#1e2330] border-mahindra-light-gray/30 text-mahindra-red focus:ring-1 focus:ring-mahindra-red"
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
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-mahindra-red text-mahindra-white py-2.5 rounded-md hover:bg-mahindra-red/90 transition-colors text-sm font-medium mt-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
} 