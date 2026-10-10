import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { Avatar } from '@/components/ui/Avatar'
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Palette,
  Shield,
  HelpCircle,
  ExternalLink,
  Check,
  LogOut,
} from 'lucide-react'
import type { UserRole } from '@/types'

interface HeaderProps {
  onOpenMobileSidebar: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const navigate = useNavigate()
  const { currentUser, currentRole, setRole, logout } = useAuth()
  const { settings, toggleDarkMode } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/directory?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const roleOptions: { role: UserRole; label: string; desc: string }[] = [
    { role: 'employee', label: 'Employee', desc: 'Shohra Qadri (Designer)' },
    { role: 'manager', label: 'Manager', desc: 'Marcus Vance (VP Eng)' },
    { role: 'admin', label: 'HR Admin', desc: 'Elena Rostova (CPO)' },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface/90 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 rounded-lg text-text-secondary hover:bg-surface-hover md:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search colleagues, policies, requests..."
            className="w-full rounded-xl border border-border bg-surface-muted py-1.5 pl-9 pr-4 text-xs md:text-sm text-text-main placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher Pill Bar */}
        <div className="hidden lg:flex items-center bg-surface-subtle p-1 rounded-xl border border-border/80">
          <span className="text-[11px] font-medium text-text-muted px-2 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-primary" /> Role:
          </span>
          {roleOptions.map((opt) => (
            <button
              key={opt.role}
              onClick={() => setRole(opt.role)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                currentRole === opt.role
                  ? 'bg-primary text-white shadow-xs font-semibold'
                  : 'text-text-secondary hover:text-text-main hover:bg-surface-hover'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Branding & Theme Shortcut */}
        <button
          onClick={() => navigate('/settings/branding')}
          className="p-2 rounded-xl text-text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
          title="Company Branding & Appearance Settings"
          aria-label="Branding settings"
        >
          <Palette className="w-5 h-5" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-text-secondary hover:text-text-main hover:bg-surface-hover transition-colors cursor-pointer"
          title="Toggle light/dark mode"
          aria-label="Toggle dark mode"
        >
          {settings.isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-text-secondary hover:text-text-main hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-surface p-4 shadow-dropdown animate-fade-in z-50">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h4 className="text-sm font-semibold text-text-main">Notifications</h4>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-border/60 max-h-64 overflow-y-auto pt-1">
                <div className="py-2.5 text-xs space-y-0.5">
                  <p className="font-medium text-text-main">Annual Leave Approved</p>
                  <p className="text-text-secondary text-[11px]">Marcus Vance approved your request for Oct 24-26.</p>
                  <span className="text-[10px] text-text-muted">2 hours ago</span>
                </div>
                <div className="py-2.5 text-xs space-y-0.5">
                  <p className="font-medium text-text-main">New Recognition Received! 🎉</p>
                  <p className="text-text-secondary text-[11px]">You received "Innovation Champion" badge (+250 pts).</p>
                  <span className="text-[10px] text-text-muted">Yesterday</span>
                </div>
                <div className="py-2.5 text-xs space-y-0.5">
                  <p className="font-medium text-text-main">Policy Update: Q4 Wellness Stipend</p>
                  <p className="text-text-secondary text-[11px]">Wellness allowance increased to $500 starting Nov 1.</p>
                  <span className="text-[10px] text-text-muted">2 days ago</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowNotifications(false)
                  navigate('/announcements')
                }}
                className="w-full mt-2 text-center text-xs font-semibold text-primary hover:underline pt-2 border-t border-border cursor-pointer"
              >
                View all announcements
              </button>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-border/80 hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-text-main leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-text-muted leading-tight capitalize">{currentRole}</p>
            </div>
            <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" status="active" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-surface p-3 shadow-dropdown animate-fade-in z-50">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <Avatar src={currentUser.avatar} name={currentUser.name} size="md" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-text-main truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-text-muted truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] bg-primary/10 text-primary px-2 py-0.2 rounded-full font-bold capitalize">
                    {currentRole} Role
                  </span>
                </div>
              </div>

              {/* Mobile Role Switcher */}
              <div className="py-2 border-b border-border lg:hidden">
                <p className="text-[10px] font-semibold text-text-muted uppercase px-2 mb-1">Switch Demo Role</p>
                {roleOptions.map((opt) => (
                  <button
                    key={opt.role}
                    onClick={() => {
                      setRole(opt.role)
                      setShowUserMenu(false)
                    }}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-text-main hover:bg-surface-hover rounded-lg transition-colors cursor-pointer"
                  >
                    <span>{opt.label}</span>
                    {currentRole === opt.role && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                ))}
              </div>

              <div className="py-1 space-y-0.5">
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    navigate('/profile')
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-text-main hover:bg-surface-hover rounded-lg transition-colors cursor-pointer"
                >
                  My Profile & Documents
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    navigate('/settings/branding')
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-text-main hover:bg-surface-hover rounded-lg transition-colors cursor-pointer"
                >
                  Branding & Company Settings
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    logout()
                    navigate('/login')
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer flex items-center gap-2 font-semibold pt-2 border-t border-border/60"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out / Logout
                </button>
              </div>

              <div className="pt-2 border-t border-border mt-1 text-[11px] text-text-muted px-2">
                PeopleHub v1.0.0 (Logged in as {currentUser.name})
              </div>
            </div>
          )}
        </div>

        {/* Quick Sign Out Icon Button */}
        <button
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="p-2 rounded-xl text-text-secondary hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          title="Log Out of PeopleHub"
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
