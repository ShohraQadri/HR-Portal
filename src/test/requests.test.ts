import { describe, it, expect, beforeEach } from 'vitest'
import { apiService } from '@/services/apiService'
import { storage } from '@/utils/storage'
import { DEMO_USERS } from '@/context/AuthContext'

describe('Service Requests & SLA Workflow', () => {
  beforeEach(() => {
    storage.clearAll()
  })

  it('creates a service request ticket with valid ticket number and SLA', async () => {
    const employee = DEMO_USERS.employee

    const ticket = await apiService.createServiceRequest({
      title: 'New Wireless Mouse for CAD Design',
      category: 'IT',
      priority: 'low',
      status: 'under_review',
      description: 'Requesting ergonomic optical mouse for precision Figma drafting.',
      submittedBy: {
        id: employee.employeeId,
        name: employee.name,
        avatar: employee.avatar,
        department: employee.department,
        email: employee.email,
      },
    })

    expect(ticket.id).toBeDefined()
    expect(ticket.ticketNumber).toMatch(/^REQ-\d+$/)
    expect(ticket.slaDueDate).toBeDefined()
    expect(ticket.comments.length).toBeGreaterThan(0)
  })

  it('allows adding conversational updates/comments to tickets', async () => {
    const employee = DEMO_USERS.employee

    const ticket = await apiService.createServiceRequest({
      title: 'Monitor Stand Replacement',
      category: 'Facilities',
      priority: 'low',
      status: 'under_review',
      description: 'Height adjustment bolt stripped.',
      submittedBy: {
        id: employee.employeeId,
        name: employee.name,
        avatar: employee.avatar,
        department: employee.department,
        email: employee.email,
      },
    })

    const updated = await apiService.addRequestComment(ticket.id, {
      authorName: 'Tyler Vance',
      authorRole: 'Facilities Lead',
      authorAvatar: '',
      content: 'Replacement arm ordered from warehouse inventory.',
    })

    expect(updated.comments.length).toBe(ticket.comments.length + 1)
    expect(updated.comments[updated.comments.length - 1].content).toContain('Replacement arm ordered')
  })
})
