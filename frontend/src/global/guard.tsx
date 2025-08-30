import { Navigate, Outlet } from 'react-router'
import { Storer } from './storer'

const Guard = () => {
  const token = Storer.get('token')

  if (!token) return <Navigate to="/identity" replace />

  return <Outlet />
}

export default Guard
