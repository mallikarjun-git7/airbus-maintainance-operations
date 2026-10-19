import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const neoButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all disabled:pointer-events-none disabled:opacity-50 border-3 border-black',
  {
    variants: {
      variant: {
        default: 'bg-green-400 text-black shadow-brutal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1',
        yellow: 'bg-yellow-400 text-black shadow-brutal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1',
        pink: 'bg-pink-400 text-black shadow-brutal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1',
        blue: 'bg-blue-400 text-black shadow-brutal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1',
        white: 'bg-white text-black shadow-brutal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1',
        black: 'bg-black text-white shadow-brutal hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 px-4 py-2',
        lg: 'h-12 px-8 py-3',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface NeoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neoButtonVariants> {
  asChild?: boolean;
}

const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(neoButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

NeoButton.displayName = 'NeoButton';

export { NeoButton, neoButtonVariants };
