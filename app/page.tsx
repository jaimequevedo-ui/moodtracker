/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMoods, Mood, Energy } from '@/hooks/use-moods';
import { UserCircle2 } from 'lucide-react';

// Constants
const MOODS: { id: Mood; emoji: string; label: string; colorClass: string }[] = [
  { id: 'increible', emoji: '😄', label: 'Increíble', colorClass: 'bg-primary text-on-primary-container shadow-[0_0_15px_rgba(105,246,184,0.3)]' },
  { id: 'bien', emoji: '😊', label: 'Bien', colorClass: 'bg-primary-container text-on-primary-container' },
  { id: 'normal', emoji: '😐', label: 'Normal', colorClass: 'bg-secondary-container text-on-secondary-container' },
  { id: 'mal', emoji: '😞', label: 'Mal', colorClass: 'bg-tertiary-container text-on-tertiary-container' },
  { id: 'horrible', emoji: '😢', label: 'Horrible', colorClass: 'bg-error-container text-on-error-container' },
];

const ENERGIES: { id: Energy; label: string }[] = [
  { id: 'baja', label: 'Baja' },
  { id: 'media', label: 'Media' },
  { id: 'alta', label: 'Alta' },
];

const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Helper to format date as YYYY-MM-DD
const formatDateStr = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Home() {
  const { moods, saveMood, isLoaded } = useMoods();
  const [today] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // Form State
  const [emoji, setEmoji] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [energy, setEnergy] = useState<Energy>('media');
  const [word, setWord] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load data when selected date changes
  useEffect(() => {
    const dateStr = formatDateStr(selectedDate);
    const entry = moods[dateStr];
    if (entry) {
      setEmoji(entry.emoji);
      setNote(entry.note);
      setEnergy(entry.energy);
      setWord(entry.word);
    } else {
      setEmoji(null);
      setNote('');
      setEnergy('media');
      setWord('');
    }
  }, [selectedDate, moods]);

  // Calendar Calculations
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emoji) return; // Require at least a mood

    setIsSaving(true);
    const dateStr = formatDateStr(selectedDate);
    saveMood(dateStr, {
      emoji,
      note,
      energy,
      word,
      timestamp: Date.now(),
    });

    setTimeout(() => setIsSaving(false), 600);
  };

  // Format selected date for display
  const displayDate = selectedDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Background Lights */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-tertiary-container/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full border-none bg-gradient-to-b from-surface to-transparent sticky top-0 z-50">
        <div className="flex justify-between items-center px-6 md:px-10 py-6 md:py-8 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <span className="font-headline italic text-2xl text-primary">Mood-Tracker</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-3 px-4 md:px-6 py-2.5 rounded-full bg-surface-container-high hover:bg-surface-bright transition-all duration-300 group">
              <span className="text-on-surface-variant font-medium text-xs md:text-sm hidden sm:block">Inicia sesión con Google</span>
              <span className="text-on-surface-variant font-medium text-xs md:text-sm sm:hidden">Entrar</span>
              <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center">
                <UserCircle2 className="text-primary w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 md:px-10 pt-4 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Left Column: Calendar */}
        <aside className="lg:col-span-4 xl:col-span-3 order-2 lg:order-1">
          <div className="lg:sticky lg:top-32 space-y-8">
            <div>
              <h2 className="font-headline text-3xl font-light mb-2 capitalize">{MONTHS[currentMonth.getMonth()]}</h2>
              <p className="font-body text-on-surface-variant text-xs tracking-widest uppercase">Tu flujo emocional</p>
            </div>

            <div className="bg-surface-container-low p-6 md:p-8 rounded-2xl">
              <div className="grid grid-cols-7 gap-2 md:gap-3 text-center mb-6">
                {DAYS_OF_WEEK.map(day => (
                  <span key={day} className="text-[10px] uppercase font-bold text-on-surface-variant/50 tracking-tighter">{day}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 md:gap-3">
                {/* Empty leading days */}
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Calendar Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
                  const dateStr = formatDateStr(dateObj);
                  const entry = moods[dateStr];
                  const isSelected = formatDateStr(selectedDate) === dateStr;
                  const isToday = formatDateStr(today) === dateStr;

                  let btnClass = "aspect-square rounded-full flex items-center justify-center text-xs transition-all relative ";

                  if (entry) {
                    const moodDef = MOODS.find(m => m.id === entry.emoji);
                    btnClass += moodDef ? moodDef.colorClass : "bg-surface-container-highest text-on-surface-variant";
                    if (isSelected) {
                      btnClass += " ring-2 ring-white ring-offset-2 ring-offset-surface-container-low";
                    }
                  } else {
                    btnClass += "bg-surface-container-highest text-on-surface-variant hover:bg-surface-bright";
                    if (isSelected) {
                      btnClass += " ring-1 ring-primary text-primary font-bold";
                    } else if (isToday) {
                      btnClass += " border border-primary/40 text-primary font-bold";
                    }
                  }

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDate(dateObj)}
                      className={btnClass}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="p-6 bg-surface-container-highest/20 rounded-2xl space-y-4 border border-white/5">
              <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">Leyenda de color</p>
              <div className="flex flex-wrap gap-4">
                {MOODS.map(m => (
                  <div key={m.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${m.colorClass.split(' ')[0]}`} />
                    <span className="text-[10px] text-on-surface-variant">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Entry Form */}
        <section className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2">
          <div className="max-w-[800px] mx-auto">
            <header className="mb-10 md:mb-12">
              <span className="text-primary font-body text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 block capitalize">
                {displayDate}
              </span>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
                ¿Cómo te sientes hoy?
              </h1>
            </header>

            <form onSubmit={handleSave} className="space-y-12 md:space-y-16">
              {/* Mood Selector */}
              <div className="space-y-6">
                <p className="font-body text-on-surface-variant text-xs md:text-sm tracking-wider uppercase">Estado de ánimo</p>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {MOODS.map(m => {
                    const isSelected = emoji === m.id;
                    return (
                      <label key={m.id} className="relative cursor-pointer group">
                        <input
                          type="radio"
                          name="mood"
                          className="peer sr-only"
                          checked={isSelected}
                          onChange={() => setEmoji(m.id)}
                        />
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          animate={{
                            backgroundColor: isSelected ? 'rgba(6, 183, 127, 0.15)' : 'var(--color-surface-container-low)',
                            borderColor: isSelected ? 'rgba(105, 246, 184, 0.4)' : 'transparent',
                          }}
                          className={`px-4 md:px-6 py-3 md:py-4 rounded-2xl border transition-colors flex flex-col items-center gap-2`}
                        >
                          <motion.span
                            animate={{
                              scale: isSelected ? 1.2 : 1,
                              filter: isSelected ? 'grayscale(0%)' : 'grayscale(100%)'
                            }}
                            className="text-2xl md:text-3xl transition-all duration-300 group-hover:grayscale-0"
                          >
                            {m.emoji}
                          </motion.span>
                          <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                            {m.label}
                          </span>
                        </motion.div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Journal Textarea */}
              <div className="space-y-4">
                <label className="font-headline text-xl md:text-2xl font-light italic text-on-surface">¿Qué ha pasado hoy?</label>
                <div className="relative">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={150}
                    placeholder="Escribe tus reflexiones aquí..."
                    rows={3}
                    className="w-full bg-surface-container-low border border-transparent focus:border-primary/30 rounded-2xl focus:ring-0 text-lg md:text-xl font-body py-5 md:py-6 px-6 md:px-8 placeholder:text-on-surface-variant/30 resize-none transition-all focus:bg-surface-container outline-none"
                  />
                  <span className="absolute bottom-4 right-6 text-[9px] md:text-[10px] text-on-surface-variant tracking-widest uppercase">
                    {note.length} / 150
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
                {/* Energy Selector */}
                <div className="space-y-6">
                  <p className="font-body text-on-surface-variant text-xs md:text-sm tracking-wider uppercase">Nivel de energía</p>
                  <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-full">
                    {ENERGIES.map(e => {
                      const isSelected = energy === e.id;
                      return (
                        <label key={e.id} className="flex-1 cursor-pointer relative">
                          <input
                            type="radio"
                            name="energy"
                            className="peer sr-only"
                            checked={isSelected}
                            onChange={() => setEnergy(e.id)}
                          />
                          <div className="relative z-10 py-2.5 md:py-3 text-center rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors text-on-surface-variant peer-checked:text-on-primary">
                            {e.label}
                          </div>
                          {isSelected && (
                            <motion.div
                              layoutId="energy-bg"
                              className="absolute inset-0 bg-primary rounded-full z-0"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* One Word Field */}
                <div className="space-y-6">
                  <p className="font-body text-on-surface-variant text-xs md:text-sm tracking-wider uppercase">Una palabra para hoy</p>
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    maxLength={30}
                    placeholder="Ej: Calma"
                    className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 transition-all py-2 text-xl md:text-2xl font-headline italic placeholder:text-on-surface-variant/20 outline-none"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isSaving ? {
                    backgroundColor: "var(--color-primary-container)",
                    boxShadow: "0 0 60px rgba(105,246,184,0.6)"
                  } : {
                    backgroundColor: "var(--color-primary)",
                    boxShadow: "0 10px 40px rgba(6,183,127,0.2)"
                  }}
                  disabled={!emoji}
                  type="submit"
                  className="w-full md:w-auto px-10 md:px-12 py-4 md:py-5 rounded-full text-on-primary-container font-bold text-xs md:text-sm uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  {isSaving ? 'Guardado ✨' : 'Guardar Registro'}
                </motion.button>
              </div>
            </form>

            {/* Daily Summary Glass Reflection (Only show if there's an entry for today) */}
            <AnimatePresence>
              {moods[formatDateStr(today)] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-16 md:mt-24 p-8 md:p-10 rounded-3xl backdrop-blur-xl bg-surface-container-highest/30 border border-white/5 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                      <h3 className="font-headline text-2xl md:text-3xl font-light mb-3 md:mb-4 text-on-surface">Tu reflejo de hoy</h3>
                      <p className="font-body text-on-surface-variant text-sm md:text-base max-w-md leading-relaxed">
                        Has registrado una energía <span className="text-primary italic capitalize">{moods[formatDateStr(today)].energy}</span>.
                        {moods[formatDateStr(today)].word && (
                          <> Tu palabra del día es <span className="text-primary font-bold">&quot;{moods[formatDateStr(today)].word}&quot;</span>.</>
                        )}
                      </p>
                    </div>
                    <div className="flex -space-x-4">
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl shadow-xl border-4 border-surface ${MOODS.find(m => m.id === moods[formatDateStr(today)].emoji)?.colorClass}`}>
                        {MOODS.find(m => m.id === moods[formatDateStr(today)].emoji)?.emoji}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>
      </main>
    </div>
  );
}
