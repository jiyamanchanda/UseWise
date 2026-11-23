
import { useState } from 'react'

function Settings() {
  const [activeTab, setActiveTab] = useState('profile')

  const [profile, setProfile] = useState({
    name: 'User',
    email: 'user@example.com',
    phone: '',
  })

  const [household, setHousehold] = useState({
  name: 'My Household',
  inviteCode: 'UW-ABC123',
  members: [
    { id: 1, name: 'You', email: 'user@example.com', role: 'Owner' },
    { id: 2, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Member' },
    { id: 3, name: 'Priya Singh', email: 'priya@example.com', role: 'Member' },
    { id: 4, name: 'Aman Verma', email: 'aman@example.com', role: 'Member' },
  ],
})

const [householdEditing, setHouseholdEditing] = useState(false)
const [householdName, setHouseholdName] = useState(household.name)

const [showInviteModal, setShowInviteModal] = useState(false)
const [inviteEmail, setInviteEmail] = useState('')

  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState(profile)

  const [passwordData, setPasswordData] = useState({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const [showPasswords, setShowPasswords] = useState({
  current: false,
  new: false,
  confirm: false,
})

const handlePasswordChange = (e) => {
  setPasswordData({
    ...passwordData,
    [e.target.name]: e.target.value,
  })
}

const handlePasswordSubmit = () => {
  if (
    !passwordData.currentPassword ||
    !passwordData.newPassword ||
    !passwordData.confirmPassword
  ) {
    alert('Please fill in all password fields.')
    return
  }

  if (passwordData.newPassword.length < 8) {
    alert('New password must be at least 8 characters long.')
    return
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    alert('New passwords do not match.')
    return
  }

  if (passwordData.currentPassword === passwordData.newPassword) {
    alert('Your new password must be different from your current password.')
    return
  }

  alert('Password updated successfully! (Demo)')

  setPasswordData({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
}

  const handleHouseholdSave = () => {
  if (!householdName.trim()) {
    alert('Household name is required.')
    return
  }

  setHousehold({
    ...household,
    name: householdName.trim(),
  })

  setHouseholdEditing(false)
  alert('Household name updated successfully!')
}

const handleHouseholdCancel = () => {
  setHouseholdName(household.name)
  setHouseholdEditing(false)
}

const handleCopyInviteCode = async () => {
  try {
    await navigator.clipboard.writeText(household.inviteCode)
    alert('Invite code copied!')
  } catch {
    alert('Unable to copy invite code.')
  }
}

const handleInviteMember = () => {
  const email = inviteEmail.trim().toLowerCase()

  if (!email) {
    alert('Please enter an email address.')
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.')
    return
  }

  if (household.members.some((member) => member.email.toLowerCase() === email)) {
    alert('This person is already a household member.')
    return
  }

  const newMember = {
    id: Date.now(),
    name: email.split('@')[0],
    email,
    role: 'Member',
  }

  setHousehold({
    ...household,
    members: [...household.members, newMember],
  })

  setInviteEmail('')
  setShowInviteModal(false)

  alert('Member added successfully! (Demo)')
}

const handleRemoveMember = (memberId) => {
  const confirmed = window.confirm(
    'Are you sure you want to remove this household member?'
  )

  if (!confirmed) return

  setHousehold({
    ...household,
    members: household.members.filter((member) => member.id !== memberId),
  })
}

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Name and email are required.')
      return
    }

    setProfile(formData)
    setIsEditing(false)
    alert('Profile updated successfully!')
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'household', label: 'Household', icon: '🏠' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Settings
        </h1>
        <p className="text-slate-500 mt-1">
          Manage your account and household preferences.
        </p>
      </div>

      {/* Settings Container */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[600px]">

          {/* Sidebar */}
          <div className="md:w-64 border-b md:border-b-0 md:border-r border-slate-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 md:p-8">

            {activeTab === 'profile' && (
              <div className="space-y-6">

                {/* Section Header */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Profile Information
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Manage your personal information.
                  </p>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold">
                    {profile.name
                      .split(' ')
                      .map((word) => word[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-800">
                      {profile.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Household Member
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancel}
                        className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleSave}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                      >
                        Save Changes
                      </button>
                    </>
                  )}

                </div>

              </div>
            )}

            
{activeTab === 'household' && (
  <div className="space-y-8">

    {/* Header */}
    <div>
      <h2 className="text-xl font-semibold text-slate-800">
        Household Settings
      </h2>
      <p className="text-sm text-slate-500 mt-1">
        Manage your shared household and its members.
      </p>
    </div>

    {/* Household Name */}
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Household Name</p>

          {!householdEditing ? (
            <h3 className="text-lg font-semibold text-slate-800 mt-1">
              {household.name}
            </h3>
          ) : (
            <input
              type="text"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              className="mt-2 w-full max-w-sm px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}
        </div>

        {!householdEditing ? (
          <button
            onClick={() => setHouseholdEditing(true)}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-slate-200 rounded-lg hover:bg-blue-50"
          >
            Edit Name
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleHouseholdCancel}
              className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-white"
            >
              Cancel
            </button>

            <button
              onClick={handleHouseholdSave}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Invite Code */}
    <div>
      <h3 className="font-semibold text-slate-800 mb-3">
        Household Invite Code
      </h3>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-600 mb-1">
            Share this code with someone joining your household
          </p>

          <p className="text-xl font-bold tracking-widest text-blue-800">
            {household.inviteCode}
          </p>
        </div>

        <button
          onClick={handleCopyInviteCode}
          className="px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium text-sm"
        >
          📋 Copy Code
        </button>
      </div>
    </div>

    {/* Members */}
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-slate-800">
            Household Members
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {household.members.length} members in your household
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Invite Member
        </button>
      </div>

      <div className="space-y-3">
        {household.members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between gap-3 p-4 border border-slate-200 rounded-xl"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-600 shrink-0">
                {member.name
                  .split(' ')
                  .map((word) => word[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>

              <div className="min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {member.name}
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {member.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                member.role === 'Owner'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {member.role}
              </span>

              {member.role !== 'Owner' && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-slate-400 hover:text-red-600 p-2"
                  title="Remove member"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Danger Zone */}
    <div className="border border-red-200 bg-red-50 rounded-2xl p-5">
      <h3 className="font-semibold text-red-700">
        Leave Household
      </h3>

      <p className="text-sm text-red-600 mt-1">
        Leaving this household will remove you from its shared space.
      </p>

      <button
        onClick={() => alert('Leave household functionality will be connected to the backend.')}
        className="mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
      >
        Leave Household
      </button>
    </div>

    {/* Invite Modal */}
    {showInviteModal && (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">

          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-slate-800">
              Invite Household Member
            </h3>

            <button
              onClick={() => {
                setShowInviteModal(false)
                setInviteEmail('')
              }}
              className="text-slate-400 hover:text-slate-700 text-xl"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-slate-500 mb-4">
            Enter the email address of the person you'd like to invite.
          </p>

          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setShowInviteModal(false)
                setInviteEmail('')
              }}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleInviteMember}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Add Member
            </button>
          </div>

        </div>
      </div>
    )}

  </div>
)}

            
{activeTab === 'security' && (
  <div className="space-y-6">

    {/* Header */}
    <div>
      <h2 className="text-xl font-semibold text-slate-800">
        Security
      </h2>
      <p className="text-sm text-slate-500 mt-1">
        Manage your password and account security.
      </p>
    </div>

    {/* Change Password */}
    <div className="border border-slate-200 rounded-2xl p-5 md:p-6">
      <h3 className="font-semibold text-slate-800">
        Change Password
      </h3>

      <p className="text-sm text-slate-500 mt-1 mb-6">
        Choose a strong password to keep your account secure.
      </p>

      <div className="space-y-5">

        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Current Password
          </label>

          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              className="w-full px-4 py-3 pr-16 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowPasswords({
                  ...showPasswords,
                  current: !showPasswords.current,
                })
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-600"
            >
              {showPasswords.current ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            New Password
          </label>

          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              className="w-full px-4 py-3 pr-16 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowPasswords({
                  ...showPasswords,
                  new: !showPasswords.new,
                })
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-600"
            >
              {showPasswords.new ? 'Hide' : 'Show'}
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            Password must contain at least 8 characters.
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confirm New Password
          </label>

          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm your new password"
              className="w-full px-4 py-3 pr-16 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() =>
                setShowPasswords({
                  ...showPasswords,
                  confirm: !showPasswords.confirm,
                })
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-600"
            >
              {showPasswords.confirm ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Password Strength */}
        {passwordData.newPassword && (
          <div>
            <p className="text-xs text-slate-500 mb-2">
              Password strength
            </p>

            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => {
                const password = passwordData.newPassword

                const score =
                  (password.length >= 8 ? 1 : 0) +
                  (/[A-Z]/.test(password) ? 1 : 0) +
                  (/[0-9]/.test(password) ? 1 : 0) +
                  (/[^A-Za-z0-9]/.test(password) ? 1 : 0)

                return (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full ${
                      score >= level
                        ? score <= 1
                          ? 'bg-red-400'
                          : score === 2
                            ? 'bg-yellow-400'
                            : score === 3
                              ? 'bg-blue-400'
                              : 'bg-green-500'
                        : 'bg-slate-200'
                    }`}
                  />
                )
              })}
            </div>

            <p className="text-xs mt-2 text-slate-500">
              {(() => {
                const password = passwordData.newPassword

                const score =
                  (password.length >= 8 ? 1 : 0) +
                  (/[A-Z]/.test(password) ? 1 : 0) +
                  (/[0-9]/.test(password) ? 1 : 0) +
                  (/[^A-Za-z0-9]/.test(password) ? 1 : 0)

                return score <= 1
                  ? 'Weak'
                  : score === 2
                    ? 'Fair'
                    : score === 3
                      ? 'Good'
                      : 'Strong'
              })()}
            </p>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={handlePasswordSubmit}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Update Password
          </button>
        </div>

      </div>
    </div>

    {/* Account Security Info */}
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
      <div className="flex gap-3">
        <span className="text-xl">🔒</span>

        <div>
          <h3 className="font-medium text-blue-800">
            Keep your account secure
          </h3>

          <p className="text-sm text-blue-700 mt-1">
            Use a unique password that you don't use on other
            websites. Never share your password with anyone.
          </p>
        </div>
      </div>
    </div>

  </div>
)}


          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
