import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'

import Home from './pages/Home'

import CustomerLogin from './pages/customer/Login'
import CustomerRegister from './pages/customer/Register'
import FindMechanic from './pages/customer/FindMechanic'
import MechanicDetails from './pages/customer/MechanicDetails'
import BookingTracking from './pages/customer/BookingTracking'
import BookingHistory from './pages/customer/BookingHistory'

import MechanicLogin from './pages/mechanic/Login'
import MechanicRegister from './pages/mechanic/Register'
import MechanicDashboard from './pages/mechanic/Dashboard'
import MechanicActiveBooking from './pages/mechanic/ActiveBooking'
import MechanicEarnings from './pages/mechanic/Earnings'

import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminMechanics from './pages/admin/Mechanics'
import AdminBookings from './pages/admin/Bookings'
import AdminPayments from './pages/admin/Payments'
import AdminComplaints from './pages/admin/Complaints'

function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="font-display text-3xl tracking-wide mb-2">404</p>
      <p className="text-slate-muted">This page took a wrong turn. Let's get you back on the road.</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/register" element={<CustomerRegister />} />
          <Route path="/find-mechanic" element={<FindMechanic />} />
          <Route path="/mechanic-details/:id" element={<MechanicDetails />} />
          <Route path="/booking/:id" element={<ProtectedRoute role="customer"><BookingTracking /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute role="customer"><BookingHistory /></ProtectedRoute>} />

          <Route path="/mechanic/login" element={<MechanicLogin />} />
          <Route path="/mechanic/register" element={<MechanicRegister />} />
          <Route path="/mechanic/dashboard" element={<ProtectedRoute role="mechanic"><MechanicDashboard /></ProtectedRoute>} />
          <Route path="/mechanic/active/:id" element={<ProtectedRoute role="mechanic"><MechanicActiveBooking /></ProtectedRoute>} />
          <Route path="/mechanic/earnings" element={<ProtectedRoute role="mechanic"><MechanicEarnings /></ProtectedRoute>} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/mechanics" element={<ProtectedRoute role="admin"><AdminMechanics /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute role="admin"><AdminBookings /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute role="admin"><AdminPayments /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute role="admin"><AdminComplaints /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
