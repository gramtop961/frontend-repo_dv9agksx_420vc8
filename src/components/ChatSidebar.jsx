import { Plus, MessageSquare, Trash2 } from 'lucide-react';

export default function ChatSidebar({ sessions, activeId, onNewChat, onSelectChat, onDeleteChat }) {
  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onNewChat}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 text-white px-3 py-2 text-sm font-semibold hover:bg-indigo-500"
        >
          <Plus size={16} /> New chat
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {sessions.length === 0 && (
          <div className="p-4 text-sm text-zinc-500 dark:text-zinc-400">No chats yet. Start a new one!</div>
        )}
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {sessions.map((s) => (
            <li key={s.id} className={`group flex items-center gap-2 px-3 py-2 cursor-pointer ${s.id === activeId ? 'bg-zinc-100 dark:bg-zinc-900' : ''}`}
                onClick={() => onSelectChat(s.id)}>
              <MessageSquare size={16} className="text-zinc-500" />
              <div className="flex-1 truncate text-sm text-zinc-900 dark:text-zinc-100">{s.title || 'Untitled chat'}</div>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteChat(s.id); }}
                className="opacity-0 group-hover:opacity-100 transition text-zinc-500 hover:text-red-600"
                aria-label="Delete chat"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
