import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { registerUser } from '../services/api'


function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

async function handleSubmit(e) {
  e.preventDefault()
  setError('')

  if (!name.trim() || !email.trim() || !password || !confirmPassword) {
    setError('Please fill in all fields.')
    return
  }

  if (password.length < 8) {
    setError('Password must be at least 8 characters long.')
    return
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match.')
    return
  }

  if (!agreeToTerms) {
    setError('Please agree to the terms before continuing.')
    return
  }

  try {
    setLoading(true)

    const data = await registerUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    })

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    navigate('/household-setup')

  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Branding section */}
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
            Better together.
            <br />
            More organized.
            <br />
            Less stressful.
          </h2>

          <p className="mt-6 text-lg text-blue-100 leading-relaxed">
            Bring your roommates together and make managing
            your shared household easier than ever.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                ✓
              </div>

              <p className="text-blue-100">
                Keep shared expenses organized
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                ✓
              </div>

              <p className="text-blue-100">
                Manage household responsibilities
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                ✓
              </div>

              <p className="text-blue-100">
                Stay connected with your household
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-blue-100">
          © 2026 UseWise
        </p>
      </div>

      {/* Registration form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-3 mb-8 lg:hidden">
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
              Create your account
            </h2>

            <p className="text-slate-500 mt-2">
              Get started with your shared household
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
            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

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
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-3 pr-20 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 font-medium hover:text-blue-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Use at least 8 characters.
              </p>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Confirm password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 pr-20 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 font-medium hover:text-blue-700"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-slate-300 accent-blue-600"
              />

              <span className="text-sm text-slate-600">
                I agree to the Terms of Service and Privacy Policy.
              </span>
            </label>

            {/* Submit */}
            <button
  type="submit"
  disabled={loading}
  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
>
  {loading ? 'Creating account...' : 'Create account'}
</button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>

          {/* Home */}
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

export default Register
