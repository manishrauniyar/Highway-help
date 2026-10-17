import { useEffect } from 'react'
import api from '../utils/api'
import { getSocket } from '../utils/socket'

const SHARING = ['accepted', 'onway', 'arrived']

// Mechanic side: while a job is active, send the phone's GPS to the customer
// (live, through the socket) and save it on the server every ~8 seconds.
export default function useShareLocation(booking) {
  const id = booking?.id
  const active = Boolean(booking) && SHARING.includes(booking.status)

  useEffect(() => {
    if (!active || !navigator.geolocation) return undefined
    let last = 0
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now()
        if (now - last < 8000) return
        last = now
        const { latitude: lat, longitude: lng } = pos.coords
        getSocket().emit('mechanic_location_update', { bookingId: id, lat, lng })
        api.patch('/mechanics/me/location', { lat, lng }).catch(() => {})
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 },
    )
    return () => navigator.geolocation.clearWatch(watch)
  }, [id, active])
}
