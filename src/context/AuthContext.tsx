import React, { createContext, useContext, useState } from 'react'
import type { User, UserRole } from '@/types'
import { storage } from '@/utils/storage'

export const DEMO_USERS: Record<UserRole, User> = {
  employee: {
    id: 'user-emp-1042',
    name: 'Shohra Qadri',
    email: 'shohra.qadri@acmeglobal.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'employee',
    title: 'Senior Product Designer',
    department: 'Product & Design',
    employeeId: 'EMP-1042',
    managerId: 'user-mgr-1015',
    joiningDate: '2023-03-15',
    location: 'New York, USA (Hybrid)',
    phone: '+1 (555) 234-5678',
    status: 'active',
  },
  manager: {
    id: 'user-mgr-1015',
    name: 'Marcus Vance',
    email: 'marcus.vance@acmeglobal.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'manager',
    title: 'VP of Engineering',
    department: 'Engineering',
    employeeId: 'EMP-1015',
    managerId: 'user-adm-1001',
    joiningDate: '2021-08-01',
    location: 'San Francisco, USA',
    phone: '+1 (555) 876-5432',
    status: 'active',
  },
  admin: {
    id: 'user-adm-1001',
    name: 'Elena Rostova',
    email: 'elena.rostova@acmeglobal.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    title: 'Chief People Officer & Admin',
    department: 'Human Resources',
    employeeId: 'EMP-1001',
    joiningDate: '2020-01-10',
    location: 'Global HQ - New York',
    phone: '+1 (555) 432-1098',
    status: 'active',
  },
}

interface AuthContextType {
  currentUser: User
  currentRole: UserRole
  isAuthenticated: boolean
  setRole: (role: UserRole) => void
  switchUser: (userId: string) => void
  login: (role?: UserRole, email?: string) => void
  logout: () => void
  isRole: (role: UserRole | UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return storage.get<boolean>('auth_is_authenticated', true)
  })

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return storage.get<UserRole>('demo_current_role', 'employee')
  })

  const currentUser = DEMO_USERS[currentRole]

  const setRole = (role: UserRole) => {
    setCurrentRole(role)
    storage.set('demo_current_role', role)
  }

  const switchUser = (userId: string) => {
    const foundRole = (Object.keys(DEMO_USERS) as UserRole[]).find(
      (r) => DEMO_USERS[r].id === userId || DEMO_USERS[r].employeeId === userId
    )
    if (foundRole) {
      setRole(foundRole)
    }
  }

  const login = (role: UserRole = 'employee') => {
    setRole(role)
    setIsAuthenticated(true)
    storage.set('auth_is_authenticated', true)
  }

  const logout = () => {
    setIsAuthenticated(false)
    storage.set('auth_is_authenticated', false)
  }

  const isRole = (role: UserRole | UserRole[]): boolean => {
    if (Array.isArray(role)) {
      return role.includes(currentRole)
    }
    return currentRole === role
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        setRole,
        switchUser,
        login,
        logout,
        isRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
