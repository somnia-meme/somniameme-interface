import React, { ButtonHTMLAttributes } from "react";
import { FaSpinner } from "react-icons/fa";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const buttonVariants = cva(
  "relative inline-flex items-center cursor-pointer justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary-dark)] text-white hover:bg-[var(--primary-darker)] focus-visible:ring-[var(--primary)]",
        secondary:
          "bg-[var(--primary-darker)]/40 text-[var(--primary-lighter)] hover:bg-[var(--primary-darker)]/60 hover:text-white focus-visible:ring-[var(--primary-light)]",
        success:
          "bg-[var(--success-dark)] text-white hover:bg-[var(--success-darker)] focus-visible:ring-[var(--success)]",
        danger:
          "bg-[var(--danger)] text-white hover:bg-[var(--danger-dark)] focus-visible:ring-[var(--danger-light)]",
        warning:
          "bg-[var(--warning)] text-white hover:bg-[var(--warning-dark)] focus-visible:ring-[var(--warning-light)]",
        outline:
          "border border-[var(--primary)]/30 bg-transparent text-[var(--primary-lighter)] hover:bg-[var(--primary-darker)]/40 hover:text-white focus-visible:ring-[var(--primary-light)]",
        ghost:
          "bg-transparent text-[var(--primary-lighter)] hover:bg-[var(--primary-darker)]/40 hover:text-white focus-visible:ring-[var(--primary-light)]",
        link: "bg-transparent text-[var(--primary-light)] underline-offset-4 hover:underline focus-visible:ring-[var(--primary-light)] p-0 font-normal",
        gradient:
          "bg-gradient-to-r from-[var(--primary-dark)] to-[var(--secondary)] text-white hover:from-[var(--primary-darker)] hover:to-[var(--secondary-dark)] focus-visible:ring-[var(--secondary)]",
      },
      size: {
        xs: "h-8 px-2 text-xs",
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base",
        xl: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={clsx(
          buttonVariants({ variant, size, fullWidth, className })
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <FaSpinner className="animate-spin" />
          </span>
        )}

        <span
          className={clsx("flex items-center gap-2", loading && "invisible")}
        >
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
