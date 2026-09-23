# Component Composition Patterns

This reference demonstrates how to compose Shadcn primitives with project-specific design tokens and dark-mode glass styling.

---

## Example 1: Composing a Glass Card with Badge and Action

```tsx
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  badgeText?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export function MetricCard({
  title,
  value,
  badgeText,
  icon,
  actionText,
  onAction,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-zinc-200/80 dark:border-blue-900/40 bg-white/90 dark:bg-[#0c162e]/80 backdrop-blur-xl p-6 shadow-sm transition-all hover:border-blue-500/40">
      <div className="flex items-center justify-between gap-3 mb-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            {icon}
          </div>
        )}
        {badgeText && (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {badgeText}
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
        {value}
      </p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>{actionText}</span>
          <span>→</span>
        </button>
      )}
    </div>
  );
}
```

---

## Example 2: Data Display with All 4 States (Loading, Empty, Error, Success)

```tsx
import React from 'react';

interface DataViewProps<T> {
  isLoading: boolean;
  error?: string | null;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyMessage?: string;
}

export function DataView<T>({
  isLoading,
  error,
  items,
  renderItem,
  onRetry,
  emptyTitle = 'No items found',
  emptyMessage = 'Get started by creating your first item.',
}: DataViewProps<T>) {
  // 1. Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-48 rounded-2xl bg-zinc-200/60 dark:bg-blue-950/30 border border-zinc-200 dark:border-blue-900/30"
          />
        ))}
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-center">
        <p className="text-sm font-semibold text-rose-800 dark:text-rose-300 mb-3">
          {error}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // 3. Empty State
  if (items.length === 0) {
    return (
      <div className="p-12 rounded-3xl border border-dashed border-zinc-300 dark:border-blue-900/60 text-center">
        <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
          {emptyTitle}
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // 4. Success State
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(renderItem)}
    </div>
  );
}
```
