import { memo } from "react";
import clsx from "clsx";
export const ContainerWrapper = memo(
  ({
    children,
    custom_class,
    isLayout = false,
  }: {
    children: React.ReactNode;
    custom_class?: string;
    isLayout?: boolean;
  }) => {
    return (
      <div
        className={clsx(
          "w-full mx-auto px-4",
          isLayout ? "max-w-screen-2xl" : "max-w-screen-xl",
          custom_class
        )}
      >
        <div className="flex flex-col gap-8">{children}</div>
      </div>
    );
  }
);
