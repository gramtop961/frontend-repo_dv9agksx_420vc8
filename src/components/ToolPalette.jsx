import { Wrench } from 'lucide-react';

export default function ToolPalette({ tools }) {
  return (
    <div className="hidden lg:block w-72 shrink-0 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="p-4 flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold">
        <Wrench size={18} className="text-indigo-600" /> Tools
      </div>
      <ul className="px-4 pb-4 space-y-2">
        {tools.map((t) => (
          <li key={t.name} className="rounded-md border border-zinc-200 dark:border-zinc-800 p-3">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">/{t.name}</div>
            <div className="text-xs text-zinc-500">{t.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
