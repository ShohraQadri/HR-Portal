import React, { useState } from 'react'
import { MOCK_RECRUITMENT_JOBS } from '@/services/mockData'
import type { RecruitmentJob } from '@/types'
import { useToast } from '@/context/ToastContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatDate } from '@/utils/formatters'
import {
  Briefcase,
  Users,
  MapPin,
  Calendar,
  Plus,
  ArrowRight,
  UserCheck,
  Check,
} from 'lucide-react'

export const RecruitmentPage: React.FC = () => {
  const { toast } = useToast()
  const [jobs, setJobs] = useState<RecruitmentJob[]>(MOCK_RECRUITMENT_JOBS)
  const [selectedJob, setSelectedJob] = useState<RecruitmentJob | null>(null)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [candidateName, setCandidateName] = useState('Alex Rivers')
  const [interviewTime, setInterviewTime] = useState('2026-10-15T14:00')

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: 'Interview scheduled! 📅',
      description: `Meeting invite sent to ${candidateName} and panel.`,
      type: 'success',
    })
    setIsScheduleModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Recruitment & Talent Acquisition</h1>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Active requisitions, candidate pipeline Kanban, and interviewer schedules
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            toast({ title: 'New Requisition', description: 'Requisition drafting opened.', type: 'info' })
          }}
        >
          Post New Job Opening
        </Button>
      </div>

      {/* Active Requisitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className={`p-5 space-y-4 hover:shadow-card transition-all cursor-pointer ${
              selectedJob?.id === job.id ? 'ring-2 ring-primary border-primary' : ''
            }`}
            onClick={() => setSelectedJob(job)}
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge variant={job.status === 'Open' ? 'success' : 'warning'} size="sm">
                  {job.status}
                </Badge>
                <span className="text-xs font-bold text-primary">{job.applicantCount} Applicants</span>
              </div>
              <h3 className="text-sm font-bold text-text-main mt-2 leading-tight">{job.title}</h3>
              <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                <span>{job.department}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3" /> {job.location}
                </span>
              </div>
            </div>

            {/* Pipeline Stage Bar */}
            <div className="space-y-1.5 pt-2 border-t border-border/60">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                Hiring Funnel
              </span>
              <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-semibold">
                <div className="p-1.5 rounded-lg bg-surface-subtle text-text-main">
                  <div>{job.pipeline.applied}</div>
                  <div className="text-[9px] text-text-muted truncate">Applied</div>
                </div>
                <div className="p-1.5 rounded-lg bg-surface-subtle text-text-main">
                  <div>{job.pipeline.screening}</div>
                  <div className="text-[9px] text-text-muted truncate">Screen</div>
                </div>
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <div>{job.pipeline.interview}</div>
                  <div className="text-[9px] truncate">Interview</div>
                </div>
                <div className="p-1.5 rounded-lg bg-surface-subtle text-text-main">
                  <div>{job.pipeline.offer}</div>
                  <div className="text-[9px] text-text-muted truncate">Offer</div>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700">
                  <div>{job.pipeline.hired}</div>
                  <div className="text-[9px] truncate">Hired</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Candidate Queue and Interview Scheduler */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div>
            <h3 className="font-semibold text-text-main text-base">Candidate Interview Pipeline</h3>
            <p className="text-xs text-text-secondary">
              Active candidates undergoing technical and executive panels
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            leftIcon={<Calendar className="w-4 h-4 text-primary" />}
            onClick={() => setIsScheduleModalOpen(true)}
          >
            Schedule Interview
          </Button>
        </div>

        <div className="divide-y divide-border/60 mt-2">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-text-main text-sm">Alex Rivers</span>
                <Badge variant="lavender" size="sm">
                  Technical Architecture Round
                </Badge>
              </div>
              <p className="text-text-secondary">Staff Frontend Engineer candidate • 9+ yrs exp</p>
              <span className="text-[11px] text-text-muted">Interviewer: Devon Miles • Tomorrow at 2:00 PM EST</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => toast({ title: 'Feedback Form', description: 'Opening scorecard...', type: 'info' })}>
                View Scorecard
              </Button>
              <Button size="sm" variant="primary" onClick={() => toast({ title: 'Stage advanced', description: 'Moved candidate to Offer stage.', type: 'success' })}>
                Advance Stage →
              </Button>
            </div>
          </div>

          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-text-main text-sm">Maya Lin</span>
                <Badge variant="warning" size="sm">
                  Culture & Leadership Interview
                </Badge>
              </div>
              <p className="text-text-secondary">Senior Product Manager candidate • ex-Fintech Lead</p>
              <span className="text-[11px] text-text-muted">Interviewer: Elena Rostova • Oct 16 at 11:30 AM EST</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => toast({ title: 'Scorecard', description: 'Opening scorecard...', type: 'info' })}>
                View Scorecard
              </Button>
              <Button size="sm" variant="primary" onClick={() => toast({ title: 'Stage advanced', description: 'Moved candidate to Offer stage.', type: 'success' })}>
                Advance Stage →
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Schedule Candidate Panel"
        description="Book technical or executive interview with Google Meet / Zoom link."
      >
        <form onSubmit={handleScheduleInterview} className="space-y-4 pt-2">
          <Input
            label="Candidate Name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            required
          />

          <Input
            label="Date & Time"
            type="datetime-local"
            value={interviewTime}
            onChange={(e) => setInterviewTime(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Invitations
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
