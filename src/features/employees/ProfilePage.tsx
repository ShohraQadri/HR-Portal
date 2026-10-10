import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { apiService } from '@/services/apiService'
import type { User, AttendanceRecord, LeaveBalance, RecognitionItem, PerformanceGoal, PayslipItem } from '@/types'
import {
  MOCK_PAYSLIPS,
  MOCK_PERFORMANCE_GOALS,
  MOCK_LEARNING_COURSES,
  MOCK_REVIEW_CYCLE,
} from '@/services/mockData'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate, formatHours, formatTime, formatCurrency } from '@/utils/formatters'
import {
  User as UserIcon,
  Briefcase,
  Clock,
  CalendarCheck,
  FileText,
  Award,
  TrendingUp,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Download,
  Edit2,
  Check,
  Building,
  ShieldCheck,
} from 'lucide-react'

type ProfileTab =
  | 'overview'
  | 'personal'
  | 'employment'
  | 'attendance'
  | 'leave'
  | 'documents'
  | 'performance'
  | 'recognition'
  | 'learning'

export const ProfilePage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { currentUser } = useAuth()
  const { toast } = useToast()

  const requestedId = searchParams.get('id')
  const initialTab = (searchParams.get('tab') as ProfileTab) || 'overview'

  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab)
  const [user, setUser] = useState<User>(currentUser)
  const [isEditing, setIsEditing] = useState(false)

  // Edit form state
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')

  // Related data
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [recognitions, setRecognitions] = useState<RecognitionItem[]>([])

  useEffect(() => {
    const loadProfile = async () => {
      let targetUser = currentUser
      if (requestedId && requestedId !== currentUser.id && requestedId !== currentUser.employeeId) {
        const found = await apiService.getEmployeeById(requestedId)
        if (found) targetUser = found
      }
      setUser(targetUser)
      setPhone(targetUser.phone)
      setLocation(targetUser.location)

      const att = await apiService.getAttendanceRecords(targetUser.employeeId)
      setAttendance(att)
      const bal = await apiService.getLeaveBalances(targetUser.employeeId)
      setLeaveBalances(bal)
      const rec = await apiService.getRecognitions()
      setRecognitions(rec.filter((r) => r.receiverId === targetUser.employeeId || r.receiverId === targetUser.id))
    }
    loadProfile()
  }, [requestedId, currentUser])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updated = await apiService.updateEmployee(user.id, { phone, location })
      setUser(updated)
      setIsEditing(false)
      toast({ title: 'Profile updated! ✅', description: 'Contact details saved successfully.', type: 'success' })
    } catch (err: any) {
      toast({ title: 'Update failed', description: err.message, type: 'error' })
    }
  }

  const handleDownloadPayslip = (payslip: PayslipItem) => {
    const textContent = `PEOPLEHUB SALARY STATEMENT\n----------------------------\nMonth: ${payslip.month}\nEmployee: ${user.name} (${user.employeeId})\nDepartment: ${user.department}\n\nGross Earnings: ${formatCurrency(payslip.grossEarnings)}\n  - Basic Salary: ${formatCurrency(payslip.basicSalary)}\n  - HRA: ${formatCurrency(payslip.hra)}\n  - Special Allowance: ${formatCurrency(payslip.specialAllowance)}\n\nTotal Deductions: ${formatCurrency(payslip.totalDeductions)}\n  - Income Tax: ${formatCurrency(payslip.incomeTax)}\n  - Provident Fund: ${formatCurrency(payslip.providentFund)}\n\nNET PAYABLE: ${formatCurrency(payslip.netPayable)}\nStatus: ${payslip.paymentStatus.toUpperCase()}\n----------------------------\nThis is a certified digital payslip simulation.`
    const element = document.createElement('a')
    const file = new Blob([textContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `Payslip_${payslip.month.replace(' ', '_')}_${user.employeeId}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast({ title: 'Payslip downloaded! 📄', description: 'Saved statement to your device.', type: 'success' })
  }

  const tabs: { id: ProfileTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'personal', label: 'Personal Info', icon: UserIcon },
    { id: 'employment', label: 'Employment Details', icon: Briefcase },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leave', label: 'Leave & Balances', icon: CalendarCheck },
    { id: 'documents', label: 'Documents & Payslips', icon: FileText },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'recognition', label: 'Recognition', icon: Award },
    { id: 'learning', label: 'Learning History', icon: GraduationCap },
  ]

  return (
    <div className="space-y-6">
      {/* Profile Header Hero Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar src={user.avatar} name={user.name} size="xl" status={user.status} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-text-main tracking-tight">{user.name}</h1>
                <Badge variant={user.status === 'active' ? 'success' : 'warning'} size="sm">
                  {user.status}
                </Badge>
              </div>
              <p className="text-sm text-text-secondary mt-0.5 font-medium">{user.title}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-primary" /> {user.department}
                </span>
                <span>•</span>
                <span>ID: {user.employeeId}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {user.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit2 className="w-4 h-4 text-primary" />}
                onClick={() => setIsEditing(true)}
              >
                Edit Contact Info
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pt-6 mt-6 border-t border-border/80 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-main hover:bg-surface-hover'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Tab Content Areas */}
      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 space-y-4">
            <h3 className="text-base font-bold text-text-main">Employee Bio & Focus</h3>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
              {user.name} is a high-impact team member in {user.department}, driving key architectural and design deliverables. Passionate about scalable design systems, customer empathy, and cross-functional collaboration.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60">
              <div>
                <span className="text-[11px] text-text-muted">Work Email</span>
                <p className="text-xs font-semibold text-text-main mt-0.5">{user.email}</p>
              </div>
              <div>
                <span className="text-[11px] text-text-muted">Direct Phone</span>
                <p className="text-xs font-semibold text-text-main mt-0.5">{user.phone}</p>
              </div>
              <div>
                <span className="text-[11px] text-text-muted">Date of Joining</span>
                <p className="text-xs font-semibold text-text-main mt-0.5">{formatDate(user.joiningDate)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="text-sm font-bold text-text-main">Reporting Hierarchy</h3>
            <div className="p-3 rounded-xl bg-surface-subtle/50 border border-border/60 flex items-center gap-3">
              <Avatar name="Marcus Vance" size="sm" />
              <div>
                <p className="text-xs font-semibold text-text-main">Marcus Vance</p>
                <p className="text-[10px] text-text-secondary">VP of Engineering (Direct Manager)</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-surface-subtle/50 border border-border/60 flex items-center gap-3">
              <Avatar name="Elena Rostova" size="sm" />
              <div>
                <p className="text-xs font-semibold text-text-main">Elena Rostova</p>
                <p className="text-[10px] text-text-secondary">Chief People Officer (HR Lead)</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 2. PERSONAL INFORMATION */}
      {activeTab === 'personal' && (
        <Card className="p-6 max-w-2xl">
          <h3 className="text-base font-bold text-text-main mb-4">Personal & Contact Details</h3>
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input label="Direct Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <Input label="Work Location / Remote Hub" value={location} onChange={(e) => setLocation(e.target.value)} required />
              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-text-muted block">Full Legal Name</span>
                <span className="font-semibold text-text-main mt-1 block">{user.name}</span>
              </div>
              <div>
                <span className="text-text-muted block">Work Email</span>
                <span className="font-semibold text-text-main mt-1 block">{user.email}</span>
              </div>
              <div>
                <span className="text-text-muted block">Phone</span>
                <span className="font-semibold text-text-main mt-1 block">{user.phone}</span>
              </div>
              <div>
                <span className="text-text-muted block">Location</span>
                <span className="font-semibold text-text-main mt-1 block">{user.location}</span>
              </div>
              <div>
                <span className="text-text-muted block">Emergency Contact</span>
                <span className="font-semibold text-text-main mt-1 block">Claire Reed (+1 555-987-6543)</span>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* 3. EMPLOYMENT DETAILS */}
      {activeTab === 'employment' && (
        <Card className="p-6 max-w-3xl">
          <h3 className="text-base font-bold text-text-main mb-4">Employment & Contract Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-text-muted block">Employee ID</span>
              <span className="font-bold text-primary text-sm mt-0.5 block">{user.employeeId}</span>
            </div>
            <div>
              <span className="text-text-muted block">Job Title</span>
              <span className="font-semibold text-text-main mt-0.5 block">{user.title}</span>
            </div>
            <div>
              <span className="text-text-muted block">Department</span>
              <span className="font-semibold text-text-main mt-0.5 block">{user.department}</span>
            </div>
            <div>
              <span className="text-text-muted block">Employment Type</span>
              <span className="font-semibold text-text-main mt-0.5 block">Full-time Regular</span>
            </div>
            <div>
              <span className="text-text-muted block">Joining Date</span>
              <span className="font-semibold text-text-main mt-0.5 block">{formatDate(user.joiningDate)}</span>
            </div>
            <div>
              <span className="text-text-muted block">Work Shift</span>
              <span className="font-semibold text-text-main mt-0.5 block">Standard Day (09:00 - 18:00)</span>
            </div>
          </div>
        </Card>
      )}

      {/* 4. ATTENDANCE TAB */}
      {activeTab === 'attendance' && (
        <Card className="p-6">
          <h3 className="text-base font-bold text-text-main mb-4">Monthly Attendance Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 text-text-muted text-[11px] uppercase">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Check In</th>
                  <th className="py-2.5 px-3">Check Out</th>
                  <th className="py-2.5 px-3">Worked Hours</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {attendance.map((a) => (
                  <tr key={a.id}>
                    <td className="py-2.5 px-3 font-semibold text-text-main">{formatDate(a.date)}</td>
                    <td className="py-2.5 px-3">{a.checkIn ? formatTime(a.checkIn) : '--:--'}</td>
                    <td className="py-2.5 px-3">{a.checkOut ? formatTime(a.checkOut) : '--:--'}</td>
                    <td className="py-2.5 px-3 font-bold text-primary">{formatHours(a.totalWorkedHours)}</td>
                    <td className="py-2.5 px-3 capitalize">
                      <Badge variant={a.status === 'present' ? 'success' : 'warning'} size="sm">
                        {a.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 5. LEAVE TAB */}
      {activeTab === 'leave' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {leaveBalances.map((b) => (
              <Card key={b.type} className="p-4 border-l-4" style={{ borderLeftColor: b.color }}>
                <span className="text-xs font-semibold text-text-secondary">{b.title}</span>
                <p className="text-2xl font-bold text-text-main mt-1">{b.remaining}d</p>
                <span className="text-[10px] text-text-muted">Used: {b.used}d / Total: {b.total}d</span>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 6. DOCUMENTS & PAYSLIPS */}
      {activeTab === 'documents' && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-text-main">Salary Statements & Payslips</h3>
            <p className="text-xs text-text-secondary mt-0.5">Download monthly certified salary stubs</p>
          </div>

          <div className="divide-y divide-border/60">
            {MOCK_PAYSLIPS.map((ps) => (
              <div key={ps.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-main">{ps.month}</span>
                    <Badge variant="success" size="sm">
                      {ps.paymentStatus}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Net Pay: <span className="font-bold text-primary">{formatCurrency(ps.netPayable)}</span> • Issued on {formatDate(ps.issueDate)}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Download className="w-4 h-4 text-primary" />}
                  onClick={() => handleDownloadPayslip(ps)}
                >
                  Download Statement
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 7. PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-bold text-text-main mb-4">Active OKRs & Performance Goals</h3>
            <div className="space-y-4">
              {MOCK_PERFORMANCE_GOALS.map((goal) => (
                <div key={goal.id} className="p-4 rounded-xl bg-surface-subtle/50 border border-border/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-text-main">{goal.title}</span>
                    <Badge variant={goal.status === 'on_track' ? 'success' : 'warning'} size="sm">
                      {goal.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-text-secondary">{goal.metric}</p>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="w-full bg-border rounded-full h-2 mr-3 overflow-hidden">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${goal.progress}%` }} />
                    </div>
                    <span className="font-bold text-primary shrink-0">{goal.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 8. RECOGNITION */}
      {activeTab === 'recognition' && (
        <Card className="p-6">
          <h3 className="text-base font-bold text-text-main mb-4">Received Awards & Accolades</h3>
          <div className="divide-y divide-border/60">
            {recognitions.length === 0 ? (
              <p className="text-xs text-text-muted py-6 text-center">No awards in profile yet.</p>
            ) : (
              recognitions.map((r) => (
                <div key={r.id} className="py-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-main">From: {r.senderName}</span>
                    <Badge variant="lavender" size="sm">
                      {r.badgeName} (+{r.points} pts)
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary italic">"{r.message}"</p>
                  <span className="text-[10px] text-text-muted block">{formatDate(r.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* 9. LEARNING HISTORY */}
      {activeTab === 'learning' && (
        <Card className="p-6">
          <h3 className="text-base font-bold text-text-main mb-4">Completed & Enrolled Courses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_LEARNING_COURSES.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-border/80 bg-surface-subtle/30 space-y-2">
                <Badge variant={c.isCompleted ? 'success' : 'lavender'} size="sm">
                  {c.isCompleted ? 'Completed' : 'In Progress'}
                </Badge>
                <h4 className="text-xs font-bold text-text-main">{c.title}</h4>
                <p className="text-[11px] text-text-muted">Instructor: {c.instructor} • {c.duration}</p>
                {c.progress !== undefined && (
                  <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
