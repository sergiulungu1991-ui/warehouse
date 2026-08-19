'use client';

import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils';
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
    <div className="space-y-1">
      <label htmlFor={id} className="block text-[11px] font-medium text-fg-muted">
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </label>

      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}

      {(error || hint) && (
        <p
          id={describedBy}
          className={cn('text-[11px]', error ? 'text-red-400' : 'text-fg-subtle')}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

const invalidClass = (invalid?: boolean) =>
  invalid ? 'border-red-800 focus:border-red-500 focus:ring-red-500/20' : '';

export function TextInput({ className = '', ...props }: ComponentProps<'input'>) {
  return (
    <input
      {...props}
      className={cn(CONTROL_CLASS, invalidClass(props['aria-invalid'] as boolean), className)}
    />
  );
}

export function Textarea({ className = '', rows = 3, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      rows={rows}
      {...props}
      className={cn(
        CONTROL_CLASS,
        'h-auto resize-y py-1.5 leading-relaxed',
        invalidClass(props['aria-invalid'] as boolean),
        className,
      )}
    />
  );
}

export function NativeSelect({ className = '', children, ...props }: ComponentProps<'select'>) {
  return (
    <select
      {...props}
      className={cn(
        CONTROL_CLASS,
        'cursor-pointer',
        invalidClass(props['aria-invalid'] as boolean),
        className,
      )}
    >
      {children}
    </select>
  );
}

/** Action bar closing a form */
export function FormActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col-reverse gap-2 border-t border-line pt-3 sm:flex-row sm:justify-end">
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
    <section className="grid gap-3 border-b border-line py-3 first:pt-0 last:border-0 lg:grid-cols-3">
      <div>
        <h2 className="text-xs font-medium text-fg">{title}</h2>
        {description && <p className="mt-0.5 text-[11px] text-fg-subtle">{description}</p>}
      </div>
      <div className="space-y-3 lg:col-span-2">{children}</div>
    </section>
  );
}
