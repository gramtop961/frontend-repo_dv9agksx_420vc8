import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import ChatSidebar from './components/ChatSidebar.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ToolPalette from './components/ToolPalette.jsx';

// Demo tool list (displayed in '/' menu and right-side palette)
const AVAILABLE_TOOLS = [
  { name: 'search', description: 'Search the web for fresh information' },
  { name: 'code', description: 'Generate or refactor code snippets' },
  { name: 'summarize', description: 'Summarize long text or links' },
  { name: 'translate', description: 'Translate between languages' },
  { name: 'mcp', description: 'Interact with the MCP server tools' },
];

function createNewSession() {
  return {
    id: crypto.randomUUID(),
    title: 'New chat',
    model: 'gpt-4o-mini',
    messages: [],
    createdAt: Date.now(),
  };
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const [usePersonalKey, setUsePersonalKey] = useState(false);
  const [personalKey, setPersonalKey] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');

  const [sessions, setSessions] = useState(() => {
    try {
      const raw = localStorage.getItem('chat_sessions');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [activeId, setActiveId] = useState(() => {
    try {
      return localStorage.getItem('active_session_id') || '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState(false);

  const activeSession = useMemo(() => sessions.find((s) => s.id === activeId) || null, [sessions, activeId]);

  // Persist sessions
  useEffect(() => {
    localStorage.setItem('chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (activeId) localStorage.setItem('active_session_id', activeId);
  }, [activeId]);

  useEffect(() => {
    const savedKey = localStorage.getItem('personal_api_key');
    if (savedKey) setPersonalKey(savedKey);
    const savedUse = localStorage.getItem('use_personal_key');
    if (savedUse) setUsePersonalKey(savedUse === 'true');
  }, []);

  const ensureSession = () => {
    if (!activeSession) {
      const s = createNewSession();
      setSessions((prev) => [s, ...prev]);
      setActiveId(s.id);
      return s;
    }
    return activeSession;
  };

  const handleNewChat = () => {
    const s = createNewSession();
    s.model = model;
    setSessions((prev) => [s, ...prev]);
    setActiveId(s.id);
  };

  const handleSelectChat = (id) => {
    setActiveId(id);
    const sel = sessions.find((s) => s.id === id);
    if (sel) setModel(sel.model);
  };

  const handleDeleteChat = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeId === id) {
      setActiveId('');
    }
  };

  const updateActiveSession = (updater) => {
    setSessions((prev) => prev.map((s) => (s.id === activeId ? { ...s, ...updater(s) } : s)));
  };

  const handleSend = async (text) => {
    const session = ensureSession();
    setLoading(true);

    // Add user message
    setSessions((prev) => prev.map((s) => (
      s.id === session.id ? { ...s, messages: [...s.messages, { role: 'user', content: text }] } : s
    )));

    // Generate title from first message
    const current = sessions.find((s) => s.id === session.id) || session;
    if ((current.messages?.length || 0) === 0) {
      updateActiveSession(() => ({ title: text.slice(0, 32) + (text.length > 32 ? '…' : '') }));
    }

    // Simulated response (replace with backend call to MCP/LLM API later)
    const usedModel = model;
    const usedKey = usePersonalKey && personalKey ? 'personal key' : 'default server key';

    const toolMatch = text.trim().startsWith('/')
      ? text.trim().slice(1).split(/\s+/)[0]
      : null;

    const toolInfo = toolMatch && AVAILABLE_TOOLS.find((t) => t.name === toolMatch)
      ? `Tool detected: /${toolMatch}. `
      : '';

    const reply = `Responding with ${usedModel} (${usedKey}). ${toolInfo}You said: "${text}"`;

    // Tiny delay to mimic processing
    await new Promise((r) => setTimeout(r, 600));

    setSessions((prev) => prev.map((s) => (
      s.id === session.id ? { ...s, model: usedModel, messages: [...s.messages, { role: 'assistant', content: reply }] } : s
    )));

    setLoading(false);
  };

  const handleChangeModel = (m) => {
    setModel(m);
    if (activeSession) {
      setSessions((prev) => prev.map((s) => (s.id === activeId ? { ...s, model: m } : s)));
    }
  };

  const handleTogglePersonalKey = (checked) => {
    setUsePersonalKey(checked);
    localStorage.setItem('use_personal_key', String(checked));
  };

  const handleUpdateApiKey = (key) => {
    setPersonalKey(key);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Header
        selectedModel={model}
        onChangeModel={handleChangeModel}
        usePersonalKey={usePersonalKey}
        onTogglePersonalKey={handleTogglePersonalKey}
        onUpdateApiKey={handleUpdateApiKey}
        theme={theme}
        setTheme={setTheme}
      />

      <div className="flex-1 flex min-h-0">
        <ChatSidebar
          sessions={sessions}
          activeId={activeId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
        />

        <ChatWindow
          session={activeSession || { id: 'temp', title: 'New chat', model, messages: [] }}
          onSend={handleSend}
          isLoading={loading}
          tools={AVAILABLE_TOOLS}
          onToolTrigger={() => {}}
        />

        <ToolPalette tools={AVAILABLE_TOOLS} />
      </div>
    </div>
  );
}
