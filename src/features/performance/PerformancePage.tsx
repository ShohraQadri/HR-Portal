import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { MOCK_PERFORMANCE_GOALS, MOCK_REVIEW_CYCLE } from '@/services/mockData'
import type { PerformanceGoal } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { formatDate } from '@/utils/formatters'
import {
  TrendingUp,
  Target,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  Plus,
  Edit2,
} from 'lucide-react'

export const PerformancePage: React.FC = () => {
  const { currentUser, isRole } = useAuth()
  const { toast } = useToast()

  const [goals, setGoals] = useState<PerformanceGoal[]>(MOCK_PERFORMANCE_GOALS)
  const [reviewCycle, setReviewCycle] = useState(MOCK_REVIEW_CYCLE)
  const [isSelfReviewModalOpen, setIsSelfReviewModalOpen] = useState(false)
  const [selfFeedback, setSelfFeedback] = useState(reviewCycle.selfFeedback || '')

  const handleSaveSelfReview = (e: React.FormEvent) => {
    e.preventDefault()
    setReviewCycle((prev) => ({
      ...prev,
      selfReviewStatus: 'completed',
      selfFeedback,
    }))
    setIsSelfReviewModalOpen(false)
    toast({ title: 'Self-Review Submitted! 🌟', description: 'Forwarded to Marcus Vance for evaluation.', type: 'success' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Performance & Goals</h1>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Quarterly OKRs, progress milestones, continuous peer feedback, and annual review cycles
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Edit2 className="w-4 h-4" />}
          onClick={() => setIsSelfReviewModalOpen(true)}
        >
          {reviewCycle.selfReviewStatus === 'completed' ? 'Edit Self-Review' : 'Complete Self-Review'}
        </Button>
      </div>

      {/* Review Cycle Banner Card */}
      <Card className="p-6 bg-surface border-l-4 border-l-primary">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {reviewCycle.period}
              </span>
              <span className="text-text-muted">•</span>
              <span className="text-xs text-text-secondary">Due by {formatDate(reviewCycle.dueDate)}</span>
            </div>
            <h2 className="text-xl font-bold text-text-main mt-1">{reviewCycle.title}</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Comprehensive annual 360 review evaluating execution, culture leadership, and team collaboration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-text-muted block">Self-Review</span>
              <Badge variant={reviewCycle.selfReviewStatus === 'completed' ? 'success' : 'warning'} size="sm">
                {reviewCycle.selfReviewStatus}
              </Badge>
            </div>
            <div className="text-right">
              <span className="text-xs text-text-muted block">Manager Review</span>
              <Badge variant={reviewCycle.managerReviewStatus === 'completed' ? 'success' : 'warning'} size="sm">
                {reviewCycle.managerReviewStatus}
              </Badge>
            </div>
            {reviewCycle.overallRating && (
              <div className="p-3 rounded-xl bg-primary/10 text-primary font-bold text-lg text-center">
                ★ {reviewCycle.overallRating} / 5.0
              </div>
            )}
          </div>
        </div>

        {/* Existing Feedback Excerpts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/80 text-xs">
          <div className="p-4 rounded-xl bg-surface-subtle/50 border border-border/60 space-y-1">
            <span className="font-bold text-text-main">Employee Self-Assessment:</span>
            <p className="text-text-secondary italic">"{reviewCycle.selfFeedback}"</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-subtle/50 border border-border/60 space-y-1">
            <span className="font-bold text-text-main">Manager Reviewer Notes (Marcus Vance):</span>
            <p className="text-text-secondary italic">"{reviewCycle.managerFeedback}"</p>
          </div>
        </div>
      </Card>

      {/* Goals & Objectives Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-text-main">Active OKRs & Deliverables</h3>
            <p className="text-xs text-text-secondary">Key results measured across the 2026 talent cycle</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => (
            <Card key={g.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="lavender" size="sm">
                    {g.category}
                  </Badge>
                  <h4 className="text-sm font-bold text-text-main mt-1.5">{g.title}</h4>
                </div>
                <Badge variant={g.status === 'on_track' ? 'success' : 'warning'} size="sm">
                  {g.status.replace('_', ' ')}
                </Badge>
              </div>

              <p className="text-xs text-text-secondary">{g.metric}</p>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Target: {formatDate(g.targetDate)}</span>
                  <span className="font-bold text-primary">{g.progress}% Complete</span>
                </div>
                <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${g.progress}%` }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Self-Review Modal */}
      <Modal
        isOpen={isSelfReviewModalOpen}
        onClose={() => setIsSelfReviewModalOpen(false)}
        title="Complete Annual Self-Review"
        description="Share accomplishments, areas of professional growth, and aspirations."
      >
        <form onSubmit={handleSaveSelfReview} className="space-y-4 pt-2">
          <Textarea
            label="Key Accomplishments & Impact"
            placeholder="Highlight major milestones achieved this cycle, challenges overcome, and customer or product impact..."
            value={selfFeedback}
            onChange={(e) => setSelfFeedback(e.target.value)}
            required
            className="min-h-[140px]"
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsSelfReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
