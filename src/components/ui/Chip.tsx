
import { cn } from '@/lib/utils';
import React from 'react';

type ChipVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface ChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  className?: string;
}

const Chip = ({ children, variant = 'default', className }: ChipProps) => {
  const variantClassMap: Record<ChipVariant, string> = {
    default: 'bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    info: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
    neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-400'
  };
  
  return (
    <span className={cn('chip', variantClassMap[variant], className)}>
      {children}
    </span>
  );
};

export default Chip;
