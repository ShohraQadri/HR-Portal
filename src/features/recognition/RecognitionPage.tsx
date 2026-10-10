import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { apiService } from '@/services/apiService'
import type { RecognitionItem, RecognitionCategory, User } from '@/types'
import { RECOGNITION_BADGES } from '@/services/mockData'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/utils/formatters'
import {
  Award,
  Sparkles,
  Heart,
  Plus,
  Star,
  Users,
  Lightbulb,
  HeartHandshake,
  GraduationCap,
  Filter,
} from 'lucide-react'

export const RecognitionPage: React.FC = () => {
  const { currentUser } = useAuth()
  const { toast } = useToast()

  const [recognitions, setRecognitions] = useState<RecognitionItem[]>([])
  const [employees, setEmployees] = useState<User[]>([])
  const [isGiveModalOpen, setIsGiveModalOpen] = useState(false)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Form state
  const [recipientId, setRecipientId] = useState('')
  const [selectedBadgeId, setSelectedBadgeId] = useState('b-star')
  const [category, setCategory] = useState<RecognitionCategory>('Teamwork')
  const [message, setMessage] = useState('')
  const [points, setPoints] = useState(150)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = async () => {
    try {
      const recs = await apiService.getRecognitions()
      setRecognitions(recs)
      const emps = await apiService.getEmployees()
      setEmployees(emps.filter((e) => e.employeeId !== currentUser.employeeId && e.id !== currentUser.id))
      if (emps.length > 0) {
        setRecipientId(emps[0].employeeId)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [currentUser])

  const handleToggleLike = async (id: string) => {
    try {
      const updated = await apiService.toggleRecognitionLike(id)
      setRecognitions((prev) => prev.map((r) => (r.id === id ? updated : r)))
    } catch (e) {
      console.error(e)
    }
  }

  const handleGiveRecognition = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast({ title: 'Missing Message', description: 'Please write a thoughtful recognition message.', type: 'warning' })
      return
    }

    const recipient = employees.find((e) => e.employeeId === recipientId || e.id === recipientId)
    if (!recipient) {
      toast({ title: 'Recipient not found', description: 'Please choose a colleague.', type: 'error' })
      return
    }

    const badge = RECOGNITION_BADGES.find((b) => b.id === selectedBadgeId) || RECOGNITION_BADGES[0]

    setIsSubmitting(true)
    try {
      await apiService.giveRecognition({
        senderId: currentUser.employeeId,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderTitle: currentUser.title,
        receiverId: recipient.employeeId,
        receiverName: recipient.name,
        receiverAvatar: recipient.avatar,
        receiverTitle: recipient.title,
        department: recipient.department,
        category,
        badgeName: badge.name,
        badgeColor: badge.color,
        badgeIcon: badge.iconName,
        message,
        points,
      })

      toast({
        title: 'Recognition sent! 🎉',
        description: `${recipient.name} was awarded the ${badge.name} badge (+${points} pts).`,
        type: 'success',
      })
      setIsGiveModalOpen(false)
      setMessage('')
      loadData()
    } catch (err: any) {
      toast({ title: 'Failed to send', description: err.message, type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredRecognitions = recognitions.filter((r) => {
    return categoryFilter === 'all' || r.category === categoryFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Rewards & Recognition</h1>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Celebrate achievements, uplift peers, and champion organizational values
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsGiveModalOpen(true)}
        >
          Give Recognition
        </Button>
      </div>

      {/* Badges Gallery Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">
          Available Award Badges
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {RECOGNITION_BADGES.map((b) => (
            <Card key={b.id} className="p-4 text-center hover:shadow-subtle transition-all space-y-2">
              <div
                className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center text-white font-bold shadow-xs"
                style={{ backgroundColor: b.color }}
              >
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-text-main leading-tight">{b.name}</h4>
              <p className="text-[10px] text-text-secondary line-clamp-2">{b.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Feed and Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recognition Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text-main text-base">Public Recognition Stream</h3>
            <div className="w-44">
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'Teamwork', label: 'Teamwork' },
                  { value: 'Innovation', label: 'Innovation' },
                  { value: 'Leadership', label: 'Leadership' },
                  { value: 'Customer First', label: 'Customer First' },
                  { value: 'Going the Extra Mile', label: 'Going the Extra Mile' },
                ]}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredRecognitions.map((item) => (
              <Card key={item.id} className="p-6 space-y-4 hover:shadow-card transition-all">
                {/* Header: Sender and Receiver */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={item.receiverAvatar} name={item.receiverName} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-main text-sm">{item.receiverName}</span>
                        <Badge variant="lavender" size="sm">
                          {item.badgeName}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-secondary">
                        Recognized by <span className="font-semibold text-text-main">{item.senderName}</span> • {item.department}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 shrink-0">
                    +{item.points} pts
                  </span>
                </div>

                {/* Message */}
                <p className="text-xs md:text-sm text-text-main leading-relaxed bg-surface-subtle/40 p-4 rounded-xl border border-border/60 italic">
                  "{item.message}"
                </p>

                {/* Footer: Date & Like Interaction */}
                <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border/60">
                  <span>{formatDate(item.createdAt, 'MMMM dd, yyyy • hh:mm a')}</span>
                  <button
                    onClick={() => handleToggleLike(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      item.isLikedByCurrentUser
                        ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 font-semibold'
                        : 'text-text-secondary hover:text-text-main hover:bg-surface-hover'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${item.isLikedByCurrentUser ? 'fill-rose-600' : ''}`} />
                    <span>{item.likesCount} Cheers</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Monthly Highlights & Top Champions */}
        <div className="space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-text-main text-sm">Monthly Culture Leaders</h3>
            </div>
            <p className="text-xs text-text-secondary">Most recognized contributors this month</p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle/50 border border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-amber-900 font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-main">Shohra Qadri</p>
                    <span className="text-[10px] text-text-secondary">Product Design</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">650 pts</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle/50 border border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-main">Liam Chen</p>
                    <span className="text-[10px] text-text-secondary">Engineering</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">520 pts</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle/50 border border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-main">Aisha Al-Mansoor</p>
                    <span className="text-[10px] text-text-secondary">Marketing</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">480 pts</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Give Recognition Modal */}
      <Modal
        isOpen={isGiveModalOpen}
        onClose={() => setIsGiveModalOpen(false)}
        title="Give Recognition"
        description="Honor a peer with points, badge accolades, and public appreciation."
      >
        <form onSubmit={handleGiveRecognition} className="space-y-4 pt-2">
          <Select
            label="Select Colleague to Recognize"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            options={employees.map((e) => ({
              value: e.employeeId,
              label: `${e.name} (${e.title} - ${e.department})`,
            }))}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Award Badge"
              value={selectedBadgeId}
              onChange={(e) => setSelectedBadgeId(e.target.value)}
              options={RECOGNITION_BADGES.map((b) => ({ value: b.id, label: b.name }))}
            />

            <Select
              label="Core Value Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as RecognitionCategory)}
              options={[
                { value: 'Teamwork', label: 'Teamwork' },
                { value: 'Innovation', label: 'Innovation' },
                { value: 'Leadership', label: 'Leadership' },
                { value: 'Customer First', label: 'Customer First' },
                { value: 'Going the Extra Mile', label: 'Going the Extra Mile' },
              ]}
            />
          </div>

          <Textarea
            label="Appreciation Message"
            placeholder="What specific impact did this colleague create? Describe why they deserve this award..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <Select
            label="Points to Award"
            value={points.toString()}
            onChange={(e) => setPoints(Number(e.target.value))}
            options={[
              { value: '100', label: '100 Points' },
              { value: '150', label: '150 Points' },
              { value: '250', label: '250 Points' },
              { value: '500', label: '500 Points (Major Achievement)' },
            ]}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsGiveModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Send Recognition 🎉
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
