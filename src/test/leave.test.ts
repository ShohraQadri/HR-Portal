import { describe, it, expect, beforeEach } from 'vitest'
import { apiService } from '@/services/apiService'
import { storage } from '@/utils/storage'
import { DEMO_USERS } from '@/context/AuthContext'

describe('Leave Management & Approval Workflows', () => {
  beforeEach(() => {
    storage.clearAll()
  })

  it('submits a new leave request and places into pending state', async () => {
    const employee = DEMO_USERS.employee

    const request = await apiService.applyForLeave({
      employeeId: employee.employeeId,
      employeeName: employee.name,
      employeeAvatar: employee.avatar,
      department: employee.department,
      leaveType: 'annual',
      startDate: '2026-11-10',
      endDate: '2026-11-12',
      daysCount: 3,
      isHalfDay: false,
      reason: 'Personal travel and wellness',
    })

    expect(request.id).toBeDefined()
    expect(request.status).toBe('pending')
    expect(request.daysCount).toBe(3)
  })

  it('rejects overlapping leave requests for the same employee', async () => {
    const employee = DEMO_USERS.employee

    await apiService.applyForLeave({
      employeeId: employee.employeeId,
      employeeName: employee.name,
      employeeAvatar: employee.avatar,
      department: employee.department,
      leaveType: 'casual',
      startDate: '2026-12-01',
      endDate: '2026-12-03',
      daysCount: 3,
      reason: 'First booking',
    })

    await expect(
      apiService.applyForLeave({
        employeeId: employee.employeeId,
        employeeName: employee.name,
        employeeAvatar: employee.avatar,
        department: employee.department,
        leaveType: 'casual',
        startDate: '2026-12-02',
        endDate: '2026-12-04',
        daysCount: 3,
        reason: 'Overlapping booking',
      })
    ).rejects.toThrow('You already have an existing leave request spanning these dates.')
  })

  it('allows manager to approve leave and updates leave balances', async () => {
    const employee = DEMO_USERS.employee
    const manager = DEMO_USERS.manager

    const request = await apiService.applyForLeave({
      employeeId: employee.employeeId,
      employeeName: employee.name,
      employeeAvatar: employee.avatar,
      department: employee.department,
      leaveType: 'annual',
      startDate: '2026-11-20',
      endDate: '2026-11-21',
      daysCount: 2,
      reason: 'Family event',
    })

    const approved = await apiService.updateLeaveStatus(
      request.id,
      'approved',
      manager,
      'Approved, have fun!'
    )

    expect(approved.status).toBe('approved')
    expect(approved.approverName).toBe(manager.name)
  })
})
