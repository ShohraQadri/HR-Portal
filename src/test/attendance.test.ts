import { describe, it, expect, beforeEach } from 'vitest'
import { apiService } from '@/services/apiService'
import { storage } from '@/utils/storage'
import { DEMO_USERS } from '@/context/AuthContext'

describe('Attendance Management Workflow', () => {
  beforeEach(() => {
    storage.clearAll()
    // Explicitly seed empty attendance records for clean test isolation
    storage.set('attendance_records', [])
  })

  it('allows employee to check in and records timestamp', async () => {
    const employee = DEMO_USERS.employee
    const record = await apiService.checkIn(employee)

    expect(record).toBeDefined()
    expect(record.employeeId).toBe(employee.employeeId)
    expect(record.checkIn).toBeDefined()
    expect(record.checkOut).toBeUndefined()
    expect(['present', 'late']).toContain(record.status)
  })

  it('prevents duplicate check-in without checking out first', async () => {
    const employee = DEMO_USERS.employee
    await apiService.checkIn(employee)

    await expect(apiService.checkIn(employee)).rejects.toThrow(
      'You are already checked in for today!'
    )
  })

  it('allows employee to check out and calculates duration', async () => {
    const employee = DEMO_USERS.employee
    await apiService.checkIn(employee)

    const checkedOut = await apiService.checkOut(employee)
    expect(checkedOut.checkOut).toBeDefined()
    expect(checkedOut.totalWorkedHours).toBeGreaterThan(0)
  })

  it('prevents check-out if no check-in exists for today', async () => {
    const newEmp = { ...DEMO_USERS.employee, employeeId: 'EMP-9999' }
    await expect(apiService.checkOut(newEmp)).rejects.toThrow(
      'No active check-in found for today'
    )
  })
})
