import React, { useState } from 'react';
import { GameState } from '../types';
import { GameAction } from '../gameReducer';
import { META_UPGRADES, RESOURCES } from '../data';
import { BrainCircuit, AlertOctagon } from 'lucide-react';

interface CyberpsychosisViewProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function CyberpsychosisView({ state, dispatch }: CyberpsychosisViewProps) {
  const [confirmPrestige, setConfirmPrestige] = useState(false);
  const isPsycho = state.humanity <= 0;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8 border-b border-rose-900/50 pb-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-rose-500 mb-2 flex items-center gap-3">
             <BrainCircuit />
             Киберпсихоз
           </h1>
           <p className="text-slate-400">Слишком много имплантов и крови разрушают разум.</p>
        </div>
        <div className="bg-slate-900 border border-rose-900/50 p-4 rounded-lg text-center min-w-[200px]">
           <span className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-1">Человечность</span>
           <span className={`text-3xl font-bold ${isPsycho ? 'text-rose-600 animate-pulse' : 'text-slate-200'}`}>
             {state.humanity} <span className="text-sm text-slate-500">/ 100</span>
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
           <h2 className="text-xl font-bold text-fuchsia-400 mb-4 tracking-wider flex items-center gap-2">
             <AlertOctagon size={20}/>
             Оцифровка Сознания
           </h2>
           <p className="text-slate-400 text-sm mb-4 leading-relaxed">
             При достижении 0 человечности ваш наемник сходит с ума. Единственный выход — оцифровать его разум, создав Энграммы данных, и начать путь нового наемника.
           </p>
           <ul className="list-disc pl-5 text-sm text-slate-500 space-y-2 mb-6">
             <li>Сбрасывает весь прогресс, ресурсы и инвентарь.</li>
             <li>Конвертирует суммарные уровни навыков в Энграммы (1 Энграмма за 10 уровров).</li>
             <li>Энграммы сохраняются и используются для мета-улучшений.</li>
           </ul>
           
           {confirmPrestige ? (
             <div className="flex gap-2">
               <button
                 onClick={() => {
                   dispatch({ type: 'PRESTIGE' });
                   setConfirmPrestige(false);
                 }}
                 className="flex-1 py-4 rounded font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.6)]"
               >
                 ТОЧНО ОЦИФРОВАТЬ?
               </button>
               <button
                 onClick={() => setConfirmPrestige(false)}
                 className="flex-1 py-4 rounded font-bold bg-slate-700 hover:bg-slate-600 text-slate-200"
               >
                 ОТМЕНА
               </button>
             </div>
           ) : (
             <button
               onClick={() => setConfirmPrestige(true)}
               disabled={!isPsycho}
               className={`w-full py-4 rounded font-bold transition-all ${
                 isPsycho 
                   ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] cursor-pointer'
                   : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
               }`}
             >
               ОЦИФРОВАТЬ РАЗУМ (ПРЕСТИЖ)
             </button>
           )}
           {!isPsycho && <p className="text-xs text-center text-rose-500/50 mt-2">Доступно только при Человечности = 0</p>}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-300 tracking-wider">МЕТА-УЛУЧШЕНИЯ</h2>
          <div className="grid grid-cols-1 gap-4">
            {Object.values(META_UPGRADES).map(upgrade => {
              const isPurchased = state.metaUpgrades.includes(upgrade.id);
              let canAfford = true;
              if (!isPurchased) {
                 for (const [res, amount] of Object.entries(upgrade.cost)) {
                    if (state.resources[res as keyof typeof state.resources] < amount) canAfford = false;
                 }
              }

              return (
                <div key={upgrade.id} className={`border rounded p-4 flex flex-col ${isPurchased ? 'border-fuchsia-500/30 bg-fuchsia-950/10' : 'border-slate-700 bg-slate-800'}`}>
                  <div className="flex justify-between items-start mb-2">
                     <h3 className={`font-bold ${isPurchased ? 'text-fuchsia-400' : 'text-slate-200'}`}>{upgrade.name}</h3>
                     {isPurchased && <span className="text-[10px] font-bold text-fuchsia-400 bg-fuchsia-950 px-2 py-1 rounded">АКТИВНО</span>}
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{upgrade.description}</p>
                  
                  {!isPurchased && (
                    <div className="flex items-center justify-between mt-auto">
                       <div className="text-xs flex gap-2">
                         {Object.entries(upgrade.cost).map(([res, amount]) => (
                            <span key={res} className={state.resources[res as keyof typeof state.resources] >= amount ? 'text-fuchsia-400 font-bold' : 'text-rose-500 font-bold'}>
                              {amount} {RESOURCES[res as keyof typeof RESOURCES].name}
                            </span>
                         ))}
                       </div>
                       <button
                         onClick={() => dispatch({ type: 'BUY_META_UPGRADE', upgradeId: upgrade.id })}
                         disabled={!canAfford}
                         className={`px-3 py-1 text-xs rounded font-bold transition-colors ${canAfford ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50 hover:bg-fuchsia-500/30' : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'}`}
                       >
                         УСТАНОВИТЬ
                       </button>
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
