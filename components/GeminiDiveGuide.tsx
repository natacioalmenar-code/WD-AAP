import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, Send, Sparkles, Loader2 } from 'lucide-react';

export const GeminiDiveGuide: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Debugging log to check if key is loaded (will show in browser console)
  // console.log("API Key Status:", process.env.API_KEY ? "Loaded" : "Missing");

  const handleAsk = async () => {
    // Check for API key existence
    if (!process.env.API_KEY) {
        setResponse("Error: No s'ha trobat la API Key. Revisa la configuració a Vercel.");
        return;
    }
    if (!query.trim()) return;
    
    setLoading(true);
    setResponse('');

    try {
      // Initialize with the key directly from process.env as required
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = "Ets un instructor de busseig expert del club West Divers. Respons de manera breu, útil i segura a preguntes sobre submarinisme, equipament i vida marina del Mediterrani. Utilitza un to amigable. Respon sempre en Català.";
      
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
            systemInstruction: systemInstruction,
            maxOutputTokens: 300,
        }
      });

      setResponse(result.text || "Ho sento, no he pogut processar la teva petició.");
    } catch (error) {
      console.error(error);
      setResponse("Hi ha hagut un error connectant amb el Dive Master virtual. Torna-ho a provar més tard.");
    } finally {
      setLoading(false);
    }
  };

  // Only render if key is theoretically available (or we want to show the button anyway and error later)
  // For UX, we hide it if strictly missing on load, but since we use define in vite, it might be an empty string if missing.
  if (!process.env.API_KEY) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-lg shadow-xl border border-blue-100 overflow-hidden animate-fade-in-up">
          <div className="bg-blue-600 p-3 flex justify-between items-center text-white">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles size={16} /> Virtual Dive Master
            </h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-blue-200">
                <span className="text-xl">&times;</span>
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto bg-slate-50 text-sm">
            {response ? (
              <div className="bg-blue-50 p-3 rounded-lg text-blue-900 border border-blue-100 mb-2">
                {response}
              </div>
            ) : (
              <p className="text-gray-500 italic text-center mt-10">
                Pregunta'm sobre immersions, peixos o material...
              </p>
            )}
            {loading && <Loader2 className="animate-spin mx-auto text-blue-500 mt-4" />}
          </div>
          <div className="p-3 border-t bg-white flex gap-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: Què és una termoclina?"
              className="flex-1 border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button 
                onClick={handleAsk}
                disabled={loading}
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                <Send size={16} />
            </button>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
};