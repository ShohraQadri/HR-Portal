import React, { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Clock, ShieldCheck, Save } from 'lucide-react'

export const AttendancePoliciesPage: React.FC = () => {
  const { settings, updateSettings } = useTheme()
  const { toast } = useToast()

  const [workingHours, setWorkingHours] = useState(settings.workingHours)
  const [timezone, setTimezone] = useState(settings.timezone)

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      workingHours,
      timezone,
    })
    toast({
      title: 'Attendance policies updated! ⏰',
      description: 'Changes apply to subsequent shift calculations.',
      type: 'success',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main">Attendance & Shift Policies</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-0.5">
          Configure official working hours, grace periods, biometric integration rules, and regularizations
        </p>
      </div>

      <Card className="p-6 max-w-3xl">
        <form onSubmit={handleSavePolicy} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Standard Shift Start Time"
              type="time"
              value={workingHours.startTime}
              onChange={(e) => setWorkingHours({ ...workingHours, startTime: e.target.value })}
              required
            />

            <Input
              label="Standard Shift End Time"
              type="time"
              value={workingHours.endTime}
              onChange={(e) => setWorkingHours({ ...workingHours, endTime: e.target.value })}
              required
            />

            <Input
              label="Grace Period (Minutes)"
              type="number"
              min="0"
              max="60"
              value={workingHours.gracePeriodMinutes.toString()}
              onChange={(e) =>
                setWorkingHours({ ...workingHours, gracePeriodMinutes: Number(e.target.value) })
              }
              helperText="Minutes past shift start before marked as 'Late'"
              required
            />

            <Input
              label="Standard Break Duration (Minutes)"
              type="number"
              min="15"
              max="120"
              value={workingHours.breakMinutes.toString()}
              onChange={(e) => setWorkingHours({ ...workingHours, breakMinutes: Number(e.target.value) })}
              helperText="Default lunch and rest duration"
              required
            />
          </div>

          <div className="pt-2">
            <Select
              label="Corporate Operating Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              options={[
                { value: 'America/New_York (UTC-5)', label: 'America/New_York (UTC-5 - Eastern Time)' },
                { value: 'America/Los_Angeles (UTC-8)', label: 'America/Los_Angeles (UTC-8 - Pacific Time)' },
                { value: 'Europe/London (UTC+0)', label: 'Europe/London (UTC+0 - GMT)' },
                { value: 'Asia/Kolkata (UTC+5:30)', label: 'Asia/Kolkata (UTC+5:30 - IST)' },
                { value: 'Asia/Singapore (UTC+8)', label: 'Asia/Singapore (UTC+8 - SGT)' },
              ]}
            />
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-border">
            <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
              Save Attendance Policies
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
