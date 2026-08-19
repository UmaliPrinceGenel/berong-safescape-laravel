import * as React from 'react'
import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'relative overflow-hidden rounded-xl bg-slate-200/80 dark:bg-slate-800/80 animate-pulse transition-colors duration-200',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/30 dark:after:via-white/5 after:to-transparent',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
