import React, { useState, useEffect } from 'react'
import { apiService } from '@/services/apiService'
import type { AuditLog } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { formatDate } from '@/utils/formatters'
import { ShieldCheck, Search, Filter } from 'lucide-react'

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await apiService.getAuditLogs()
      setLogs(data)
    }
    fetchLogs()
  }, [])

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = categoryFilter === 'all' || l.category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main">Security & Administrative Audit Logs</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-0.5">
          Immutable event stream capturing administrative policy modifications and authorization records
        </p>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            leftIcon={<Search className="w-4 h-4" />}
            placeholder="Search action or administrator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Event Categories' },
              { value: 'Branding', label: 'Branding & Themes' },
              { value: 'Leave', label: 'Leave Approvals' },
              { value: 'Attendance', label: 'Attendance Policies' },
              { value: 'Permissions', label: 'Roles & Permissions' },
            ]}
          />
        </div>
      </Card>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border/80 text-text-muted text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Event Category</th>
                <th className="py-3 px-3">Action Performed</th>
                <th className="py-3 px-3">Administrator</th>
                <th className="py-3 px-3">Details</th>
                <th className="py-3 px-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="py-3 px-3 font-medium text-text-main whitespace-nowrap">
                    {formatDate(log.timestamp, 'MMM dd, yyyy • HH:mm:ss')}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="lavender" size="sm">
                      {log.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-semibold text-text-main">{log.action}</td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-text-main block">{log.actorName}</span>
                    <span className="text-[10px] text-text-muted block">{log.actorEmail}</span>
                  </td>
                  <td className="py-3 px-3 text-text-secondary max-w-sm truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-3 px-3 text-text-muted font-mono text-[11px]">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
