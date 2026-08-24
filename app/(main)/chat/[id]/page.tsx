"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserDropdown from "@/components/UserDropdown";
interface ChatMessage {
  id: number;
  sender: "me" | "owner";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 1, sender: "owner", text: "أهلاً! الكاميرا جاهزة. يمكنك تحديد مكان التسليم المناسب لك 📷", time: "10:15 ص" },
  { id: 2, sender: "me", text: "ممتاز! نقابل عند مفرق الرمال الساعة 10 صباحاً", time: "10:18 ص" },
  { id: 3, sender: "owner", text: "تمام، سأكون هناك 👍", time: "10:20 ص" },
];

function getCurrentTimeLabel(): string {
  const now = new Date();
  const hour24 = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const period = hour24 >= 12 ? "م" : "ص";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${minutes} ${period}`;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "me", text: trimmed, time: getCurrentTimeLabel() },
    ]);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-bg-page p-4">
    <div className="w-full max-w-2xl h-[600px] max-h-[85vh] bg-white rounded-card shadow-sm border border-gray-100 flex flex-col overflow-hidden">

      <header className="h-14 flex items-center justify-between px-4 border-b border-gray-100 bg-white shrink-0">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100"
        >
          <span className="material-symbols-rounded text-lg">arrow_forward</span>
        </button>

        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>

        <UserDropdown align="left" />
      </header>

      <main ref={scrollRef} className="grow overflow-y-auto p-5 flex flex-col gap-3.5 bg-gray-50">

        <div className="text-center">
          <span className="inline-block bg-primary-light text-primary-dark text-xs px-3.5 py-1.5 rounded-full border border-primary/20">
            تم تأكيد الاستئجار — 13 مايو، 10 ص - 1 م
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2.5 ${msg.sender === "me" ? "flex-row-reverse" : ""}`}
          >
            <div className="w-8 h-8 rounded-full bg-primary-light border border-primary/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded text-primary text-sm">person</span>
            </div>

            <div className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-3 max-w-[280px] shadow-sm text-sm ${
                  msg.sender === "me"
                    ? "bg-linear-to-r from-primary to-green-harvest text-white rounded-2xl rounded-tl-none"
                    : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tr-none"
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                {msg.sender === "me" && (
                  <span className="material-symbols-rounded text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    done_all
                  </span>
                )}
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </main>

      <div className="p-3.5 border-t border-gray-100 bg-white flex items-center gap-2.5 shrink-0">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب رسالة..."
          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-sm outline-none focus:bg-white focus:border-primary transition-all"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!draft.trim()}
          className="w-10.5 h-10.5 rounded-full bg-linear-to-r from-primary to-green-harvest flex items-center justify-center shadow-md shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 transition-all active:scale-90"
        >
          <span className="material-symbols-rounded text-white text-lg">send</span>
        </button>
      </div>

    </div>
  </div>
);
}