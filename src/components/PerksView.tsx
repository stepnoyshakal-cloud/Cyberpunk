import React from 'react';
import { GameState } from '../types';
import { GameAction } from '../gameReducer';
import { PERKS, PerkDef } from '../perksData';
import { 
  Cpu, 
  Zap, 
  ShieldAlert, 
  HeartPulse, 
  ShieldCheck, 
  Flame, 
  Pickaxe, 
  Bot, 
  FlaskConical, 
  Check, 
  Lock, 
  Sparkles, 
  RotateCcw,
  Network,
  Shield,
  Activity,
  FastForward,
  Terminal,
  Brain,
  Wrench,
  Hammer
} from 'lucide-react';
import { playHackSound, playClickSound } from '../sound';

interface PerksViewProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Cpu,
  Zap,
  ShieldAlert,
  HeartPulse,
  ShieldCheck,
  Flame,
  Pickaxe,
  Bot,
  FlaskConical,
  Shield,
  Activity,
  FastForward,
  Terminal,
  Brain,
  Wrench,
  Hammer,
  Sparkles
};

const CATEGORIES = [
  { id: 'solo' as const, name: 'Ветка Соло (Бой)', color: 'rose', icon: Flame, desc: 'Огневая мощь, вампиризм и тяжелая живучесть' },
  { id: 'netrunner' as const, name: 'Ветка Нетраннинга', color: 'cyan', icon: Network, desc: 'Пассивные данные, ускорение взлома и защита разума' },
  { id: 'techie' as const, name: 'Ветка Техника', color: 'amber', icon: Bot, desc: 'Эффективность сбора утиля, буст дрона и стимуляторы' },
];

