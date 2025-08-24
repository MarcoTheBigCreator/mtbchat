import { cn } from '@/lib';
import { cva, VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';

export const buttonVariants = cva(
  'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-violet-700 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200',
        ghost:
          'bg-transparent hover:text-slate-900 hover:bg-slate-200 dark:hover:text-gray-300 dark:hover:bg-neutral-800',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = ({
  className,
  children,
  variant,
  size,
  isLoading,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
      ) : null}
      {children}
    </button>
  );
};
