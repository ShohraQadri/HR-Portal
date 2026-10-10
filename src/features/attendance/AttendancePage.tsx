import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { apiService } from '@/services/apiService'
import type { AttendanceRecord } from '@/types'
import { AttendanceCalendarWidget } from './AttendanceCalendarWidget'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { formatDate, formatTime, formatHours, getStatusBadgeVariant } from '@/utils/formatters'
import {
  Clock,
  LogIn,
  LogOut,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Calendar,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export const AttendancePage: React.FC = () => {
  const { currentUser, isRole } = useAuth()
  const { toast } = useToast()

  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null)
  const [isLoadingAction, setIsLoadingAction] = useState(false)

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Correction Request Modal
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false)
  const [correctionDate, setCorrectionDate] = useState('2026-10-09')
  const [correctionCheckIn, setCorrectionCheckIn] = useState('09:00')
  const [correctionCheckOut, setCorrectionCheckOut] = useState('18:00')
  const [correctionReason, setCorrectionReason] = useState('')

  const loadAttendance = async () => {
    try {
      const all = await apiService.getAttendanceRecords(
        isRole(['manager', 'admin']) ? undefined : currentUser.employeeId
      )
      setRecords(all)
      const today = await apiService.getTodayAttendance(currentUser.employeeId)
      setTodayRecord(today)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadAttendance()
  }, [currentUser])

  const isCheckedIn = !!todayRecord && !todayRecord.checkOut
  const isCheckedOut = !!todayRecord && !!todayRecord.checkOut

  const handleCheckIn = async () => {
    setIsLoadingAction(true)
    try {
      const record = await apiService.checkIn(currentUser)
      setTodayRecord(record)
      toast({
        title: 'Checked in successfully! 👋',
        description: `Logged in at ${formatTime(record.checkIn)}.`,
        type: 'success',
      })
      loadAttendance()
    } catch (err: any) {
      toast({ title: 'Check-in error', description: err.message, type: 'error' })
    } finally {
      setIsLoadingAction(false)
    }
  }

  const handleCheckOut = async () => {
    setIsLoadingAction(true)
    try {
      const record = await apiService.checkOut(currentUser)
      setTodayRecord(record)
      toast({
        title: 'Checked out successfully! 🎉',
        description: `Session closed at ${formatTime(record.checkOut)}.`,
        type: 'success',
      })
      loadAttendance()
    } catch (err: any) {
      toast({ title: 'Check-out error', description: err.message, type: 'error' })
    } finally {
      setIsLoadingAction(false)
    }
  }

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!correctionReason.trim()) {
      toast({ title: 'Missing details', description: 'Please provide a valid reason for correction.', type: 'warning' })
      return
    }

    // Submit as service request / attendance correction
    try {
      await apiService.createServiceRequest({
        title: `Attendance Regularization for ${correctionDate}`,
        category: 'HR',
        priority: 'medium',
        status: 'under_review',
        description: `Request to regularize attendance for ${correctionDate}. Claimed Check-in: ${correctionCheckIn}, Check-out: ${correctionCheckOut}. Reason: ${correctionReason}`,
        submittedBy: {
          id: currentUser.employeeId,
          name: currentUser.name,
          avatar: currentUser.avatar,
          department: currentUser.department,
          email: currentUser.email,
        },
      })

      toast({
        title: 'Correction request submitted! 📝',
        description: 'Sent to manager and HR for review.',
        type: 'success',
      })
      setIsCorrectionModalOpen(false)
      setCorrectionReason('')
    } catch (err: any) {
      toast({ title: 'Failed to submit', description: err.message, type: 'error' })
    }
  }

  const handleExportCSV = () => {
    const headers = ['Employee ID,Employee Name,Date,Check In,Check Out,Hours,Status,Location']
    const rows = filteredRecords.map((r) =>
      `"${r.employeeId}","${r.employeeName}","${r.date}","${r.checkIn || ''}","${r.checkOut || ''}","${r.totalWorkedHours || 0}","${r.status}","${r.location}"`
    )
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `peoplehub-attendance-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({ title: 'Export complete', description: 'Downloaded attendance CSV file.', type: 'success' })
  }

  // Filter and search logic
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.date.includes(searchTerm)
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [records, searchTerm, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Attendance Management</h1>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Real-time biometric shift tracking, check-in timestamps, and regularization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<FileQuestion className="w-4 h-4 text-primary" />}
            onClick={() => setIsCorrectionModalOpen(true)}
          >
            Request Regularization
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Download className="w-4 h-4 text-primary" />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Interactive Monthly Attendance Calendar & Biometric Punch Desk */}
      <AttendanceCalendarWidget />

      {/* Attendance History Filter & Table */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div>
            <h3 className="font-semibold text-text-main text-base">Attendance Log & History</h3>
            <p className="text-xs text-text-secondary">Historical daily shift attendance records</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-56">
              <Input
                leftIcon={<Search className="w-4 h-4" />}
                placeholder="Search date or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-36">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'present', label: 'Present' },
                  { value: 'late', label: 'Late Arrival' },
                  { value: 'on_leave', label: 'On Leave' },
                  { value: 'absent', label: 'Absent' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border/80 text-text-muted text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Check In</th>
                <th className="py-3 px-3">Check Out</th>
                <th className="py-3 px-3">Hours Worked</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-muted">
                    No attendance records match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => {
                  const badge = getStatusBadgeVariant(r.status)
                  return (
                    <tr key={r.id} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-text-main">{formatDate(r.date)}</td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-text-main">{r.employeeName}</div>
                        <div className="text-[10px] text-text-muted">{r.employeeId}</div>
                      </td>
                      <td className="py-3 px-3">{r.checkIn ? formatTime(r.checkIn) : '--:--'}</td>
                      <td className="py-3 px-3">{r.checkOut ? formatTime(r.checkOut) : '--:--'}</td>
                      <td className="py-3 px-3 font-semibold text-primary">{formatHours(r.totalWorkedHours)}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${badge.bg}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-text-secondary">{r.location}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-border/80 mt-4 text-xs text-text-secondary">
          <span>
            Showing {paginatedRecords.length} of {filteredRecords.length} records
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Attendance Regularization Modal */}
      <Modal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        title="Attendance Regularization Request"
        description="Submit punch correction for manager review and approval."
      >
        <form onSubmit={handleSubmitCorrection} className="space-y-4 pt-2">
          <Input
            label="Date of Regularization"
            type="date"
            value={correctionDate}
            onChange={(e) => setCorrectionDate(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Claimed Check-In"
              type="time"
              value={correctionCheckIn}
              onChange={(e) => setCorrectionCheckIn(e.target.value)}
              required
            />
            <Input
              label="Claimed Check-Out"
              type="time"
              value={correctionCheckOut}
              onChange={(e) => setCorrectionCheckOut(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Reason for Regularization"
            placeholder="e.g. Card reader error, remote client meeting, power failure..."
            value={correctionReason}
            onChange={(e) => setCorrectionReason(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsCorrectionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
