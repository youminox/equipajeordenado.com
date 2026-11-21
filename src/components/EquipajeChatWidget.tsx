"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FormEvent,
} from "react";
import { CHAT_ENDPOINT, OPEN_CHAT_EVENT } from "@/lib/chat-constants";

const STORAGE_VISITOR_KEY = "eo_chat_visitor_v1";
const STORAGE_SESSION_KEY = "eo_chat_session_v1";
const STORAGE_MESSAGES_KEY = "eo_chat_messages_v1";

export interface ChatGuideCard {
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  url: string;
  image: string;
  excerpt: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendedGuides?: ChatGuideCard[];
  suggestedOptions?: string[];
  createdAt: string;
}

const INITIAL_QUICK_OPTIONS = [
  "✈️ Medidas de maleta de cabina en LATAM, Iberia o Ryanair",
  "💧 Regla de líquidos 100 ml y medicamentos en cabina",
  "🎒 ¿Puedo llevar mochila y maleta de mano juntas?",
  "🔋 Power bank, laptop y electrónicos en el avión",
  "🚫 Objetos prohibidos en el equipaje de mano",
  "🧳 Cómo empacar una maleta de 10 kg para 7 días",
  "🔒 Candado TSA y cómo proteger mi maleta de robos",
];

const DEFAULT_WELCOME =
  "¡Hola! 👋 Soy tu Asesor de Equipaje y Vuelos IA de Equipaje Ordenado. Pregúntame sobre las medidas y peso de cabina de tu aerolínea, qué puedes llevar en el avión (líquidos 100 ml, baterías, medicamentos), cómo empacar tu maleta o cualquier duda de viaje.";

