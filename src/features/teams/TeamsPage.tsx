import React, { useState } from 'react'
import { MOCK_DEPARTMENTS, MOCK_EMPLOYEES } from '@/services/mockData'
import type { Department } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Building2, Users, DollarSign, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const TeamsPage: React.FC = () => {
  const navigate = useNavigate()
  const [departments] = useState<Department[]>(MOCK_DEPARTMENTS)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main">Teams & Departments</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-0.5">
          Organizational structure, division leads, headcount allocation, and budget codes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const members = MOCK_EMPLOYEES.filter((e) => e.department.includes(dept.name) || dept.name.includes(e.department))
          return (
            <Card key={dept.id} className="p-6 space-y-4 hover:shadow-card transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="lavender" size="sm">
                    {dept.budgetCode}
                  </Badge>
                  <span className="text-xs font-bold text-text-main">{dept.employeeCount} Members</span>
                </div>

                <h3 className="text-base font-bold text-text-main mt-3">{dept.name}</h3>
                <p className="text-xs text-text-secondary mt-0.5">Division Lead: <span className="font-semibold text-text-main">{dept.leadName}</span></p>

                {/* Team Avatars */}
                <div className="mt-4 pt-3 border-t border-border/60">
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-2">
                    Key Contributors
                  </span>
                  <div className="flex items-center -space-x-2">
                    {members.slice(0, 4).map((m) => (
                      <Avatar key={m.id} src={m.avatar} name={m.name} size="sm" className="ring-2 ring-surface" />
                    ))}
                    {dept.employeeCount > 4 && (
                      <div className="w-8 h-8 rounded-full bg-surface-subtle text-primary border border-border flex items-center justify-center text-[10px] font-bold">
                        +{dept.employeeCount - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/directory?q=${encodeURIComponent(dept.name)}`)}
                className="w-full text-xs font-semibold text-primary hover:underline pt-3 border-t border-border/60 flex items-center justify-between cursor-pointer"
              >
                <span>View Department Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
