import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, addDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useApp } from "../context/AppContext";
import { PageHero } from "../components/PageHero";
import type { Chat, ChatMessage, User } from "../types";

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-black text-white/90">
    {children}
  </span>
);

function uidPairId(a: string, b: string) {
  return [a, b].sort().join("__");
}

function displayName(u?: User) {
  if (!u) return "Usuari";
  return (u.name || u.email || "Usuari").trim();
}

export const ChatPage: React.FC = () => {
  const { currentUser, users } = useApp();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const selectedChatId = params.get("chat") || "";
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQ, setPickerQ] = useState("");

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  // Guards
  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  // Load chats where current user is member
  useEffect(() => {
    if (!currentUser) return;

    const qChats = query(
      collection(db, "chats"),
      where("memberIds", "array-contains", currentUser.id),
      orderBy("lastMessageAt", "desc")
    );

    const unsub = onSnapshot(qChats, (snap) => {
      const list = snap.docs.map((d) => ({ ...(d.data() as any), id: d.id })) as Chat[];
      setChats(list);
    });

    return () => unsub();
  }, [currentUser]);

  // Load messages for selected chat
  useEffect(() => {
    if (!currentUser || !selectedChatId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    const qMsgs = query(
      collection(db, "chats", selectedChatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(
      qMsgs,
      (snap) => {
        const list = snap.docs.map((d) => ({ ...(d.data() as any), id: d.id })) as ChatMessage[];
        setMessages(list);
        setLoadingMessages(false);
      },
      () => setLoadingMessages(false)
    );

    return () => unsub();
  }, [currentUser, selectedChatId]);

  const chatPartner = useMemo(() => {
    if (!currentUser || !selectedChatId) return null;
    const chat = chats.find((c) => c.id === selectedChatId);
    if (!chat) return null;
    const otherId = (chat.memberIds || []).find((x) => x !== currentUser.id) || "";
    return users.find((u) => u.id === otherId) || null;
  }, [currentUser, selectedChatId, chats, users]);

  const myChatsPretty = useMemo(() => {
    if (!currentUser) return [];
    return chats.map((c) => {
      const otherId = (c.memberIds || []).find((x) => x !== currentUser.id) || "";
      const other = users.find((u) => u.id === otherId);
      return { chat: c, other };
    });
  }, [chats, users, currentUser]);

  const filteredUsers = useMemo(() => {
    if (!currentUser) return [];
    const needle = pickerQ.trim().toLowerCase();
    return (users || [])
      .filter((u) => u.id !== currentUser.id)
      .filter((u) => {
        if (!needle) return true;
        return (
          (u.name || "").toLowerCase().includes(needle) ||
          (u.email || "").toLowerCase().includes(needle)
        );
      })
      .slice(0, 40);
  }, [users, pickerQ, currentUser]);

  const openChat = (chatId: string) => {
    setParams((p) => {
      p.set("chat", chatId);
      return p;
    });
  };

  const startChatWith = async (otherId: string) => {
    if (!currentUser) return;

    const chatId = uidPairId(currentUser.id, otherId);
    const ref = doc(db, "chats", chatId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const payload = {
        memberIds: [currentUser.id, otherId],
        lastMessageText: "",
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(ref, payload, { merge: true });
    }

    setPickerOpen(false);
    setPickerQ("");
    openChat(chatId);
  };

  const send = async () => {
    if (!currentUser || !selectedChatId) return;
    const t = text.trim();
    if (!t) return;

    setSending(true);
    try {
      await addDoc(collection(db, "chats", selectedChatId, "messages"), {
        chatId: selectedChatId,
        senderId: currentUser.id,
        text: t,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "chats", selectedChatId), {
        lastMessageText: t.slice(0, 160),
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setText("");
    } finally {
      setSending(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <PageHero
        compact
        title="Xat del Club"
        subtitle="Converses privades entre socis/es, instructors i administració."
        badge={
          <span className="inline-flex items-center gap-2">
            <Pill>{(chats || []).length} converses</Pill>
            <Pill>{currentUser.role.toUpperCase()}</Pill>
          </span>
        }
      />

      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-sm overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-white/60">CONVERSES</div>
                  <div className="text-lg font-black text-white">Missatges</div>
                </div>

                <button
                  onClick={() => setPickerOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-yellow-400 text-black font-black hover:bg-yellow-500"
                >
                  Nou xat
                </button>
              </div>

              <div className="p-2">
                {myChatsPretty.length === 0 ? (
                  <div className="p-4 text-sm text-white/70">
                    Encara no tens converses. Clica <b>Nou xat</b>.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {myChatsPretty.map(({ chat, other }) => {
                      const active = chat.id === selectedChatId;
                      return (
                        <button
                          key={chat.id}
                          onClick={() => openChat(chat.id)}
                          className={`w-full text-left rounded-2xl px-4 py-3 transition border ${
                            active
                              ? "bg-yellow-400 text-black border-yellow-300"
                              : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-black truncate">
                                {displayName(other)}
                              </div>
                              <div className={`text-xs truncate ${active ? "text-black/70" : "text-white/60"}`}>
                                {chat.lastMessageText ? chat.lastMessageText : "Sense missatges"}
                              </div>
                            </div>

                            <div className={`text-[10px] font-black ${active ? "text-black/70" : "text-white/50"}`}>
                              {(other?.role || "").toUpperCase()}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-sm overflow-hidden min-h-[520px] flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-black text-white/60">XAT AMB</div>
                  <div className="text-lg font-black text-white truncate">
                    {selectedChatId ? displayName(chatPartner || undefined) : "Selecciona una conversa"}
                  </div>
                </div>

                {selectedChatId ? (
                  <div className="flex items-center gap-2">
                    <Pill>{(chatPartner?.role || "").toUpperCase() || "USUARI"}</Pill>
                  </div>
                ) : null}
              </div>

              <div className="flex-1 p-4 overflow-auto">
                {!selectedChatId ? (
                  <div className="h-full flex items-center justify-center text-white/70 text-sm">
                    Tria una conversa o crea’n una amb <b>Nou xat</b>.
                  </div>
                ) : loadingMessages ? (
                  <div className="text-white/70 text-sm">Carregant…</div>
                ) : messages.length === 0 ? (
                  <div className="text-white/70 text-sm">Encara no hi ha missatges.</div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((m) => {
                      const mine = m.senderId === currentUser.id;
                      return (
                        <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 border text-sm ${
                              mine
                                ? "bg-yellow-400 text-black border-yellow-300"
                                : "bg-white/10 text-white border-white/10"
                            }`}
                          >
                            <div className="font-semibold whitespace-pre-wrap break-words">{m.text}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10">
                <div className="flex gap-3">
                  <input
                    disabled={!selectedChatId || sending}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    className="flex-1 rounded-2xl px-4 py-3 bg-black/30 text-white border border-white/10 focus:outline-none placeholder:text-white/40"
                    placeholder={selectedChatId ? "Escriu un missatge…" : "Selecciona una conversa"}
                  />
                  <button
                    disabled={!selectedChatId || sending || !text.trim()}
                    onClick={send}
                    className={`px-6 py-3 rounded-2xl font-black ${
                      !selectedChatId || sending || !text.trim()
                        ? "bg-white/10 text-white/40 cursor-not-allowed"
                        : "bg-yellow-400 text-black hover:bg-yellow-500"
                    }`}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User picker modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-950 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-white/60">NOU XAT</div>
                <div className="text-lg font-black text-white">Selecciona un usuari</div>
              </div>
              <button
                onClick={() => setPickerOpen(false)}
                className="px-4 py-2 rounded-2xl bg-white/10 text-white font-black hover:bg-white/15"
              >
                Tancar
              </button>
            </div>

            <div className="p-5">
              <label className="text-xs font-black text-white/70">Cerca</label>
              <input
                value={pickerQ}
                onChange={(e) => setPickerQ(e.target.value)}
                className="mt-2 w-full rounded-2xl px-4 py-3 bg-black/30 text-white border border-white/10 focus:outline-none placeholder:text-white/40"
                placeholder="Nom o email…"
              />

              <div className="mt-4 space-y-2 max-h-[360px] overflow-auto pr-1">
                {filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => startChatWith(u.id)}
                    className="w-full text-left rounded-2xl px-4 py-3 border border-white/10 bg-white/5 hover:bg-white/10 text-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-black truncate">{displayName(u)}</div>
                        <div className="text-xs text-white/60 truncate">{u.email || ""}</div>
                      </div>
                      <Pill>{(u.role || "").toUpperCase()}</Pill>
                    </div>
                  </button>
                ))}
                {filteredUsers.length === 0 ? (
                  <div className="text-sm text-white/60">No hi ha resultats.</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
