
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const AUTH_URL = "https://functions.poehali.dev/24e96f37-d805-41a0-addb-f1335f99fac8";

interface User {
  id: number;
  username: string;
  email: string;
  bio: string;
}

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("memex_token");
    if (!token) { setLoading(false); return; }
    fetch(`${AUTH_URL}?action=me`, { headers: { "X-Session-Token": token } })
      .then(r => r.json())
      .then(data => { if (data.user) setUser(data.user); else localStorage.removeItem("memex_token"); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#060810" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "rgba(0,255,245,0.6)", borderTopColor: "transparent" }} />
          <p className="font-mono-tech text-xs" style={{ color: "rgba(0,255,245,0.4)", fontFamily: "'Share Tech Mono', monospace" }}>ПОДКЛЮЧЕНИЕ...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={(token, u) => { localStorage.setItem("memex_token", token); setUser(u); }} />;
  }

  return <Index user={user} onLogout={() => setUser(null)} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;