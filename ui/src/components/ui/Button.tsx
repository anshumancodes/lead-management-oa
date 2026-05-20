'use client';

import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
}

const styles = {
  primary:   { background: 'var(--accent)',    color: '#fff',                  border: 'none' },
  secondary: { background: 'var(--surface-2)', color: 'var(--text-primary)',   border: '1px solid var(--border)' },
  danger:    { background: 'var(--danger)',     color: '#fff',                  border: 'none' },
  ghost:     { background: 'transparent',       color: 'var(--text-secondary)', border: '1px solid var(--border)' },
};

const sizes = {
  sm: { padding: '6px 12px', fontSize: '12px', height: '32px' },
  md: { padding: '8px 16px', fontSize: '14px', height: '38px' },
  lg: { padding: '10px 20px',fontSize: '15px', height: '44px' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        ...styles[variant],
        ...sizes[size],
        borderRadius: 'var(--radius)',
        fontWeight: 500,
        fontFamily: 'inherit',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.65 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : leftIcon}
      {children}
    </button>
  );
}
