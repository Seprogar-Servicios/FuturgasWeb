import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

type Props = {
  className?: string;
  lightOnDark?: boolean;
};

export default function ThemeToggle({ className = '', lightOnDark = false }: Props) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
        lightOnDark
          ? 'border-white/25 bg-white/10 text-white hover:bg-white/20'
          : 'border-theme bg-surface text-foreground hover:text-brand hover:border-brand/40'
      } ${className}`}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  );
}
