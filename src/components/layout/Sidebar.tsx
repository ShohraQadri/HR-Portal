import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import {
  LayoutDashboard,
  User,
  Users,
  Clock,
  CalendarCheck,
  FileText,
  CheckSquare,
  Award,
  TrendingUp,
  GraduationCap,
  Megaphone,
  BookOpen,
  Briefcase,
  BarChart3,
  Palette,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface SidebarProps {
  isOpen: boolean
  onCloseMobile: () => void
}

interface NavItem {
  name: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  roles: ('employee' | 'manager' | 'admin')[]
}

interface NavSection {
  title: string
  items: NavItem[]
  roles: ('employee' | 'manager' | 'admin')[]
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { currentRole } = useAuth()
  const { settings } = useTheme()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navSections: NavSection[] = [
    {
      title: 'WORKSPACE',
      roles: ['employee', 'manager', 'admin'],
      items: [
        { name: 'Dashboard', to: '/', icon: LayoutDashboard, roles: ['employee', 'manager', 'admin'] },
        { name: 'My Profile', to: '/profile', icon: User, roles: ['employee', 'manager', 'admin'] },
        { name: 'Employee Directory', to: '/directory', icon: Users, roles: ['employee', 'manager', 'admin'] },
        { name: 'Attendance', to: '/attendance', icon: Clock, roles: ['employee', 'manager', 'admin'] },
        { name: 'Leave Management', to: '/leave', icon: CalendarCheck, roles: ['employee', 'manager', 'admin'] },
        { name: 'My Requests', to: '/requests', icon: FileText, roles: ['employee', 'manager', 'admin'] },
        { name: 'Approvals', to: '/approvals', icon: CheckSquare, badge: currentRole === 'manager' ? '2' : '4', roles: ['manager', 'admin'] },
      ],
    },
    {
      title: 'PEOPLE & CULTURE',
      roles: ['employee', 'manager', 'admin'],
      items: [
        { name: 'Rewards & Recognition', to: '/recognition', icon: Award, roles: ['employee', 'manager', 'admin'] },
        { name: 'Performance', to: '/performance', icon: TrendingUp, roles: ['employee', 'manager', 'admin'] },
        { name: 'Learning & Dev', to: '/learning', icon: GraduationCap, roles: ['employee', 'manager', 'admin'] },
        { name: 'Announcements', to: '/announcements', icon: Megaphone, roles: ['employee', 'manager', 'admin'] },
        { name: 'Company Policies', to: '/policies', icon: BookOpen, roles: ['employee', 'manager', 'admin'] },
      ],
    },
    {
      title: 'MANAGEMENT',
      roles: ['manager', 'admin'],
      items: [
        { name: 'Team Overview', to: '/teams', icon: Users, roles: ['manager', 'admin'] },
        { name: 'Recruitment', to: '/recruitment', icon: Briefcase, roles: ['admin'] },
        { name: 'Reports & Analytics', to: '/reports', icon: BarChart3, roles: ['manager', 'admin'] },
      ],
    },
    {
      title: 'ADMINISTRATION',
      roles: ['admin'],
      items: [
        { name: 'Branding & Appearance', to: '/settings/branding', icon: Palette, roles: ['admin'] },
        { name: 'Attendance Policies', to: '/settings/attendance', icon: Clock, roles: ['admin'] },
        { name: 'Roles & Audit Logs', to: '/settings/audit', icon: ShieldCheck, roles: ['admin'] },
        { name: 'General Settings', to: '/settings', icon: Settings, roles: ['admin'] },
      ],
    },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-in-out md:static',
          'bg-surface-sidebar border-r border-surface-sidebar-border',
          isCollapsed ? 'w-20' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-surface-sidebar-border">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-text-main truncate leading-tight tracking-tight">
                  {settings.companyName || 'PeopleHub'}
                </h1>
                <p className="text-[10px] text-text-muted truncate">Enterprise HRMS</p>
              </div>
            )}
          </div>

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-md hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors cursor-pointer"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections
            .filter((section) => section.roles.includes(currentRole))
            .map((section) => {
              const visibleItems = section.items.filter((item) => item.roles.includes(currentRole))
              if (visibleItems.length === 0) return null

              return (
                <div key={section.title} className="space-y-1">
                  {!isCollapsed && (
                    <h3 className="px-3 text-[10px] font-semibold tracking-wider text-text-muted uppercase">
                      {section.title}
                    </h3>
                  )}
                  <div className="space-y-0.5 pt-1">
                    {visibleItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          end={item.to === '/'}
                          onClick={onCloseMobile}
                          title={isCollapsed ? item.name : undefined}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-all group relative',
                              isActive
                                ? 'bg-primary text-white shadow-xs font-semibold'
                                : 'text-text-secondary hover:text-text-main hover:bg-surface-hover',
                              isCollapsed && 'justify-center px-2'
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <Icon
                                className={cn(
                                  'w-4 h-4 shrink-0 transition-colors',
                                  isActive ? 'text-white' : 'text-text-secondary group-hover:text-primary'
                                )}
                              />
                              {!isCollapsed && <span className="truncate">{item.name}</span>}
                              {!isCollapsed && item.badge && (
                                <span
                                  className={cn(
                                    'ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                                    isActive
                                      ? 'bg-white text-primary'
                                      : 'bg-primary/10 text-primary'
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </NavLink>
                      )
                    })}
                  </div>
                </div>
              )
            })}
        </div>

        {/* Role Footnote */}
        {!isCollapsed && (
          <div className="p-3 border-t border-surface-sidebar-border bg-surface-subtle/40 m-2 rounded-xl">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-text-muted">Viewing as:</span>
              <span className="font-semibold text-primary capitalize px-2 py-0.5 bg-primary/10 rounded-full">
                {currentRole}
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