export default function PerksView({ state, dispatch }: PerksViewProps) {
  const [confirmReset, setConfirmReset] = React.useState(false);
  const currentPerks = state.perks || [];
  const perkPoints = state.perkPoints ?? 0;

  const handleBuyPerk = (perk: PerkDef) => {
    playHackSound();
    dispatch({ type: 'BUY_PERK', perkId: perk.id });
  };

  const handleResetPerks = () => {
    if (currentPerks.length === 0) return;
    playClickSound();
    setConfirmReset(true);
  };

  const executeReset = () => {
    dispatch({ type: 'RESET_PERKS' });
    setConfirmReset(false);
  };

  const canBuy = (perk: PerkDef): { ok: boolean; reason?: string } => {
    if (currentPerks.includes(perk.id)) {
      return { ok: false, reason: 'Изучено' };
    }
    if (perkPoints < perk.cost) {
      return { ok: false, reason: `Нужно ${perk.cost} очка(ов) перков` };
    }
    if (perk.requires && !currentPerks.includes(perk.requires)) {
      const prereqPerk = PERKS.find(p => p.id === perk.requires);
      return { ok: false, reason: `Требуется: ${prereqPerk?.name || perk.requires}` };
    }
    return { ok: true };
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-cyan-400 tracking-wider">КИБЕР-НЕЙРОСЕТЬ</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
              Дерево навыков
            </span>
          </div>
          <p className="text-slate-400 mt-1">
            Модифицируйте свое сознание и тело имплантами нейро-узлов. Очки перков даются за каждые 3 уровня любого навыка (на 3, 6, 9, 12, 15, 18... ур.).
          </p>
        </div>

        {/* Status Card & Reset */}
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-3 rounded-lg">
          <div className="flex items-center gap-3 pr-4 border-r border-slate-800">
            <Sparkles className="text-yellow-400" size={20} />
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Очки перков</div>
              <div className="text-2xl font-mono font-bold text-yellow-400">{perkPoints}</div>
            </div>
          </div>

          <div className="pr-4 border-r border-slate-800 hidden sm:block">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Изучено</div>
            <div className="text-lg font-mono font-bold text-emerald-400">
              {currentPerks.length} / {PERKS.length}
            </div>
          </div>

          {confirmReset ? (
            <div className="flex items-center gap-2">
              <button
                onClick={executeReset}
                className="flex items-center gap-1 px-3 py-2 rounded text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Точно?
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex items-center gap-1 px-3 py-2 rounded text-xs font-bold border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
              >
                Отмена
              </button>
            </div>
          ) : (
            <button
              onClick={handleResetPerks}
              disabled={currentPerks.length === 0}
              className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-bold border transition-colors ${
                currentPerks.length > 0
                  ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  : 'border-slate-800/60 bg-slate-950 text-slate-600 cursor-not-allowed'
              }`}
              title="Сбросить все перки и вернуть очки"
            >
              <RotateCcw size={14} />
              Сброс
            </button>
          )}
        </div>
      </div>

      {/* Perk Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {CATEGORIES.map(category => {
          const categoryPerks = PERKS.filter(p => p.branch === category.id);
          const CatIcon = category.icon;

          return (
            <div key={category.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center gap-2.5 mb-2 pb-3 border-b border-slate-800">
                  <div className={`p-2 rounded-lg ${
                    category.id === 'netrunner' ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30' :
                    category.id === 'solo' ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30' :
                    'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                  }`}>
                    <CatIcon size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-200">{category.name}</h2>
                    <p className="text-[11px] text-slate-400">{category.desc}</p>
                  </div>
                </div>

                {/* Vertical tree representation */}
                <div className="space-y-4 my-4 relative">
                  {categoryPerks.map((perk, index) => {
                    const isUnlocked = currentPerks.includes(perk.id);
                    const buyCheck = canBuy(perk);
                    const PerkIcon = ICON_MAP[perk.icon] || Cpu;

                    return (
                      <div key={perk.id} className="relative">
                        {/* Connecting vertical line if there is next */}
                        {index < categoryPerks.length - 1 && (
                          <div 
                            className={`absolute left-6 top-12 bottom-[-16px] w-0.5 z-0 ${
                              isUnlocked ? 'bg-cyan-500/50' : 'bg-slate-800'
                            }`}
                          />
                        )}

                        <div 
                          className={`relative z-10 rounded-lg p-4 border transition-all ${
                            isUnlocked
                              ? 'border-emerald-500/60 bg-emerald-950/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                              : buyCheck.ok
                                ? 'border-cyan-500/60 bg-cyan-950/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                                : 'border-slate-800 bg-slate-950/60 opacity-70'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`p-2 rounded border ${
                                isUnlocked 
                                  ? 'bg-emerald-900/40 text-emerald-400 border-emerald-500/50' 
                                  : buyCheck.ok
                                    ? 'bg-cyan-900/40 text-cyan-400 border-cyan-500/50'
                                    : 'bg-slate-900 text-slate-600 border-slate-800'
                              }`}>
                                <PerkIcon size={18} />
                              </div>
                              <div>
                                <h3 className={`text-sm font-bold leading-tight ${
                                  isUnlocked ? 'text-emerald-300' : buyCheck.ok ? 'text-slate-100' : 'text-slate-400'
                                }`}>
                                  {perk.name}
                                </h3>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  Стоимость: {perk.cost} очк.
                                </div>
                              </div>
                            </div>

                            {isUnlocked ? (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 shrink-0">
                                <Check size={12} /> Изучено
                              </span>
                            ) : (
                              <span className="text-[11px] font-mono text-slate-500 shrink-0">
                                ТИР {index + 1}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                            {perk.description}
                          </p>

                          {/* Requirements footer */}
                          {!isUnlocked && (
                            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="text-[11px] text-slate-500">
                                {!buyCheck.ok ? (
                                  <span className="text-rose-400/90 flex items-center gap-1">
                                    <Lock size={12} /> {buyCheck.reason}
                                  </span>
                                ) : (
                                  <span className="text-cyan-400/90 flex items-center gap-1">
                                    <Sparkles size={12} /> Доступно к изучению
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => handleBuyPerk(perk)}
                                disabled={!buyCheck.ok}
                                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                                  buyCheck.ok
                                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)] active:scale-95'
                                    : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                                }`}
                              >
                                Активировать
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
