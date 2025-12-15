import React, { useState } from "react";
import { Send, Bot } from "lucide-react";

type Msg = {
  from: "user" | "bot";
  text: string;
};

function generateDiveMasterResponse(input: string): string {
  const text = input.toLowerCase();

  if (text.includes("bateig")) {
    return "Per a un bateig de busseig necessites bona salut, saber nedar i ganes de gaudir del mar 🌊. Consulta les pròximes dates al calendari.";
  }

  if (text.includes("nivell") || text.includes("titulació")) {
    return "Al club treballem principalment amb titulacions FECDAS/CMAS. Pots indicar els teus nivells al perfil.";
  }

  if (text.includes("material")) {
    return "El material bàsic és: neoprè, regulador, jacket, màscara, aletes i ordinador. El club pot facilitar part del material.";
  }

  if (text.includes("sortida")) {
    return "Les sortides es publiquen al panell de Sortides. Recorda que has d’estar aprovat/da per apuntar-t’hi.";
  }

  if (text.includes("curs")) {
    return "Els cursos actius els trobaràs a l’apartat Formació. Si no en veus cap, és que encara no n’hi ha de publicats.";
  }

  if (text.includes("hola") || text.includes("bon")) {
    return "Hola! Sóc el Dive Master virtual 🤿. En què et puc ajudar?";
  }

  return (
    "No tinc una resposta concreta per això encara 🤔.\n" +
    "Pots preguntar-me sobre cursos, sortides, material o titulacions."
  );
}

export const VirtualDiveMaster: React.FC = () => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "bot",
      text: "Hola! Sóc el Dive Master virtual 🤿. Pregunta’m el que vulguis sobre el club.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((m) => [...m, { from: "user", text }]);
    setLoading(true);

    // Simulem “pensar”
    setTimeout(() => {
      const reply = generateDiveMasterResponse(text);
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow-sm flex flex-col h-[500px]">
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
            <div className="text-sm text-gray-500">El Dive Master està pensant…</div>
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
