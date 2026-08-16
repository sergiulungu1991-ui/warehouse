import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
  /** Edge-to-edge layout with tighter gutters, for data-dense pages */
  fullWidth?: boolean;
  className?: string;
};

/** Consistent page gutters and max width across the whole app */
export function PageContainer({ children, fullWidth = false, className = '' }: PageContainerProps) {
  const layout = fullWidth
    ? 'w-full px-3 py-4 sm:px-4'
    : 'mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10';

  return <div className={`${layout} ${className}`}>{children}</div>;
}
