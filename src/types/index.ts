export type UserRole = 'employee' | 'manager' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: UserRole
  title: string
  department: string
  employeeId: string
  managerId?: string
  joiningDate: string
  location: string
  phone: string
  status: 'active' | 'on_leave' | 'probation' | 'inactive'
}

export interface Department {
  id: string
  name: string
  leadName: string
  employeeCount: number
  budgetCode: string
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string // YYYY-MM-DD
  checkIn: string // HH:mm:ss or ISO
  checkOut?: string // HH:mm:ss or ISO
  totalWorkedHours?: number
  breakDurationMinutes?: number
  status: 'present' | 'late' | 'half_day' | 'absent' | 'on_leave'
  shift: string
  location: 'Office' | 'Remote' | 'Client Site'
  notes?: string
}

export type LeaveType = 'annual' | 'sick' | 'casual' | 'parental' | 'unpaid'
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export interface LeaveBalance {
  type: LeaveType
  title: string
  total: number
  used: number
  pending: number
  remaining: number
  color: string
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  employeeAvatar: string
  department: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  daysCount: number
  isHalfDay?: boolean
  reason: string
  status: LeaveStatus
  appliedAt: string
  approverId?: string
  approverName?: string
  approverComments?: string
  decidedAt?: string
  attachmentName?: string
}

export type RequestCategory = 'HR' | 'IT' | 'Facilities' | 'Finance' | 'General'
export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent'
export type RequestStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'awaiting_info'
  | 'approved'
  | 'in_progress'
  | 'resolved'
  | 'rejected'
  | 'closed'

export interface ServiceRequestComment {
  id: string
  authorName: string
  authorRole: string
  authorAvatar: string
  content: string
  timestamp: string
  isInternal?: boolean
}

export interface ServiceRequest {
  id: string
  ticketNumber: string
  title: string
  category: RequestCategory
  priority: RequestPriority
  status: RequestStatus
  description: string
  submittedBy: {
    id: string
    name: string
    avatar: string
    department: string
    email: string
  }
  assignedTo?: {
    id: string
    name: string
    avatar: string
  }
  createdAt: string
  updatedAt: string
  slaDueDate: string
  comments: ServiceRequestComment[]
}

export type RecognitionCategory = 
  | 'Teamwork'
  | 'Innovation'
  | 'Leadership'
  | 'Customer First'
  | 'Going the Extra Mile'
  | 'Culture Champion'

export interface RecognitionBadge {
  id: string
  name: string
  iconName: string
  description: string
  color: string
}

export interface RecognitionItem {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  senderTitle: string
  receiverId: string
  receiverName: string
  receiverAvatar: string
  receiverTitle: string
  department: string
  category: RecognitionCategory
  badgeName: string
  badgeColor: string
  badgeIcon: string
  message: string
  points: number
  createdAt: string
  likesCount: number
  isLikedByCurrentUser?: boolean
}

export interface PerformanceGoal {
  id: string
  employeeId: string
  title: string
  category: 'Strategic' | 'Operational' | 'Learning' | 'Leadership'
  targetDate: string
  progress: number // 0-100
  status: 'on_track' | 'at_risk' | 'behind' | 'completed'
  weightage: number
  metric: string
}

export interface PerformanceReviewCycle {
  id: string
  title: string
  period: string
  dueDate: string
  selfReviewStatus: 'completed' | 'in_progress' | 'pending'
  managerReviewStatus: 'completed' | 'in_progress' | 'pending'
  overallRating?: number
  selfFeedback?: string
  managerFeedback?: string
}

export interface LearningCourse {
  id: string
  title: string
  category: 'Engineering' | 'Leadership' | 'Security & Compliance' | 'Productivity'
  duration: string
  instructor: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  rating: number
  enrolledCount: number
  progress?: number
  isCompleted?: boolean
  thumbnailGradient: string
  description: string
}

export interface RecruitmentJob {
  id: string
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Contract' | 'Remote'
  status: 'Open' | 'Interviewing' | 'Closed'
  applicantCount: number
  postedDate: string
  pipeline: {
    applied: number
    screening: number
    interview: number
    offer: number
    hired: number
  }
}

export interface PayslipItem {
  id: string
  employeeId: string
  month: string // e.g. "October 2026"
  payPeriod: string
  issueDate: string
  paymentStatus: 'paid' | 'processing' | 'scheduled'
  basicSalary: number
  hra: number
  specialAllowance: number
  bonus: number
  grossEarnings: number
  providentFund: number
  professionalTax: number
  incomeTax: number
  totalDeductions: number
  netPayable: number
  currency: string
}

export interface Announcement {
  id: string
  title: string
  category: 'Company Update' | 'Event' | 'Policy' | 'Celebration' | 'Holiday'
  summary: string
  content: string
  author: string
  authorRole: string
  publishedAt: string
  isPinned: boolean
}

export interface PolicyArticle {
  id: string
  title: string
  category: 'Workplace' | 'Leave & Attendance' | 'Code of Conduct' | 'Benefits' | 'IT Security'
  readTime: string
  lastUpdated: string
  content: string
}

export interface AuditLog {
  id: string
  action: string
  category: 'Branding' | 'Attendance' | 'Leave' | 'Permissions' | 'User'
  actorName: string
  actorEmail: string
  timestamp: string
  details: string
  ipAddress: string
}

export type ThemePresetId = 'lavender' | 'ocean' | 'emerald' | 'rose' | 'midnight'

export interface ThemePreset {
  id: ThemePresetId
  name: string
  description: string
  primary: string
  primaryHover: string
  surfaceSubtle: string
  pageBg: string
  cardBg: string
  sidebarBg: string
  textMain: string
  textSecondary: string
  border: string
  isDark?: boolean
}

export interface CompanyBrandingSettings {
  companyName: string
  organizationId: string
  tagline: string
  supportEmail: string
  website: string
  logoUrl?: string
  themePreset: ThemePresetId
  primaryColor: string
  accentColor: string
  sidebarStyle: 'light' | 'tinted' | 'dark'
  isDarkMode: boolean
  timezone: string
  workingHours: {
    startTime: string // "09:00"
    endTime: string // "18:00"
    gracePeriodMinutes: number // 15
    breakMinutes: number // 60
    workDays: string[] // ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  }
}
