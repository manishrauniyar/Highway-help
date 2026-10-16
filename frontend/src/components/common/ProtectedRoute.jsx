import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth()

  if (!user || (role && user.role !== role)) {
    const redirect = role === 'mechanic' ? '/mechanic/login' : role === 'admin' ? '/admin/login' : '/login'
    return <Navigate to={redirect} replace />
  }

  return children
}
