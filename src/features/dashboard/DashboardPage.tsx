import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { EmployeeDashboard } from './EmployeeDashboard'
import { ManagerDashboard } from './ManagerDashboard'
import { AdminDashboard } from './AdminDashboard'

export const DashboardPage: React.FC = () => {
  const { currentRole } = useAuth()

  switch (currentRole) {
    case 'manager':
      return <ManagerDashboard />
    case 'admin':
      return <AdminDashboard />
    case 'employee':
    default:
      return <EmployeeDashboard />
  }
}
