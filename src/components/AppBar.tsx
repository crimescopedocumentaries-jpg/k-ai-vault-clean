import type { ReactNode } from "react";

type Props = {
  title?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  subtitle?: string;
  large?: boolean;
};

/** Material 3 top app bar. */
export function AppBar({ title, leading, trailing, subtitle, large }: Props) {
  return (
    <header
      className={
        "sticky top-0 z-20 flex flex-col bg-background/85 backdrop-blur-md" +
        (large ? " pt-3 pb-2" : "")
      }
    >
      <div className="flex h-14 items-center gap-1 px-2">
        <div className="flex w-11 justify-center">{leading}</div>
        {!large && (
          <h1 className="flex-1 truncate text-[17px] font-medium text-on-surface">{title}</h1>
        )}
        {large && <div className="flex-1" />}
        <div className="flex items-center gap-1">{trailing}</div>
      </div>
      {large && (
        <div className="px-5 pb-3">
          <h1 className="text-[28px] font-normal leading-tight text-on-surface">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-[13px] text-on-surface-variant">{subtitle}</p>
          )}
        </div>
      )}
    </header>
  );
}
