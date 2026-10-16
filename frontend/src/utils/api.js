import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Socket.IO lives on the same server as the API (without the /api suffix).
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api\/?$/, '')

export const TOKEN_KEY = 'hh_token'
export const USER_KEY = 'hh_auth_user'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If the token expired / is invalid, clear the session and send the user to login.
// Login/register calls (/auth/...) are excluded so "Invalid credentials" is shown normally.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || ''
    if (err.response?.status === 401 && !url.includes('/auth/')) {
      let role = 'customer'
      try { role = JSON.parse(localStorage.getItem(USER_KEY))?.role || 'customer' } catch { /* ignore */ }
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      const loginPath = role === 'mechanic' ? '/mechanic/login' : role === 'admin' ? '/admin/login' : '/login'
      if (!window.location.pathname.includes('login')) {
        window.location.assign(loginPath)
      }
    }
    return Promise.reject(err)
  },
)

// Turns any axios error into a readable message for the UI.
export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (err?.response?.data?.message) return err.response.data.message
  if (err?.response?.data?.error) return err.response.data.error
  if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error') {
    return 'Cannot reach the server. Please check your connection or try again later.'
  }
  return err?.message || fallback
}

export default api
