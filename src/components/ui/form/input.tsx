import React, { InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const inputVariants = cva(
  "flex w-full rounded-lg border px-3 py-2 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-slate-700 bg-slate-900/70 text-white focus-visible:ring-[var(--primary)]",
        primary:
          "border-[var(--primary-dark)]/50 bg-[var(--primary-darker)]/40 text-white focus-visible:ring-[var(--primary)]",
        secondary:
          "border-[var(--primary-darker)]/40 bg-[var(--primary-darker)]/70 text-[var(--primary-lighter)] focus-visible:ring-[var(--primary-light)]",
        error:
          "border-[var(--danger)]/50 bg-[var(--danger-dark)]/40 text-[var(--danger-light)] focus-visible:ring-[var(--danger)]",
        success:
          "border-[var(--success)]/50 bg-[var(--success-dark)]/40 text-[var(--success-light)] focus-visible:ring-[var(--success)]",
        warning:
          "border-[var(--warning)]/50 bg-[var(--warning-dark)]/40 text-[var(--warning-light)] focus-visible:ring-[var(--warning)]",
        solid:
          "border-transparent bg-[var(--primary-dark)] text-white placeholder:text-[var(--primary-lighter)]/70 focus-visible:ring-[var(--primary)]",
        outline:
          "border-[var(--primary)]/30 bg-[var(--primary-darker)]/30 text-[var(--primary-lighter)] focus-visible:ring-[var(--primary-light)]",
        ghost:
          "border-transparent bg-transparent hover:bg-[var(--primary-darker)]/40 text-[var(--primary-lighter)] focus-visible:ring-[var(--primary-light)] focus-visible:bg-[var(--primary-darker)]/40",
      },
      inputSize: {
        xs: "h-8 text-xs",
        sm: "h-9 text-sm",
        md: "h-10 text-sm",
        lg: "h-11 text-base",
        xl: "h-12 text-lg",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      fullWidth,
      error,
      disabled,
      leftElement,
      rightElement,
      ...props
    },
    ref
  ) => {
    const inputVariant = error ? "error" : variant;
    
    return (
      <div className="relative w-full">
        {leftElement && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            {leftElement}
          </div>
        )}
        <input
          className={clsx(
            inputVariants({ variant: inputVariant, inputSize, fullWidth, className }),
            leftElement && "pl-10",
            rightElement && "pr-10"
          )}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants }; 