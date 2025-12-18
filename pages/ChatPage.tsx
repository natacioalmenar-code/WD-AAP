import React, { useEffect, useMemo, useRef, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, addDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useApp } from "../context/AppContext";
import { PageHero } from "../components/PageHero";

type ChatMsg = {
  id: string;
  text: string;
  createdAt?: any;
  uid: string;
  name: string;
  avatarUrl?: string;
};

const ROOM_ID = "club";

export const ChatPage: React.FC = () => {
  const { currentUser, users, canManageSystem, isActiveMember } = useApp();
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  const userName = useMemo(
    () => (uid: string) => users.find((u) => u.id === uid)?.name || "Soci/a",
    [users]
  );

  useEffect(() => {
    // assegura room doc (admin pot crear; però si no existeix, igual llegirem missatges)
    const roomRef = doc(db, "chatRooms", ROOM_ID);
    if (canManageSystem()) {
      setDoc(roomRef, { title: "Xat del Club", updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
    }

    const qy = query(collection(db, "chatRooms", ROOM_ID, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(qy, (snap) => {
      const list = snap.docs.map((d) => ({ ...(d.data() as any), id: d.id })) as ChatMsg[];
      setMsgs(list);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    });

    return () => unsub();
  }, [canManageSystem]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!isActiveMember()) return alert("Has d’estar aprovat/da per parlar al xat.");
    const t = text.trim();
    if (!t) return;

    await addDoc(collection(db, "chatRooms", ROOM_ID, "messages"), {
      text: t,
      uid: currentUser.id,
      name: currentUser.name || userName(currentUser.id),
      avatarUrl: currentUser.avatarUrl || "",
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white border rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Has d’iniciar sessió</h1>
          <p className="text-slate-600 mt-2">Per usar el xat, primer fes login.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200">
      <PageHero
        compact
        title="Xat del Club"
        subtitle="Parla amb socis/es i instructors/es — estil WhatsApp."
        badge={<span>Participants: <b>{users.length}</b></span>}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-3xl border bg-white/70 backdrop-blur shadow-sm overflow-hidden">
          <div className="p-5 border-b bg-white/60">
            <div className="text-sm font-black text-slate-900">Sala general</div>
            <div className="text-xs text-slate-600">Missatges en temps real</div>
          </div>

          <div className="p-5 h-[60vh] overflow-y-auto space-y-3">
            {msgs.length === 0 ? (
              <div className="text-sm text-slate-600">Encara no hi ha missatges. Escriu el primer 👇</div>
            ) : null}

            {msgs.map((m) => {
              const mine = m.uid === currentUser.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[78%] rounded-3xl px-4 py-3 border shadow-sm ${mine ? "bg-slate-900 text-white border-slate-900" : "bg-white/80 text-slate-900"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {!mine && (
                        <div className="h-7 w-7 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center">
                          {m.avatarUrl ? (
                            <img src={m.avatarUrl} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-yellow-300 font-black text-xs">
                              {(m.name || "S").slice(0, 1).toUpperCase()}
                            </span>
                          )}
                        </div>
                      )}
                      <div className={`text-xs font-black ${mine ? "text-yellow-300" : "text-slate-600"}`}>
                        {mine ? "Tu" : (m.name || userName(m.uid))}
                      </div>
                    </div>

                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</div>
                  </div>
                </div>
              );
            })}

            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="p-4 border-t bg-white/60 flex gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 rounded-2xl border px-4 py-3 bg-white/80 focus:outline-none"
              placeholder="Escriu un missatge…"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-yellow-400 text-black font-black hover:bg-yellow-500"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
