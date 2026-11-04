import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Activity, Calculator, Coffee, MapPin, MessageCircle, Minus, Mountain, Music, Plus, Tag, Trees, UtensilsCrossed, Waves, X, Zap } from 'lucide-react';
import { LUGARES, TIPOS, img, cop } from './data/oferta';

const ICONOS = { rio: Waves, senderismo: Mountain, ecologico: Trees, cafetero: Coffee, aventura: Zap, gastronomico: UtensilsCrossed, cultural: Music };
const WA = import.meta.env.VITE_WHATSAPP ?? ''; // dígitos con indicativo, p. ej. 57XXXXXXXXXX
const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const nombreTipo = (id) => TIPOS.find((t) => t.id === id)?.label;
const unidad = (l) => (l.unidad === 'noche' ? 'noche' : 'persona');
const ring = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300';

const Foto = ({ l, sizes, eager, className }) => (
  <img
    src={img(l.foto, 800)}
    srcSet={`${img(l.foto, 480)} 480w, ${img(l.foto, 800)} 800w, ${img(l.foto, 1200)} 1200w`}
    sizes={sizes} alt={l.alt} width="800" height="600"
    loading={eager ? 'eager' : 'lazy'} decoding="async"
    className={`bg-slate-800 ${className}`}
  />
);

