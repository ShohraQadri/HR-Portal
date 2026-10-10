import type {
  AttendanceRecord,
  LeaveBalance,
  LeaveRequest,
  ServiceRequest,
  RecognitionItem,
  User,
  PerformanceGoal,
  AuditLog,
} from '@/types'
import {
  MOCK_EMPLOYEES,
  MOCK_ATTENDANCE_RECORDS,
  MOCK_LEAVE_BALANCES,
  MOCK_LEAVE_REQUESTS,
  MOCK_SERVICE_REQUESTS,
  MOCK_RECOGNITIONS,
  MOCK_PERFORMANCE_GOALS,
  MOCK_AUDIT_LOGS,
} from './mockData'
import { storage } from '@/utils/storage'
import { format, differenceInMinutes, parseISO } from 'date-fns'

// Simulated network delay
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

export const apiService = {
  // --- ATTENDANCE ---
  async getAttendanceRecords(employeeId?: string): Promise<AttendanceRecord[]> {
    await delay()
    const stored = storage.get<AttendanceRecord[]>('attendance_records', MOCK_ATTENDANCE_RECORDS)
    if (employeeId) {
      return stored.filter((r) => r.employeeId === employeeId)
    }
    return stored
  },

  async getTodayAttendance(employeeId: string): Promise<AttendanceRecord | null> {
    await delay()
    const stored = storage.get<AttendanceRecord[]>('attendance_records', MOCK_ATTENDANCE_RECORDS)
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    const match = stored.find((r) => r.employeeId === employeeId && r.date === todayStr)
    return match || null
  },

  async checkIn(user: User): Promise<AttendanceRecord> {
    await delay()
    const records = storage.get<AttendanceRecord[]>('attendance_records', MOCK_ATTENDANCE_RECORDS)
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    const nowTimeStr = format(new Date(), 'HH:mm:ss')

    const existing = records.find((r) => r.employeeId === user.employeeId && r.date === todayStr)
    if (existing && !existing.checkOut) {
      throw new Error('You are already checked in for today!')
    }

    // Determine status (check if after 09:15 AM for late arrival)
    const now = new Date()
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15)

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: user.employeeId,
      employeeName: user.name,
      date: todayStr,
      checkIn: nowTimeStr,
      checkOut: undefined,
      totalWorkedHours: 0.1,
      breakDurationMinutes: 0,
      status: isLate ? 'late' : 'present',
      shift: 'General (09:00 - 18:00)',
      location: 'Office',
    }

    const updated = [newRecord, ...records.filter((r) => !(r.employeeId === user.employeeId && r.date === todayStr))]
    storage.set('attendance_records', updated)
    return newRecord
  },

  async checkOut(user: User): Promise<AttendanceRecord> {
    await delay()
    const records = storage.get<AttendanceRecord[]>('attendance_records', MOCK_ATTENDANCE_RECORDS)
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    const nowTimeStr = format(new Date(), 'HH:mm:ss')

    const existingIndex = records.findIndex((r) => r.employeeId === user.employeeId && r.date === todayStr)
    if (existingIndex === -1 || !records[existingIndex].checkIn) {
      throw new Error('No active check-in found for today. You must check in before checking out.')
    }

    const existing = records[existingIndex]
    if (existing.checkOut) {
      throw new Error('You have already checked out for today.')
    }

    // Calculate duration in hours based on timestamps
    const [inH, inM, inS] = existing.checkIn.split(':').map(Number)
    const checkInDate = new Date()
    checkInDate.setHours(inH || 9, inM || 0, inS || 0, 0)
    const now = new Date()
    const diffMinutes = Math.max(1, differenceInMinutes(now, checkInDate))
    const totalWorkedHours = parseFloat(((diffMinutes - (existing.breakDurationMinutes || 0)) / 60).toFixed(2))

    const updatedRecord: AttendanceRecord = {
      ...existing,
      checkOut: nowTimeStr,
      totalWorkedHours: Math.max(0.1, totalWorkedHours),
    }

    records[existingIndex] = updatedRecord
    storage.set('attendance_records', records)
    return updatedRecord
  },

  // --- LEAVE ---
  async getLeaveBalances(employeeId: string): Promise<LeaveBalance[]> {
    await delay()
    return storage.get<LeaveBalance[]>(`leave_balances_${employeeId}`, MOCK_LEAVE_BALANCES)
  },

  async getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
    await delay()
    const stored = storage.get<LeaveRequest[]>('leave_requests', MOCK_LEAVE_REQUESTS)
    if (employeeId) {
      return stored.filter((r) => r.employeeId === employeeId)
    }
    return stored
  },

  async applyForLeave(requestData: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>): Promise<LeaveRequest> {
    await delay()
    const requests = storage.get<LeaveRequest[]>('leave_requests', MOCK_LEAVE_REQUESTS)
    
    // Validate overlapping dates
    const overlaps = requests.some(
      (r) =>
        r.employeeId === requestData.employeeId &&
        r.status !== 'rejected' &&
        r.status !== 'cancelled' &&
        ((requestData.startDate >= r.startDate && requestData.startDate <= r.endDate) ||
          (requestData.endDate >= r.startDate && requestData.endDate <= r.endDate))
    )
    if (overlaps) {
      throw new Error('You already have an existing leave request spanning these dates.')
    }

    const newRequest: LeaveRequest = {
      ...requestData,
      id: `lr-${Date.now()}`,
      appliedAt: new Date().toISOString(),
      status: 'pending',
    }

    const updated = [newRequest, ...requests]
    storage.set('leave_requests', updated)

    // Update pending balance
    const balances = storage.get<LeaveBalance[]>(`leave_balances_${requestData.employeeId}`, MOCK_LEAVE_BALANCES)
    const updatedBalances = balances.map((b) => {
      if (b.type === requestData.leaveType) {
        return {
          ...b,
          pending: b.pending + requestData.daysCount,
          remaining: Math.max(0, b.remaining - requestData.daysCount),
        }
      }
      return b
    })
    storage.set(`leave_balances_${requestData.employeeId}`, updatedBalances)

    return newRequest
  },

  async updateLeaveStatus(requestId: string, status: 'approved' | 'rejected', approver: User, comments?: string): Promise<LeaveRequest> {
    await delay()
    const requests = storage.get<LeaveRequest[]>('leave_requests', MOCK_LEAVE_REQUESTS)
    const index = requests.findIndex((r) => r.id === requestId)
    if (index === -1) throw new Error('Leave request not found')

    const req = requests[index]
    const updatedReq: LeaveRequest = {
      ...req,
      status,
      approverId: approver.employeeId,
      approverName: approver.name,
      approverComments: comments || (status === 'approved' ? 'Approved by manager.' : 'Request declined.'),
      decidedAt: new Date().toISOString(),
    }
    requests[index] = updatedReq
    storage.set('leave_requests', requests)

    // Update leave balances
    const balances = storage.get<LeaveBalance[]>(`leave_balances_${req.employeeId}`, MOCK_LEAVE_BALANCES)
    const updatedBalances = balances.map((b) => {
      if (b.type === req.leaveType) {
        if (status === 'approved') {
          return {
            ...b,
            pending: Math.max(0, b.pending - req.daysCount),
            used: b.used + req.daysCount,
          }
        } else {
          return {
            ...b,
            pending: Math.max(0, b.pending - req.daysCount),
            remaining: b.remaining + req.daysCount,
          }
        }
      }
      return b
    })
    storage.set(`leave_balances_${req.employeeId}`, updatedBalances)

    return updatedReq
  },

  // --- SERVICE REQUESTS ---
  async getServiceRequests(employeeId?: string): Promise<ServiceRequest[]> {
    await delay()
    const stored = storage.get<ServiceRequest[]>('service_requests', MOCK_SERVICE_REQUESTS)
    if (employeeId) {
      return stored.filter((r) => r.submittedBy.id === employeeId)
    }
    return stored
  },

  async createServiceRequest(
    data: Omit<ServiceRequest, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'slaDueDate' | 'comments'>
  ): Promise<ServiceRequest> {
    await delay()
    const stored = storage.get<ServiceRequest[]>('service_requests', MOCK_SERVICE_REQUESTS)
    const nextTicketNum = `REQ-${2040 + stored.length + 1}`
    
    // SLA due in 3 business days
    const sla = new Date()
    sla.setDate(sla.getDate() + 3)

    const newReq: ServiceRequest = {
      ...data,
      id: `req-${Date.now()}`,
      ticketNumber: nextTicketNum,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaDueDate: sla.toISOString(),
      comments: [
        {
          id: `c-${Date.now()}`,
          authorName: data.submittedBy.name,
          authorRole: 'Requester',
          authorAvatar: data.submittedBy.avatar,
          content: 'Ticket created and assigned to triage queue.',
          timestamp: new Date().toISOString(),
        },
      ],
    }

    const updated = [newReq, ...stored]
    storage.set('service_requests', updated)
    return newReq
  },

  async addRequestComment(ticketId: string, comment: { authorName: string; authorRole: string; authorAvatar: string; content: string }): Promise<ServiceRequest> {
    await delay()
    const stored = storage.get<ServiceRequest[]>('service_requests', MOCK_SERVICE_REQUESTS)
    const index = stored.findIndex((r) => r.id === ticketId || r.ticketNumber === ticketId)
    if (index === -1) throw new Error('Ticket not found')

    const newComment = {
      id: `c-${Date.now()}`,
      ...comment,
      timestamp: new Date().toISOString(),
    }

    stored[index].comments.push(newComment)
    stored[index].updatedAt = new Date().toISOString()
    storage.set('service_requests', stored)
    return stored[index]
  },

  async updateRequestStatus(ticketId: string, newStatus: ServiceRequest['status']): Promise<ServiceRequest> {
    await delay()
    const stored = storage.get<ServiceRequest[]>('service_requests', MOCK_SERVICE_REQUESTS)
    const index = stored.findIndex((r) => r.id === ticketId || r.ticketNumber === ticketId)
    if (index === -1) throw new Error('Ticket not found')

    stored[index].status = newStatus
    stored[index].updatedAt = new Date().toISOString()
    storage.set('service_requests', stored)
    return stored[index]
  },

  // --- REWARDS & RECOGNITION ---
  async getRecognitions(): Promise<RecognitionItem[]> {
    await delay()
    return storage.get<RecognitionItem[]>('recognitions', MOCK_RECOGNITIONS)
  },

  async giveRecognition(data: Omit<RecognitionItem, 'id' | 'createdAt' | 'likesCount' | 'isLikedByCurrentUser'>): Promise<RecognitionItem> {
    await delay()
    const stored = storage.get<RecognitionItem[]>('recognitions', MOCK_RECOGNITIONS)
    const newItem: RecognitionItem = {
      ...data,
      id: `rec-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likesCount: 1,
      isLikedByCurrentUser: true,
    }

    const updated = [newItem, ...stored]
    storage.set('recognitions', updated)
    return newItem
  },

  async toggleRecognitionLike(recognitionId: string): Promise<RecognitionItem> {
    await delay()
    const stored = storage.get<RecognitionItem[]>('recognitions', MOCK_RECOGNITIONS)
    const item = stored.find((r) => r.id === recognitionId)
    if (!item) throw new Error('Recognition not found')

    if (item.isLikedByCurrentUser) {
      item.likesCount = Math.max(0, item.likesCount - 1)
      item.isLikedByCurrentUser = false
    } else {
      item.likesCount += 1
      item.isLikedByCurrentUser = true
    }

    storage.set('recognitions', stored)
    return { ...item }
  },

  // --- EMPLOYEES ---
  async getEmployees(): Promise<User[]> {
    await delay()
    return storage.get<User[]>('employees_directory', MOCK_EMPLOYEES)
  },

  async getEmployeeById(id: string): Promise<User | undefined> {
    await delay()
    const employees = storage.get<User[]>('employees_directory', MOCK_EMPLOYEES)
    return employees.find((e) => e.id === id || e.employeeId === id)
  },

  async updateEmployee(id: string, updates: Partial<User>): Promise<User> {
    await delay()
    const employees = storage.get<User[]>('employees_directory', MOCK_EMPLOYEES)
    const index = employees.findIndex((e) => e.id === id || e.employeeId === id)
    if (index === -1) throw new Error('Employee not found')

    employees[index] = { ...employees[index], ...updates }
    storage.set('employees_directory', employees)
    return employees[index]
  },

  // --- AUDIT LOGS ---
  async getAuditLogs(): Promise<AuditLog[]> {
    await delay()
    return storage.get<AuditLog[]>('audit_logs', MOCK_AUDIT_LOGS)
  },

  async logAction(action: string, category: AuditLog['category'], details: string, actor: User): Promise<void> {
    const logs = storage.get<AuditLog[]>('audit_logs', MOCK_AUDIT_LOGS)
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      action,
      category,
      actorName: actor.name,
      actorEmail: actor.email,
      timestamp: new Date().toISOString(),
      details,
      ipAddress: '192.168.1.100',
    }
    storage.set('audit_logs', [newLog, ...logs])
  },
}
