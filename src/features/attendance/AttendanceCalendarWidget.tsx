import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { apiService } from '@/services/apiService'
import type { AttendanceRecord } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { formatDate, formatTime, formatHours } from '@/utils/formatters'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  LogIn,
  LogOut,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Info,
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns'

export const AttendanceCalendarWidget: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { toast } = useToast()

  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 9, 10)) // October 2026
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null)
  const [selectedDayRecord, setSelectedDayRecord] = useState<{
    date: Date
    record?: AttendanceRecord
    type: 'present' | 'late' | 'leave' | 'holiday' | 'weekend' | 'future'
  } | null>(null)
  const [isLoadingAction, setIsLoadingAction] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Live seconds clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const loadData = async () => {
    try {
      const records = await apiService.getAttendanceRecords(currentUser.employeeId)
      setAttendanceRecords(records)
      const today = await apiService.getTodayAttendance(currentUser.employeeId)
      setTodayRecord(today)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [currentUser])

  const isCheckedIn = !!todayRecord && !todayRecord.checkOut

  const handleCheckIn = async () => {
    setIsLoadingAction(true)
    try {
      const record = await apiService.checkIn(currentUser)
      setTodayRecord(record)
      toast({
        title: 'Punch In Recorded! 🟢',
        description: `Logged in at ${formatTime(record.checkIn)}.`,
        type: 'success',
      })
      loadData()
    } catch (err: any) {
      toast({ title: 'Check-in error', description: err.message, type: 'error' })
    } finally {
      setIsLoadingAction(false)
    }
  }

  const handleCheckOut = async () => {
    setIsLoadingAction(true)
    try {
      const record = await apiService.checkOut(currentUser)
      setTodayRecord(record)
      toast({
        title: 'Punch Out Recorded! 🔴',
        description: `Logged out at ${formatTime(record.checkOut)}. Total: ${formatHours(record.totalWorkedHours)}`,
        type: 'success',
      })
      loadData()
    } catch (err: any) {
      toast({ title: 'Check-out error', description: err.message, type: 'error' })
    } finally {
      setIsLoadingAction(false)
    }
  }

  // Calendar days generation
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Determine status of each day
  const getDayInfo = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    const dayOfWeek = day.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // Specific simulated holidays in October 2026
    const isHoliday = dateStr === '2026-10-02' || dateStr === '2026-10-24'
    // Specific simulated leave in October 2026
    const isLeave = dateStr === '2026-10-20' || dateStr === '2026-10-21'

    const record = attendanceRecords.find((r) => r.date === dateStr)

    let type: 'present' | 'late' | 'leave' | 'holiday' | 'weekend' | 'future' = 'future'

    if (record) {
      type = record.status === 'late' ? 'late' : record.status === 'on_leave' ? 'leave' : 'present'
    } else if (isHoliday) {
      type = 'holiday'
    } else if (isLeave) {
      type = 'leave'
    } else if (isWeekend) {
      type = 'weekend'
    } else if (day <= new Date(2026, 9, 10)) {
      type = 'present' // fallback past working day simulation
    }

    return { type, record }
  }

  return (
    <Card className="p-6 space-y-4 hover:shadow-card transition-all">
      {/* Top Header: Matching ZingHR screenshot */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div>
          <h3 className="font-bold text-text-main text-base">Time, Attendance & Leave</h3>
          <p className="text-[11px] text-text-secondary">Monthly attendance calendar & biometric punch desk</p>
        </div>
        <button
          onClick={() => navigate('/attendance')}
          className="text-xs font-bold text-primary hover:underline uppercase tracking-wide cursor-pointer"
        >
          VIEW MORE
        </button>
      </div>

      {/* Month Navigator Header: < October 2026 > */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text-main transition-colors cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-sm font-bold text-text-main">
          {format(currentMonth, 'MMMM yyyy')}
        </span>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text-main transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 7-column Calendar Grid */}
      <div className="w-full">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-text-muted pb-2 border-b border-border/50">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Day Tiles */}
        <div className="grid grid-cols-7 gap-1 pt-2">
          {calendarDays.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isTodayDate = format(day, 'yyyy-MM-dd') === '2026-10-10' // Active date from ZingHR screenshot
            const { type, record } = getDayInfo(day)

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelectedDayRecord({ date: day, record, type })}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  !isCurrentMonth ? 'opacity-25 pointer-events-none' : 'hover:bg-surface-hover'
                }`}
              >
                {/* Date Number Pill */}
                <span
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs transition-all ${
                    isTodayDate
                      ? 'bg-primary text-white font-bold shadow-sm scale-110'
                      : type === 'leave' || type === 'holiday'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-semibold'
                      : 'text-text-main'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                {/* Status Dot underneath date (like ZingHR) */}
                <div className="mt-1 flex items-center justify-center h-1.5">
                  {type === 'present' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                  {type === 'late' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                  {(type === 'leave' || type === 'holiday') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  )}
                  {type === 'weekend' && (
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Calendar Indicators Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-border/60 text-[10px] text-text-muted">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Present
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Late
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Leave / Holiday
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" /> Today
        </span>
      </div>

      {/* Live Biometric Punch Desk Section */}
      <div className="p-4 rounded-xl bg-surface-subtle/60 border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary text-white shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-text-main flex items-center gap-2">
              <span>Live Clock: {format(currentTime, 'hh:mm:ss a')}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Status:{' '}
              <span className={isCheckedIn ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                {isCheckedIn ? 'Logged In (Shift Active)' : 'Logged Out'}
              </span>
              {todayRecord?.totalWorkedHours ? ` • ${formatHours(todayRecord.totalWorkedHours)} today` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!isCheckedIn ? (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<LogIn className="w-4 h-4" />}
              isLoading={isLoadingAction}
              onClick={handleCheckIn}
              className="w-full sm:w-auto font-bold px-4"
            >
              Punch In
            </Button>
          ) : (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<LogOut className="w-4 h-4" />}
              isLoading={isLoadingAction}
              onClick={handleCheckOut}
              className="w-full sm:w-auto font-bold px-4"
            >
              Punch Out
            </Button>
          )}
        </div>
      </div>

      {/* Day Detail Popover Modal */}
      {selectedDayRecord && (
        <Modal
          isOpen={!!selectedDayRecord}
          onClose={() => setSelectedDayRecord(null)}
          title={`Attendance on ${format(selectedDayRecord.date, 'EEEE, MMMM dd, yyyy')}`}
          description="Shift biometric details and regularization status"
        >
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-muted border border-border/60">
                <span className="text-text-muted block">First In Time</span>
                <span className="font-bold text-text-main text-sm mt-1 block">
                  {selectedDayRecord.record?.checkIn
                    ? formatTime(selectedDayRecord.record.checkIn)
                    : selectedDayRecord.type === 'present'
                    ? '08:52 AM'
                    : '--:--'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-muted border border-border/60">
                <span className="text-text-muted block">Last Out Time</span>
                <span className="font-bold text-text-main text-sm mt-1 block">
                  {selectedDayRecord.record?.checkOut
                    ? formatTime(selectedDayRecord.record.checkOut)
                    : selectedDayRecord.type === 'present'
                    ? '06:15 PM'
                    : '--:--'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-muted border border-border/60">
                <span className="text-text-muted block">Total Hours</span>
                <span className="font-bold text-primary text-sm mt-1 block">
                  {selectedDayRecord.record?.totalWorkedHours
                    ? formatHours(selectedDayRecord.record.totalWorkedHours)
                    : selectedDayRecord.type === 'present'
                    ? '8h 23m'
                    : '0h 0m'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-muted border border-border/60">
                <span className="text-text-muted block">Attendance Status</span>
                <span className="font-bold text-text-main text-sm mt-1 capitalize block">
                  {selectedDayRecord.type}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-subtle text-xs text-text-secondary flex items-start gap-2">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Shift: General (09:00 AM - 06:00 PM). Shift location: Global HQ Office.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDayRecord(null)
                  navigate('/attendance')
                }}
              >
                Go to Full Attendance Page →
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  )
}
