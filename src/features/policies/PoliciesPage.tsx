import React, { useState } from 'react'
import { MOCK_POLICIES } from '@/services/mockData'
import type { PolicyArticle } from '@/types'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/utils/formatters'
import {
  BookOpen,
  Search,
  Clock,
  Shield,
  ChevronRight,
  FileText,
} from 'lucide-react'

export const PoliciesPage: React.FC = () => {
  const [policies] = useState<PolicyArticle[]>(MOCK_POLICIES)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<PolicyArticle | null>(policies[0])

  const filtered = policies.filter((p) => {
    return (
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main">Company Policies & Knowledge Base</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-0.5">
          Official guidelines on hybrid work, code of conduct, leaves, wellness benefits, and IT security
        </p>
      </div>

      {/* Search Input */}
      <Card className="p-4">
        <Input
          leftIcon={<Search className="w-4 h-4" />}
          placeholder="Search corporate handbook by keyword (e.g. stipend, carry forward, hybrid hours)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policy Articles List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Directory of Policies ({filtered.length})
          </h3>
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-muted border rounded-xl">
              No matching policies found.
            </div>
          ) : (
            filtered.map((item) => (
              <Card
                key={item.id}
                className={`p-4 hover:shadow-subtle transition-all cursor-pointer ${
                  selectedArticle?.id === item.id ? 'border-primary ring-2 ring-primary/20 bg-surface-subtle/30' : ''
                }`}
                onClick={() => setSelectedArticle(item)}
              >
                <div className="flex items-center justify-between">
                  <Badge variant="lavender" size="sm">
                    {item.category}
                  </Badge>
                  <span className="text-[10px] text-text-muted">{item.readTime}</span>
                </div>
                <h4 className="text-xs font-bold text-text-main mt-2 leading-snug">{item.title}</h4>
                <span className="text-[10px] text-text-muted block mt-1">
                  Updated: {formatDate(item.lastUpdated)}
                </span>
              </Card>
            ))
          )}
        </div>

        {/* Selected Article Detail View */}
        <div className="lg:col-span-2">
          {selectedArticle ? (
            <Card className="p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="lavender" size="sm">
                    {selectedArticle.category}
                  </Badge>
                  <span className="text-xs text-text-muted">• {selectedArticle.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-text-main tracking-tight">
                  {selectedArticle.title}
                </h2>
                <p className="text-xs text-text-muted mt-1">
                  Approved by People Operations • Last verified on {formatDate(selectedArticle.lastUpdated)}
                </p>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none text-xs md:text-sm text-text-secondary leading-relaxed space-y-4 pt-4 border-t border-border/80">
                <p>{selectedArticle.content}</p>
                <div className="p-4 rounded-xl bg-surface-subtle border border-border/60">
                  <h4 className="font-semibold text-text-main text-xs flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Compliance & Employee Acknowledgment
                  </h4>
                  <p className="text-[11px] text-text-secondary mt-1">
                    All full-time and contract personnel are expected to uphold this code of conduct. For exceptions, contact the People Operations desk.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-xs text-text-muted">
              Select an article to review handbook guidelines.
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
