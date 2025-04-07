import clsx from "clsx";

export function RowWrapper({
  children,
  items_center = false,
  justify_center = false,
  custom_class,
}: {
  children: React.ReactNode;
  items_center?: boolean;
  justify_center?: boolean;
  custom_class?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-row",
        items_center && "items-center",
        justify_center && "justify-center",
        custom_class
      )}
    >
      {children}
    </div>
  );
}
