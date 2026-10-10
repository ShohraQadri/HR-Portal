import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, DEMO_USERS } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import type { UserRole } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import {
  Sparkles,
  Lock,
  Mail,
  Building2,
  LogIn,
  Shield,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { settings } = useTheme()
  const { toast } = useToast()

  const [selectedRole, setSelectedRole] = useState<UserRole>('employee')
  const [email, setEmail] = useState('shohra.qadri@acmeglobal.io')
  const [password, setPassword] = useState('••••••••••••')
  const [orgId, setOrgId] = useState(settings.organizationId || 'ORG-8842')
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role)
    setEmail(DEMO_USERS[role].email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      login(selectedRole, email)
      setIsLoading(false)
      toast({
        title: `Welcome, ${DEMO_USERS[selectedRole].name}! 👋`,
        description: `Successfully signed in as ${selectedRole}.`,
        type: 'success',
      })
      navigate('/')
    }, 400)
  }

  return (
    <div className="min-h-screen bg-surface-page flex flex-col justify-center items-center p-4 sm:p-6 transition-colors">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shadow-card mb-2">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-9 h-9 rounded-xl object-cover" />
            ) : (
              <Sparkles className="w-7 h-7" />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-main">
            {settings.companyName || 'PeopleHub'}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Enterprise HRMS & Employee Workplace Experience Platform
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 sm:p-8 space-y-6 shadow-modal border-border">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text-main">Sign In to Your Workspace</h2>
            <p className="text-xs text-text-secondary">
              Enter your credentials or choose a 1-click demo persona
            </p>
          </div>

          {/* Quick Demo Persona Switcher */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
              1-Click Demo Personas
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(DEMO_USERS) as UserRole[]).map((r) => {
                const user = DEMO_USERS[r]
                const isSelected = selectedRole === r
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSelectRole(r)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center text-center ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-surface-subtle font-bold shadow-xs'
                        : 'border-border/80 hover:border-text-secondary/30 bg-surface hover:bg-surface-hover'
                    }`}
                  >
                    <Avatar src={user.avatar} name={user.name} size="sm" className="mb-1.5" />
                    <span className="text-xs font-semibold text-text-main leading-tight truncate w-full">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-primary capitalize font-medium">
                      {r}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Organization ID"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              leftIcon={<Building2 className="w-4 h-4" />}
              required
            />

            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                />
                Remember this device
              </label>
              <button
                type="button"
                onClick={() =>
                  toast({
                    title: 'Password Reset',
                    description: 'Instructions sent to your corporate email address.',
                    type: 'info',
                  })
                }
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full font-bold h-11 text-sm shadow-sm"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In as {selectedRole.toUpperCase()}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 border-t border-border/60 text-center">
            <p className="text-[11px] text-text-muted flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5 text-primary" /> Protected by Enterprise SSO & MFA simulation
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
