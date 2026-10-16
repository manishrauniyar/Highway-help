import { useCallback, useEffect, useState } from 'react'
import api, { getErrorMessage } from '../utils/api'

// Small helper: GET a path on mount and expose { data, loading, error, reload, setData }.
export default function useApiData(path, initial = []) {
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(path)
      setData(res.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [path])

  useEffect(() => { reload() }, [reload])

  return { data, loading, error, reload, setData }
}
