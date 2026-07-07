import { NavLink } from 'react-router-dom';
import { BarChart3Icon, RabbitIcon, RadioIcon, Settings2Icon, SparklesIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

const NAV_ITEMS = [
  { to: '/', label: 'Дашборд', icon: BarChart3Icon },
  { to: '/signals', label: 'События', icon: RadioIcon },
  { to: '/model', label: 'Модель', icon: Settings2Icon },
  { to: '/worklog', label: 'AI Worklog', icon: SparklesIcon },
] as const;

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border/60 bg-sidebar/90 backdrop-blur-xl md:flex">
      <div className="border-b border-border/50 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background shadow-md">
            <RabbitIcon className="h-4 w-4" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              RabbitOps
            </p>
            <p className="text-sm font-semibold tracking-tight text-sidebar-foreground">
              Невидимые кролики
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200',
                isActive
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0 opacity-80" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-border/50 p-5">
        <p className="text-[11px] leading-relaxed text-muted-foreground/80">
          Аналитика популяции по косвенным сигналам в реальном времени
        </p>
      </div>
    </aside>
  );
}