export default function EquipajeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showTeaser, setShowTeaser] = useState(true);
  const [visitorId, setVisitorId] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState(DEFAULT_WELCOME);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingPromptRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      let vid = localStorage.getItem(STORAGE_VISITOR_KEY);
      if (!vid) {
        vid =
          "eo-" +
          Math.random().toString(36).slice(2, 10) +
          "-" +
          Date.now().toString(36);
        localStorage.setItem(STORAGE_VISITOR_KEY, vid);
      }
      setVisitorId(vid);

      const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (savedSession) setSessionId(savedSession);

      const savedMessages = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }

    fetch(CHAT_ENDPOINT, { method: "GET" })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data?.is_enabled === "boolean") {
          setIsEnabled(data.is_enabled);
        }
        if (data?.welcome_message) {
          setWelcomeMessage(data.welcome_message);
        }
      })
      .catch(() => {
        // fallback to default enabled
      });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [messages, isOpen, isLoading]);

  const persistMessages = useCallback(
    (nextMessages: ChatMessage[], nextSessionId?: string | null) => {
      setMessages(nextMessages);
      try {
        localStorage.setItem(
          STORAGE_MESSAGES_KEY,
          JSON.stringify(nextMessages.slice(-24))
        );
        if (nextSessionId) {
          localStorage.setItem(STORAGE_SESSION_KEY, nextSessionId);
        }
      } catch {
        // ignore
      }
    },
    []
  );

  const trackGuideClick = (
    targetUrl: string,
    guide?: { slug?: string; title?: string; category?: string }
  ) => {
    try {
      fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "track_click",
          session_id: sessionId,
          visitor_id: visitorId,
          guide_slug: guide?.slug || null,
          guide_title: guide?.title || null,
          category: guide?.category || null,
          target_url: targetUrl,
          page_url:
            typeof window !== "undefined"
              ? window.location.href
              : "https://equipajeordenado.com/",
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  const sendMessage = useCallback(
    async (textToSend: string) => {
      const trimmed = textToSend.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: "u-" + Date.now(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      const updatedWithUser = [...messages, userMsg];
      persistMessages(updatedWithUser, sessionId);
      setInput("");
      setIsLoading(true);

      try {
        const historyPayload = updatedWithUser.slice(-8).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "chat",
            session_id: sessionId,
            visitor_id: visitorId,
            message: trimmed,
            history: historyPayload.slice(0, -1),
            page_url:
              typeof window !== "undefined"
                ? window.location.href
                : "https://equipajeordenado.com/",
            user_agent:
              typeof navigator !== "undefined" ? navigator.userAgent : "",
          }),
        });

        const data = await res.json();
        const newSessId = data.session_id || sessionId;
        if (newSessId && newSessId !== sessionId) {
          setSessionId(newSessId);
        }

        const assistantMsg: ChatMessage = {
          id: "a-" + Date.now(),
          role: "assistant",
          content:
            data.reply ||
            "Puedes revisar las dimensiones exactas por aerolínea en [Medidas del Equipaje de Mano](https://equipajeordenado.com/medidas-equipaje-de-mano/).",
          recommendedGuides: Array.isArray(data.recommended_guides)
            ? data.recommended_guides
            : [],
          suggestedOptions: Array.isArray(data.suggested_options)
            ? data.suggested_options
            : [],
          createdAt: new Date().toISOString(),
        };

        persistMessages([...updatedWithUser, assistantMsg], newSessId);
      } catch {
        const fallbackMsg: ChatMessage = {
          id: "a-err-" + Date.now(),
          role: "assistant",
          content:
            "En este momento hubo una demora en la conexión. Puedes consultar gratis nuestra tabla oficial en [Medidas por Aerolínea](https://equipajeordenado.com/medidas-equipaje-de-mano/).",
          suggestedOptions: ["Intentar de nuevo"],
          createdAt: new Date().toISOString(),
        };
        persistMessages([...updatedWithUser, fallbackMsg], sessionId);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, persistMessages, sessionId, visitorId]
  );

  useEffect(() => {
    const handleOpenEvent = (ev: Event) => {
      const customEv = ev as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      setShowTeaser(false);
      if (customEv.detail?.prompt) {
        pendingPromptRef.current = customEv.detail.prompt;
      }
    };
    window.addEventListener(OPEN_CHAT_EVENT, handleOpenEvent);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, handleOpenEvent);
  }, []);

  useEffect(() => {
    if (isOpen && pendingPromptRef.current && !isLoading) {
      const p = pendingPromptRef.current;
      pendingPromptRef.current = null;
      sendMessage(p);
    }
  }, [isOpen, isLoading, sendMessage]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleResetChat = () => {
    setMessages([]);
    setSessionId(null);
    try {
      localStorage.removeItem(STORAGE_MESSAGES_KEY);
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // ignore
    }
  };

  const toLocalOrFullHref = (url: string) => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      return (
        url.replace(/^https?:\/\/(www\.)?equipajeordenado\.com/i, "") || "/"
      );
    }
    return url;
  };

  const toImageSrc = (imgUrl: string) => {
    if (!imgUrl) return "/images/Charlie-Lingan.jpg";
    return imgUrl.replace(/^https?:\/\/(www\.)?equipajeordenado\.com/i, "");
  };

  const renderFormattedContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      const tokenRegex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*)/g;
      const parts = line.split(tokenRegex);

      return (
        <p key={lineIdx} className="leading-relaxed mb-1.5 last:mb-0">
          {parts.map((part, i) => {
            const linkMatch = part.match(
              /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/
            );
            if (linkMatch) {
              const [, label, url] = linkMatch;
              return (
                <a
                  key={i}
                  href={toLocalOrFullHref(url)}
                  onClick={() => trackGuideClick(url, { title: label })}
                  className="inline-flex items-center gap-1 font-bold text-[#0767db] underline decoration-[#f59e0b] decoration-2 underline-offset-2 hover:text-[#03428e] transition-colors"
                >
                  <span>{label}</span>
                  <span aria-hidden="true">→</span>
                </a>
              );
            }

            const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
            if (boldMatch) {
              return (
                <strong key={i} className="font-bold text-[#111827]">
                  {boldMatch[1]}
                </strong>
              );
            }

            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    });
  };

  if (!isEnabled) return null;

  const latestAssistantMsg =
    messages.length > 0 && messages[messages.length - 1].role === "assistant"
      ? messages[messages.length - 1]
      : null;

  return (
    <div className="fixed bottom-[76px] right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[415px] h-[590px] max-h-[82vh] rounded-3xl bg-white border border-[#cfe2f7] shadow-2xl flex flex-col overflow-hidden"
          role="dialog"
          aria-label="Asesor de Equipaje y Vuelos IA Equipaje Ordenado"
        >
          {/* Header */}
          <div
            className="px-4 py-3.5 text-white flex items-center justify-between gap-3 shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #03428e 0%, #0767db 55%, #0284c7 100%)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-full bg-white/15 border border-white/30 grid place-items-center shrink-0">
                <span className="text-xl" aria-hidden="true">
                  🧳
                </span>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#8CC63F] border-2 border-[#03428e]"
                  title="En línea"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[15px] leading-tight truncate text-white">
                    Asesor IA · Equipaje y Vuelos
                  </h3>
                  <span className="inline-flex items-center whitespace-nowrap shrink-0 leading-none text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-300 text-gray-950">
                    En línea
                  </span>
                </div>
                <p className="text-xs text-sky-100 truncate mt-0.5">
                  20 aerolíneas · +550 guías de cabina
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-xs text-white transition-colors cursor-pointer"
                  title="Reiniciar conversación"
                  aria-label="Reiniciar conversación"
                >
                  ↺
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-sm font-bold text-white transition-colors cursor-pointer"
                aria-label="Cerrar chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f4f8fd]"
            data-lenis-prevent
          >
            {/* Welcome Bubble */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#0767db] text-white grid place-items-center text-xs font-bold shrink-0 mt-0.5">
                ✈️
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-white border border-[#d6e6f9] p-3.5 text-[13.5px] text-[#111827] shadow-xs max-w-[88%]">
                <p className="leading-relaxed">{welcomeMessage}</p>
              </div>
            </div>

            {/* Initial Quick Options */}
            {messages.length === 0 && !isLoading && (
              <div className="pl-9 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#4b5563]">
                  Consultas frecuentes sobre maletas y vuelos:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {INITIAL_QUICK_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => sendMessage(opt)}
                      className="text-left text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-[#bdd7f6] text-[#03428e] hover:bg-[#0767db] hover:text-white hover:border-[#0767db] transition-all shadow-2xs cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation History */}
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2.5">
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-[#0767db] text-white px-3.5 py-2.5 text-[13.5px] max-w-[85%] shadow-xs">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#0767db] text-white grid place-items-center text-xs font-bold shrink-0 mt-0.5">
                      ✈️
                    </div>
                    <div className="space-y-2.5 max-w-[88%] min-w-0">
                      <div className="rounded-2xl rounded-tl-sm bg-white border border-[#d6e6f9] p-3.5 text-[13.5px] text-[#1f2937] shadow-xs">
                        {renderFormattedContent(msg.content)}
                      </div>

                      {/* Recommended Guide Cards */}
                      {msg.recommendedGuides &&
                        msg.recommendedGuides.length > 0 && (
                          <div className="space-y-2">
                            {msg.recommendedGuides.map((guide) => (
                              <div
                                key={guide.slug}
                                className="rounded-2xl bg-white border border-[#bdd7f6] p-3 shadow-xs hover:border-[#0767db] transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={toImageSrc(guide.image)}
                                    alt={guide.title}
                                    className="w-16 h-16 rounded-xl object-cover bg-[#edf5fe] shrink-0 border border-[#d6e6f9]"
                                    loading="lazy"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0767db] block truncate">
                                      {guide.categoryName}
                                    </span>
                                    <h4 className="font-extrabold text-xs sm:text-[13px] text-[#111827] line-clamp-2 leading-snug">
                                      {guide.title}
                                    </h4>
                                  </div>
                                </div>
                                <a
                                  href={toLocalOrFullHref(guide.url)}
                                  onClick={() =>
                                    trackGuideClick(guide.url, {
                                      slug: guide.slug,
                                      title: guide.title,
                                      category: guide.category,
                                    })
                                  }
                                  className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0767db] to-[#03428e] hover:from-[#03428e] hover:to-[#022c61] text-white font-extrabold text-xs py-2 px-3 transition-colors shadow-2xs"
                                >
                                  <span>Ver guía completa</span>
                                  <span aria-hidden="true">→</span>
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Suggested Follow-up Options */}
            {latestAssistantMsg &&
              latestAssistantMsg.suggestedOptions &&
              latestAssistantMsg.suggestedOptions.length > 0 &&
              !isLoading && (
                <div className="pl-9 flex flex-wrap gap-1.5 pt-1">
                  {latestAssistantMsg.suggestedOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(opt)}
                      className="text-left text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-[#0767db]/35 text-[#03428e] hover:bg-[#0767db] hover:text-white transition-colors cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#0767db] text-white grid place-items-center text-xs font-bold shrink-0">
                  ✈️
                </div>
                <div className="rounded-2xl bg-white border border-[#d6e6f9] px-4 py-3 text-xs text-[#4b5563] flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#0767db] animate-bounce" />
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-[#f59e0b] animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-[#8CC63F] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <span className="ml-1 font-medium">
                    Verificando reglas de cabina...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-[#d6e6f9] flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre maletas, medidas, aerolíneas o vuelos..."
              disabled={isLoading}
              className="flex-1 rounded-full border border-[#c6dbf5] bg-[#f4f8fd] px-4 py-2.5 text-[13.5px] text-[#111827] placeholder:text-[#6b7280] focus:outline-none focus:border-[#0767db]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#0767db] hover:bg-[#03428e] disabled:opacity-45 text-white grid place-items-center shrink-0 transition-colors cursor-pointer"
              aria-label="Enviar consulta"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Callout Pill + Main Trigger Button */}
      <div className="flex items-center gap-2.5">
        {!isOpen && showTeaser && (
          <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-white border border-[#bdd7f6] shadow-lg px-3.5 py-2 text-xs font-semibold text-[#111827]">
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setShowTeaser(false);
              }}
              className="flex items-center gap-2 text-left cursor-pointer"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#8CC63F] animate-pulse" />
              <span>
                ¿Dudas con tu maleta o vuelo?{" "}
                <strong className="text-[#0767db]">
                  Pregúntale al Asesor IA →
                </strong>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowTeaser(false)}
              className="text-[#6b7280] hover:text-[#111827] ml-1 text-[11px] cursor-pointer"
              aria-label="Ocultar aviso"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTeaser(false);
          }}
          className="group relative flex items-center gap-2.5 rounded-full px-4 py-3 sm:px-5 sm:py-3.5 text-white font-extrabold text-sm shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          style={{
            background:
              "linear-gradient(135deg, #03428e 0%, #0767db 55%, #0284c7 100%)",
            boxShadow: "0 14px 30px -6px rgba(7, 103, 219, 0.65)",
          }}
          aria-label={
            isOpen
              ? "Cerrar Asesor de Equipaje IA"
              : "Abrir Asesor de Equipaje y Vuelos IA"
          }
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-300" />
          </span>
          <span>{isOpen ? "Cerrar Asesor IA" : "Asesor Equipaje IA"}</span>
          <span className="text-base" aria-hidden="true">
            🧳
          </span>
        </button>
      </div>
    </div>
  );
}
