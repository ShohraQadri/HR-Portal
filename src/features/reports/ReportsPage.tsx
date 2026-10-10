import React, { useState } from 'react'
import { useToast } from '@/context/ToastContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Download, BarChart3, TrendingUp, Calendar, Users } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export const ReportsPage: React.FC = () => {
  const { toast } = useToast()
  const [departmentFilter, setDepartmentFilter] = useState('all')

  const monthlyLeaveTrend = [
    { month: 'Jun', annual: 24, sick: 8, casual: 12 },
    { month: 'Jul', annual: 35, sick: 6, casual: 14 },
    { month: 'Aug', annual: 42, sick: 10, casual: 18 },
    { month: 'Sep', annual: 38, sick: 12, casual: 15 },
    { month: 'Oct', annual: 28, sick: 9, casual: 11 },
  ]

  const slaData = [
    { name: 'Within SLA (< 48h)', value: 84, color: '#10B981' },
    { name: 'Moderate (48-72h)', value: 12, color: '#F59E0B' },
    { name: 'Breached (> 72h)', value: 4, color: '#E11D48' },
  ]

  const handleExportReportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Month,Annual Leave,Sick Leave,Casual Leave\n' +
      monthlyLeaveTrend.map((r) => `"${r.month}",${r.annual},${r.sick},${r.casual}`).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `peoplehub-analytics-report-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({ title: 'Report Exported! 📊', description: 'Downloaded CSV file.', type: 'success' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Reports & Analytics</h1>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Workforce intelligence, leave utilization ratios, SLA turnaround, and hiring analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-48">
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Departments' },
                { value: 'eng', label: 'Engineering' },
                { value: 'prod', label: 'Product & Design' },
                { value: 'sales', label: 'Global Sales' },
              ]}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4 text-primary" />}
            onClick={handleExportReportCSV}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Leave Utilization Stacked Bar */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <div>
              <h3 className="font-semibold text-text-main text-base">Leave Utilization by Category</h3>
              <p className="text-xs text-text-secondary">Monthly total days taken across organization</p>
            </div>
            <Badge variant="lavender" size="sm">
              Days Taken
            </Badge>
          </div>

          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyLeaveTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAE7F1" vertical={false} opacity={0.6} />
                <XAxis dataKey="month" stroke="#77758A" fontSize={11} tickLine={false} />
                <YAxis stroke="#77758A" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card-bg)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="annual" fill="#8B7BC8" name="Annual Vacation" radius={[4, 4, 0, 0]} />
                <Bar dataKey="casual" fill="#3B82F6" name="Casual Leave" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sick" fill="#10B981" name="Sick / Medical" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* SLA Compliance Pie Chart */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-border/80">
              <h3 className="font-semibold text-text-main text-base">Ticket SLA Performance</h3>
              <p className="text-xs text-text-secondary">Turnaround adherence on service queries</p>
            </div>

            <div className="h-44 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {slaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2">
              {slaData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-text-secondary">{d.name}</span>
                  </div>
                  <span className="font-bold text-text-main">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-subtle mt-4 text-center text-xs font-semibold text-emerald-600">
            96% Overall Compliance Benchmark
          </div>
        </Card>
      </div>
    </div>
  )
}
