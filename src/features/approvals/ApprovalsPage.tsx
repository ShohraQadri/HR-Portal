import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { apiService } from '@/services/apiService'
import type { LeaveRequest, ServiceRequest } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/utils/formatters'
import {
  CheckSquare,
  Check,
  X,
  Clock,
  CalendarCheck,
  FileText,
  AlertCircle,
} from 'lucide-react'

export const ApprovalsPage: React.FC = () => {
  const { currentUser, isRole } = useAuth()
  const { toast } = useToast()

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [activeTab, setActiveTab] = useState<'leave' | 'service'>('leave')

  const loadApprovals = async () => {
    try {
      const leaves = await apiService.getLeaveRequests()
      setLeaveRequests(leaves.filter((l) => l.status === 'pending'))
      const tickets = await apiService.getServiceRequests()
      setServiceRequests(tickets.filter((t) => t.status === 'under_review'))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadApprovals()
  }, [currentUser])

  const handleApproveLeave = async (id: string) => {
    try {
      await apiService.updateLeaveStatus(id, 'approved', currentUser, 'Approved in centralized inbox.')
      toast({ title: 'Leave approved! ✅', type: 'success' })
      loadApprovals()
    } catch (err: any) {
      toast({ title: 'Approval failed', description: err.message, type: 'error' })
    }
  }

  const handleRejectLeave = async (id: string) => {
    try {
      await apiService.updateLeaveStatus(id, 'rejected', currentUser, 'Declined due to resource coverage.')
      toast({ title: 'Leave rejected', type: 'info' })
      loadApprovals()
    } catch (err: any) {
      toast({ title: 'Action failed', description: err.message, type: 'error' })
    }
  }

  const handleApproveTicket = async (ticketId: string) => {
    try {
      await apiService.updateRequestStatus(ticketId, 'in_progress')
      toast({ title: 'Ticket accepted into progress! 🛠️', type: 'success' })
      loadApprovals()
    } catch (err: any) {
      toast({ title: 'Action failed', description: err.message, type: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main">Centralized Approvals Inbox</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-0.5">
          Review, approve, and resolve pending actions submitted by team members
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3">
        <button
          onClick={() => setActiveTab('leave')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'leave'
              ? 'bg-primary text-white shadow-xs'
              : 'text-text-secondary hover:text-text-main hover:bg-surface-hover'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Pending Leave ({leaveRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('service')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'service'
              ? 'bg-primary text-white shadow-xs'
              : 'text-text-secondary hover:text-text-main hover:bg-surface-hover'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Service Requests ({serviceRequests.length})</span>
        </button>
      </div>

      {/* Leave Approvals Tab */}
      {activeTab === 'leave' && (
        <div className="space-y-3">
          {leaveRequests.length === 0 ? (
            <Card className="p-8 text-center text-xs text-text-muted">
              No pending leave approvals right now. Everything is clear! 🎉
            </Card>
          ) : (
            leaveRequests.map((r) => (
              <Card key={r.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Avatar src={r.employeeAvatar} name={r.employeeName} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text-main">{r.employeeName}</span>
                      <Badge variant="lavender" size="sm">
                        {r.leaveType}
                      </Badge>
                      <span className="text-xs font-semibold text-primary">{r.daysCount} days</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {formatDate(r.startDate)} to {formatDate(r.endDate)} • Applied {formatDate(r.appliedAt)}
                    </p>
                    <p className="text-xs text-text-muted italic mt-1 bg-surface-subtle/50 p-2 rounded-lg border border-border/40">
                      "{r.reason}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    leftIcon={<X className="w-4 h-4" />}
                    onClick={() => handleRejectLeave(r.id)}
                  >
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<Check className="w-4 h-4" />}
                    onClick={() => handleApproveLeave(r.id)}
                  >
                    Approve Request
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Service Request Approvals Tab */}
      {activeTab === 'service' && (
        <div className="space-y-3">
          {serviceRequests.length === 0 ? (
            <Card className="p-8 text-center text-xs text-text-muted">
              No tickets awaiting review right now.
            </Card>
          ) : (
            serviceRequests.map((t) => (
              <Card key={t.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-xs">{t.ticketNumber}</span>
                    <Badge variant="lavender" size="sm">
                      {t.category}
                    </Badge>
                    <Badge variant="warning" size="sm">
                      {t.priority}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-text-main mt-1">{t.title}</h4>
                  <p className="text-xs text-text-secondary mt-0.5">{t.description}</p>
                  <span className="text-[10px] text-text-muted block mt-1">
                    Requester: {t.submittedBy.name} ({t.submittedBy.department})
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Check className="w-4 h-4" />}
                  onClick={() => handleApproveTicket(t.id)}
                >
                  Accept & Assign
                </Button>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
