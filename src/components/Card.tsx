import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padded?: boolean;
  elevated?: boolean;
  as?: "div" | "button";
  onClick?: () => void;
};

/** Material 3 filled card. */
export function Card({
  children,
  padded = true,
  elevated,
  className = "",
  as = "div",
  ...rest
}: Props) {
  const Cmp = as as "div";
  return (
    <Cmp
      className={
        "rounded-3xl bg-surface-1 text-card-foreground " +
        (padded ? "p-5 " : "") +
        (elevated ? "shadow-elevated " : "shadow-card ") +
        (as === "button" ? "ripple text-left w-full " : "") +
        className
      }
      {...rest}
    >
      {children}
    </Cmp>
  );
}
