'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-8" />;

  const options = [
    { value: 'light',  Icon: Sun,     label: 'Light'  },
    { value: 'dark',   Icon: Moon,    label: 'Dark'   },
    { value: 'system', Icon: Monitor, label: 'System' },
  ] as const;

  const current = options.find(o => o.value === theme) ?? options[2];
  const { Icon } = current;

  const cycle = () => {
    const idx  = options.findIndex(o => o.value === theme);
    const next = options[(idx + 1) % options.length];
    setTheme(next.value);
  };

  return (
    <button
      onClick={cycle}
      title={`Switch theme (current: ${current.label})`}
      className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-150"
      style={{ color: 'var(--text-secondary)', background: 'var(--surface-2)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'; }}
    >
      <Icon size={16} />
    </button>
  );
}
