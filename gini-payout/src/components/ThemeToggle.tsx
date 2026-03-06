// src/components/ThemeToggle.tsx
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-xl bg-muted text-foreground transition-colors hover:bg-muted/80"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}