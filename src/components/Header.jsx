import { useEffect, useState } from 'react';
import { Sun, Moon, KeyRound, Settings } from 'lucide-react';

const MODEL_OPTIONS = [
  { provider: 'OpenAI', id: 'gpt-4o-mini', label: 'GPT-4o-mini' },
  { provider: 'OpenAI', id: 'gpt-4.1', label: 'GPT-4.1' },
  { provider: 'Anthropic', id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
  { provider: 'Meta', id: 'llama-3.1-70b', label: 'Llama 3.1 70B' },
  { provider: 'Google', id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
];

export default function Header({ selectedModel, onChangeModel, usePersonalKey, onTogglePersonalKey, onUpdateApiKey, theme, setTheme }) {
  const [apiKey, setApiKey] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    const savedKey = localStorage.getItem('personal_api_key') || '';
    setApiKey(savedKey);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSaveKey = () => {
    localStorage.setItem('personal_api_key', apiKey);
    onUpdateApiKey(apiKey);
  };

  return (
    <div className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold">
          <Settings size={18} className="text-indigo-600" />
          <span>Chat Control</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => onChangeModel(e.target.value)}
            className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Model selector"
          >
            {MODEL_OPTIONS.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
          </button>

          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            API & Keys
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-4">
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
            <div className="flex items-center gap-3 mb-3">
              <KeyRound size={18} className="text-indigo-600" />
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Personal API key (optional)</div>
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 mb-3">
              <input
                type="checkbox"
                checked={usePersonalKey}
                onChange={(e) => onTogglePersonalKey(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700"
              />
              Use my own API key for requests
            </label>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!usePersonalKey}
              />
              <button
                onClick={handleSaveKey}
                disabled={!usePersonalKey}
                className="rounded-md bg-indigo-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                Save key
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Your key is stored locally in your browser. It is not sent anywhere until you explicitly use it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
