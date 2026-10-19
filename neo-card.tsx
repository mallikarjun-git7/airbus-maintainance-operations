import * as React from 'react';
import { cn } from '@/lib/utils';

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'yellow' | 'green' | 'pink' | 'blue' | 'red' | 'white';
  children: React.ReactNode;
}

const variantStyles = {
  yellow: 'bg-yellow-300',
  green: 'bg-green-300',
  pink: 'bg-pink-300',
  blue: 'bg-blue-300',
  red: 'bg-red-300',
  white: 'bg-white'
};

export const NeoCard = React.forwardRef<HTMLDivElement, NeoCardProps>(
  ({ className, variant = 'white', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl border-4 border-black p-8 shadow-brutal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeoCard.displayName = 'NeoCard';

interface NeoCardIconProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const NeoCardIcon = React.forwardRef<HTMLDivElement, NeoCardIconProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-12 h-12 bg-white rounded-xl border-3 border-black flex items-center justify-center mb-6',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeoCardIcon.displayName = 'NeoCardIcon';

interface NeoCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const NeoCardTitle = React.forwardRef<HTMLHeadingElement, NeoCardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-2xl font-black text-gray-900 mb-4', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

NeoCardTitle.displayName = 'NeoCardTitle';

interface NeoCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const NeoCardDescription = React.forwardRef<HTMLParagraphElement, NeoCardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-gray-800 mb-6 leading-relaxed', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

NeoCardDescription.displayName = 'NeoCardDescription';
