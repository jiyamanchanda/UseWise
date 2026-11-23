import { useState } from 'react'

const initialBalances = [
  {
    id: 1,
    name: 'Rahul',
    avatar: 'R',
    balance: -500,
  },
  {
    id: 2,
    name: 'Priya',
    avatar: 'P',
    balance: 350,
  },
  {
    id: 3,
    name: 'Aman',
    avatar: 'A',
    balance: 200,
  },
]

const initialSettlements = [
  {
    id: 1,
    from: 'Rahul',
    to: 'You',
    amount: 500,
    date: '2026-11-20',
    status: 'Pending',
  },
  {
    id: 2,
    from: 'You',
    to: 'Priya',
    amount: 200,
    date: '2026-11-18',
    status: 'Completed',
  },
]

function Balances() {
  const [balances, setBalances] = useState(initialBalances)
  const [settlements, setSettlements] = useState(initialSettlements)
  const [showModal, setShowModal] = useState(false)
  const [selectedSettlement, setSelectedSettlement] = useState(null)
  const [settlementAmount, setSettlementAmount] = useState('')
  const [settlementMethod, setSettlementMethod] = useState('UPI')
  const [error, setError] = useState('')

  const youAreOwed = balances
    .filter((member) => member.balance > 0)
    .reduce((total, member) => total + member.balance, 0)

  const youOwe = balances
    .filter((member) => member.balance < 0)
    .reduce((total, member) => total + Math.abs(member.balance), 0)

  const netBalance = youAreOwed - youOwe

  const pendingSettlements = settlements.filter(
    (settlement) => settlement.status === 'Pending'
  )

  const completedSettlements = settlements.filter(
    (settlement) => settlement.status === 'Completed'
  )

  const openSettlementModal = (settlement) => {
    setSelectedSettlement(settlement)
    setSettlementAmount(String(settlement.amount))
    setSettlementMethod('UPI')
    setError('')
    setShowModal(true)
  }

  const handleCompleteSettlement = () => {
    setError('')

    if (!settlementAmount || Number(settlementAmount) <= 0) {
      setError('Enter a valid settlement amount.')
      return
    }

    if (Number(settlementAmount) !== selectedSettlement.amount) {
      setError(
        'For this demo, settle the full suggested amount.'
      )
      return
    }

    setSettlements((previous) =>
      previous.map((settlement) =>
        settlement.id === selectedSettlement.id
          ? {
              ...settlement,
              status: 'Completed',
              date: new Date().toISOString().split('T')[0],
              method: settlementMethod,
            }
          : settlement
      )
    )

    setBalances((previous) =>
      previous.map((member) => {
        if (selectedSettlement.from === 'You') {
          if (member.name === selectedSettlement.to) {
            return {
              ...member,
              balance: member.balance + selectedSettlement.amount,
            }
          }
        }

        if (selectedSettlement.to === 'You') {
          if (member.name === selectedSettlement.from) {
            return {
              ...member,
              balance: member.balance - selectedSettlement.amount,
            }
          }
        }

        return member
      })
    )

    setShowModal(false)
    setSelectedSettlement(null)
  }

  const formatAmount = (amount) =>
    `₹${Math.abs(amount).toLocaleString('en-IN')}`

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Balances & Settlements
        </h1>

        <p className="text-slate-500 mt-2">
          Keep track of who owes whom and settle up easily.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            You're owed
          </p>

          <h2 className="text-2xl font-bold text-emerald-600 mt-2">
            ₹{youAreOwed.toLocaleString('en-IN')}
          </h2>

          <p className="text-xs text-slate-400 mt-2">
            Money others owe you
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            You owe
          </p>

          <h2 className="text-2xl font-bold text-red-600 mt-2">
            ₹{youOwe.toLocaleString('en-IN')}
          </h2>

          <p className="text-xs text-slate-400 mt-2">
            Money you owe others
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Net Balance
          </p>

          <h2
            className={`text-2xl font-bold mt-2 ${
              netBalance >= 0
                ? 'text-emerald-600'
                : 'text-red-600'
            }`}
          >
            {netBalance >= 0 ? '+' : '-'}
            {formatAmount(netBalance)}
          </h2>

          <p className="text-xs text-slate-400 mt-2">
            {netBalance >= 0
              ? 'You are in credit'
              : 'You owe more than you are owed'}
          </p>
        </div>

      </div>

      {/* Member balances */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            Member Balances
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Your individual balance with each household member.
          </p>
        </div>

        <div className="divide-y divide-slate-100">

          {balances.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-5 gap-3"
            >

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  {member.avatar}
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    {member.name}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {member.balance > 0
                      ? `${member.name} owes you`
                      : member.balance < 0
                      ? `You owe ${member.name}`
                      : 'Settled up'}
                  </p>
                </div>

              </div>

              <div className="text-right">
                <p
                  className={`font-bold ${
                    member.balance > 0
                      ? 'text-emerald-600'
                      : member.balance < 0
                      ? 'text-red-600'
                      : 'text-slate-500'
                  }`}
                >
                  {member.balance > 0
                    ? `+${formatAmount(member.balance)}`
                    : member.balance < 0
                    ? `-${formatAmount(member.balance)}`
                    : '₹0'}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {member.balance > 0
                    ? 'You receive'
                    : member.balance < 0
                    ? 'You pay'
                    : 'No outstanding balance'}
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>

      {/* Suggested settlements */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            Suggested Settlements
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Settle outstanding amounts with your roommates.
          </p>
        </div>

        {pendingSettlements.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">🎉</div>

            <h3 className="font-semibold text-slate-800">
              You're all settled!
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              There are no pending settlements.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {pendingSettlements.map((settlement) => (
              <div
                key={settlement.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    💸
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      {settlement.from} → {settlement.to}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {settlement.from === 'You'
                        ? `You pay ${settlement.to}`
                        : `${settlement.from} pays you`}
                    </p>
                  </div>

                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">

                  <p className="text-lg font-bold text-slate-900">
                    ₹{settlement.amount.toLocaleString('en-IN')}
                  </p>

                  <button
                    onClick={() => openSettlementModal(settlement)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Settle Up
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* Settlement history */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            Settlement History
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Previous payments between household members.
          </p>
        </div>

        {completedSettlements.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">
            No completed settlements yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {completedSettlements.map((settlement) => (
              <div
                key={settlement.id}
                className="flex items-center justify-between gap-3 p-4"
              >

                <div>
                  <p className="font-semibold text-slate-800">
                    {settlement.from} → {settlement.to}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {new Date(
                      settlement.date + 'T00:00:00'
                    ).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    {settlement.method
                      ? ` · ${settlement.method}`
                      : ''}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-900">
                    ₹{settlement.amount.toLocaleString('en-IN')}
                  </p>

                  <span className="text-xs text-emerald-600 font-medium">
                    ✓ Completed
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* Settlement modal */}
      {showModal && selectedSettlement && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">

            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Record Settlement
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-500 text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-5">

              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-sm text-slate-600">
                  Settlement
                </p>

                <p className="text-lg font-bold text-indigo-700 mt-1">
                  {selectedSettlement.from} → {selectedSettlement.to}
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-3">
                  ₹{selectedSettlement.amount.toLocaleString('en-IN')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Amount
                </label>

                <input
                  type="number"
                  value={settlementAmount}
                  onChange={(e) => setSettlementAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment method
                </label>

                <select
                  value={settlementMethod}
                  onChange={(e) => setSettlementMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}

            </div>

            <div className="p-5 border-t border-slate-200 flex gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleCompleteSettlement}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl"
              >
                Mark as Settled
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default Balances