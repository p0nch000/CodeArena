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
    
    <div className="min-h-screen bg-mahindra-navy-blue flex items-center justify-center p-4">
      
      <div className="bg-[#1a202c] p-8 rounded-xl w-full max-w-[550px] flex flex-col gap-6">
        
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-40 h-20">
            <Image
              src="/code_arena_logo.png"
              alt="Tech Mahindra Logo"
              fill
              className="object-contain w-full h-full"
            />
          </div>
          {/* <div className="text-center">
            <h1 className="text-xl font-bold text-mahindra-white mb-1">CodeArena</h1>
            <p className="text-sm text-mahindra-light-gray">Please enter your credentials</p>
          </div> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-mahindra-light-gray">Email</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-mahindra-light-gray text-sm" />
              <input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full bg-mahindra-black/60 text-mahindra-white text-sm pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-mahindra-red border border-transparent focus:border-mahindra-red/30 transition-all"
                placeholder="Enter your email"
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
            className="w-full bg-mahindra-red text-mahindra-white py-2.5 rounded-lg hover:bg-mahindra-red/90 transition-all text-sm font-semibold shadow-lg hover:shadow-mahindra-red/20 mt-6"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
} 