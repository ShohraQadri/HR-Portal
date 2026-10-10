import React, { useState } from 'react'
import { MOCK_LEARNING_COURSES } from '@/services/mockData'
import type { LearningCourse } from '@/types'
import { useToast } from '@/context/ToastContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Clock,
  Star,
  Users,
  Search,
  BookOpen,
} from 'lucide-react'

export const LearningPage: React.FC = () => {
  const { toast } = useToast()
  const [courses, setCourses] = useState<LearningCourse[]>(MOCK_LEARNING_COURSES)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handleEnrollOrResume = (course: LearningCourse) => {
    if (course.isCompleted) {
      toast({
        title: 'Course Completed! 🎓',
        description: `Certificate generated for "${course.title}".`,
        type: 'success',
      })
      return
    }

    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id
          ? { ...c, progress: Math.min(100, (c.progress || 0) + 20), isCompleted: (c.progress || 0) + 20 >= 100 }
          : c
      )
    )

    toast({
      title: 'Progress saved! 🚀',
      description: `Advancing through "${course.title}".`,
      type: 'info',
    })
  }

  const filteredCourses = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = categoryFilter === 'all' || c.category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">Learning & Development</h1>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Internal talent upskilling, mandatory compliance certifications, and leadership pathways
          </p>
        </div>

        <Badge variant="lavender" size="md">
          $1,800 Annual Learning Budget Active
        </Badge>
      </div>

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            leftIcon={<Search className="w-4 h-4" />}
            placeholder="Search training catalog by title or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Learning Disciplines' },
              { value: 'Engineering', label: 'Engineering & Architecture' },
              { value: 'Leadership', label: 'Leadership & People Ops' },
              { value: 'Security & Compliance', label: 'Security & Compliance' },
              { value: 'Productivity', label: 'Productivity & UX' },
            ]}
          />
        </div>
      </Card>

      {/* Course Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((c) => (
          <Card key={c.id} className="overflow-hidden flex flex-col justify-between hover:shadow-card transition-all">
            <div className={`h-24 bg-gradient-to-r ${c.thumbnailGradient} p-4 flex items-start justify-between text-white`}>
              <Badge variant="outline" size="sm" className="bg-black/20 text-white border-white/20">
                {c.category}
              </Badge>
              <span className="flex items-center gap-1 text-xs font-bold bg-black/20 px-2 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> {c.rating}
              </span>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-text-main text-base">{c.title}</h3>
                <p className="text-xs text-text-secondary mt-1">{c.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {c.duration}
                  </span>
                  <span>•</span>
                  <span>{c.level}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {c.enrolledCount} enrolled
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted font-medium">
                    {c.isCompleted ? 'Completed' : c.progress ? `${c.progress}% completed` : 'Not enrolled yet'}
                  </span>
                  {c.isCompleted && (
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                    </span>
                  )}
                </div>

                {c.progress !== undefined && (
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${c.isCompleted ? 'bg-emerald-500' : 'bg-primary'}`}
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                )}

                <Button
                  className="w-full mt-2"
                  variant={c.isCompleted ? 'secondary' : 'primary'}
                  size="sm"
                  leftIcon={c.isCompleted ? <BookOpen className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  onClick={() => handleEnrollOrResume(c)}
                >
                  {c.isCompleted ? 'Review Materials' : c.progress ? 'Continue Learning' : 'Enroll Now'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
