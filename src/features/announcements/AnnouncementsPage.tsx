import React, { useState } from 'react'
import { MOCK_ANNOUNCEMENTS } from '@/services/mockData'
import type { Announcement } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/utils/formatters'
import {
  Megaphone,
  Pin,
  Calendar,
  Gift,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react'

export const AnnouncementsPage: React.FC = () => {
  const [announcements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main">Announcements & Workplace Calendar</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-0.5">
          Corporate broadcasts, upcoming company holidays, milestones, and celebration events
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Announcements List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">
            Company Communications
          </h2>

          <div className="space-y-4">
            {announcements.map((a) => (
              <Card
                key={a.id}
                className="p-6 space-y-3 hover:shadow-card transition-all cursor-pointer"
                onClick={() => setSelectedAnnouncement(a)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {a.isPinned && (
                      <Badge variant="lavender" size="sm" className="gap-1">
                        <Pin className="w-3 h-3 inline" /> Pinned
                      </Badge>
                    )}
                    <Badge variant="outline" size="sm">
                      {a.category}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-text-muted">{formatDate(a.publishedAt)}</span>
                </div>

                <h3 className="text-base font-bold text-text-main leading-snug">{a.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{a.summary}</p>

                <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs text-text-muted">
                  <span>Author: {a.author} ({a.authorRole})</span>
                  <span className="text-primary font-semibold">Read Full Message →</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Company Calendar & Celebrations */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-text-main text-sm">2026 Company Holidays</h3>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-surface-subtle/50 border border-border/60 flex items-center justify-between">
                <div>
                  <p className="font-bold text-text-main">Diwali / Fall Holiday</p>
                  <span className="text-[11px] text-text-secondary">All Office Locations</span>
                </div>
                <span className="font-semibold text-primary">Oct 24</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle/50 border border-border/60 flex items-center justify-between">
                <div>
                  <p className="font-bold text-text-main">Thanksgiving Holiday</p>
                  <span className="text-[11px] text-text-secondary">Thursday - Friday</span>
                </div>
                <span className="font-semibold text-primary">Nov 26 - 27</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle/50 border border-border/60 flex items-center justify-between">
                <div>
                  <p className="font-bold text-text-main">Winter Holiday Break</p>
                  <span className="text-[11px] text-text-secondary">Year-End Close</span>
                </div>
                <span className="font-semibold text-primary">Dec 25 - Jan 01</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-text-main text-sm">Team Birthdays This Month</h3>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-muted border border-border/60">
                <span className="font-semibold text-text-main">Liam Chen</span>
                <span className="text-text-muted">October 11 (Tomorrow)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-muted border border-border/60">
                <span className="font-semibold text-text-main">Devon Miles</span>
                <span className="text-text-muted">October 19</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-muted border border-border/60">
                <span className="font-semibold text-text-main">Chloe Bennett</span>
                <span className="text-text-muted">October 28</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
