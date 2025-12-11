import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-slate-950">
              WD
            </div>
            <div>
              <h1 className="font-semibold text-lg">West Divers</h1>
              <p className="text-xs text-slate-400">
                App del club de busseig
              </p>
            </div>
          </div>
          <span className="hidden sm:inline text-xs text-slate-400">
            Versió demo desplegada
          </span>
        </div>
      </header>

      {/* CONTINGUT PRINCIPAL */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

          {/* Hero */}
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold">
                Benvingut/da a la app de <span className="text-cyan-400">West Divers</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Aquesta és una primera versió mínima de l&apos;aplicació web,
                pensada per poder-la desplegar fàcilment. Més endavant hi
                podrem afegir el panell de socis, sortides, calendari,
                cursos privats i molt més.
              </p>
              <ul className="text-sm text-slate-300 list-disc pl-5 space-y-1">
                <li>Gestió de sortides i immersions del club</li>
                <li>Inscripcions dels socis amb un sol clic</li>
                <li>Panell d&apos;administració per instructors i organitzadors</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 text-sm text-slate-200 space-y-3">
              <h3 className="font-semibold text-slate-100">
                Estat del desplegament
              </h3>
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 px-3 py-2 text-xs flex items-center justify-between">
                <span>Build Vercel</span>
                <span className="font-mono text-emerald-300">OK ✅</span>
              </div>
              <p className="text-xs text-slate-400">
                Si estàs veient aquesta pantalla a production, vol dir
                que el build de Vercel ja funciona correctament i
                l&apos;app està desplegada.
              </p>
            </div>
          </section>

          {/* Bloc “Properament” */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-100">
              Què hi afegirem més endavant
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="space-y-1">
                <p className="font-semibold text-slate-100">Panell de soci</p>
                <p>Perfil, nivell, llicència, historial de bussejos…</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-100">Gestió de sortides</p>
                <p>Llista de sortides, places disponibles i inscripcions.</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-100">Assistent IA</p>
                <p>
                  Un guia intel·ligent per recomanar immersions, revisar
                  condicions i resoldre dubtes.
                </p>
              </div>
            </div>
          </section>

          {/* Nota tècnica */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-[11px] text-slate-400 space-y-1">
            <p>
              Aquesta versió està feta amb <span className="font-mono">React + Vite + TailwindCSS</span> i
              simplificada perquè el build no falli per mòduls inexistents
              (components i pàgines que encara no s&apos;han creat).
            </p>
            <p>
              Un cop el desplegament estigui estable, podem afegir de nou
              la resta de pantalles i el codi de l&apos;assistent IA pas a pas.
            </p>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-900/80">
        <div className="max-w-5xl mx-auto px-4 py-3 text-[11px] text-slate-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} West Divers</span>
          <span>Primera versió desplegada de l&apos;app del club</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
