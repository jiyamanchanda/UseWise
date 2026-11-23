import { useState } from 'react'
 import { Link, useNavigate, useLocation } from 'react-router'

function InviteRoommates() {
  const navigate = useNavigate()

  const [emails, setEmails] = useState([''])
  const [invitedEmails, setInvitedEmails] = useState([])
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Temporary mock household information
 

const location = useLocation()
const householdName = location.state?.householdName || 'My Household'
const [inviteCode] = useState(
  () => 'UW-' + Math.random().toString(36).substring(2, 8).toUpperCase()
)
  const handleEmailChange = (index, value) => {
    const updatedEmails = [...emails]
    updatedEmails[index] = value
    setEmails(updatedEmails)
  }

  const addEmailField = () => {
    setEmails([...emails, ''])
  }

  const removeEmailField = (index) => {
    setEmails(emails.filter((_, i) => i !== index))
  }

  const handleInvite = () => {
    setError('')

    const validEmails = emails
      .map((email) => email.trim())
      .filter((email) => email !== '')

    if (validEmails.length === 0) {
      setError('Please enter at least one email address.')
      return
    }

    const invalidEmail = validEmails.find(
      (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    )

    if (invalidEmail) {
      setError(`Please enter a valid email address: ${invalidEmail}`)
      return
    }

    setInvitedEmails([...invitedEmails, ...validEmails])
    setEmails([''])
  }

  const handleCopyCode = async () => {
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

        {/* Household card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">

          <p className="text-sm text-slate-500">
            Your household
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {householdName}
          </h2>

          <div className="mt-6 p-4 bg-indigo-50 rounded-xl">

            <p className="text-sm font-medium text-slate-700 mb-2">
              Household invitation code
            </p>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white border border-indigo-200 rounded-lg px-4 py-3">
                <p className="text-xl font-bold tracking-widest text-indigo-700">
                  {inviteCode}
                </p>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Share this code with your roommates so they can join your household.
            </p>
          </div>

        </div>

        {/* Email invitations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">

          <h2 className="text-lg font-bold text-slate-900">
            Invite by email
          </h2>

          <p className="text-sm text-slate-500 mt-1 mb-5">
            Add your roommates' email addresses.
          </p>

          {emails.map((email, index) => (
            <div key={index} className="flex gap-2 mb-3">

              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder="roommate@example.com"
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmailField(index)}
                  className="px-3 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  ✕
                </button>
              )}

            </div>
          ))}

          <button
            type="button"
            onClick={addEmailField}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 mt-1"
          >
            + Add another email
          </button>

          {error && (
            <p className="text-sm text-red-600 mt-4">
              {error}
            </p>
          )}

          <button
            onClick={handleInvite}
            className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Send Invitations
          </button>

          {/* Mock invitation results */}
          {invitedEmails.length > 0 && (
            <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4">

              <p className="text-sm font-semibold text-emerald-700 mb-2">
                Invitations added successfully!
              </p>

              {invitedEmails.map((email, index) => (
                <p key={index} className="text-sm text-emerald-600">
                  ✓ {email}
                </p>
              ))}

            </div>
          )}

        </div>

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">

          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>

          <button
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