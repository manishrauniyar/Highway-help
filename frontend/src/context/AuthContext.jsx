import React, { createContext, useContext, useState, useCallback } from 'react'
import api, { TOKEN_KEY, USER_KEY } from '../utils/api'
import { closeSocket } from '../utils/socket'

const AuthContext = createContext(null)

// Read the saved session synchronously so a page refresh on a protected
// route does not bounce the user to the login page.
function readSavedUser() {
  try {
    const saved = localStorage.getItem(USER_KEY)
    const token = localStorage.getItem(TOKEN_KEY)
    return saved && token ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSavedUser)

  // Store the session after any successful login / register.
  const saveSession = useCallback((token, userData, role) => {
    const full = { ...userData, role }
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(full))
    setUser(full)
    return full
  }, [])

  const customerRegister = useCallback(async (form) => {
    const { data } = await api.post('/auth/customer/register', form)
    return saveSession(data.token, data.user, 'customer')
  }, [saveSession])

  const customerLogin = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/customer/login', { email, password })
    return saveSession(data.token, data.user, 'customer')
  }, [saveSession])

  const mechanicRegister = useCallback(async (form) => {
    const { data } = await api.post('/auth/mechanic/register', form)
    return saveSession(data.token, data.mechanic, 'mechanic')
  }, [saveSession])

  const mechanicLogin = useCallback(async (phone, password) => {
    const { data } = await api.post('/auth/mechanic/login', { phone, password })
    return saveSession(data.token, data.mechanic, 'mechanic')
  }, [saveSession])

  const adminLogin = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/admin/login', { email, password })
    return saveSession(data.token, data.admin, 'admin')
  }, [saveSession])

  // Merge fresh fields (e.g. verified, available) into the saved user.
  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      localStorage.setItem(USER_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    closeSocket()
    setUser(null)
  }, [])

  const value = {
    user,
    initialized: true,
    customerRegister,
    customerLogin,
    mechanicRegister,
    mechanicLogin,
    adminLogin,
    updateUser,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
