
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { loginUser } from '../services/api'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    try {
      setLoading(true)

      const data = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      })

      // Store authentication details
      const storage = rememberMe ? localStorage : sessionStorage

      storage.setItem('token', data.token)
      storage.setItem('user', JSON.stringify(data.user))

      // Clear any previous session
      const otherStorage = rememberMe ? sessionStorage : localStorage
      otherStorage.removeItem('token')
      otherStorage.removeItem('user')

      navigate('/dashboard', { replace: true })

    } catch (error) {
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Left branding section */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white flex-col justify-between p-12">

        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white text-blue-600 flex items-center justify-center font-bold text-2xl">
            U
          </div>

          <div>
            <h1 className="text-2xl font-bold">UseWise</h1>
            <p className="text-sm text-blue-100">
              Shared living, simplified
            </p>
          </div>
        </Link>

        <div className="max-w-lg">
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
            Your household.
            <br />
            Your shared space.
            <br />
            All organized.
          </h2>

          <p className="mt-6 text-lg text-blue-100 leading-relaxed">
            Keep track of expenses, shopping, inventory and
            responsibilities with everyone in your household.
          </p>
        </div>

        <p className="text-sm text-blue-100">
          © 2026 UseWise
        </p>
      </div>

      {/* Login section */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              U
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                UseWise
              </h1>

              <p className="text-xs text-slate-500">
                Shared living, simplified
              </p>
            </div>
          </Link>

          {/* Heading */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Welcome back
            </h2>

            <p className="text-slate-500 mt-2">
              Sign in to your UseWise account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-20 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 font-medium hover:text-blue-700"
                  disabled={loading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                  disabled={loading}
                />

                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Create one
            </Link>
          </p>

          {/* Home link */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-slate-400 hover:text-slate-600"
            >
              ← Back to home
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login
