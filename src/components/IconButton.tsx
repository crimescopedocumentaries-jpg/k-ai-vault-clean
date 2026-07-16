import type { ReactNode, ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  filled?: boolean;
  label?: string;
};

/** Material 3 icon button. Uses Material Symbols children. */
export function IconButton({ children, className = "", label, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      className={
        "ripple inline-flex h-11 w-11 items-center justify-center rounded-full text-on-surface hover:bg-surface-2 active:bg-surface-3 " +
        className
      }
      {...rest}
    >
      {children}
    </button>
  );
}

export function Symbol({
  name,
  filled,
  className = "",
  size = 24,
}: {
  name: string;
  filled?: boolean;
  className?: string;
  size?: number;
}) {
  return (
    <span
      aria-hidden
      className={"material-symbols-rounded" + (filled ? " filled" : "") + " " + className}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
}
