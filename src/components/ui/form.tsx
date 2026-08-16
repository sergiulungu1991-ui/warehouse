'use client';

import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';
import { CONTROL_CLASS } from './form-controls';

type FieldProps = {
  label: string;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby': string }) => ReactNode;
};

/** Label + control + hint/error, wired with the right aria attributes */
export function FormField({ label, error, hint, required, children }: FieldProps) {
  const id = useId();
  const describedBy = `${id}-description`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}

      {(error || hint) && (
        <p
          id={describedBy}
          className={`text-xs ${error ? 'text-red-600 dark:text-red-400' : 'text-zinc-500 dark:text-zinc-400'}`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

const invalidClass = (invalid?: boolean) =>
  invalid ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-800' : '';

export function TextInput({ className = '', ...props }: ComponentProps<'input'>) {
  return (
    <input
      {...props}
      className={`${CONTROL_CLASS} ${invalidClass(props['aria-invalid'] as boolean)} ${className}`}
    />
  );
}

export function Textarea({ className = '', rows = 3, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      rows={rows}
      {...props}
      className={`${CONTROL_CLASS} resize-y ${invalidClass(props['aria-invalid'] as boolean)} ${className}`}
    />
  );
}

export function NativeSelect({ className = '', children, ...props }: ComponentProps<'select'>) {
  return (
    <select
      {...props}
      className={`${CONTROL_CLASS} ${invalidClass(props['aria-invalid'] as boolean)} ${className}`}
    >
      {children}
    </select>
  );
}

/** Sticky action bar for long forms */
export function FormActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:justify-end dark:border-zinc-800">
      {children}
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-6 border-b border-zinc-200 py-6 first:pt-0 last:border-0 lg:grid-cols-3 dark:border-zinc-800">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </div>
      <div className="space-y-4 lg:col-span-2">{children}</div>
    </section>
  );
}