function Chips({ value, onChange }) {
  const todos = [{ id: 'todos', label: 'Todos' }, ...TIPOS];
  return (
    <div role="group" aria-label="Filtrar por tipo de turismo" className="flex flex-wrap gap-2 mb-8">
      {todos.map((t) => {
        const Icon = ICONOS[t.id];
        const on = value === t.id;
        return (
          <button key={t.id} aria-pressed={on} onClick={() => onChange(t.id)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${ring} ${on ? 'bg-emerald-400 text-slate-950 font-semibold' : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-emerald-500/60'}`}>
            {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}{t.label}
          </button>
        );
      })}
    </div>
  );
}

const Tipos = ({ l }) => (
  <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-emerald-300">
    {l.tipos.map((t) => { const I = ICONOS[t]; return <span key={t} className="inline-flex items-center gap-1"><I className="w-3.5 h-3.5" aria-hidden="true" />{nombreTipo(t)}</span>; })}
  </p>
);

function Ofertas({ abrir }) {
  const [tipo, setTipo] = useState('todos');
  const lista = tipo === 'todos' ? LUGARES : LUGARES.filter((l) => l.tipos.includes(tipo));
  return (
    <>
      <Chips value={tipo} onChange={setTipo} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {lista.map((l) => (
            <motion.article layout key={l.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <Foto l={l} sizes="(min-width:1024px) 33vw,(min-width:768px) 50vw,100vw" className="h-52 w-full object-cover" />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <Tipos l={l} />
                <h3 className="font-display text-xl font-bold leading-snug">{l.titulo}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{l.desc}</p>
                <p className="mt-auto pt-2 text-slate-300">Desde <strong className="text-lg text-emerald-300">{cop.format(l.precio)}</strong> por {unidad(l)}</p>
                <button onClick={() => abrir(l)} className={`rounded-xl border border-emerald-500/40 py-2.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-400 hover:text-slate-950 transition-colors ${ring}`}>Ver detalle</button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

function Precios() {
  const [sel, setSel] = useState({}); // { id: cantidad }
  const set = (id, q) => setSel((s) => { const n = { ...s }; q > 0 ? (n[id] = Math.min(q, 30)) : delete n[id]; return n; });
  const items = LUGARES.filter((l) => sel[l.id]);
  const total = items.reduce((a, l) => a + l.precio * sel[l.id], 0);
  const resumen = `Hola, quiero cotizar en Manaure:\n${items.map((l) => `• ${l.titulo}: ${sel[l.id]} ${unidad(l)}${sel[l.id] > 1 ? (l.unidad === 'noche' ? 's' : 's') : ''}`).join('\n')}\nTotal estimado: ${cop.format(total)}`;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <ul className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900">
        {[...LUGARES].sort((a, b) => a.precio - b.precio).map((l) => {
          const q = sel[l.id] ?? 0;
          return (
            <li key={l.id} className="flex flex-wrap items-center gap-4 p-4">
              <label className="flex min-w-0 flex-1 basis-60 cursor-pointer items-start gap-3">
                <input type="checkbox" checked={q > 0} onChange={(e) => set(l.id, e.target.checked ? 1 : 0)} className="mt-1 h-5 w-5 accent-emerald-400" />
                <span><span className="block font-medium">{l.titulo}</span><span className="text-sm text-slate-400">{cop.format(l.precio)} por {unidad(l)}</span></span>
              </label>
              {q > 0 && (
                <div className="flex items-center gap-3" role="group" aria-label={`Cantidad de ${unidad(l)}s`}>
                  <button aria-label="Quitar uno" onClick={() => set(l.id, q - 1)} className={`rounded-full border border-slate-700 p-2 ${ring}`}><Minus className="w-4 h-4" /></button>
                  <output className="w-16 text-center text-sm">{q} {unidad(l)}{q > 1 ? 's' : ''}</output>
                  <button aria-label="Añadir uno" onClick={() => set(l.id, q + 1)} className={`rounded-full border border-slate-700 p-2 ${ring}`}><Plus className="w-4 h-4" /></button>
                  <span className="w-28 text-right font-semibold text-emerald-300">{cop.format(l.precio * q)}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <aside className="h-fit rounded-2xl border border-emerald-500/30 bg-slate-900 p-5 lg:sticky lg:top-24" aria-live="polite">
        <p className="text-sm text-slate-400">Total estimado</p>
        <p className="font-display text-3xl font-extrabold text-emerald-300">{cop.format(total)}</p>
        <p className="mt-2 mb-4 text-xs text-slate-500">Precios sugeridos; confirma disponibilidad y tarifas con el operador.</p>
        <a href={items.length ? wa(resumen) : undefined} aria-disabled={!items.length} target="_blank" rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 rounded-xl py-3 font-semibold ${ring} ${items.length ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300' : 'bg-slate-800 text-slate-500 pointer-events-none'}`}>
          <MessageCircle className="w-4 h-4" aria-hidden="true" /> Cotizar por WhatsApp
        </a>
      </aside>
    </div>
  );
}

function Atractivos({ abrir }) {
  return (
    <div className="grid gap-10">
      {LUGARES.filter((l) => l.atractivo).map((l, i) => (
        <article key={l.id} className="grid items-center gap-6 md:grid-cols-2">
          <Foto l={l} sizes="(min-width:768px) 50vw,100vw" className={`h-72 w-full rounded-2xl object-cover ${i % 2 ? 'md:order-2' : ''}`} />
          <div className="space-y-3">
            <Tipos l={l} />
            <h3 className="font-display text-2xl font-bold">{l.titulo}</h3>
            <p className="leading-relaxed text-slate-300">{l.desc}</p>
            <ul className="flex flex-wrap gap-2">{l.actividades.map((a) => <li key={a} className="rounded-full bg-slate-900 border border-slate-700 px-3 py-1 text-sm text-slate-300">{a}</li>)}</ul>
            <button onClick={() => abrir(l)} className={`font-semibold text-emerald-300 underline underline-offset-4 ${ring}`}>Ver detalle y precio</button>
          </div>
        </article>
      ))}
    </div>
  );
}

function Actividades({ abrir }) {
  const [tipo, setTipo] = useState('todos');
  const filas = useMemo(() => LUGARES.filter((l) => tipo === 'todos' || l.tipos.includes(tipo)).flatMap((l) => l.actividades.map((a) => ({ a, l }))), [tipo]);
  return (
    <>
      <Chips value={tipo} onChange={setTipo} />
      <ul className="grid gap-3 md:grid-cols-2">
        <AnimatePresence>
          {filas.map(({ a, l }) => (
            <motion.li layout key={l.id + a} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button onClick={() => abrir(l)} className={`flex w-full items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 text-left hover:border-emerald-500/60 transition-colors ${ring}`}>
                <span><span className="block font-medium">{a}</span><span className="text-sm text-slate-400">{l.titulo}</span></span>
                <span className="shrink-0 text-sm text-emerald-300">{cop.format(l.precio)}</span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
}

function Detalle({ l, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement, overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current.querySelector('button').focus();
    const onKey = (e) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab') return;
      const f = ref.current.querySelectorAll('button,a[href]');
      const [first, last] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; prev?.focus?.(); };
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <motion.div ref={ref} role="dialog" aria-modal="true" aria-labelledby="dlg-t" initial={{ y: 24, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, scale: 0.97 }}
        className="max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900">
        <div className="relative">
          <Foto l={l} sizes="32rem" className="h-52 w-full object-cover" />
          <button onClick={onClose} aria-label="Cerrar" className={`absolute right-3 top-3 rounded-full bg-slate-950/80 p-2 ${ring}`}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4 p-6">
          <Tipos l={l} />
          <h3 id="dlg-t" className="font-display text-2xl font-bold">{l.titulo}</h3>
          <p className="text-sm leading-relaxed text-slate-300">{l.desc}</p>
          <ul className="space-y-1.5 text-sm">{l.actividades.map((a) => <li key={a} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{a}</li>)}</ul>
          <p className="text-slate-300">Tarifa sugerida: <strong className="text-xl text-emerald-300">{cop.format(l.precio)}</strong> por {unidad(l)}</p>
          <a href={wa(`Hola, quiero información sobre: ${l.titulo}`)} target="_blank" rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 rounded-xl bg-emerald-400 py-3 font-semibold text-slate-950 hover:bg-emerald-300 ${ring}`}><MessageCircle className="w-4 h-4" aria-hidden="true" /> Reservar o pedir informes</a>
        </div>
      </motion.div>
    </motion.div>
  );
}

const TABS = [
  { id: 'ofertas', label: 'Ofertas', Icon: Tag, Panel: Ofertas },
  { id: 'precios', label: 'Precios', Icon: Calculator, Panel: Precios },
  { id: 'atractivos', label: 'Atractivos', Icon: MapPin, Panel: Atractivos },
  { id: 'actividades', label: 'Actividades', Icon: Activity, Panel: Actividades },
];

export default function App() {
  const [tab, setTab] = useState('ofertas');
  const [lugar, setLugar] = useState(null);
  const cerrar = useCallback(() => setLugar(null), []);
  const { Panel } = TABS.find((t) => t.id === tab);
  const onKeyTabs = (e) => {
    const i = TABS.findIndex((t) => t.id === tab);
    const n = { ArrowRight: i + 1, ArrowLeft: i - 1 }[e.key];
    if (n === undefined) return;
    const next = TABS[(n + TABS.length) % TABS.length].id;
    setTab(next); document.getElementById(`tab-${next}`).focus();
  };
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-slate-950 font-sans text-slate-100 selection:bg-emerald-400 selection:text-slate-950">
        <header className="relative flex min-h-[70svh] items-end overflow-hidden px-6 pb-14 pt-24 md:px-12">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=75" alt="" width="1600" height="1067" fetchPriority="high" decoding="async"
            className="absolute inset-0 h-full w-full object-cover brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }} className="relative max-w-3xl">
            <p className="mb-3 flex items-center gap-2 text-emerald-300"><MapPin className="w-4 h-4" aria-hidden="true" /> Corpotur Manaure, Balcón del Cesar</p>
            <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">Montaña, río, café y vallenato en un solo lugar</h1>
            <p className="mt-5 max-w-xl text-lg text-slate-200">Manaure, en la Serranía del Perijá, reúne turismo de río, senderismo, ecoturismo, café, aventura y gastronomía.</p>
            <button onClick={() => document.getElementById('explorar').scrollIntoView({ behavior: 'smooth' })} className={`mt-7 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-300 ${ring}`}>Explorar experiencias</button>
          </motion.div>
        </header>

        <main id="explorar" className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
          <div role="tablist" aria-label="Secciones" onKeyDown={onKeyTabs} className="sticky top-0 z-30 -mx-4 mb-8 flex gap-1 overflow-x-auto border-b border-slate-800 bg-slate-950/90 px-4 backdrop-blur md:mx-0 md:px-0">
            {TABS.map(({ id, label, Icon }) => (
              <button key={id} role="tab" id={`tab-${id}`} aria-selected={tab === id} aria-controls="panel" tabIndex={tab === id ? 0 : -1} onClick={() => setTab(id)}
                className={`relative inline-flex shrink-0 items-center gap-2 px-5 py-4 text-sm font-medium transition-colors ${ring} ${tab === id ? 'text-emerald-300' : 'text-slate-400 hover:text-white'}`}>
                <Icon className="w-4 h-4" aria-hidden="true" />{label}
                {tab === id && <motion.span layoutId="subrayado" className="absolute inset-x-3 bottom-0 h-0.5 bg-emerald-400" />}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.section key={tab} id="panel" role="tabpanel" aria-labelledby={`tab-${tab}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Panel abrir={setLugar} />
            </motion.section>
          </AnimatePresence>
        </main>

        <footer className="border-t border-slate-900 py-8 text-center text-sm text-slate-500">© {new Date().getFullYear()} Corpotur Manaure, Balcón del Cesar</footer>
        <AnimatePresence>{lugar && <Detalle l={lugar} onClose={cerrar} />}</AnimatePresence>
      </div>
    </MotionConfig>
  );
}
