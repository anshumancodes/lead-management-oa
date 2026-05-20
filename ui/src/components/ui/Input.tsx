'use client';

import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, id, style, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)', pointerEvents: 'none' }}
          >
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          style={{
            width: '100%',
            height: 38,
            padding: leftIcon ? '0 12px 0 36px' : '0 12px',
            background: 'var(--surface)',
            border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)',
            color: 'var(--text-primary)',
            fontSize: 14,
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border 0.15s',
            ...style,
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = error ? 'var(--danger)' : 'var(--accent)';
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = error ? 'var(--danger)' : 'var(--border)';
            props.onBlur?.(e);
          }}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs" style={{ color: 'var(--danger)' }}>{error}</p>
      )}
    </div>
  );
}
