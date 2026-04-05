import { useState } from "react";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/24e96f37-d805-41a0-addb-f1335f99fac8";

interface AuthPageProps {
  onLogin: (token: string, user: { id: number; username: string; email: string; bio: string }) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const action = mode === "login" ? "login" : "register";
    const body: Record<string, string> = { email, password };
    if (mode === "register") body.username = username;

    try {
      const res = await fetch(`${AUTH_URL}?action=${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка сервера");
      } else {
        localStorage.setItem("memex_token", data.token);
        onLogin(data.token, data.user);
      }
    } catch {
      setError("Нет соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden font-rajdhani"
      style={{
        backgroundColor: "var(--dark-bg)",
        backgroundImage: "linear-gradient(rgba(0,255,245,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,245,0.03) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    >
      {/* Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(0,255,245,0.05)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "rgba(191,0,255,0.05)" }} />

      <div className="w-full max-w-sm mx-4 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 flex items-center justify-center border" style={{ backgroundColor: "rgba(0,255,245,0.08)", borderColor: "rgba(0,255,245,0.5)", boxShadow: "0 0 16px rgba(0,255,245,0.3)" }}>
              <span className="font-orbitron text-sm font-bold" style={{ color: "var(--neon-cyan)" }}>MX</span>
            </div>
            <span className="font-orbitron text-2xl font-bold" style={{ color: "var(--neon-cyan)", textShadow: "0 0 20px var(--neon-cyan), 0 0 40px var(--neon-cyan)" }}>MEMEX</span>
          </div>
          <p className="font-mono-tech text-xs" style={{ color: "rgba(0,255,245,0.4)" }}>// MEME MESSENGER v2.7.4</p>
        </div>

        {/* Card */}
        <div
          className="border p-6"
          style={{
            backgroundColor: "rgba(13,17,23,0.95)",
            borderColor: "rgba(0,255,245,0.25)",
            clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
            boxShadow: "0 0 40px rgba(0,255,245,0.06)",
          }}
        >
          {/* Tabs */}
          <div className="flex border-b mb-6" style={{ borderColor: "rgba(0,255,245,0.15)" }}>
            {(["login", "register"] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-2 font-orbitron text-xs font-bold transition-all border-b-2"
                style={{
                  color: mode === m ? "var(--neon-cyan)" : "rgba(255,255,255,0.3)",
                  borderBottomColor: mode === m ? "var(--neon-cyan)" : "transparent",
                  textShadow: mode === m ? "0 0 8px var(--neon-cyan)" : "none",
                }}
              >
                {m === "login" ? "ВХОД" : "РЕГИСТРАЦИЯ"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="font-mono-tech text-xs mb-1.5 block" style={{ color: "rgba(0,255,245,0.6)" }}>
                  // ИМЯ ПОЛЬЗОВАТЕЛЯ
                </label>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="НЕЙРО_МАКС"
                  className="w-full px-3 py-2.5 border outline-none font-mono-tech text-sm transition-all"
                  style={{ backgroundColor: "rgba(6,8,16,0.8)", borderColor: "rgba(0,255,245,0.2)", color: "rgba(255,255,255,0.88)" }}
                  onFocus={e => e.target.style.borderColor = "rgba(0,255,245,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(0,255,245,0.2)"}
                />
              </div>
            )}

            <div>
              <label className="font-mono-tech text-xs mb-1.5 block" style={{ color: "rgba(0,255,245,0.6)" }}>
                // EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@memex.cyber"
                className="w-full px-3 py-2.5 border outline-none font-mono-tech text-sm transition-all"
                style={{ backgroundColor: "rgba(6,8,16,0.8)", borderColor: "rgba(0,255,245,0.2)", color: "rgba(255,255,255,0.88)" }}
                onFocus={e => e.target.style.borderColor = "rgba(0,255,245,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(0,255,245,0.2)"}
              />
            </div>

            <div>
              <label className="font-mono-tech text-xs mb-1.5 block" style={{ color: "rgba(0,255,245,0.6)" }}>
                // ПАРОЛЬ
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border outline-none font-mono-tech text-sm transition-all"
                style={{ backgroundColor: "rgba(6,8,16,0.8)", borderColor: "rgba(0,255,245,0.2)", color: "rgba(255,255,255,0.88)" }}
                onFocus={e => e.target.style.borderColor = "rgba(0,255,245,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(0,255,245,0.2)"}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 border" style={{ backgroundColor: "rgba(255,0,106,0.08)", borderColor: "rgba(255,0,106,0.4)" }}>
                <Icon name="AlertCircle" size={14} style={{ color: "var(--neon-pink)", flexShrink: 0 }} />
                <span className="font-mono-tech text-xs" style={{ color: "var(--neon-pink)" }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-orbitron text-sm font-bold transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: loading ? "rgba(0,255,245,0.05)" : "rgba(0,255,245,0.12)",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "rgba(0,255,245,0.5)",
                color: "var(--neon-cyan)",
                clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                boxShadow: loading ? "none" : "0 0 20px rgba(0,255,245,0.15)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>ПОДКЛЮЧЕНИЕ...</span>
                </>
              ) : (
                <>
                  <Icon name={mode === "login" ? "LogIn" : "UserPlus"} size={16} />
                  <span>{mode === "login" ? "ВОЙТИ В СИСТЕМУ" : "СОЗДАТЬ АККАУНТ"}</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-mono-tech text-xs mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
          MEMEX // CYBERPUNK MEME MESSENGER // 2077
        </p>
      </div>
    </div>
  );
}
