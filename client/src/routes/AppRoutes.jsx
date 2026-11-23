
import { Routes, Route } from 'react-router'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import HouseholdSetup from '../pages/HouseholdSetup'
import InviteRoommates from '../pages/InviteRoommates'

import DashboardLayout from '../layouts/DashboardLayout'

import Dashboard from '../pages/Dashboard'
import Expenses from '../pages/Expenses'
import Balances from '../pages/Balances'
import Shopping from '../pages/Shopping'
import Inventory from '../pages/Inventory'
import Chores from '../pages/Chores'
import Settings from '../pages/Settings'

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/household-setup" element={<HouseholdSetup />} />
      <Route path="/invite-roommates" element={<InviteRoommates />} />

      {/* Application routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/balances" element={<Balances />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/chores" element={<Chores />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
