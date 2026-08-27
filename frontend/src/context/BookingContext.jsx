import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const BookingContext = createContext(null)
const STORAGE_KEY = 'hh_bookings'

export const STATUS_FLOW = [
  'requested',
  'accepted',
  'onway',
  'arrived',
  'started',
  'completed',
]

export const STATUS_LABELS = {
  requested: 'Requested',
  accepted: 'Accepted',
  onway: 'On the Way',
  arrived: 'Arrived',
  started: 'Service Started',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
}

function genId() {
  return 'BK' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

function genOtp() {
  return String(Math.floor(1000 + Math.random() * 9000))
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { setBookings(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  const persist = useCallback((next) => {
    setBookings(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const createBooking = useCallback((payload) => {
    const booking = {
      id: genId(),
      status: 'requested',
      otp: genOtp(),
      createdAt: new Date().toISOString(),
      paymentStatus: 'pending',
      rating: null,
      review: '',
      ...payload,
    }
    persist([booking, ...bookings])
    return booking
  }, [bookings, persist])

  const updateBooking = useCallback((id, updates) => {
    const next = bookings.map((b) => (b.id === id ? { ...b, ...updates } : b))
    persist(next)
  }, [bookings, persist])

  const acceptBooking = useCallback((id) => updateBooking(id, { status: 'accepted', acceptedAt: new Date().toISOString() }), [updateBooking])
  const rejectBooking = useCallback((id) => updateBooking(id, { status: 'rejected' }), [updateBooking])
  const advanceStatus = useCallback((id, status) => updateBooking(id, { status }), [updateBooking])
  const cancelBooking = useCallback((id) => updateBooking(id, { status: 'cancelled' }), [updateBooking])

  const verifyOtp = useCallback((id, enteredOtp) => {
    const booking = bookings.find((b) => b.id === id)
    if (!booking) return { success: false, message: 'Booking not found' }
    if (String(enteredOtp) === String(booking.otp)) {
      updateBooking(id, { status: 'started' })
      return { success: true }
    }
    return { success: false, message: 'Incorrect OTP. Please try again.' }
  }, [bookings, updateBooking])

  // Mechanic marks the job done and sets the final price; payment is settled by the customer next.
  const finalizeService = useCallback((id, finalPrice) => {
    updateBooking(id, {
      status: 'completed',
      finalPrice,
      paymentStatus: 'pending',
      completedAt: new Date().toISOString(),
    })
  }, [updateBooking])

  // Customer settles payment after the service is marked completed.
  const submitPayment = useCallback((id, paymentMethod) => {
    updateBooking(id, {
      paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'due',
      paidAt: new Date().toISOString(),
    })
  }, [updateBooking])

  const submitRating = useCallback((id, rating, review) => {
    updateBooking(id, { rating, review })
  }, [updateBooking])

  const getBookingsForCustomer = useCallback((customerId) => (
    bookings.filter((b) => b.customerId === customerId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  ), [bookings])

  const getBookingsForMechanic = useCallback((mechanicId) => (
    bookings.filter((b) => b.mechanicId === mechanicId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  ), [bookings])

  const value = {
    bookings,
    createBooking,
    updateBooking,
    acceptBooking,
    rejectBooking,
    advanceStatus,
    cancelBooking,
    verifyOtp,
    finalizeService,
    submitPayment,
    submitRating,
    getBookingsForCustomer,
    getBookingsForMechanic,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBookings() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBookings must be used within BookingProvider')
  return ctx
}
