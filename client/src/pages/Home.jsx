import { Link } from 'react-router'

const features = [
  {
    icon: '💰',
    title: 'Shared Expenses',
    description:
      'Record household expenses and keep track of who paid for what.',
  },
  {
    icon: '⚖️',
    title: 'Easy Settlements',
    description:
      'Know exactly who owes whom and settle shared payments easily.',
  },
  {
    icon: '🛒',
    title: 'Shopping Lists',
    description:
      'Create shared shopping lists and keep everyone updated in real time.',
  },
  {
    icon: '📦',
    title: 'Household Inventory',
    description:
      'Track shared essentials and know what needs to be restocked.',
  },
  {
    icon: '🧹',
    title: 'Manage Chores',
    description:
      'Assign household tasks and make shared responsibilities easier.',
  },
  {
    icon: '📊',
    title: 'One Dashboard',
    description:
      'Get a clear overview of your household activity in one place.',
  },
]

function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="border-b border-slate-100">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              U
            </div>

            <div>
              <h1 className="text-xl font-bold">UseWise</h1>
              <p className="text-xs text-slate-500">
                Shared living, simplified
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              How it works
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Hero text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              ✨ Made for shared living
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
              Shared living,
              <span className="text-blue-600"> simplified.</span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
              Manage household expenses, split bills, organize shopping,
              track inventory and share chores — all in one place.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
                <span>→</span>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                I already have an account
              </Link>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Designed for roommates, families and shared households.
            </p>
          </div>

          {/* Dashboard preview */}
          <div className="bg-slate-50 rounded-3xl p-5 md:p-8 border border-slate-200">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Preview top bar */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    Household Overview
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Your shared space
                  </p>
                </div>

                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                  U
                </div>
              </div>

              {/* Preview stats */}
              <div className="grid grid-cols-2 gap-3 p-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500">
                    Monthly expenses
                  </p>

                  <p className="text-xl font-bold text-slate-900 mt-2">
                    ₹12,450
                  </p>

                  <p className="text-xs text-blue-600 mt-1">
                    This month
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500">
                    Your balance
                  </p>

                  <p className="text-xl font-bold text-slate-900 mt-2">
                    ₹850
                  </p>

                  <p className="text-xs text-green-600 mt-1">
                    You are owed
                  </p>
                </div>
              </div>

              {/* Preview activity */}
              <div className="px-4 pb-4">
                <div className="border border-slate-100 rounded-xl p-4">
                  <p className="text-sm font-semibold text-slate-800 mb-3">
                    Recent activity
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                          🛒
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            Groceries
                          </p>

                          <p className="text-xs text-slate-500">
                            Rahul paid
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-semibold">
                        ₹1,200
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                          💡
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            Electricity
                          </p>

                          <p className="text-xs text-slate-500">
                            Priya paid
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-semibold">
                        ₹2,400
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                          🧹
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            Kitchen cleaning
                          </p>

                          <p className="text-xs text-slate-500">
                            Chore completed
                          </p>
                        </div>
                      </div>

                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Done
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 mt-4">
              A preview of your organized household
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Everything in one place
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Less household chaos.
              <br />
              More organization.
            </h2>

            <p className="mt-4 text-slate-600">
              Everything you need to manage a shared household
              without juggling multiple apps and spreadsheets.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                  {feature.icon}
                </div>

                <h3 className="text-lg font-semibold mt-5">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Simple setup
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Get your household organized in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-xl font-bold">
                1
              </div>

              <h3 className="font-semibold text-lg mt-5">
                Create your account
              </h3>

              <p className="text-slate-600 text-sm mt-3">
                Sign up and create your personal UseWise account.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-xl font-bold">
                2
              </div>

              <h3 className="font-semibold text-lg mt-5">
                Create or join a household
              </h3>

              <p className="text-slate-600 text-sm mt-3">
                Set up your shared household or join your roommates
                through an invitation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-xl font-bold">
                3
              </div>

              <h3 className="font-semibold text-lg mt-5">
                Start managing together
              </h3>

              <p className="text-slate-600 text-sm mt-3">
                Track expenses, manage supplies and divide
                responsibilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-3xl px-8 py-14 md:px-14 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold">
            Make shared living easier.
          </h2>

          <p className="mt-4 text-blue-100 max-w-xl mx-auto">
            Bring your household expenses, shopping and
            responsibilities together in one place.
          </p>

          <Link
            to="/register"
            className="inline-flex mt-8 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Get Started for Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg text-white flex items-center justify-center font-bold">
              U
            </div>

            <span className="font-semibold">UseWise</span>
          </div>

          <p className="text-sm text-slate-500 text-center">
            Shared living, simplified.
          </p>

          <p className="text-sm text-slate-400">
            © 2026 UseWise
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home