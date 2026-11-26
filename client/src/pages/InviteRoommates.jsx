
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { addHouseholdMember } from '../services/api'

function InviteRoommates() {
  const navigate = useNavigate()
  const location = useLocation()

  // Household information received from backend
  const household = location.state?.household

  const householdName =
    household?.name || location.state?.householdName || 'My Household'

  const inviteCode = household?.inviteCode || ''

  // Component states
  const [emails, setEmails] = useState([''])
  const [invitedEmails, setInvitedEmails] = useState([])
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  // Handle email input changes
  const handleEmailChange = (index, value) => {
    const updatedEmails = [...emails]
    updatedEmails[index] = value
    setEmails(updatedEmails)
  }

  // Add another email input
  const addEmailField = () => {
    setEmails([...emails, ''])
  }

  // Remove an email input
  const removeEmailField = (index) => {
    setEmails(emails.filter((_, i) => i !== index))
  }

  // Add registered users to household
  const handleInvite = async () => {
    setError('')

    const validEmails = emails
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email !== '')

    // Check household information
    if (!household?._id) {
      setError(
        'Household information is missing. Please create a household again.'
      )
      return
    }

    // Check whether at least one email is entered
    if (validEmails.length === 0) {
      setError('Please enter at least one email address.')
      return
    }

    // Validate email format
    const invalidEmail = validEmails.find(
      (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    )

    if (invalidEmail) {
      setError(`Please enter a valid email address: ${invalidEmail}`)
      return
    }

    // Remove duplicate emails
    const uniqueEmails = [...new Set(validEmails)]

    setLoading(true)

    const successfulEmails = []
    const failedEmails = []

    try {
      for (const email of uniqueEmails) {
        try {
          await addHouseholdMember(household._id, email)
          successfulEmails.push(email)
        } catch (error) {
          failedEmails.push({
            email,
            message: error.message
          })
        }
      }

      // Update successful members
      setInvitedEmails((previous) => [
        ...previous,
        ...successfulEmails
      ])

      // Handle failed invitations
      if (failedEmails.length === 0) {
        setEmails([''])
      } else {
        setEmails(failedEmails.map((item) => item.email))

        setError(
          failedEmails
            .map((item) => `${item.email}: ${item.message}`)
            .join(' | ')
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // Copy invitation code
  const handleCopyCode = async () => {
    setError('')

    if (!inviteCode) {
      setError('Invitation code is unavailable.')
      return
    }

    try {
      await navigator.clipboard.writeText(inviteCode)

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      setError('Unable to copy the code. Please copy it manually.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-2xl">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
            U
          </div>

          <span className="text-2xl font-bold text-slate-900">
            UseWise
          </span>
        </Link>

        {/* Heading */}
        <div className="text-center mb-8">

          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            🎉
          </div>

          <p className="text-sm font-semibold text-indigo-600 mb-2">
            HOUSEHOLD CREATED
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Bring your roommates together
          </h1>

          <p className="text-slate-500 mt-3">
            Invite your household members to start using UseWise together.
          </p>

        </div>

        {/* Household Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">

          <p className="text-sm text-slate-500">
            Your household
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {householdName}
          </h2>

          {/* Invitation Code */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-xl">

            <p className="text-sm font-medium text-slate-700 mb-2">
              Household invitation code
            </p>

            <div className="flex items-center gap-3">

              <div className="flex-1 min-w-0 bg-white border border-indigo-200 rounded-lg px-4 py-3">

                <p className="text-xl font-bold tracking-widest text-indigo-700 break-all">
                  {inviteCode || 'Invitation code unavailable'}
                </p>

              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                disabled={!inviteCode}
                className="px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>

            </div>

            <p className="text-xs text-slate-500 mt-3">
              Share this code with your roommates so they can join your household.
            </p>

          </div>

        </div>

        {/* Email Invitations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <h2 className="text-lg font-bold text-slate-900">
            Add roommates by email
          </h2>

          <p className="text-sm text-slate-500 mt-1 mb-5">
            Enter the email addresses of roommates who already have a UseWise account.
          </p>

          {/* Email Inputs */}
          {emails.map((email, index) => (

            <div key={index} className="flex gap-2 mb-3">

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  handleEmailChange(index, e.target.value)
                }
                placeholder="roommate@example.com"
                disabled={loading}
                className="flex-1 min-w-0 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
              />

              {emails.length > 1 && (

                <button
                  type="button"
                  onClick={() => removeEmailField(index)}
                  disabled={loading}
                  className="px-3 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                >
                  ✕
                </button>

              )}

            </div>

          ))}

          {/* Add Email Field */}
          <button
            type="button"
            onClick={addEmailField}
            disabled={loading}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 mt-1 disabled:opacity-50"
          >
            + Add another email
          </button>

          {/* Error Message */}
          {error && (

            <p className="text-sm text-red-600 mt-4">
              {error}
            </p>

          )}

          {/* Add Members Button */}
          <button
            type="button"
            onClick={handleInvite}
            disabled={loading}
            className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding members...' : 'Add Members'}
          </button>

          {/* Successful Members */}
          {invitedEmails.length > 0 && (

            <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4">

              <p className="text-sm font-semibold text-emerald-700 mb-2">
                Members added successfully!
              </p>

              {invitedEmails.map((email, index) => (

                <p key={`${email}-${index}`} className="text-sm text-emerald-600">
                  ✓ {email}
                </p>

              ))}

            </div>

          )}

        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
          >
            Skip for now
          </button>

        </div>

      </div>

    </div>
  )
}

export default InviteRoommates
