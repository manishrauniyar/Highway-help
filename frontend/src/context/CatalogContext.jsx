import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../utils/api'
// The mock files are only used as the first paint / offline fallback.
// As soon as the API answers, real data from MongoDB replaces them.
import { services as mockServices } from '../data/mockServices'
import { districts as mockDistricts } from '../data/mockLocations'
import { petrolPumps as mockPumps } from '../data/mockPetrolPumps'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [services, setServices] = useState(mockServices)
  const [districts, setDistricts] = useState(mockDistricts)
  const [petrolPumps, setPetrolPumps] = useState(mockPumps)

  useEffect(() => {
    let cancelled = false
    const load = async (path, setter) => {
      try {
        const { data } = await api.get(path)
        if (!cancelled && Array.isArray(data) && data.length) setter(data)
      } catch {
        /* keep fallback data */
      }
    }
    load('/services', setServices)
    load('/districts', setDistricts)
    load('/petrol-pumps', setPetrolPumps)
    return () => { cancelled = true }
  }, [])

  const getDistrictById = useCallback((id) => districts.find((d) => d.id === id), [districts])

  return (
    <CatalogContext.Provider value={{ services, districts, petrolPumps, getDistrictById }}>
      {children}
    </CatalogContext.Provider>
  )
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
