import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { apiService } from '@/services/apiService'
import type { AttendanceRecord, LeaveBalance, RecognitionItem } from '@/types'
import { AttendanceCalendarWidget } from '@/features/attendance/AttendanceCalendarWidget'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatDate } from '@/utils/formatters'
import {
  Award,
  CalendarCheck,
  FileText,
  Search,
  BookOpen,
  HelpCircle,
  Newspaper,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  Sparkles,
  ArrowRight,
  Megaphone,
} from 'lucide-react'

export const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { toast } = useToast()

  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([])
  const [recognitions, setRecognitions] = useState<RecognitionItem[]>([])
  const [congratsGiven, setCongratsGiven] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchData = async () => {
      const balances = await apiService.getLeaveBalances(currentUser.employeeId)
      setLeaveBalances(balances)
      const recs = await apiService.getRecognitions()
      setRecognitions(recs)
    }
    fetchData()
  }, [currentUser])

  const handleSendCongrats = (name: string) => {
    setCongratsGiven((prev) => ({ ...prev, [name]: true }))
    toast({
      title: 'Congratulations Sent! 🎉',
      description: `Welcomed ${name} to the organization.`,
      type: 'success',
    })
  }

  return (
    <div className="space-y-6">
      {/* Search Header Bar (ZingHR inspired) */}
      <div className="relative w-full">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                navigate(`/directory?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`)
              }
            }}
            placeholder="What are you looking for ? (Search employees, leaves, payroll, policies...)"
            className="w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-4 text-xs sm:text-sm text-text-main shadow-subtle placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Top 3 Cards Row (Welcome New Employees, Rewards & Recognition, Announcements) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Welcome New Employees (ZingHR exact style) */}
        <Card className="p-5 flex flex-col justify-between hover:shadow-card transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <h3 className="font-bold text-text-main text-sm">Welcome New Employees</h3>
              <button
                onClick={() => navigate('/directory')}
                className="text-xs font-semibold text-primary hover:underline uppercase"
              >
                VIEW ALL
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-3 pb-2 text-xs font-semibold">
              <span className="text-text-muted cursor-pointer hover:text-text-main">PREVIOUS MONTH</span>
              <span className="text-primary border-b-2 border-primary pb-1 font-bold">CURRENT MONTH</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-xl bg-surface-muted border border-border/60 text-center space-y-2">
                <Avatar name="Jitesh Kumar Harishchand Prasad" size="md" className="mx-auto" />
                <div>
                  <p className="text-xs font-bold text-text-main leading-tight line-clamp-2">
                    Mr. Jitesh Kumar Harishchand Prasad
                  </p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Software Engineer</p>
                </div>
                <button
                  onClick={() => handleSendCongrats('Jitesh')}
                  disabled={congratsGiven['Jitesh']}
                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    congratsGiven['Jitesh']
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'border border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {congratsGiven['Jitesh'] ? 'Welcomed ✓' : '🎉 Congrats'}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-surface-muted border border-border/60 text-center space-y-2">
                <Avatar name="Satyam Choubey" size="md" className="mx-auto" />
                <div>
                  <p className="text-xs font-bold text-text-main leading-tight line-clamp-2">
                    Mr. Satyam Choubey
                  </p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Product Analyst</p>
                </div>
                <button
                  onClick={() => handleSendCongrats('Satyam')}
                  disabled={congratsGiven['Satyam']}
                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    congratsGiven['Satyam']
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'border border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {congratsGiven['Satyam'] ? 'Welcomed ✓' : '🎉 Congrats'}
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* 2. Rewards & Recognitions (ZingHR exact style) */}
        <Card className="p-5 flex flex-col justify-between hover:shadow-card transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <h3 className="font-bold text-text-main text-sm">Rewards & Recognitions</h3>
              <button
                onClick={() => navigate('/recognition')}
                className="text-xs font-semibold text-primary hover:underline uppercase"
              >
                GIVE A BADGE
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-subtle/50 border border-border/60 my-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-text-main block">
                    Persistence Pro badge to Shaoli Saha
                  </span>
                  <p className="text-[11px] text-text-secondary line-clamp-2 mt-0.5">
                    by Omprakash Prabhulal Parihar for "For proactively managing all HR responsibilities with ownership and dedication..."
                  </p>
                  <span className="text-[10px] text-text-muted mt-1 block">Sat Oct 10 2026</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-text-secondary">
                <button
                  onClick={() => toast({ title: 'Liked! 👍', type: 'success' })}
                  className="flex items-center gap-1.5 text-primary font-semibold hover:underline cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Like (14)
                </button>
                <span className="text-[11px] text-text-muted">+200 Points</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/recognition')}
            className="w-full text-center text-xs font-bold text-primary hover:underline pt-2 border-t border-border/60 cursor-pointer uppercase"
          >
            VIEW MORE
          </button>
        </Card>

        {/* 3. Announcements (ZingHR exact style) */}
        <Card className="p-5 flex flex-col justify-between hover:shadow-card transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/80">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-text-main text-sm">Announcement</h3>
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">
                  4
                </span>
              </div>
            </div>

            <div className="space-y-2 mt-3 text-xs">
              <h4 className="font-bold text-text-main text-xs">
                Leave & Attendance Rule note-1st April-25 onwa
              </h4>
              <p className="text-text-secondary text-[11px] leading-relaxed">
                This is to induct everyone about the leave and attendance application rules and procedure to Edit in system.
              </p>

              <div className="space-y-1.5 pt-2 text-[11px] text-text-secondary">
                <p className="font-bold text-text-main text-[11px]">LEAVE RULES</p>
                <p>• EL should be applied same day or in advance. System will allow backdated 10 days application.</p>
                <p>• EL 6 days and above must be applied 15 days in advance and approved before going on leave.</p>
              </div>
            </div>
          </div>

          <Button
            size="sm"
            variant="secondary"
            className="w-full mt-3 text-xs"
            onClick={() => navigate('/announcements')}
          >
            READ MORE
          </Button>
        </Card>
      </div>

      {/* Middle Row: ZingHR-style Interactive Monthly Attendance Calendar + Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Attendance Calendar (ZingHR "Time, Attendance & Leave" widget) */}
        <div className="lg:col-span-2">
          <AttendanceCalendarWidget />
        </div>

        {/* Quick Portal Shortcuts (ZingHR style 6 grid tiles) */}
        <div className="space-y-3">
          <h3 className="font-bold text-text-main text-sm uppercase tracking-wider text-text-muted">
            Quick Services
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/recognition')}
              className="p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-primary/50 text-left transition-all space-y-1.5 group cursor-pointer shadow-subtle"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit group-hover:scale-105 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-text-main leading-tight">Rewards & Recognition</p>
            </button>

            <button
              onClick={() => navigate('/directory')}
              className="p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-primary/50 text-left transition-all space-y-1.5 group cursor-pointer shadow-subtle"
            >
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 w-fit group-hover:scale-105 transition-transform">
                <Search className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-text-main leading-tight">Employee Search</p>
            </button>

            <button
              onClick={() => navigate('/requests')}
              className="p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-primary/50 text-left transition-all space-y-1.5 group cursor-pointer shadow-subtle"
            >
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 w-fit group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-text-main leading-tight">Help Desk</p>
            </button>

            <button
              onClick={() => navigate('/announcements')}
              className="p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-primary/50 text-left transition-all space-y-1.5 group cursor-pointer shadow-subtle"
            >
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 w-fit group-hover:scale-105 transition-transform">
                <Newspaper className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-text-main leading-tight">News & Articles</p>
            </button>

            <button
              onClick={() => navigate('/policies')}
              className="p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-primary/50 text-left transition-all space-y-1.5 group cursor-pointer shadow-subtle"
            >
              <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 w-fit group-hover:scale-105 transition-transform">
                <HelpCircle className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-text-main leading-tight">FAQs</p>
            </button>

            <button
              onClick={() => navigate('/policies')}
              className="p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-hover hover:border-primary/50 text-left transition-all space-y-1.5 group cursor-pointer shadow-subtle"
            >
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 w-fit group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-text-main leading-tight">HR Handbook</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
