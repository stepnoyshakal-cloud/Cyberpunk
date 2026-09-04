import React from 'react';
import { GameState, SafehouseModule, Resource } from '../types';
import { GameAction } from '../gameReducer';
import { RESOURCES } from '../data';
import { SAFEHOUSE_MODULES, COMBAT_STIMS } from '../safehouseData';
import { 
  Home, 
  Server, 
  HeartPulse, 
  Wrench, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpCircle,
  FlaskConical,
  Zap,
  Bomb,
  Shield,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { playHackSound, playStimSound } from '../sound';

interface SafehouseViewProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const MODULE_ICONS: Record<SafehouseModule, React.ComponentType<{ size?: number; className?: string }>> = {
  server: Server,
  medpod: HeartPulse,
  workbench: Wrench,
  terminal: Radio,
};

const STIM_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  max_doc: HeartPulse,
  black_lace: Zap,
  emp_grenade: Bomb,
  overclock_stim: Shield,
  neuropozyne: Sparkles,
};

export default function SafehouseView({ state, dispatch }: SafehouseViewProps) {
  const safehouse = state.safehouse || {
    server: 0,
    medpod: 0,
    workbench: 0,
    terminal: 0,
  };

  const handleUpgrade = (moduleId: SafehouseModule) => {
    playHackSound();
    dispatch({ type: 'UPGRADE_SAFEHOUSE', module: moduleId });
  };

  const handleCraftStim = (stimId: string) => {
    playStimSound();
    dispatch({ type: 'CRAFT_COMBAT_STIM', stimId });
  };

  const canAfford = (cost: Partial<Record<Resource, number>>): boolean => {
    return Object.entries(cost).every(([res, amt]) => (state.resources[res as Resource] || 0) >= (Number(amt) || 0));
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-cyan-400 tracking-wider">УБЕЖИЩЕ НАЕМНИКА</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
              База операций
            </span>
          </div>
          <p className="text-slate-400 mt-1">
            Заброшенный бункер в нижнем секторе. Улучшайте модули для пассивного дохода ресурсов, регенерации здоровья и крафта военных стимуляторов.
          </p>
        </div>

        {/* Quick Resource Summary */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-xs font-mono">
          <div className="text-slate-400">Кредиты: <span className="text-yellow-400 font-bold">{state.resources.credits.toLocaleString()}</span></div>
          <div className="text-slate-400">Данные: <span className="text-cyan-400 font-bold">{state.resources.data.toLocaleString()}</span></div>
          <div className="text-slate-400">Утиль: <span className="text-emerald-400 font-bold">{state.resources.scrap.toLocaleString()}</span></div>
          <div className="text-slate-400">Компоненты: <span className="text-purple-400 font-bold">{state.resources.components.toLocaleString()}</span></div>
        </div>
      </div>

      {/* Main Safehouse Modules */}
      <div>
        <h2 className="text-xl font-bold text-slate-200 tracking-wider mb-4 flex items-center gap-2">
          <Home size={18} className="text-cyan-400" /> МОДУЛИ УБЕЖИЩА
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAFEHOUSE_MODULES.map(moduleDef => {
            const currentLevel = safehouse[moduleDef.id] || 0;
            const maxLevel = moduleDef.levels.length;
            const nextLevelDef = moduleDef.levels.find(l => l.level === currentLevel + 1);
            const currentLevelDef = moduleDef.levels.find(l => l.level === currentLevel);
            const isMaxed = currentLevel >= maxLevel;
            const affordable = nextLevelDef ? canAfford(nextLevelDef.cost) : false;

            const Icon = MODULE_ICONS[moduleDef.id] || Home;

            return (
              <div 
                key={moduleDef.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors"
              >
                <div>
                  {/* Top bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                        <Icon size={22} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-200">{moduleDef.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono text-cyan-400 font-bold">
                            Уровень {currentLevel} / {maxLevel}
                          </span>
                          {currentLevel > 0 && (
                            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              АКТИВЕН
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {moduleDef.description}
                  </p>

                  {/* Current bonus */}
                  <div className="mb-4 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 text-xs">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                      Текущий эффект:
                    </div>
                    {currentLevelDef ? (
                      <div className="text-emerald-400 font-medium">{currentLevelDef.bonusDesc}</div>
                    ) : (
                      <div className="text-slate-600 italic">Модуль не установлен</div>
                    )}
                  </div>

                  {/* Next level bonus if available */}
                  {!isMaxed && nextLevelDef && (
                    <div className="mb-4 bg-cyan-950/20 p-3 rounded-lg border border-cyan-500/20 text-xs">
                      <div className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider mb-1">
                        Следующий уровень ({currentLevel + 1}) — {nextLevelDef.title}:
                      </div>
                      <div className="text-cyan-300">{nextLevelDef.bonusDesc}</div>

                      <div className="mt-2 pt-2 border-t border-cyan-500/20 flex flex-wrap gap-2 text-[11px] font-mono">
                        <span className="text-slate-400">Стоимость:</span>
                        {Object.entries(nextLevelDef.cost).map(([res, amt]) => {
                          const hasEnough = (state.resources[res as Resource] || 0) >= (Number(amt) || 0);
                          return (
                            <span key={res} className={hasEnough ? 'text-slate-200' : 'text-rose-400'}>
                              {amt} {RESOURCES[res as Resource]?.name || res}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="pt-2 border-t border-slate-800">
                  {isMaxed ? (
                    <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-400 bg-emerald-950/40 rounded border border-emerald-500/30">
                      <CheckCircle2 size={14} /> МАКСИМАЛЬНЫЙ УРОВЕНЬ
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(moduleDef.id)}
                      disabled={!affordable}
                      className={`w-full flex items-center justify-center gap-2 py-2 rounded text-xs font-bold transition-all ${
                        affordable
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_12px_rgba(6,182,212,0.3)] active:scale-[0.98]'
                          : 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      <ArrowUpCircle size={15} />
                      {currentLevel === 0 ? 'Установить модуль' : `Улучшить до Ур. ${currentLevel + 1}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Synthesis Lab / Combat Stim Crafting */}
      <div className="pt-6 border-t border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-200 tracking-wider flex items-center gap-2">
              <FlaskConical size={20} className="text-purple-400" /> ЛАБОРАТОРИЯ СИНТЕЗА
            </h2>
            <p className="text-xs text-slate-400">
              Синтез боевых стимуляторов и расходников для использования прямо во время схваток.
            </p>
          </div>
          {state.perks?.includes('tech_stim') && (
            <span className="px-2.5 py-1 text-xs font-bold bg-purple-950 text-purple-300 border border-purple-500/40 rounded">
              Перк «Химический Синтез» активен (+50% сила стимуляторов)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {COMBAT_STIMS.map(stim => {
            const Icon = STIM_ICONS[stim.id] || Sparkles;
            const affordable = canAfford(stim.cost);
            const count = state.inventory[stim.id] || 0;

            return (
              <div 
                key={stim.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        stim.color === 'emerald' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' :
                        stim.color === 'amber' ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30' :
                        stim.color === 'cyan' ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/30' :
                        stim.color === 'rose' ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30' :
                        'bg-purple-950/60 text-purple-400 border border-purple-500/30'
                      }`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">{stim.name}</h4>
                        <div className="text-[11px] text-slate-500">В запасе: <span className="text-slate-300 font-mono font-bold">{count} шт.</span></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-3 leading-tight min-h-[32px]">
                    {stim.desc}
                  </p>

                  {/* Cost */}
                  <div className="mb-3 bg-slate-950 p-2 rounded text-[11px] font-mono border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 uppercase mb-1">Рецепт:</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(stim.cost).map(([res, amt]) => {
                        const hasEnough = (state.resources[res as Resource] || 0) >= (Number(amt) || 0);
                        return (
                          <span key={res} className={hasEnough ? 'text-slate-300' : 'text-rose-400'}>
                            {amt} {RESOURCES[res as Resource]?.name || res}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCraftStim(stim.id)}
                  disabled={!affordable}
                  className={`w-full py-2 rounded text-xs font-bold border transition-all ${
                    affordable
                      ? 'bg-purple-900/40 text-purple-300 border-purple-600/50 hover:bg-purple-800/50 active:scale-[0.98]'
                      : 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
                  }`}
                >
                  Синтезировать
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
