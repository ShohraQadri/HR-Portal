import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useNavigate } from 'react-router-dom'
import { Settings, Palette, Clock, ShieldCheck, Database } from 'lucide-react'

export const GeneralSettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentRole } = useAuth()
  const { settings } = useTheme()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main">Company & Platform Administration</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-0.5">
          Tenant governance, corporate policies, branding parameters, and security overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="p-6 hover:shadow-card transition-all cursor-pointer space-y-3"
          onClick={() => navigate('/settings/branding')}
        >
          <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
            <Palette className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-text-main text-base">Branding & Appearance</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Customize company logos, primary brand themes, dark mode, and navigation layout styles.
          </p>
          <span className="text-xs font-semibold text-primary block pt-2">
            Active Theme: {settings.themePreset} →
          </span>
        </Card>

        <Card
          className="p-6 hover:shadow-card transition-all cursor-pointer space-y-3"
          onClick={() => navigate('/settings/attendance')}
        >
          <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-text-main text-base">Attendance Policies</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Configure default working shift durations, 15-min grace periods, and regularization workflows.
          </p>
          <span className="text-xs font-semibold text-primary block pt-2">
            Timezone: {settings.timezone} →
          </span>
        </Card>

        <Card
          className="p-6 hover:shadow-card transition-all cursor-pointer space-y-3"
          onClick={() => navigate('/settings/audit')}
        >
          <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-text-main text-base">Roles & Audit Logs</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Review security trails, role assignments (Employee, Manager, Admin), and event logs.
          </p>
          <span className="text-xs font-semibold text-primary block pt-2">
            Security logs active →
          </span>
        </Card>

        <Card className="p-6 space-y-3 bg-surface-subtle/30">
          <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-text-main text-base">Multi-Tenant Architecture Status</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Organization ID: <span className="font-bold text-text-main">{settings.organizationId}</span>. All demo preferences are persisted in tenant storage abstraction.
          </p>
          <Badge variant="success" size="sm">
            Prototype Engine Online
          </Badge>
        </Card>
      </div>
    </div>
  )
}
