import React, { useState } from 'react'
import { cn } from '@/utils/cn'

export interface AvatarProps {
  src?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  status?: 'active' | 'on_leave' | 'busy' | 'offline' | 'probation' | 'inactive'
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className,
  status,
}) => {
  const [imageError, setImageError] = useState(false)

  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  const statusIndicatorStyles = {
    active: 'bg-emerald-500',
    on_leave: 'bg-amber-500',
    busy: 'bg-rose-500',
    offline: 'bg-slate-400',
    probation: 'bg-blue-400',
    inactive: 'bg-slate-300',
  }

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return fullName.slice(0, 2).toUpperCase()
  }

  return (
    <div className={cn('relative inline-block shrink-0', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-semibold border border-border/80 bg-primary/10 text-primary',
          sizeStyles[size]
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-surface',
            size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
            statusIndicatorStyles[status]
          )}
        />
      )}
    </div>
  )
}
