import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { apiService } from '@/services/apiService'
import type { AttendanceRecord, LeaveRequest, ServiceRequest, User } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { StatCard } from '@/components/ui/StatCard'
import { formatDate, formatTime } from '@/utils/formatters'
import {
  Users,
  CheckCircle2,
  Clock,
  CalendarCheck,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  Check,
  X,
  FileText,
} from 'lucide-react'

export const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { toast } = useToast()

  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState<LeaveRequest[]>([])
  const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>([])

  const loadManagerData = async () => {
    try {
      const allEmployees = await apiService.getEmployees()
      // Team members reporting to Marcus or in Engineering
      const team = allEmployees.filter((e) => e.managerId === currentUser.id || e.department === currentUser.department)
      setTeamMembers(team)

      const att = await apiService.getAttendanceRecords()
      setAttendanceRecords(att)

      const leaves = await apiService.getLeaveRequests()
      setPendingLeaveRequests(leaves.filter((l) => l.status === 'pending'))

      const requests = await apiService.getServiceRequests()
      setActiveRequests(requests.filter((r) => r.status === 'in_progress' || r.status === 'under_review'))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadManagerData()
  }, [currentUser])

  const handleQuickApproveLeave = async (requestId: string) => {
    try {
      await apiService.updateLeaveStatus(requestId, 'approved', currentUser, 'Approved via Manager Dashboard')
      toast({
        title: 'Leave request approved! ✅',
        description: 'Employee notified and leave balance deducted.',
        type: 'success',
      })
      loadManagerData()
    } catch (err: any) {
      toast({ title: 'Approval failed', description: err.message, type: 'error' })
    }
  }

  const handleQuickRejectLeave = async (requestId: string) => {
    try {
      await apiService.updateLeaveStatus(requestId, 'rejected', currentUser, 'Declined due to sprint delivery schedule')
      toast({
        title: 'Leave request declined',
        description: 'Employee notified with feedback.',
        type: 'info',
      })
      loadManagerData()
    } catch (err: any) {
      toast({ title: 'Action failed', description: err.message, type: 'error' })
    }
  }

  const presentCount = attendanceRecords.filter((r) => r.date === '2026-10-10' && r.status === 'present').length
  const lateCount = attendanceRecords.filter((r) => r.date === '2026-10-10' && r.status === 'late').length
  const onLeaveCount = teamMembers.filter((m) => m.status === 'on_leave').length

  return (
    <div className="space-y-6">
      {/* Manager Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Management Portal
            </span>
            <span className="text-text-muted">•</span>
            <span className="text-xs text-text-secondary">{currentUser.department} Division</span>
          </div>
          <h1 className="text-2xl font-bold text-text-main mt-1 tracking-tight">
            Team Overview & Approvals — {currentUser.name}
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Overseeing {teamMembers.length} team members across active project streams
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Users className="w-4 h-4 text-primary" />}
            onClick={() => navigate('/teams')}
          >
            Team Directory
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<CheckSquare className="w-4 h-4" />}
            onClick={() => navigate('/approvals')}
          >
            Approval Inbox ({pendingLeaveRequests.length})
          </Button>
        </div>
      </div>

      {/* Team Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Direct Reports"
          value={teamMembers.length}
          subtitle="All active in Engineering"
          icon={<Users className="w-5 h-5" />}
          trend={{ value: '100%', isPositive: true, label: 'headcount filled' }}
        />
        <StatCard
          title="Present Today"
          value={presentCount}
          subtitle="Logged in & active"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
        />
        <StatCard
          title="Late / Incomplete"
          value={lateCount}
          subtitle="Logged after 09:15 AM"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50 dark:bg-amber-950/40 text-amber-600"
        />
        <StatCard
          title="On Planned Leave"
          value={onLeaveCount}
          subtitle="Approved out of office"
          icon={<CalendarCheck className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50 dark:bg-blue-950/40 text-blue-600"
        />
      </div>

      {/* Urgent Approval Queue & Team Attendance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approval Inbox */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-main text-base">Pending Leave Approvals</h3>
                  <p className="text-xs text-text-secondary">Requests awaiting managerial signoff</p>
                </div>
              </div>
              <Badge variant="warning" size="sm">
                {pendingLeaveRequests.length} Pending Action
              </Badge>
            </div>

            {pendingLeaveRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-secondary">
                No pending leave approvals right now. Everything is up to date! 🎉
              </div>
            ) : (
              <div className="divide-y divide-border/60 mt-2">
                {pendingLeaveRequests.map((req) => (
                  <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Avatar src={req.employeeAvatar} name={req.employeeName} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-text-main">{req.employeeName}</span>
                          <Badge variant="lavender" size="sm">
                            {req.leaveType}
                          </Badge>
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {formatDate(req.startDate)} to {formatDate(req.endDate)} ({req.daysCount} days)
                        </p>
                        <p className="text-xs text-text-muted italic mt-1 max-w-md">"{req.reason}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        leftIcon={<X className="w-4 h-4" />}
                        onClick={() => handleQuickRejectLeave(req.id)}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<Check className="w-4 h-4" />}
                        onClick={() => handleQuickApproveLeave(req.id)}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border/80 flex items-center justify-between">
            <span className="text-xs text-text-muted">Need to delegate approvals while away?</span>
            <Button size="sm" variant="ghost" onClick={() => navigate('/approvals')}>
              Go to Full Approval Hub <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
            </Button>
          </div>
        </Card>

        {/* SLA Health & Ticket Monitoring */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-semibold text-text-main text-sm">Team SLA Status</h3>
                  <p className="text-xs text-text-secondary">Turnaround on open service requests</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 my-4">
              <div className="p-3.5 rounded-xl bg-surface-muted border border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-main">Average SLA Compliance</span>
                  <span className="text-xs font-bold text-emerald-600">96.4%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2 mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full w-[96.4%]" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-text-secondary">Active Queries:</span>
                {activeRequests.slice(0, 3).map((r) => (
                  <div key={r.id} className="p-3 rounded-xl bg-surface-subtle/50 border border-border/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-primary">{r.ticketNumber}</span>
                      <Badge variant="warning" size="sm">
                        {r.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-main truncate font-medium mt-1">{r.title}</p>
                    <span className="text-[10px] text-text-muted block mt-1">
                      Requester: {r.submittedBy.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={() => navigate('/requests')}
          >
            Review All Tickets
          </Button>
        </Card>
      </div>
    </div>
  )
}
