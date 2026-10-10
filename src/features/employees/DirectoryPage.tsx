import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiService } from '@/services/apiService'
import type { User } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/utils/formatters'
import {
  Users,
  Search,
  LayoutGrid,
  List,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  ChevronRight,
} from 'lucide-react'

export const DirectoryPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [employees, setEmployees] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  useEffect(() => {
    const fetchEmps = async () => {
      const data = await apiService.getEmployees()
      setEmployees(data)
    }
    fetchEmps()
  }, [])

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchDept = departmentFilter === 'all' || e.department === departmentFilter
      const matchStatus = statusFilter === 'all' || e.status === statusFilter
      return matchSearch && matchDept && matchStatus
    })
  }, [employees, searchTerm, departmentFilter, statusFilter])

  const departments = ['Engineering', 'Product & Design', 'Marketing & Comms', 'Global Sales', 'Human Resources', 'Finance & Legal']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Employee Directory</h1>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Discover team members, reporting lines, contact information, and skill profiles
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-surface-subtle p-1 rounded-xl border border-border/80">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-main'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-main'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            leftIcon={<Search className="w-4 h-4" />}
            placeholder="Search by name, role, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Departments' },
              ...departments.map((d) => ({ value: d, label: d })),
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Employment Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'on_leave', label: 'On Leave' },
              { value: 'probation', label: 'Probation' },
            ]}
          />
        </div>
      </Card>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => (
            <Card
              key={emp.id}
              className="p-5 flex flex-col justify-between hover:shadow-dropdown transition-all cursor-pointer group hover:border-primary/40"
              onClick={() => navigate(`/profile?id=${emp.id}`)}
            >
              <div>
                <div className="flex items-start justify-between">
                  <Avatar src={emp.avatar} name={emp.name} size="lg" status={emp.status} />
                  <Badge variant={emp.status === 'active' ? 'success' : emp.status === 'on_leave' ? 'warning' : 'default'} size="sm">
                    {emp.status}
                  </Badge>
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-text-main text-base group-hover:text-primary transition-colors">
                    {emp.name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5 font-medium">{emp.title}</p>
                  <p className="text-[11px] text-primary mt-1 font-semibold">{emp.department}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 space-y-2 text-xs text-text-secondary">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span className="truncate">{emp.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span>ID: {emp.employeeId}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-primary font-semibold">
                <span>View Full Profile</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border/80 text-text-muted text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Employee</th>
                  <th className="py-3 px-3">Role & Title</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Email & Contact</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => navigate(`/profile?id=${emp.id}`)}
                    className="hover:bg-surface-hover/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={emp.avatar} name={emp.name} size="sm" status={emp.status} />
                        <div>
                          <p className="font-semibold text-text-main">{emp.name}</p>
                          <span className="text-[10px] text-text-muted">{emp.employeeId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-text-secondary">{emp.title}</td>
                    <td className="py-3 px-3 text-primary font-medium">{emp.department}</td>
                    <td className="py-3 px-3 text-text-secondary">{emp.email}</td>
                    <td className="py-3 px-3 text-text-secondary">{emp.location}</td>
                    <td className="py-3 px-3">
                      <Badge variant={emp.status === 'active' ? 'success' : 'warning'} size="sm">
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right text-primary font-semibold">
                      View Profile →
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
