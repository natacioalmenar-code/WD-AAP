import React, { useState } from "react";
import { Bot, Send } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Trip, Course, SocialEvent } from "../types";

type Msg = {
  from: "user" | "bot";
  text: string;
};

export const VirtualDiveMaster: React.FC = () => {
  const {
    currentUser,
    trips,
    courses,
    socialEvents,
    isActiveMember,
    canManageSystem,
  } = useApp();

  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "bot",
      text:
        "Hola! Sóc el Dive Master virtual 🤿\n" +
        "Pots preguntar-me sobre sortides, cursos, esdeveniments o el funcionament del club.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ====== MOTOR INTEL·LIGENT ======
  function answer(text: string): string {
    const t = text.toLowerCase();

    // 👋 Salutacions
    if (t.includes("hola") || t.includes("bon")) {
      return "Hola! 🤿 En què et puc ajudar avui?";
    }

    // 🚫 Pending
    if (!isActiveMember() && !canManageSystem()) {
      return (
        "El teu compte encara està pendent d’aprovació ⏳.\n" +
        "Quan l’administració t’activi, podràs apuntar-te a sortides i cursos."
      );
    }

    // 📅 SORTIDES
    if (t.includes("sortida")) {
      const upcoming = trips.filter(
        (x) => x.published && x.status === "active"
      );

      if (upcoming.length === 0) {
        return "Ara mateix no hi ha sortides publicades.";
      }

      const list = upcoming
        .slice(0, 3)
        .map((s) => `• ${s.title} (${s.date})`)
        .join("\n");

      return (
        "Aquestes són les pròximes sortides 🤿:\n" +
        list +
        "\n\nLes pots veure totes a l’apartat Sortides."
      );
    }

    // 🎓 CURSOS
    if (t.includes("curs")) {
      const active = courses.filter(
        (c) => c.published && c.status === "active"
      );

      if (active.length === 0) {
        return "Actualment no hi ha cursos actius.";
      }

      const list = active
        .slice(0, 3)
        .map((c) => `• ${c.title} (${c.date})`)
        .join("\n");

      return (
        "Cursos disponibles 🎓:\n" +
        list +
        "\n\nPots inscriure-t’hi des de l’apartat Formació."
      );
    }

    // 🎉 ESDEVENIMENTS
    if (t.includes("esdeveniment") || t.includes("sopar")) {
      const events = socialEvents.filter(
        (e) => e.published && e.status === "active"
      );

      if (events.length === 0) {
        return "No hi ha esdeveniments socials publicats ara mateix.";
      }

      const list = events
        .slice(0, 3)
        .map((e) => `• ${e.title} (${e.date})`)
        .join("\n");

      return (
        "Esdeveniments del club 🎉:\n" +
        list +
        "\n\nSón ideals per fer pinya!"
      );
    }

    // 🤿 NIVELL
    if (t.includes("nivell") || t.includes("b1e") || t.includes("b2e")) {
      return (
        "El teu nivell de busseig el pots gestionar des del teu perfil 🤿.\n" +
        "Les sortides indiquen el nivell recomanat."
      );
    }

    // 👑 ADMIN
    if (canManageSystem() && t.includes("admin")) {
      return (
        "Com a administrador/a pots:\n" +
        "• Crear i publicar sortides\n" +
        "• Crear cursos\n" +
        "• Gestionar esdeveniments\n" +
        "• Aprovar socis/es\n\n" +
        "Tot des del panell d’administració."
      );
    }

    // ❓ Fallback
    return (
      "No ho tinc del tot clar 🤔.\n" +
      "Pots preguntar-me sobre sortides, cursos, esdeveniments o nivells."
    );
  }

  // ====== ENVIAR ======
  const send = () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((m) => [...m, { from: "user", text }]);
    setLoading(true);

    setTimeout(() => {
      const reply = answer(text);
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow-sm flex flex-col h-[520px]">
        <div className="p-4 border-b flex items-center gap-2 font-extrabold">
          <Bot /> Virtual Dive Master
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[75%] rounded-xl px-4 py-2 text-sm whitespace-pre-line ${
                m.from === "user"
                  ? "ml-auto bg-yellow-400 font-bold"
                  : "bg-gray-100"
              }`}
            >
              {m.text}
            </div>
          ))}

          {loading && (
            <div className="text-sm text-gray-500">
              El Dive Master està pensant…
            </div>
          )}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input
            className="flex-1 border rounded-xl px-3 py-2"
            placeholder="Pregunta al Dive Master…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            className="px-4 py-2 rounded-xl bg-black text-white font-bold hover:bg-gray-900"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
