import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "chats" | "gallery" | "trends" | "profile" | "settings";

interface Notification {
  id: number;
  text: string;
  type: "message" | "trend" | "system";
  time: string;
  read: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Meme {
  id: number;
  title: string;
  img: string;
  likes: number;
  comments: number;
  author: string;
  tag: string;
}

interface Trend {
  id: number;
  tag: string;
  count: number;
  growth: number;
  img: string;
}

const CHATS: Chat[] = [
  { id: 1, name: "НЕЙРО_МАКС", avatar: "NM", lastMsg: "этот мем — огонь 🔥", time: "22:14", unread: 3, online: true },
  { id: 2, name: "ГЛиЧ_ДЕВОЧКА", avatar: "ГД", lastMsg: "хахаха всё, умерла", time: "21:58", unread: 0, online: true },
  { id: 3, name: "ДАТА_ПРИЗРАК", avatar: "ДП", lastMsg: "видел тренд с котом?", time: "20:30", unread: 7, online: false },
  { id: 4, name: "БАЙТ_РЕЙВ", avatar: "БР", lastMsg: "отправил 5 мемов", time: "19:11", unread: 0, online: true },
  { id: 5, name: "КИБЕРША_404", avatar: "К4", lastMsg: "недоступна", time: "вчера", unread: 0, online: false },
];

const MEMES: Meme[] = [
  { id: 1, title: "Когда баг в проде", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/ee103960-c81d-46ef-9aa7-2479605461d6.jpg", likes: 4280, comments: 312, author: "НЕЙРО_МАКС", tag: "#devops" },
  { id: 2, title: "Я в понедельник", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/385d3e4f-6ab2-4fcc-837d-68125ce5f523.jpg", likes: 2990, comments: 187, author: "ГЛиЧ_ДЕВОЧКА", tag: "#понедельник" },
  { id: 3, title: "Нейросети захватывают", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/ee103960-c81d-46ef-9aa7-2479605461d6.jpg", likes: 6110, comments: 544, author: "ДАТА_ПРИЗРАК", tag: "#ИИ" },
  { id: 4, title: "Киберпанк реальность", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/385d3e4f-6ab2-4fcc-837d-68125ce5f523.jpg", likes: 3450, comments: 229, author: "БАЙТ_РЕЙВ", tag: "#future" },
];

const TRENDS: Trend[] = [
  { id: 1, tag: "#НЕЙРОКОТ", count: 142800, growth: 340, img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/ee103960-c81d-46ef-9aa7-2479605461d6.jpg" },
  { id: 2, tag: "#БАГИ_В_ПРОДЕ", count: 98200, growth: 210, img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/385d3e4f-6ab2-4fcc-837d-68125ce5f523.jpg" },
  { id: 3, tag: "#КИБЕРПАНК_ЩАС", count: 76500, growth: 180, img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/ee103960-c81d-46ef-9aa7-2479605461d6.jpg" },
  { id: 4, tag: "#404_ПОНЕДЕЛЬНИК", count: 54300, growth: 95, img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/385d3e4f-6ab2-4fcc-837d-68125ce5f523.jpg" },
  { id: 5, tag: "#МАТРИЦА_ПОНЯЛА", count: 43100, growth: 67, img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/ee103960-c81d-46ef-9aa7-2479605461d6.jpg" },
];

const NOTIFS: Notification[] = [
  { id: 1, text: "НЕЙРО_МАКС прислал мем: 'Когда баг...'", type: "message", time: "22:14", read: false },
  { id: 2, text: "#НЕЙРОКОТ в топ-трендах! +340%", type: "trend", time: "22:00", read: false },
  { id: 3, text: "ДАТА_ПРИЗРАК отправил 7 сообщений", type: "message", time: "20:30", read: false },
  { id: 4, text: "Новый тренд: #БАГИ_В_ПРОДЕ взлетел!", type: "trend", time: "19:45", read: true },
  { id: 5, text: "Системное обновление MEMEX v2.7.4", type: "system", time: "18:00", read: true },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFS);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [likedMemes, setLikedMemes] = useState<number[]>([]);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [toggleStates, setToggleStates] = useState({ msg: true, trend: true, sound: true, sys: false });

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalUnread = CHATS.reduce((s, c) => s + c.unread, 0);

  useEffect(() => {
    const msgs = [
      "НЕЙРО_МАКС прислал новый мем!",
      "#НЕЙРОКОТ снова в топе!",
      "Новое сообщение от ГЛиЧ_ДЕВОЧКА",
    ];
    const timer = setInterval(() => {
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      setShowToast(msg);
      setTimeout(() => setShowToast(null), 3500);
    }, 14000);
    return () => clearInterval(timer);
  }, []);

  const markAllRead = () => {
    setNotifications(n => n.map(x => ({ ...x, read: true })));
  };

  const navItems = [
    { id: "home" as Section, icon: "Zap", label: "Главная", badge: 0 },
    { id: "chats" as Section, icon: "MessageSquare", label: "Чаты", badge: totalUnread },
    { id: "gallery" as Section, icon: "Image", label: "Галерея", badge: 0 },
    { id: "trends" as Section, icon: "TrendingUp", label: "Тренды", badge: 0 },
    { id: "profile" as Section, icon: "User", label: "Профиль", badge: 0 },
    { id: "settings" as Section, icon: "Settings", label: "Настройки", badge: 0 },
  ];

  return (
    <div className="min-h-screen font-rajdhani relative overflow-hidden" style={{ backgroundColor: "var(--dark-bg)", backgroundImage: "linear-gradient(rgba(0,255,245,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,245,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(0,255,245,0.04)" }} />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(191,0,255,0.04)" }} />

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="border px-4 py-3 flex items-center gap-3 min-w-72 backdrop-blur-md" style={{ backgroundColor: "rgba(13,17,23,0.95)", borderColor: "rgba(0,255,245,0.6)", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
            <div className="w-2 h-2 rounded-full pulse-dot" style={{ backgroundColor: "var(--neon-cyan)" }} />
            <span className="font-mono-tech text-sm" style={{ color: "var(--neon-cyan)" }}>{showToast}</span>
            <button onClick={() => setShowToast(null)} className="ml-auto opacity-50 hover:opacity-100 transition-opacity" style={{ color: "var(--neon-cyan)" }}>
              <Icon name="X" size={14} />
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-md" style={{ backgroundColor: "rgba(6,8,16,0.92)", borderColor: "rgba(0,255,245,0.2)" }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center border" style={{ backgroundColor: "rgba(0,255,245,0.08)", borderColor: "rgba(0,255,245,0.5)", boxShadow: "0 0 8px rgba(0,255,245,0.3)" }}>
              <span className="font-orbitron text-xs font-bold" style={{ color: "var(--neon-cyan)" }}>MX</span>
            </div>
            <span className="font-orbitron text-lg font-bold tracking-widest" style={{ color: "var(--neon-cyan)", textShadow: "0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan)" }}>MEMEX</span>
            <span className="font-mono-tech text-xs hidden sm:block" style={{ color: "rgba(0,255,245,0.25)" }}>// v2.7.4</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-sm border" style={{ backgroundColor: "rgba(0,255,136,0.08)", borderColor: "rgba(0,255,136,0.3)" }}>
              <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ backgroundColor: "var(--neon-green)", color: "var(--neon-green)" }} />
              <span className="font-mono-tech text-xs" style={{ color: "var(--neon-green)" }}>ОНЛАЙН: 4,219</span>
            </div>

            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 border transition-all"
              style={{ borderColor: showNotifs ? "rgba(0,255,245,0.6)" : "rgba(0,255,245,0.25)", backgroundColor: showNotifs ? "rgba(0,255,245,0.08)" : "transparent" }}
            >
              <Icon name="Bell" size={18} style={{ color: "var(--neon-cyan)" }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-xs flex items-center justify-center rounded-full font-bold pulse-dot" style={{ backgroundColor: "var(--neon-pink)" }}>
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="w-8 h-8 flex items-center justify-center cursor-pointer hex-avatar" style={{ background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))" }}>
              <span className="font-orbitron text-xs font-bold" style={{ color: "var(--dark-bg)" }}>ВЫ</span>
            </div>
          </div>
        </div>
      </header>

      {/* NOTIFICATION PANEL */}
      {showNotifs && (
        <div className="fixed top-14 right-4 z-40 w-80 border animate-fade-in backdrop-blur-md" style={{ backgroundColor: "rgba(13,17,23,0.97)", borderColor: "rgba(0,255,245,0.35)", clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }}>
          <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(0,255,245,0.15)" }}>
            <span className="font-orbitron text-sm font-bold" style={{ color: "var(--neon-cyan)" }}>УВЕДОМЛЕНИЯ</span>
            <button onClick={markAllRead} className="font-mono-tech text-xs transition-colors hover:opacity-100 opacity-50" style={{ color: "var(--neon-cyan)" }}>
              ПРОЧИТАТЬ ВСЁ
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className="p-3 border-b flex gap-3 transition-all" style={{ borderColor: "rgba(0,255,245,0.08)", backgroundColor: !n.read ? "rgba(0,255,245,0.04)" : "transparent" }}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'pulse-dot' : ''}`} style={{ backgroundColor: n.type === 'message' ? "var(--neon-cyan)" : n.type === 'trend' ? "var(--neon-pink)" : "var(--neon-purple)" }} />
                <div className="flex-1 min-w-0">
                  <p className="font-rajdhani text-sm leading-tight" style={{ color: "rgba(255,255,255,0.85)" }}>{n.text}</p>
                  <span className="font-mono-tech text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex pt-14 min-h-screen">
        {/* SIDEBAR */}
        <aside className="fixed left-0 top-14 bottom-0 w-16 lg:w-56 border-r z-30 flex flex-col" style={{ backgroundColor: "rgba(6,8,16,0.88)", borderColor: "rgba(0,255,245,0.15)", backdropFilter: "blur(12px)" }}>
          <nav className="flex-1 py-4 space-y-1 px-2">
            {navItems.map((item, i) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setActiveChat(null); setShowNotifs(false); }}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 transition-all relative group animate-fade-in border-l-2"
                  style={{
                    borderLeftColor: active ? "var(--neon-cyan)" : "transparent",
                    backgroundColor: active ? "rgba(0,255,245,0.07)" : "transparent",
                  }}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    style={{ color: active ? "var(--neon-cyan)" : "rgba(255,255,255,0.4)", filter: active ? "drop-shadow(0 0 4px var(--neon-cyan))" : "none" }}
                  />
                  <span className="hidden lg:block font-rajdhani font-semibold text-sm tracking-wider" style={{ color: active ? "var(--neon-cyan)" : "rgba(255,255,255,0.55)" }}>
                    {item.label}
                  </span>
                  {item.badge > 0 && (
                    <>
                      <span className="hidden lg:flex ml-auto w-5 h-5 text-white text-xs items-center justify-center font-bold pulse-dot rounded-sm" style={{ backgroundColor: "var(--neon-pink)" }}>
                        {item.badge}
                      </span>
                      <span className="lg:hidden absolute top-1 right-1 w-2.5 h-2.5 rounded-full pulse-dot" style={{ backgroundColor: "var(--neon-pink)" }} />
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t" style={{ borderColor: "rgba(0,255,245,0.12)" }}>
            <div className="flex items-center gap-2 px-1">
              <div className="w-7 h-7 hex-avatar flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))" }}>
                <span className="font-orbitron text-xs font-bold" style={{ color: "var(--dark-bg)" }}>ВЫ</span>
              </div>
              <div className="hidden lg:block min-w-0">
                <p className="font-orbitron text-xs font-bold truncate" style={{ color: "var(--neon-cyan)" }}>ПОЛЬЗОВАТЕЛЬ</p>
                <p className="font-mono-tech text-xs truncate" style={{ color: "rgba(255,255,255,0.3)" }}>@user_404</p>
              </div>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 ml-16 lg:ml-56 min-h-screen p-4 lg:p-6">

          {/* HOME */}
          {activeSection === "home" && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h1 className="font-orbitron text-2xl font-bold mb-1" style={{ color: "var(--neon-cyan)", textShadow: "0 0 20px var(--neon-cyan)" }}>ДОБРО ПОЖАЛОВАТЬ</h1>
                <p className="font-mono-tech text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>// СИСТЕМА АКТИВИРОВАНА · {new Date().toLocaleString('ru')}</p>
              </div>

              {/* Hero banner */}
              <div className="relative border overflow-hidden mb-6 h-48 lg:h-64" style={{ borderColor: "rgba(0,255,245,0.25)", clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}>
                <img src="https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/3684833f-112a-4f3b-870b-f7ccbc50e24c.jpg" alt="Cyberpunk City" className="w-full h-full object-cover opacity-55" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, var(--dark-bg) 0%, rgba(6,8,16,0.4) 60%, transparent 100%)" }} />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <p className="font-mono-tech text-xs mb-1" style={{ color: "rgba(0,255,245,0.55)" }}>СЕГОДНЯШНИЙ ТРЕНД</p>
                  <h2 className="font-orbitron text-xl lg:text-3xl font-black mb-2" style={{ color: "var(--neon-cyan)", textShadow: "0 0 20px var(--neon-cyan), 0 0 40px var(--neon-cyan)" }}>#НЕЙРОКОТ</h2>
                  <div className="flex gap-4 text-sm">
                    <span className="font-mono-tech font-bold" style={{ color: "var(--neon-green)", textShadow: "0 0 8px var(--neon-green)" }}>▲ +340%</span>
                    <span className="font-mono-tech" style={{ color: "rgba(255,255,255,0.5)" }}>142,800 постов</span>
                  </div>
                </div>
                {/* Scanlines overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)" }} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "МЕМОВ СЕГОДНЯ", val: "1,284", icon: "Image", color: "var(--neon-cyan)", border: "rgba(0,255,245,0.25)" },
                  { label: "АКТИВНЫХ ЧАТОВ", val: "23", icon: "MessageSquare", color: "var(--neon-purple)", border: "rgba(191,0,255,0.25)" },
                  { label: "В ТОПЕ", val: "5", icon: "TrendingUp", color: "var(--neon-pink)", border: "rgba(255,0,106,0.25)" },
                  { label: "НОВЫХ ПОДПИСОК", val: "+47", icon: "Users", color: "var(--neon-green)", border: "rgba(0,255,136,0.25)" },
                ].map(s => (
                  <div key={s.label} className="p-4 border" style={{ backgroundColor: "rgba(13,17,23,0.85)", borderColor: s.border, clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
                    <Icon name={s.icon} size={16} className="mb-2" style={{ color: s.color }} />
                    <p className="font-orbitron text-xl font-bold" style={{ color: s.color, textShadow: `0 0 10px ${s.color}` }}>{s.val}</p>
                    <p className="font-mono-tech text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Hot memes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-orbitron text-sm font-bold" style={{ color: "var(--neon-pink)", textShadow: "0 0 8px var(--neon-pink)" }}>// ГОРЯЧИЕ МЕМЫ</h3>
                  <button onClick={() => setActiveSection("gallery")} className="font-mono-tech text-xs transition-colors" style={{ color: "rgba(255,255,255,0.35)" }}>СМОТРЕТЬ ВСЕ →</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {MEMES.map(m => (
                    <div key={m.id} className="border overflow-hidden group cursor-pointer transition-all" style={{ backgroundColor: "rgba(13,17,23,0.85)", borderColor: "rgba(0,255,245,0.15)", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
                      <div className="relative h-32 overflow-hidden">
                        <img src={m.img} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)" }} />
                        <div className="absolute bottom-0 left-0 right-0 p-2" style={{ background: "linear-gradient(to top, var(--dark-bg), transparent)" }}>
                          <span className="font-mono-tech text-xs" style={{ color: "var(--neon-cyan)" }}>{m.tag}</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="font-rajdhani font-semibold text-sm truncate" style={{ color: "rgba(255,255,255,0.85)" }}>{m.title}</p>
                        <div className="flex gap-3 mt-1">
                          <span className="font-mono-tech text-xs" style={{ color: "var(--neon-pink)" }}>{m.likes.toLocaleString()} ❤</span>
                          <span className="font-mono-tech text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{m.comments} 💬</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CHATS */}
          {activeSection === "chats" && (
            <div className="animate-fade-in">
              <h1 className="font-orbitron text-2xl font-bold mb-6" style={{ color: "var(--neon-cyan)", textShadow: "0 0 20px var(--neon-cyan)" }}>ЧАТЫ</h1>
              <div className="flex gap-4" style={{ height: "calc(100vh - 180px)" }}>
                {/* Chat list */}
                <div className="w-60 flex-shrink-0 space-y-1 overflow-y-auto pr-1">
                  {CHATS.map(chat => (
                    <button
                      key={chat.id}
                      onClick={() => setActiveChat(chat)}
                      className="w-full flex items-center gap-3 p-3 border transition-all text-left"
                      style={{
                        backgroundColor: activeChat?.id === chat.id ? "rgba(0,255,245,0.06)" : "rgba(13,17,23,0.7)",
                        borderColor: activeChat?.id === chat.id ? "rgba(0,255,245,0.5)" : "rgba(0,255,245,0.12)",
                        clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                      }}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-9 h-9 hex-avatar border flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(0,255,245,0.2), rgba(191,0,255,0.2))", borderColor: "rgba(0,255,245,0.3)" }}>
                          <span className="font-orbitron text-xs font-bold" style={{ color: "var(--neon-cyan)" }}>{chat.avatar}</span>
                        </div>
                        {chat.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 pulse-dot" style={{ backgroundColor: "var(--neon-green)", borderColor: "var(--dark-bg)" }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-orbitron text-xs font-bold truncate" style={{ color: "rgba(255,255,255,0.88)" }}>{chat.name}</span>
                          <span className="font-mono-tech text-xs flex-shrink-0 ml-1" style={{ color: "rgba(255,255,255,0.28)" }}>{chat.time}</span>
                        </div>
                        <p className="font-rajdhani text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{chat.lastMsg}</p>
                      </div>
                      {chat.unread > 0 && (
                        <span className="w-5 h-5 text-white text-xs flex items-center justify-center font-bold flex-shrink-0 pulse-dot" style={{ backgroundColor: "var(--neon-pink)" }}>
                          {chat.unread}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Chat window */}
                <div className="flex-1 border flex flex-col overflow-hidden" style={{ backgroundColor: "rgba(13,17,23,0.8)", borderColor: "rgba(0,255,245,0.2)", clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}>
                  {activeChat ? (
                    <>
                      <div className="p-3 border-b flex items-center gap-3" style={{ borderColor: "rgba(0,255,245,0.15)" }}>
                        <div className="relative">
                          <div className="w-8 h-8 hex-avatar flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(0,255,245,0.25), rgba(191,0,255,0.25))" }}>
                            <span className="font-orbitron text-xs" style={{ color: "var(--neon-cyan)" }}>{activeChat.avatar}</span>
                          </div>
                          {activeChat.online && <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full pulse-dot" style={{ backgroundColor: "var(--neon-green)" }} />}
                        </div>
                        <div>
                          <p className="font-orbitron text-sm font-bold" style={{ color: "var(--neon-cyan)", textShadow: "0 0 8px var(--neon-cyan)" }}>{activeChat.name}</p>
                          <p className="font-mono-tech text-xs" style={{ color: activeChat.online ? "rgba(0,255,136,0.7)" : "rgba(255,255,255,0.3)" }}>{activeChat.online ? '● ОНЛАЙН' : '○ ОФФЛАЙН'}</p>
                        </div>
                        <div className="ml-auto flex gap-2">
                          <button className="p-1.5 border transition-all" style={{ borderColor: "rgba(0,255,245,0.2)", color: "rgba(255,255,255,0.4)" }}>
                            <Icon name="Phone" size={14} />
                          </button>
                          <button className="p-1.5 border transition-all" style={{ borderColor: "rgba(0,255,245,0.2)", color: "rgba(255,255,255,0.4)" }}>
                            <Icon name="MoreVertical" size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {[
                          { from: activeChat.name, msg: "Привет! Видел этот мем про нейросети?", time: "21:50", own: false },
                          { from: "Вы", msg: "Хахаха, огонь! Отправь ссылку", time: "21:52", own: true },
                          { from: activeChat.name, msg: activeChat.lastMsg, time: activeChat.time, own: false },
                        ].map((msg, i) => (
                          <div key={i} className={`flex ${msg.own ? 'justify-end' : 'justify-start'}`}>
                            <div className="max-w-xs px-3 py-2 border" style={{
                              backgroundColor: msg.own ? "rgba(0,255,245,0.1)" : "rgba(191,0,255,0.08)",
                              borderColor: msg.own ? "rgba(0,255,245,0.3)" : "rgba(191,0,255,0.25)",
                              clipPath: msg.own
                                ? "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))"
                                : "polygon(0 0, 100% 0, calc(100% - 0px) 100%, 0 100%)",
                            }}>
                              {!msg.own && <p className="font-orbitron text-xs mb-1" style={{ color: "var(--neon-cyan)" }}>{msg.from}</p>}
                              <p className="font-rajdhani text-sm" style={{ color: "rgba(255,255,255,0.88)" }}>{msg.msg}</p>
                              <p className="font-mono-tech text-xs mt-1 text-right" style={{ color: "rgba(255,255,255,0.28)" }}>{msg.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 border-t flex gap-2" style={{ borderColor: "rgba(0,255,245,0.15)" }}>
                        <button className="p-2 border transition-all" style={{ borderColor: "rgba(0,255,245,0.2)", color: "rgba(255,255,255,0.4)" }}>
                          <Icon name="Image" size={16} />
                        </button>
                        <input
                          value={messageInput}
                          onChange={e => setMessageInput(e.target.value)}
                          placeholder="ВВЕДИТЕ СООБЩЕНИЕ..."
                          className="flex-1 px-3 py-2 font-mono-tech text-sm outline-none transition-all border"
                          style={{ backgroundColor: "rgba(6,8,16,0.8)", borderColor: "rgba(0,255,245,0.2)", color: "rgba(255,255,255,0.88)" }}
                          onKeyDown={e => { if (e.key === 'Enter') setMessageInput(""); }}
                        />
                        <button className="px-4 py-2 border transition-all" style={{ backgroundColor: "rgba(0,255,245,0.1)", borderColor: "rgba(0,255,245,0.5)", color: "var(--neon-cyan)", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
                          <Icon name="Send" size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                      <Icon name="MessageSquare" size={48} className="mb-4 animate-float" style={{ color: "rgba(0,255,245,0.18)" }} />
                      <p className="font-orbitron text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>ВЫБЕРИТЕ ЧАТ</p>
                      <p className="font-mono-tech text-xs mt-2" style={{ color: "rgba(255,255,255,0.15)" }}>// для начала разговора</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* GALLERY */}
          {activeSection === "gallery" && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-orbitron text-2xl font-bold" style={{ color: "var(--neon-cyan)", textShadow: "0 0 20px var(--neon-cyan)" }}>ГАЛЕРЕЯ МЕМОВ</h1>
                  <p className="font-mono-tech text-sm mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>// 4,219 мемов в базе</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border transition-all font-orbitron text-sm font-bold" style={{ backgroundColor: "rgba(255,0,106,0.1)", borderColor: "rgba(255,0,106,0.5)", color: "var(--neon-pink)", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
                  <Icon name="Plus" size={16} />
                  ЗАГРУЗИТЬ МЕМ
                </button>
              </div>

              <div className="flex gap-2 mb-4 flex-wrap">
                {["ВСЕ", "#devops", "#понедельник", "#ИИ", "#future", "#коты"].map(tag => (
                  <button key={tag} className="font-mono-tech text-xs px-3 py-1 border transition-all" style={{ borderColor: "rgba(0,255,245,0.2)", color: "rgba(255,255,255,0.45)" }}>
                    {tag}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...MEMES, ...MEMES].map((m, i) => (
                  <div
                    key={`${m.id}-${i}`}
                    style={{ animationDelay: `${i * 50}ms`, backgroundColor: "rgba(13,17,23,0.85)", borderColor: "rgba(0,255,245,0.12)", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                    className="border overflow-hidden group cursor-pointer transition-all animate-fade-in hover:border-cyan-400/40"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img src={m.img} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)" }} />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,8,16,0.9) 0%, transparent 60%)" }} />
                      <div className="absolute top-2 right-2 border px-2 py-0.5" style={{ backgroundColor: "rgba(6,8,16,0.7)", borderColor: "rgba(255,0,106,0.4)" }}>
                        <span className="font-mono-tech text-xs" style={{ color: "var(--neon-pink)" }}>{m.tag}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-rajdhani font-bold text-sm mb-1" style={{ color: "rgba(255,255,255,0.88)" }}>{m.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tech text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>@{m.author}</span>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setLikedMemes(l => l.includes(m.id + i * 100) ? l.filter(x => x !== m.id + i * 100) : [...l, m.id + i * 100])}
                            className="font-mono-tech text-xs flex items-center gap-1 transition-colors"
                            style={{ color: likedMemes.includes(m.id + i * 100) ? "var(--neon-pink)" : "rgba(255,255,255,0.35)" }}
                          >
                            <Icon name="Heart" size={12} />
                            {m.likes.toLocaleString()}
                          </button>
                          <span className="font-mono-tech text-xs flex items-center gap-1" style={{ color: "rgba(255,255,255,0.28)" }}>
                            <Icon name="MessageCircle" size={12} />
                            {m.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRENDS */}
          {activeSection === "trends" && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h1 className="font-orbitron text-2xl font-bold" style={{ color: "var(--neon-pink)", textShadow: "0 0 20px var(--neon-pink)" }}>ПОПУЛЯРНЫЕ ТРЕНДЫ</h1>
                <p className="font-mono-tech text-sm mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>// обновлено 5 минут назад</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {TRENDS.map((t, i) => (
                  <div
                    key={t.id}
                    style={{ animationDelay: `${i * 80}ms`, backgroundColor: "rgba(13,17,23,0.85)", borderColor: "rgba(255,0,106,0.2)", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
                    className="border overflow-hidden flex group cursor-pointer transition-all animate-fade-in hover:border-pink-500/40"
                  >
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                      <img src={t.img} alt={t.tag} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" style={{ filter: "hue-rotate(280deg) saturate(1.5)" }} />
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-orbitron text-xs font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>#{i + 1}</span>
                          <span className="font-orbitron text-sm font-bold" style={{ color: "var(--neon-pink)", textShadow: "0 0 8px var(--neon-pink)" }}>{t.tag}</span>
                        </div>
                        <p className="font-mono-tech text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{t.count.toLocaleString()} постов</p>
                      </div>
                      <div className="text-right">
                        <span className="font-orbitron text-lg font-black" style={{ color: "var(--neon-green)", textShadow: "0 0 10px var(--neon-green)" }}>▲{t.growth}%</span>
                        <p className="font-mono-tech text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>за 24ч</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border p-4" style={{ backgroundColor: "rgba(13,17,23,0.85)", borderColor: "rgba(0,255,245,0.18)", clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
                <h3 className="font-orbitron text-sm font-bold mb-4" style={{ color: "var(--neon-cyan)" }}>// ГРАФИК АКТИВНОСТИ</h3>
                <div className="flex items-end gap-1 h-20">
                  {[30,50,40,80,60,90,70,100,85,75,95,88].map((h, i) => (
                    <div key={i} className="flex-1">
                      <div
                        className="w-full transition-all cursor-pointer group border-t"
                        style={{ height: `${h}%`, background: "linear-gradient(to top, rgba(0,255,245,0.6), rgba(191,0,255,0.4))", borderTopColor: "rgba(0,255,245,0.8)" }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {["12","13","14","15","16","17","18","19","20","21","22","23"].map(t => (
                    <span key={t} className="font-mono-tech" style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activeSection === "profile" && (
            <div className="animate-fade-in">
              <h1 className="font-orbitron text-2xl font-bold mb-6" style={{ color: "var(--neon-cyan)", textShadow: "0 0 20px var(--neon-cyan)" }}>ПРОФИЛЬ</h1>
              <div className="max-w-2xl">
                <div className="border p-6 mb-4 relative overflow-hidden" style={{ backgroundColor: "rgba(13,17,23,0.88)", borderColor: "rgba(0,255,245,0.28)", clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}>
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(0,255,245,0.04)" }} />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)" }} />
                  <div className="flex items-start gap-5 relative">
                    <div className="relative">
                      <div className="w-20 h-20 hex-avatar flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))" }}>
                        <span className="font-orbitron font-black text-2xl" style={{ color: "var(--dark-bg)" }}>ВЫ</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 pulse-dot" style={{ backgroundColor: "var(--neon-green)", borderColor: "var(--dark-bg)" }} />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-orbitron text-xl font-black" style={{ color: "var(--neon-cyan)", textShadow: "0 0 12px var(--neon-cyan)" }}>ПОЛЬЗОВАТЕЛЬ</h2>
                      <p className="font-mono-tech text-sm mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>@user_404 · НЕЙРОСЕТЬ-КЛАСС</p>
                      <p className="font-rajdhani text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>Мемолог по призванию. Киберпанк по духу. 404 — стиль жизни.</p>
                    </div>
                    <button className="px-3 py-1.5 border font-orbitron text-sm font-bold transition-all" style={{ borderColor: "rgba(0,255,245,0.4)", color: "var(--neon-cyan)", clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}>
                      РЕДАКТИРОВАТЬ
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t" style={{ borderColor: "rgba(0,255,245,0.12)" }}>
                    {[
                      { label: "МЕМОВ", val: "284" },
                      { label: "ПОДПИСЧИКИ", val: "1,204" },
                      { label: "ПОДПИСКИ", val: "388" },
                      { label: "ЛАЙКИ", val: "12.4K" },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <p className="font-orbitron text-xl font-black" style={{ color: "var(--neon-cyan)", textShadow: "0 0 8px var(--neon-cyan)" }}>{s.val}</p>
                        <p className="font-mono-tech text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-orbitron text-sm font-bold mb-3" style={{ color: "var(--neon-pink)", textShadow: "0 0 8px var(--neon-pink)" }}>// МОИ МЕМЫ</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {MEMES.map(m => (
                      <div key={m.id} className="border overflow-hidden group cursor-pointer transition-all" style={{ backgroundColor: "rgba(13,17,23,0.85)", borderColor: "rgba(0,255,245,0.12)", clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}>
                        <div className="h-28 overflow-hidden relative">
                          <img src={m.img} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)" }} />
                        </div>
                        <div className="p-2">
                          <p className="font-mono-tech text-xs" style={{ color: "var(--neon-pink)" }}>{m.likes.toLocaleString()} ❤</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeSection === "settings" && (
            <div className="animate-fade-in">
              <h1 className="font-orbitron text-2xl font-bold mb-6" style={{ color: "var(--neon-cyan)", textShadow: "0 0 20px var(--neon-cyan)" }}>НАСТРОЙКИ АККАУНТА</h1>
              <div className="max-w-lg space-y-3">
                {[
                  { section: "АККАУНТ", items: [
                    { label: "Имя пользователя", val: "@user_404", icon: "User", toggle: null },
                    { label: "Email", val: "user@memex.cyber", icon: "Mail", toggle: null },
                    { label: "Пароль", val: "••••••••", icon: "Lock", toggle: null },
                  ]},
                  { section: "УВЕДОМЛЕНИЯ", items: [
                    { label: "Новые сообщения", val: "ВКЛ", icon: "Bell", toggle: "msg" },
                    { label: "Тренды", val: "ВКЛ", icon: "TrendingUp", toggle: "trend" },
                    { label: "Системные", val: "ВЫКЛ", icon: "AlertCircle", toggle: "sys" },
                  ]},
                  { section: "ИНТЕРФЕЙС", items: [
                    { label: "Тема", val: "КИБЕРПАНК", icon: "Zap", toggle: null },
                    { label: "Язык", val: "РУССКИЙ", icon: "Globe", toggle: null },
                    { label: "Звуки", val: "ВКЛ", icon: "Volume2", toggle: "sound" },
                  ]},
                ].map(group => (
                  <div key={group.section} className="border overflow-hidden" style={{ backgroundColor: "rgba(13,17,23,0.85)", borderColor: "rgba(0,255,245,0.18)", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
                    <div className="px-4 py-2 border-b" style={{ backgroundColor: "rgba(0,255,245,0.05)", borderColor: "rgba(0,255,245,0.12)" }}>
                      <span className="font-orbitron text-xs font-bold" style={{ color: "var(--neon-cyan)" }}>// {group.section}</span>
                    </div>
                    {group.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-0 transition-all" style={{ borderColor: "rgba(0,255,245,0.06)" }}>
                        <div className="flex items-center gap-3">
                          <Icon name={item.icon} size={15} style={{ color: "rgba(255,255,255,0.35)" }} />
                          <span className="font-rajdhani font-semibold text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{item.label}</span>
                        </div>
                        {item.toggle ? (
                          <button
                            onClick={() => setToggleStates(s => ({ ...s, [item.toggle!]: !s[item.toggle as keyof typeof s] }))}
                            className="relative w-12 h-6 border transition-all"
                            style={{
                              borderColor: toggleStates[item.toggle as keyof typeof toggleStates] ? "rgba(0,255,245,0.6)" : "rgba(255,255,255,0.15)",
                              backgroundColor: toggleStates[item.toggle as keyof typeof toggleStates] ? "rgba(0,255,245,0.12)" : "transparent",
                            }}
                          >
                            <div
                              className="absolute top-0.5 w-5 h-5 transition-all"
                              style={{
                                left: toggleStates[item.toggle as keyof typeof toggleStates] ? "calc(100% - 22px)" : "2px",
                                backgroundColor: toggleStates[item.toggle as keyof typeof toggleStates] ? "var(--neon-cyan)" : "rgba(255,255,255,0.25)",
                                boxShadow: toggleStates[item.toggle as keyof typeof toggleStates] ? "0 0 8px var(--neon-cyan)" : "none",
                              }}
                            />
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono-tech text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{item.val}</span>
                            <Icon name="ChevronRight" size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}

                <button className="w-full flex items-center justify-center gap-2 py-3 border font-orbitron text-sm font-bold transition-all" style={{ borderColor: "rgba(255,0,106,0.4)", color: "var(--neon-pink)", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
                  <Icon name="LogOut" size={16} />
                  ВЫЙТИ ИЗ СИСТЕМЫ
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
