
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface MotionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  className?: string;
}

const MotionCard = ({
  children,
  hoverEffect = true,
  className,
  ...props
}: MotionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={cn(
        'glass-panel rounded-2xl p-6 animate-slide-up',
        hoverEffect && 'hover:translate-y-[-2px] smooth-transition',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
};

export default MotionCard;
