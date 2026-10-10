import React from 'react'
import { Card } from './Card'
import { cn } from '@/utils/cn'
import { TrendingUp, TrendingDown } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  iconBg?: string
  trend?: {
    value: number | string
    isPositive?: boolean
    label?: string
  }
  badge?: React.ReactNode
  onClick?: () => void
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-primary/10 text-primary',
  trend,
  badge,
  onClick,
  className,
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-5 transition-all duration-200 hover:shadow-dropdown',
        onClick && 'cursor-pointer hover:border-primary/50',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-text-main">{value}</h3>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
        </div>
        {icon && (
          <div className={cn('p-2.5 rounded-xl shrink-0 flex items-center justify-center', iconBg)}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs pt-2 border-t border-border/50">
          <span
            className={cn(
              'flex items-center font-semibold',
              trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 mr-0.5 inline" />
            )}
            {trend.value}
          </span>
          {trend.label && <span className="text-text-muted">{trend.label}</span>}
        </div>
      )}
    </Card>
  )
}
