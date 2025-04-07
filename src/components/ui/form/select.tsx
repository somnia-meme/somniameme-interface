import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { FiChevronDown } from "react-icons/fi";
import clsx from "clsx";
import { Fragment } from "react";

export interface SelectOptionType {
  id: string | number;
  name?: string;
  label?: string;
  [key: string]: any;
}

const selectVariants = cva(
  "relative flex w-full items-center rounded-lg border px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-slate-700 bg-slate-900/70 text-white focus-visible:ring-[var(--primary)]",
        primary: "border-[var(--primary-dark)]/50 bg-[var(--primary-darker)]/40 text-white focus-visible:ring-[var(--primary)]",
        secondary: "border-[var(--primary-darker)]/40 bg-[var(--primary-darker)]/70 text-[var(--primary-lighter)] focus-visible:ring-[var(--primary-light)]",
        error: "border-[var(--danger)]/50 bg-[var(--danger-dark)]/40 text-[var(--danger-light)] focus-visible:ring-[var(--danger)]",
        success: "border-[var(--success)]/50 bg-[var(--success-dark)]/40 text-[var(--success-light)] focus-visible:ring-[var(--success)]",
        warning: "border-[var(--warning)]/50 bg-[var(--warning-dark)]/40 text-[var(--warning-light)] focus-visible:ring-[var(--warning)]",
        solid: "border-transparent bg-[var(--primary-dark)] text-white focus-visible:ring-[var(--primary)]",
        outline: "border-[var(--primary)]/30 bg-[var(--primary-darker)]/30 text-[var(--primary-lighter)] focus-visible:ring-[var(--primary-light)]",
        ghost: "border-transparent bg-transparent hover:bg-[var(--primary-darker)]/40 text-[var(--primary-lighter)] focus-visible:ring-[var(--primary-light)]",
      },
      selectSize: {
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
      selectSize: "md",
    },
  }
);

export interface SelectProps extends VariantProps<typeof selectVariants> {
  options: SelectOptionType[];
  value: SelectOptionType;
  onChange: (value: SelectOptionType) => void;
  className?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  optionClassName?: string;
}

export function Select({
  options,
  value,
  onChange,
  variant,
  selectSize,
  fullWidth,
  className,
  buttonClassName,
  optionsClassName,
  optionClassName,
}: SelectProps) {
  return (
    <div className={clsx("relative", className)}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton
            className={clsx(
              selectVariants({ variant, selectSize, fullWidth }),
              "flex w-full items-center justify-between",
              buttonClassName
            )}
          >
            <span className="block truncate">
              {value?.label || value?.name}
            </span>
            <FiChevronDown
              className="ml-2 h-4 w-4 text-indigo-300"
              aria-hidden="true"
            />
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className={clsx(
                "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-indigo-500/30 bg-indigo-950/90 backdrop-blur-sm py-1 shadow-lg",
                "focus:outline-none",
                optionsClassName
              )}
            >
              {options.map((option) => (
                <ListboxOption
                  key={option.id}
                  value={option}
                  className={({ active }) =>
                    clsx(
                      "relative cursor-pointer select-none px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-indigo-600/40 text-white"
                        : "text-indigo-300",
                      optionClassName
                    )
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center">
                      {option.name || option.label}
                      {selected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-400">
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
