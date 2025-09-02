import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react'
import logo from "/logo.webp";
import React, { useState } from 'react'

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt:', formData)
      setIsLoading(false)
      // Handle login logic here
    }, 1500)
  }

  const isEmailFormat = formData.emailOrUsername.includes('@')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 transition-transform hover:scale-[1.01] duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center">
              <img src={logo} alt="Logo" width={100}/>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-1">KAKUTA USA</h1>
            <p className="text-gray-500 text-sm">Control System Login</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email/Username */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {isEmailFormat ? (
                  <Mail className="h-5 w-5 text-gray-400" />
                ) : (
                  <User className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <input
                type="text"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleInputChange}
                placeholder="Email or Username"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400 text-sm font-light">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Back to Website */}
          <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-2xl border border-gray-200 transition-all duration-200 shadow-sm">
            Back to Website
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
