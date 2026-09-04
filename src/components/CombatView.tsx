import React, { useRef } from 'react';
import { GameState } from '../types';
import { ENEMIES, SKILL_INFO, getXpForLevel, RESOURCES, ITEMS } from '../data';
import { GameAction } from '../gameReducer';
import { getPlayerStats } from '../playerStats';
import { Play, Square, Crosshair, Shield, Zap, Sparkles, AlertCircle, Bomb, Skull, Crown, Flame, Terminal } from 'lucide-react';
import { playStimSound, playClickSound, playHitSound } from '../sound';

interface CombatViewProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function CombatView({ state, dispatch }: CombatViewProps) {
  const info = SKILL_INFO.combat;
  const skillState = state.skills.combat;
  const logEndRef = useRef<HTMLDivElement>(null);
  
  const currentLevelXp = getXpForLevel(skillState.level);
  const nextLevelXp = getXpForLevel(skillState.level + 1);
  const progressPercent = Math.min(100, Math.max(0, ((skillState.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

  const stats = getPlayerStats(state);
  const isActiveCombat = state.activeTask?.type === 'combat';
  const playerHpPercent = Math.max(0, (state.playerHp / stats.maxHp) * 100);
  
  const isPsycho = state.humanity <= 0;

  const stimsList = [
    { id: 'max_doc', name: 'МаксДок', desc: '+50 ОЗ', icon: Sparkles, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50' },
    { id: 'black_lace', name: 'Черное кружево', desc: 'x2 темп атак на 15с', icon: Zap, color: 'text-amber-400 border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/50' },
    { id: 'emp_grenade', name: 'ЭМИ-Граната', desc: '120 урона врагу', icon: Bomb, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50' },
    { id: 'overclock_stim', name: 'Оверклок-Стим', desc: '+75 ОЗ щита', icon: Shield, color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-900/50' },
    { id: 'neuropozyne', name: 'Нейропозин', desc: '+50 ОЗ, +15 Чел.', icon: AlertCircle, color: 'text-purple-400 border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/50' },
  ];

  const handleUseStim = (stimId: string) => {
    playStimSound();
    dispatch({ type: 'USE_COMBAT_STIM', stimId });
  };

  // Check active equipped cyber-programs
  const activePrograms = [state.equipment.program, state.equipment.program2]
    .filter(Boolean)
    .map(progId => {
      const item = ITEMS[progId!];
      return item ? { name: item.name, desc: item.programEffect || item.description } : null;
    })
    .filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto pb-16 px-2">
      <div className="mb-8 border-b border-slate-800 pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-black text-rose-500 mb-1 flex items-center gap-2">
              <Skull className="text-rose-500" />
              {info.name}
            </h1>
            <p className="text-slate-400 text-sm">
              Устранение целей в Найт-Сити. Каждый бой влияет на репутацию корпораций/улиц и постепенно истощает человечность.
            </p>
          </div>
          <button
            onClick={() => {
              playClickSound();
              dispatch({ type: 'CLEAR_COMBAT_LOG' });
            }}
            className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-bold transition-colors"
          >
            Очистить лог
          </button>
        </div>
        
        <div className="mt-4 bg-slate-900/90 border border-slate-800 rounded-xl p-4">
           <div className="flex justify-between text-xs mb-1.5 font-mono">
             <span className="text-slate-300 font-bold">Навык боя: Уровень {skillState.level}</span>
             <span className="text-slate-500">{skillState.xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
           </div>
           <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
             <div 
               className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)] transition-all duration-300"
               style={{ width: `${progressPercent}%` }}
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-5">
           <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
             <Crosshair size={16} className="text-rose-400" />
             Статистика наемника
           </h2>
           <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
             <div className="mb-4">
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-400">ЗДОРОВЬЕ (ОЗ)</span>
                  <span className="text-rose-400 font-bold">{Math.floor(state.playerHp)} / {stats.maxHp}</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-300" style={{ width: `${playerHpPercent}%` }} />
                </div>
             </div>

             {/* Active Combat Buffs */}
             {(state.combatBuffs?.blackLaceTimer > 0 || state.combatBuffs?.overclockShield > 0) && (
               <div className="mb-4 p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Боевые стимуляторы:</div>
                 {state.combatBuffs?.blackLaceTimer > 0 && (
                   <div className="flex items-center justify-between text-xs text-amber-400">
                     <span className="flex items-center gap-1.5 font-bold"><Zap size={13} className="animate-pulse" /> Черное кружево (х2 темп)</span>
                     <span className="font-mono font-bold">{(state.combatBuffs.blackLaceTimer / 1000).toFixed(1)}с</span>
                   </div>
                 )}
                 {state.combatBuffs?.overclockShield > 0 && (
                   <div className="flex items-center justify-between text-xs text-indigo-400">
                     <span className="flex items-center gap-1.5 font-bold"><Shield size={13} /> Нано-щит оверклока</span>
                     <span className="font-mono font-bold">+{state.combatBuffs.overclockShield} ОЗ</span>
                   </div>
                 )}
               </div>
             )}

             {/* Combat Programs Active */}
             {activePrograms.length > 0 && (
               <div className="mb-4 p-2.5 rounded-lg bg-slate-950 border border-cyan-900/40 space-y-1">
                 <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                   <Terminal size={11} /> Кибер-программы в бою:
                 </div>
                 {activePrograms.map((p, idx) => (
                   <div key={idx} className="flex justify-between text-[11px] text-slate-300 font-mono">
                     <span className="text-cyan-300 font-bold">{p?.name}</span>
                     <span className="text-slate-400">{p?.desc}</span>
                   </div>
                 ))}
               </div>
             )}

             <div className="space-y-2 text-xs font-mono pt-1">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-2"><Crosshair size={14} className="text-rose-400"/> АТАКА</span>
                  <span className="text-slate-200 font-bold text-sm">{stats.attack}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-2"><Shield size={14} className="text-cyan-400"/> ЗАЩИТА</span>
                  <span className="text-slate-200 font-bold text-sm">{stats.defense}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400 flex items-center gap-2"><Zap size={14} className="text-amber-400"/> КРИТ. ШАНС</span>
                  <span className="text-slate-200 font-bold text-sm">{Math.round(((ITEMS[state.equipment.implant || '']?.critChance || 0)) * 100)}%</span>
                </div>
             </div>
             
             {/* Combat Consumables & Stimulants Bar */}
             <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Стимы в бою:</span>
                  <span className="text-[10px] text-slate-500">Крафт в Убежище</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                   {stimsList.map(stim => {
                     const count = state.inventory[stim.id] || 0;
                     const Icon = stim.icon;
                     return (
                       <button
                         key={stim.id}
                         onClick={() => handleUseStim(stim.id)}
                         disabled={count <= 0}
                         className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-all ${
                           count > 0 
                             ? stim.color + ' active:scale-95 cursor-pointer font-bold'
                             : 'border-slate-800 bg-slate-950/60 text-slate-600 cursor-not-allowed'
                         }`}
                       >
                         <div className="flex items-center gap-2">
                           <Icon size={14} />
                           <span>{stim.name}</span>
                         </div>
                         <div className="flex items-center gap-2 font-mono">
                           <span className="text-[10px] opacity-75">{stim.desc}</span>
                           <span className={`px-1.5 py-0.5 rounded text-[10px] ${count > 0 ? 'bg-slate-950/80 font-bold' : 'text-slate-600'}`}>x{count}</span>
                         </div>
                       </button>
                     );
                   })}
                </div>
             </div>
           </div>
           
           <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mt-6">
             Терминал боя
           </h2>
           <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 h-64 overflow-y-auto flex flex-col gap-1 text-xs font-mono shadow-inner">
             {state.combatLogs.length === 0 ? (
               <span className="text-slate-600 italic">Ожидание начала столкновения...</span>
             ) : (
               state.combatLogs.map(log => (
                 <div key={log.id} className={`py-0.5 ${
                   log.type === 'player' ? 'text-cyan-400' :
                   log.type === 'enemy' ? 'text-rose-400' : 'text-amber-300 font-bold'
                 }`}>
                   {log.text}
                 </div>
               ))
             )}
             <div ref={logEndRef} />
           </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Skull size={16} className="text-rose-400" />
              Цели ликвидации и Боссы
            </h2>
            <span className="text-xs text-slate-500 font-mono">Всего доступно: {Object.keys(ENEMIES).length}</span>
          </div>

          {isPsycho && (
            <div className="p-4 bg-rose-950/60 border border-rose-500 rounded-xl text-rose-300 mb-4 animate-pulse">
               <strong>ВНИМАНИЕ:</strong> Ваш рассудок истощен (Киберпсихоз: Человечность 0%). Вы не можете начинать новые бои, пока не восстановите рассудок нейропозином или не оцифруете сознание в энграмму.
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {Object.values(ENEMIES).map(enemy => {
              const isFightingThis = isActiveCombat && state.activeTask?.actionId === enemy.id;
              const enemyHpPercent = isFightingThis && state.activeTask?.enemyHp !== undefined
                 ? (state.activeTask.enemyHp / enemy.maxHp) * 100
                 : 100;

              const corpRep = enemy.rewards.reputation?.corp || 0;
              const streetRep = enemy.rewards.reputation?.street || 0;
              const humanityLoss = enemy.humanityLoss || (enemy.isBoss ? (enemy.maxHp > 5000 ? 5 : 2) : 1);

              return (
                <div 
                  key={enemy.id}
                  className={`border rounded-xl p-5 transition-all ${
                    isFightingThis
                      ? 'border-rose-500 bg-rose-950/30 shadow-[0_0_25px_rgba(244,63,94,0.25)]'
                      : enemy.isBoss
                      ? 'border-purple-800/80 bg-slate-900/90 hover:border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.15)]'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                          {enemy.name}
                        </h3>
                        {enemy.bossTitle && (
                          <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-full bg-purple-950 border border-purple-700 text-purple-300 flex items-center gap-1 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                            <Crown size={12} /> {enemy.bossTitle}
                          </span>
                        )}
                        {enemy.isBoss && !enemy.bossTitle && (
                          <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-full bg-rose-950 border border-rose-700 text-rose-300">
                            БОСС
                          </span>
                        )}
                        {enemy.isElite && (
                          <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-full bg-fuchsia-950 border border-fuchsia-700 text-fuchsia-300">
                            ЭЛИТА
                          </span>
                        )}
                      </div>

                      {/* Combat Stats Badges */}
                      <div className="flex flex-wrap gap-3 text-xs text-slate-400 font-mono mb-2.5">
                        <span className="text-rose-400 flex items-center gap-1">
                          <Crosshair size={13} /> {enemy.attack} Урон
                        </span>
                        <span className="text-cyan-400 flex items-center gap-1">
                          <Shield size={13} /> {enemy.defense} Броня
                        </span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          {enemy.maxHp} ОЗ
                        </span>
                        <span className="text-purple-400">+{enemy.xp} XP</span>
                      </div>

                      {/* Explicit Reputation & Humanity impact */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Итог победы:</span>
                        
                        {corpRep !== 0 && (
                          <span className={`px-2 py-0.5 rounded border ${
                            corpRep > 0 
                              ? 'bg-blue-950/80 text-blue-300 border-blue-800/60' 
                              : 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                          }`}>
                            🏢 Корпорация: {corpRep > 0 ? `+${corpRep}` : corpRep} Реп.
                          </span>
                        )}

                        {streetRep !== 0 && (
                          <span className={`px-2 py-0.5 rounded border ${
                            streetRep > 0 
                              ? 'bg-orange-950/80 text-orange-300 border-orange-800/60' 
                              : 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                          }`}>
                            🔥 Улицы: {streetRep > 0 ? `+${streetRep}` : streetRep} Реп.
                          </span>
                        )}

                        {enemy.rewards.relic && (
                          <span className="px-2 py-0.5 rounded border bg-amber-950/80 text-amber-300 border-amber-800/60 font-bold flex items-center gap-1">
                            <Sparkles size={10} /> РЕЛИКВИЯ
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded border bg-amber-950/60 text-amber-300 border-amber-800/50 flex items-center gap-1">
                          <Flame size={12} /> Человечность: -{humanityLoss}%
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (isFightingThis) {
                          playClickSound();
                          dispatch({ type: 'STOP_TASK' });
                        } else if (!isPsycho) {
                          playHitSound();
                          dispatch({ type: 'START_COMBAT', enemyId: enemy.id });
                        }
                      }}
                      disabled={!isFightingThis && isPsycho}
                      className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all self-start shrink-0 ${
                        isFightingThis
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-md'
                          : isPsycho
                          ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                          : enemy.isBoss
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] active:scale-95'
                          : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)] active:scale-95'
                      }`}
                    >
                      {isFightingThis ? (
                        <><Square size={14} /> ОТСТУПИТЬ</>
                      ) : (
                        <><Play size={14} /> АТАКОВАТЬ</>
                      )}
                    </button>
                  </div>
                  
                  {isFightingThis ? (
                    <div className="mt-3 pt-3 border-t border-rose-900/40">
                      <div className="flex justify-between text-xs mb-1 font-mono">
                         <span className="text-slate-300 font-bold">Здоровье противника</span>
                         <span className="text-rose-400 font-bold">{Math.max(0, Math.floor(state.activeTask!.enemyHp!))} / {enemy.maxHp}</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden relative border border-slate-800">
                         <div className="absolute inset-0 bg-slate-800/40" style={{ width: `${(state.activeTask!.progressTime / 2000) * 100}%` }} />
                         <div className="h-full bg-rose-500 rounded-full relative z-10 transition-all duration-100" style={{ width: `${enemyHpPercent}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-3 text-xs font-mono">
                      <span className="text-slate-500">Трофеи:</span>
                      {enemy.rewards.resources && Object.entries(enemy.rewards.resources).map(([res, amt]) => (
                         <span key={res} className="text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                           +{amt} {RESOURCES[res as keyof typeof RESOURCES].name}
                         </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
