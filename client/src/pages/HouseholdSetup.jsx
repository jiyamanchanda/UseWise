import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

function HouseholdSetup() {
  const [selectedOption, setSelectedOption] = useState('')
  const [householdName, setHouseholdName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleContinue = () => {
    setError('')

    if (!selectedOption) {
      setError('Please choose an option to continue.')
      return
    }

    if (selectedOption === 'create') {
  if (!householdName.trim()) {
    setError('Please enter a household name.')
    return
  }

  navigate('/invite-roommates', {
    state: {
      householdName: householdName.trim(),
    },
  })
}

    if (selectedOption === 'join') {
      if (!inviteCode.trim()) {
        setError('Please enter an invitation code.')
        return
      }

      // Temporary frontend flow
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-3xl">

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
            U
          </div>

          <span className="text-2xl font-bold text-slate-900">
            UseWise
          </span>
        </Link>

        {/* Heading */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-indigo-600 mb-2">
            ONE MORE STEP
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Set up your household
          </h1>

          <p className="text-slate-500 mt-3 max-w-lg mx-auto">
            Create a shared space for your roommates or join an existing household.
          </p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Create household */}
          <button
            type="button"
            onClick={() => {
              setSelectedOption('create')
              setError('')
            }}
            className={`text-left p-6 rounded-2xl border-2 transition-all ${
              selectedOption === 'create'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-slate-200 bg-white hover:border-indigo-300'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl mb-4">
              🏠
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Create a household
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Start a new household and invite your roommates to join.
            </p>

            <div className="mt-5 text-sm font-semibold text-indigo-600">
              Create your own →
            </div>
          </button>

          {/* Join household */}
          <button
            type="button"
            onClick={() => {
              setSelectedOption('join')
              setError('')
            }}
            className={`text-left p-6 rounded-2xl border-2 transition-all ${
              selectedOption === 'join'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-slate-200 bg-white hover:border-indigo-300'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl mb-4">
              👥
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Join a household
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Already living with others? Join using an invitation code.
            </p>

            <div className="mt-5 text-sm font-semibold text-indigo-600">
              Join existing household →
            </div>
          </button>

        </div>

        {/* Dynamic form */}
        {selectedOption && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-6">

            {selectedOption === 'create' && (
              <>
                <h3 className="text-lg font-bold text-slate-900">
                  Create your household
                </h3>

                <p className="text-sm text-slate-500 mt-1 mb-5">
                  Give your household a name that everyone will recognize.
                </p>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Household name
                </label>

                <input
                  type="text"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  placeholder="e.g. The Flatmates, Hostel Room 204"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </>
            )}

            {selectedOption === 'join' && (
              <>
                <h3 className="text-lg font-bold text-slate-900">
                  Join a household
                </h3>

                <p className="text-sm text-slate-500 mt-1 mb-5">
                  Enter the invitation code shared by your household admin.
                </p>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Invitation code
                </label>

                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter your invite code"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </>
            )}

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 mt-4">
                {error}
              </p>
            )}

            {/* Continue button */}
            <button
              onClick={handleContinue}
              className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Continue
            </button>

          </div>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default HouseholdSetup