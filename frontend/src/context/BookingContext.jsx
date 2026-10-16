import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import api, { getErrorMessage } from '../utils/api'
import { getSocket } from '../utils/socket'
import { useAuth } from './AuthContext'

const BookingContext = createContext(null)

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

const FINISHED = ['completed', 'cancelled', 'rejected']
const POLL_MS = 20000 // safety net in case websockets are blocked

function listPathForRole(role) {
  if (role === 'customer') return '/bookings/customer'
  if (role === 'mechanic') return '/bookings/mechanic'
  if (role === 'admin') return '/admin/bookings'
  return null
}

export function BookingProvider({ children }) {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  const role = user?.role
  const userId = user?.id

  const refresh = useCallback(async () => {
    const path = listPathForRole(role)
    if (!path) return
    try {
      const { data } = await api.get(path)
      setBookings(data)
    } catch {
      /* keep last known bookings; the 401 interceptor handles expired tokens */
    }
  }, [role])

  // Load on login, clear on logout.
  useEffect(() => {
    if (!userId) {
      setBookings([])
      return
    }
    setLoading(true)
    refresh().finally(() => setLoading(false))
  }, [userId, refresh])

  // Insert or replace one booking in local state using the server's copy.
  const upsert = useCallback((booking) => {
    setBookings((prev) => {
      const exists = prev.some((b) => b.id === booking.id)
      return exists ? prev.map((b) => (b.id === booking.id ? booking : b)) : [booking, ...prev]
    })
  }, [])

  // Runs an API call, stores the returned booking, and throws a readable error.
  const run = useCallback(async (fn) => {
    try {
      const { data } = await fn()
      upsert(data)
      return data
    } catch (err) {
      throw new Error(getErrorMessage(err))
    }
  }, [upsert])

  // ---------- Real-time + polling ----------
  const refreshRef = useRef(refresh)
  refreshRef.current = refresh
  const activeIdsKey = bookings.filter((b) => !FINISHED.includes(b.status)).map((b) => b.id).join(',')

  useEffect(() => {
    if (!userId || role === 'admin') return undefined
    const socket = getSocket()

    const joinRooms = () => {
      if (role === 'mechanic') socket.emit('join_mechanic', userId)
      activeIdsKey.split(',').filter(Boolean).forEach((id) => socket.emit('join_booking', id))
    }
    const onAnyUpdate = () => refreshRef.current()

    joinRooms()
    socket.on('connect', joinRooms)
    socket.on('new_request', onAnyUpdate)
    socket.on('booking_created', onAnyUpdate)
    socket.on('status_changed', onAnyUpdate)
    socket.on('payment_settled', onAnyUpdate)

    return () => {
      socket.off('connect', joinRooms)
      socket.off('new_request', onAnyUpdate)
      socket.off('booking_created', onAnyUpdate)
      socket.off('status_changed', onAnyUpdate)
      socket.off('payment_settled', onAnyUpdate)
    }
  }, [userId, role, activeIdsKey])

  useEffect(() => {
    if (!userId) return undefined
    const t = setInterval(() => refreshRef.current(), POLL_MS)
    return () => clearInterval(t)
  }, [userId])

  // ---------- Customer actions ----------
  // payload: { mechanicId, serviceType, customerLocation: {lat,lng}, locationLabel }
  const createBooking = useCallback((payload) => run(() => api.post('/bookings', payload)), [run])
  const cancelBooking = useCallback((id) => run(() => api.patch(`/bookings/${id}/cancel`)), [run])
  const submitPayment = useCallback((id, paymentMethod) => run(() => api.post(`/bookings/${id}/payment`, { paymentMethod })), [run])
  const submitRating = useCallback((id, rating, review) => run(() => api.post(`/bookings/${id}/rating`, { rating, review })), [run])

  // ---------- Mechanic actions ----------
  const acceptBooking = useCallback((id) => run(() => api.patch(`/bookings/${id}/accept`)), [run])
  const rejectBooking = useCallback((id) => run(() => api.patch(`/bookings/${id}/reject`)), [run])
  // status must be 'onway' or 'arrived'
  const advanceStatus = useCallback((id, status) => run(() => api.patch(`/bookings/${id}/status`, { status })), [run])
  const finalizeService = useCallback((id, finalPrice) => run(() => api.patch(`/bookings/${id}/complete`, { finalPrice })), [run])

  // Resolves to { success, message } like the old mock version.
  const verifyOtp = useCallback(async (id, otp) => {
    try {
      await run(() => api.post(`/bookings/${id}/verify-otp`, { otp }))
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }, [run])

  // The list endpoints are already scoped to the logged-in person, so the id
  // argument is kept only so existing pages do not need to change.
  const sorted = useCallback(
    () => [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [bookings],
  )
  const getBookingsForCustomer = useCallback(() => sorted(), [sorted])
  const getBookingsForMechanic = useCallback(() => sorted(), [sorted])

  const value = {
    bookings,
    loading,
    refresh,
    createBooking,
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
