'use client'
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';

export interface LoginFormData {
  email: string;
  password: string;
}

interface LoginPageProps {
  onLogin?: (data: LoginFormData) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Welcome Back to UrbanEase
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Access your municipal services dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8">
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-purple-600 hover:text-purple-500 font-medium transition-colors duration-200"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign In
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-gray-600">
                Don't have an account?{' '}
                <a
                  href="#"
                  className="text-purple-600 hover:text-purple-500 font-medium transition-colors duration-200"
                >
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center text-sm text-gray-600 flex items-center justify-center">
          <Shield className="w-4 h-4 mr-2" />
          Your connection is secure and encrypted
        </div>
      </div>
    </div>
  );
}