import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "filled" | "tonal" | "outlined" | "text";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  full?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
};

/** Material 3 button. Never use raw color utilities on this. */
export function MButton({
  variant = "filled",
  size = "md",
  full,
  leading,
  trailing,
  children,
  className = "",
  ...rest
}: Props) {
  const base =
    "ripple inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-40 select-none";
  const sizes = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-11 px-5 text-[14px]",
    lg: "h-14 px-6 text-[15px]",
  }[size];
  const variants: Record<Variant, string> = {
    filled: "bg-primary text-primary-foreground hover:brightness-110 shadow-card",
    tonal: "bg-primary-container text-on-primary-container hover:brightness-110",
    outlined:
      "border border-border bg-transparent text-on-surface hover:bg-surface-2",
    text: "bg-transparent text-primary hover:bg-surface-2",
  };
  return (
    <button
      type="button"
      className={`${base} ${sizes} ${variants[variant]} ${full ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {leading}
      {children}
      {trailing}
    </button>
  );
}
