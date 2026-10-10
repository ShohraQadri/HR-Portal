import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { apiService } from '@/services/apiService'
import type { LeaveBalance, LeaveRequest, LeaveType } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { formatDate, getStatusBadgeVariant } from '@/utils/formatters'
import {
  CalendarCheck,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  X,
  Check,
} from 'lucide-react'
import { differenceInBusinessDays, parseISO, isValid } from 'date-fns'

export const LeavePage: React.FC = () => {
  const { currentUser, isRole } = useAuth()
  const { toast } = useToast()

  const [balances, setBalances] = useState<LeaveBalance[]>([])
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  // Form states
  const [leaveType, setLeaveType] = useState<LeaveType>('annual')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isHalfDay, setIsHalfDay] = useState(false)
  const [reason, setReason] = useState('')
  const [attachmentName, setAttachmentName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = async () => {
    try {
      const b = await apiService.getLeaveBalances(currentUser.employeeId)
      setBalances(b)
      const r = await apiService.getLeaveRequests(
        isRole(['manager', 'admin']) ? undefined : currentUser.employeeId
      )
      setRequests(r)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [currentUser])

  // Calculate day count
  const calculatedDays = React.useMemo(() => {
    if (!startDate || !endDate) return 0
    try {
      const s = parseISO(startDate)
      const e = parseISO(endDate)
      if (!isValid(s) || !isValid(e) || s > e) return 0
      const days = differenceInBusinessDays(e, s) + 1
      return isHalfDay ? 0.5 : Math.max(1, days)
    } catch {
      return 0
    }
  }, [startDate, endDate, isHalfDay])

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) {
      toast({ title: 'Invalid Dates', description: 'Please select both start and end dates.', type: 'warning' })
      return
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast({ title: 'Invalid Date Range', description: 'End date must be on or after start date.', type: 'error' })
      return
    }
    if (!reason.trim()) {
      toast({ title: 'Missing Reason', description: 'Please enter a reason for your leave.', type: 'warning' })
      return
    }

    const currentBalance = balances.find((b) => b.type === leaveType)
    if (currentBalance && calculatedDays > currentBalance.remaining) {
      toast({
        title: 'Insufficient Balance',
        description: `You only have ${currentBalance.remaining} days remaining in this category.`,
        type: 'error',
      })
      return
    }

    setIsSubmitting(true)
    try {
      await apiService.applyForLeave({
        employeeId: currentUser.employeeId,
        employeeName: currentUser.name,
        employeeAvatar: currentUser.avatar,
        department: currentUser.department,
        leaveType,
        startDate,
        endDate,
        daysCount: calculatedDays,
        isHalfDay,
        reason,
        attachmentName: attachmentName || undefined,
      })

      toast({
        title: 'Leave application submitted! ✈️',
        description: `Requested ${calculatedDays} day(s) for manager approval.`,
        type: 'success',
      })
      setIsApplyModalOpen(false)
      // reset form
      setStartDate('')
      setEndDate('')
      setReason('')
      setAttachmentName('')
      loadData()
    } catch (err: any) {
      toast({ title: 'Submission failed', description: err.message, type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApprove = async (reqId: string) => {
    try {
      await apiService.updateLeaveStatus(reqId, 'approved', currentUser, 'Approved.')
      toast({ title: 'Leave approved! ✅', description: 'Employee has been notified.', type: 'success' })
      loadData()
    } catch (err: any) {
      toast({ title: 'Action failed', description: err.message, type: 'error' })
    }
  }

  const handleReject = async (reqId: string) => {
    try {
      await apiService.updateLeaveStatus(reqId, 'rejected', currentUser, 'Declined due to coverage.')
      toast({ title: 'Leave request rejected', description: 'Status updated.', type: 'info' })
      loadData()
    } catch (err: any) {
      toast({ title: 'Action failed', description: err.message, type: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Leave & Time Off</h1>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Manage your annual vacation, sick leaves, and review approval workflows
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsApplyModalOpen(true)}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {balances.map((b) => (
          <Card key={b.type} className="p-5 border-l-4" style={{ borderLeftColor: b.color }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary">{b.title}</span>
              <span className="text-[11px] text-text-muted">{b.total} Total</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-text-main">{b.remaining}</span>
              <span className="text-xs text-text-secondary">available</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border/60">
              <span>Used: {b.used}d</span>
              {b.pending > 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  {b.pending}d pending
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Leave Requests Log */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div>
            <h3 className="font-semibold text-text-main text-base">Leave Applications & Approvals</h3>
            <p className="text-xs text-text-secondary">
              {isRole(['manager', 'admin']) ? 'Team and departmental leave requests' : 'Your personal leave history'}
            </p>
          </div>
          <span className="text-xs font-semibold text-primary">{requests.length} Requests Total</span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="border-b border-border/80 text-text-muted text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Period</th>
                <th className="py-3 px-3">Days</th>
                <th className="py-3 px-3">Reason</th>
                <th className="py-3 px-3">Status</th>
                {isRole(['manager', 'admin']) && <th className="py-3 px-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-muted">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                requests.map((r) => {
                  const badge = getStatusBadgeVariant(r.status)
                  return (
                    <tr key={r.id} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="py-3 px-3 font-medium text-text-main">
                        <div>{r.employeeName}</div>
                        <div className="text-[10px] text-text-muted">{r.department}</div>
                      </td>
                      <td className="py-3 px-3 capitalize">
                        <Badge variant="lavender" size="sm">
                          {r.leaveType}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-text-main">{formatDate(r.startDate)} - {formatDate(r.endDate)}</div>
                        <div className="text-[10px] text-text-muted">Applied: {formatDate(r.appliedAt)}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-primary">
                        {r.daysCount}d {r.isHalfDay && '(Half Day)'}
                      </td>
                      <td className="py-3 px-3 text-text-secondary max-w-xs truncate" title={r.reason}>
                        {r.reason}
                        {r.approverComments && (
                          <div className="text-[10px] text-text-muted mt-0.5 italic">
                            Approver note: "{r.approverComments}"
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${badge.bg}`}>
                          {r.status}
                        </span>
                      </td>
                      {isRole(['manager', 'admin']) && (
                        <td className="py-3 px-3 text-right">
                          {r.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs text-rose-600 hover:text-rose-700"
                                onClick={() => handleReject(r.id)}
                              >
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                variant="primary"
                                className="h-7 text-xs"
                                onClick={() => handleApprove(r.id)}
                              >
                                Approve
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-text-muted">Done</span>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Time Off"
        description="Submit a new vacation, medical, or casual leave request."
      >
        <form onSubmit={handleApplyLeave} className="space-y-4 pt-2">
          <Select
            label="Leave Category"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
            options={[
              { value: 'annual', label: 'Annual Paid Vacation' },
              { value: 'casual', label: 'Casual / Personal Leave' },
              { value: 'sick', label: 'Medical & Sick Leave' },
              { value: 'parental', label: 'Parental / Family Leave' },
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="half-day"
              checked={isHalfDay}
              onChange={(e) => setIsHalfDay(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor="half-day" className="text-xs text-text-main font-medium cursor-pointer">
              Apply as Half-Day Leave
            </label>
          </div>

          {calculatedDays > 0 && (
            <div className="p-3 rounded-xl bg-surface-subtle border border-border/60 flex items-center justify-between text-xs">
              <span className="text-text-secondary">Estimated Working Days:</span>
              <span className="font-bold text-primary">{calculatedDays} day(s)</span>
            </div>
          )}

          <Textarea
            label="Reason for Leave"
            placeholder="Please provide details for your manager..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <Input
            label="Optional Supporting Document / Doctor Note"
            placeholder="e.g. medical_certificate_2026.pdf"
            value={attachmentName}
            onChange={(e) => setAttachmentName(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
