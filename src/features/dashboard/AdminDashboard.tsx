import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { apiService } from '@/services/apiService'
import type { User, Department, AuditLog, ServiceRequest, LeaveRequest } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { formatDate } from '@/utils/formatters'
import {
  Users,
  UserCheck,
  Clock,
  CalendarCheck,
  TrendingUp,
  ShieldCheck,
  Palette,
  Briefcase,
  ArrowRight,
  Building2,
  FileText,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts'

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [employees, setEmployees] = useState<User[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const emps = await apiService.getEmployees()
      setEmployees(emps)
      const logs = await apiService.getAuditLogs()
      setAuditLogs(logs)
      const reqs = await apiService.getServiceRequests()
      setServiceRequests(reqs)
      const leaves = await apiService.getLeaveRequests()
      setLeaveRequests(leaves)
    }
    fetchData()
  }, [])

  // Sample analytics data
  const attendanceTrendData = [
    { day: 'Mon', present: 94, late: 4, leave: 2 },
    { day: 'Tue', present: 96, late: 3, leave: 1 },
    { day: 'Wed', present: 92, late: 5, leave: 3 },
    { day: 'Thu', present: 95, late: 2, leave: 3 },
    { day: 'Fri', present: 88, late: 6, leave: 6 },
    { day: 'Sat', present: 12, late: 0, leave: 0 },
    { day: 'Sun', present: 8, late: 0, leave: 0 },
  ]

  const departmentData = [
    { name: 'Engineering', count: 42, color: '#8B7BC8' },
    { name: 'Sales', count: 28, color: '#3B82F6' },
    { name: 'Product & Design', count: 16, color: '#10B981' },
    { name: 'Marketing', count: 14, color: '#F59E0B' },
    { name: 'HR & Ops', count: 9, color: '#EC4899' },
    { name: 'Finance', count: 8, color: '#6366F1' },
  ]

  return (
    <div className="space-y-6">
      {/* Admin Greeting & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Executive HR Administration
            </span>
            <span className="text-text-muted">•</span>
            <span className="text-xs text-text-secondary">Org ID: ORG-8842</span>
          </div>
          <h1 className="text-2xl font-bold text-text-main mt-1 tracking-tight">
            Company Operations & Talent Analytics
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Active workforce governance, compliance tracking, and organizational health
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Palette className="w-4 h-4 text-primary" />}
            onClick={() => navigate('/settings/branding')}
          >
            Brand Customization
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Briefcase className="w-4 h-4 text-primary" />}
            onClick={() => navigate('/recruitment')}
          >
            Hiring Pipeline
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<ShieldCheck className="w-4 h-4" />}
            onClick={() => navigate('/settings/audit')}
          >
            Audit Logs
          </Button>
        </div>
      </div>

      {/* Top HR KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value="117"
          subtitle="Across 6 global departments"
          icon={<Users className="w-5 h-5 text-primary" />}
          trend={{ value: '+4.2%', isPositive: true, label: 'growth MoM' }}
        />
        <StatCard
          title="Present Today"
          value="104"
          subtitle="92.8% active attendance"
          icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
          trend={{ value: '98.1%', isPositive: true, label: 'on-time rate' }}
        />
        <StatCard
          title="Pending Leave"
          value={leaveRequests.filter((l) => l.status === 'pending').length}
          subtitle="Requiring manager or HR action"
          icon={<CalendarCheck className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50 dark:bg-amber-950/40 text-amber-600"
        />
        <StatCard
          title="Open Service Queries"
          value={serviceRequests.filter((r) => r.status !== 'resolved' && r.status !== 'closed').length}
          subtitle="IT, HR and Facilities triage"
          icon={<FileText className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50 dark:bg-blue-950/40 text-blue-600"
        />
      </div>

      {/* Charts Grid: Attendance Trends & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trends Area Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <div>
              <h3 className="font-semibold text-text-main text-base">Weekly Attendance Trends (%)</h3>
              <p className="text-xs text-text-secondary">Present vs. late check-in dynamics</p>
            </div>
            <Badge variant="success" size="sm">
              Healthy SLA
            </Badge>
          </div>

          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B7BC8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B7BC8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAE7F1" vertical={false} opacity={0.5} />
                <XAxis dataKey="day" stroke="#77758A" fontSize={11} tickLine={false} />
                <YAxis stroke="#77758A" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card-bg)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="present"
                  stroke="#8B7BC8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#presentGrad)"
                  name="Present %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Distribution Pie / List */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <h3 className="font-semibold text-text-main text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Headcount by Dept
              </h3>
              <span className="text-[11px] text-text-muted">117 Total</span>
            </div>

            <div className="space-y-3 mt-4">
              {departmentData.map((d) => (
                <div key={d.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-main font-medium">{d.name}</span>
                    <span className="font-bold text-text-secondary">{d.count} ({Math.round((d.count / 117) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(d.count / 117) * 100}%`,
                        backgroundColor: d.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="w-full mt-4 text-xs"
            onClick={() => navigate('/directory')}
          >
            Open Organization Chart
          </Button>
        </Card>
      </div>

      {/* Recent Administrative Audit Logs */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold text-text-main text-base">Recent Administrative Audit Logs</h3>
              <p className="text-xs text-text-secondary">Security, policy, and configuration audit trail</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => navigate('/settings/audit')}
          >
            All Logs
          </Button>
        </div>

        <div className="divide-y divide-border/60 mt-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="lavender" size="sm">
                    {log.category}
                  </Badge>
                  <span className="font-semibold text-text-main">{log.action}</span>
                </div>
                <p className="text-text-secondary text-[11px]">{log.details}</p>
              </div>
              <div className="text-left sm:text-right shrink-0 text-[11px] text-text-muted">
                <div>{log.actorName}</div>
                <div>{formatDate(log.timestamp, 'MMM dd, yyyy • HH:mm')}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
