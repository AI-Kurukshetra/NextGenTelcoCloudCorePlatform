"use client";

import type { ReactNode } from "react";

type Props = {
  title?: string;
  value?: string | number | ReactNode;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ChartPanel({ title, value, subtitle, badge, actions, children, className = "" }: Props) {
  return (
    <div className={`chart-panel viz-panel group ${className}`}>
      {(title || value || actions) && (
        <div className="chart-header">
          <div className="flex-1 min-w-0">
            {title && <p className="chart-title">{title}</p>}
            {(value !== undefined || badge) && (
              <div className="flex items-center gap-2 mt-0.5 flex-wrap items-baseline">
                {value !== undefined && (
                  <span className="chart-value inline-flex items-baseline gap-2 flex-wrap">{value}</span>
                )}
                {badge}
              </div>
            )}
            {subtitle && <p className="text-xs text-[var(--color-ink-dim)] mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
