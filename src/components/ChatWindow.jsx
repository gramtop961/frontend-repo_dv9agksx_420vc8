import { useEffect, useRef, useState } from 'react';
import { CornerDownLeft, Loader2 } from 'lucide-react';

// Slash command helper: shows available tools when user types '/'
function SlashMenu({ open, tools, onPick }) {
  if (!open) return null;
  return (
    <div className="absolute bottom-16 left-3 right-3 z-20 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow">
      <ul className="max-h-64 overflow-auto divide-y divide-zinc-200 dark:divide-zinc-800">
        {tools.map((t) => (
          <li key={t.name} className="px-3 py-2 text-sm flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              onClick={() => onPick(t)}>
            <div>
              <div className="font-medium text-zinc-900 dark:text-zinc-100">/{t.name}</div>
              <div className="text-xs text-zinc-500">{t.description}</div>
            </div>
            <span className="text-[10px] text-zinc-400">enter</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ChatWindow({ session, onSend, isLoading, tools, onToolTrigger }) {
  const [input, setInput] = useState('');
  const [showSlash, setShowSlash] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [session]);

  useEffect(() => {
    const last = input.slice(-1);
    setShowSlash(last === '/');
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    onSend(trimmed);
  };

  const handlePickTool = (tool) => {
    setShowSlash(false);
    setInput(`/${tool.name} `);
    onToolTrigger && onToolTrigger(tool.name);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3 bg-white dark:bg-zinc-950">
        {session.messages.map((m, idx) => (
          <div key={idx} className={`max-w-3xl ${m.role === 'user' ? 'ml-auto' : ''}`}>
            <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm border ${m.role === 'user' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="max-w-3xl">
            <div className="rounded-2xl px-4 py-3 text-sm border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 inline-flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} /> Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="relative border-t border-zinc-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Message... Use '/' to see tools"
              className="w-full resize-none rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 pr-10 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 bottom-2 inline-flex items-center gap-2 rounded-md bg-indigo-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-indigo-500"
            >
              <CornerDownLeft size={14} /> Send
            </button>

            <SlashMenu open={showSlash} tools={tools} onPick={handlePickTool} />
          </div>
        </div>
      </div>
    </div>
  );
}
