import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { apiService } from '@/services/apiService'
import type { ServiceRequest, RequestCategory, RequestPriority } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate, getStatusBadgeVariant } from '@/utils/formatters'
import {
  FileText,
  Plus,
  Search,
  MessageSquare,
  Clock,
  Send,
  AlertCircle,
  CheckCircle2,
  Filter,
} from 'lucide-react'

export const RequestsPage: React.FC = () => {
  const { currentUser, isRole } = useAuth()
  const { toast } = useToast()

  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<ServiceRequest | null>(null)
  const [commentText, setCommentText] = useState('')

  // Filter
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Form
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<RequestCategory>('IT')
  const [priority, setPriority] = useState<RequestPriority>('medium')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadRequests = async () => {
    try {
      const data = await apiService.getServiceRequests(
        isRole(['manager', 'admin']) ? undefined : currentUser.employeeId
      )
      setRequests(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [currentUser])

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      toast({ title: 'Missing details', description: 'Please provide both a title and description.', type: 'warning' })
      return
    }

    setIsSubmitting(true)
    try {
      const created = await apiService.createServiceRequest({
        title,
        category,
        priority,
        status: 'under_review',
        description,
        submittedBy: {
          id: currentUser.employeeId,
          name: currentUser.name,
          avatar: currentUser.avatar,
          department: currentUser.department,
          email: currentUser.email,
        },
      })

      toast({
        title: `Ticket ${created.ticketNumber} created! 🎫`,
        description: 'Assigned to triage team with 3-day SLA guarantee.',
        type: 'success',
      })
      setIsCreateModalOpen(false)
      setTitle('')
      setDescription('')
      loadRequests()
    } catch (err: any) {
      toast({ title: 'Failed to create', description: err.message, type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket || !commentText.trim()) return

    try {
      const updated = await apiService.addRequestComment(selectedTicket.id, {
        authorName: currentUser.name,
        authorRole: currentUser.title,
        authorAvatar: currentUser.avatar,
        content: commentText,
      })
      setSelectedTicket(updated)
      setCommentText('')
      loadRequests()
      toast({ title: 'Comment posted', type: 'success' })
    } catch (err: any) {
      toast({ title: 'Failed to post comment', description: err.message, type: 'error' })
    }
  }

  const filteredRequests = requests.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = categoryFilter === 'all' || r.category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Employee Service Requests</h1>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Submit IT hardware, HR letters, facilities, and workplace administrative tickets
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          New Ticket
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            leftIcon={<Search className="w-4 h-4" />}
            placeholder="Search by ticket # or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'IT', label: 'IT Support & Hardware' },
              { value: 'HR', label: 'HR Letters & Payroll' },
              { value: 'Facilities', label: 'Facilities & Badges' },
              { value: 'Finance', label: 'Finance & Reimbursements' },
            ]}
          />

          <div className="flex items-center justify-end text-xs font-semibold text-primary px-2">
            {filteredRequests.length} Active Tickets Found
          </div>
        </div>
      </Card>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredRequests.map((ticket) => {
          const badge = getStatusBadgeVariant(ticket.status)
          return (
            <Card
              key={ticket.id}
              className="p-5 hover:shadow-dropdown transition-all cursor-pointer hover:border-primary/50"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-xs">{ticket.ticketNumber}</span>
                    <Badge variant="lavender" size="sm">
                      {ticket.category}
                    </Badge>
                    <Badge
                      variant={ticket.priority === 'high' ? 'error' : ticket.priority === 'medium' ? 'warning' : 'default'}
                      size="sm"
                    >
                      {ticket.priority} priority
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-text-main hover:text-primary transition-colors">
                    {ticket.title}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-1">{ticket.description}</p>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center shrink-0 text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${badge.bg}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-text-muted mt-1">
                    SLA Due: {formatDate(ticket.slaDueDate)}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
                <span>Submitted by: {ticket.submittedBy.name}</span>
                <span className="flex items-center gap-1 font-medium text-text-secondary">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" /> {ticket.comments.length} updates
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Submit Service Request"
        description="Describe your request and choose the appropriate category."
      >
        <form onSubmit={handleCreateRequest} className="space-y-4 pt-2">
          <Input
            label="Ticket Subject"
            placeholder="e.g. Ergonomic chair request, Employment verification..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as RequestCategory)}
              options={[
                { value: 'IT', label: 'IT Support & Hardware' },
                { value: 'HR', label: 'HR & Personnel' },
                { value: 'Facilities', label: 'Facilities & Workplace' },
                { value: 'Finance', label: 'Finance & Accounts' },
                { value: 'General', label: 'General Administrative' },
              ]}
            />

            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as RequestPriority)}
              options={[
                { value: 'low', label: 'Low (General non-blocking)' },
                { value: 'medium', label: 'Medium (Standard SLA)' },
                { value: 'high', label: 'High (Immediate attention)' },
              ]}
            />
          </div>

          <Textarea
            label="Detailed Description"
            placeholder="Provide context, required hardware specifications, address, or urgency..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Create Ticket
            </Button>
          </div>
        </form>
      </Modal>

      {/* Ticket Details & Comments Modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket ${selectedTicket.ticketNumber}`}
          description={`Created on ${formatDate(selectedTicket.createdAt)}`}
          maxWidth="lg"
        >
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="lavender" size="sm">
                  {selectedTicket.category}
                </Badge>
                <Badge variant="warning" size="sm">
                  {selectedTicket.priority}
                </Badge>
                <span className="text-xs font-bold text-text-main ml-auto capitalize">
                  Status: {selectedTicket.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-base font-bold text-text-main">{selectedTicket.title}</h3>
              <p className="text-xs text-text-secondary mt-1">{selectedTicket.description}</p>
            </div>

            {/* SLA Bar */}
            <div className="p-3 rounded-xl bg-surface-subtle border border-border/60 flex items-center justify-between text-xs">
              <span className="text-text-secondary font-medium">SLA Resolution Target:</span>
              <span className="font-bold text-emerald-600">{formatDate(selectedTicket.slaDueDate)}</span>
            </div>

            {/* Conversation / Comments Timeline */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Activity & Updates ({selectedTicket.comments.length})
              </h4>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {selectedTicket.comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-surface-muted border border-border/60 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-main">{c.authorName} ({c.authorRole})</span>
                      <span className="text-[10px] text-text-muted">{formatDate(c.timestamp)}</span>
                    </div>
                    <p className="text-xs text-text-secondary">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Input */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
              <Input
                placeholder="Write a message or provide clarification..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="text-xs"
              />
              <Button type="submit" variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
                Reply
              </Button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  )
}
