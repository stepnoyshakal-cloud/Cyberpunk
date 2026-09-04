import React from 'react';
import { GameState } from '../types';
import { GameAction } from '../gameReducer';
import { Activity, Syringe, PlusSquare, Cpu } from 'lucide-react';
import { ITEMS } from '../data';

interface RipperdocViewProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function RipperdocView({ state, dispatch }: RipperdocViewProps) {
  const healCost = 250;
  const canHeal = state.resources.credits >= healCost && state.humanity < 100;

  const IMPLANTS = [
    { id: 'health_booster', cost: 1000 },
    { id: 'subdermal_armor', cost: 3000 },
    { id: 'kiroshi_optics', cost: 7500 },
    { id: 'sandevistan', cost: 15000 }
  ];

  const NEURO_PROGRAMS = [
    { id: 'prog_zen_protocol', cost: 1200 },
    { id: 'prog_ghost_shell', cost: 2200 },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8 border-b border-slate-800 pb-6 flex items-center gap-4">
        <Activity size={32} className="text-cyan-400" />
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Клиника Риппердока</h1>
          <p className="text-slate-400">Обслуживание имплантов и нейротерапия. Сохрани свой рассудок.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-slate-300 tracking-wider mb-4 flex items-center gap-2">
            <Syringe size={20} className="text-rose-400" />
            Нейротерапия
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Киберпсихоз подкрадывается незаметно. Регулярная терапия и калибровка имплантов помогут сохранить вашу человечность в норме.
          </p>
          
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded border border-slate-800 mb-6">
            <div>
               <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mb-1">Статус Разума</p>
               <p className={`text-2xl font-bold ${state.humanity <= 30 ? 'text-rose-500 animate-pulse' : 'text-cyan-400'}`}>
                 {state.humanity}%
               </p>
            </div>
            <div className="text-right">
               <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mb-1">Стоимость сеанса</p>
               <p className={state.resources.credits >= healCost ? 'text-green-400 font-bold' : 'text-rose-500 font-bold'}>
                 {healCost} Кредитов
               </p>
            </div>
          </div>

          <button
            onClick={() => dispatch({ type: 'RIPPERDOC_HEAL' })}
            disabled={!canHeal}
            className={`w-full py-3 rounded font-bold flex justify-center items-center gap-2 transition-colors ${
              canHeal
                ? 'bg-cyan-900/40 hover:bg-cyan-800 text-cyan-400 border border-cyan-700/50'
                : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <PlusSquare size={18} />
            {state.humanity >= 100 ? 'ЗДОРОВ' : 'ПРОЙТИ ТЕРАПИЮ (+10%)'}
          </button>

          {/* Neuro-programs in clinic */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <h3 className="text-sm font-bold text-slate-300 tracking-wider mb-3 flex items-center gap-2">
              <Cpu size={16} className="text-purple-400" />
              Нейро-программы и Психо-щиты
            </h3>
            <div className="space-y-3">
              {NEURO_PROGRAMS.map(prog => {
                const item = ITEMS[prog.id];
                const hasItem = (state.inventory[prog.id] || 0) > 0;
                const canBuy = state.resources.credits >= prog.cost && !hasItem;

                return (
                  <div key={prog.id} className="bg-slate-950 border border-slate-800 p-3 rounded flex flex-col justify-between">
                    <div className="mb-2">
                      <h4 className="text-purple-300 text-sm font-bold flex justify-between items-center">
                        {item.name}
                        {hasItem && <span className="text-[10px] text-green-400 bg-green-900/30 px-1.5 py-0.5 rounded">АКТИВНО</span>}
                      </h4>
                      <p className="text-slate-400 text-xs mt-0.5">{item.description}</p>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'BUY_ITEM', itemId: prog.id, cost: prog.cost })}
                      disabled={!canBuy}
                      className={`w-full py-1.5 rounded text-xs font-bold transition-colors ${
                        hasItem ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : canBuy ? 'bg-purple-950/60 text-purple-300 border border-purple-700/50 hover:bg-purple-900'
                        : 'bg-slate-950 text-slate-700 border border-slate-800 cursor-not-allowed'
                      }`}
                    >
                      {hasItem ? 'УЖЕ УСТАНОВЛЕНО' : `ИНТЕГРИРОВАТЬ (${prog.cost} КР)`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
           <h2 className="text-xl font-bold text-slate-300 tracking-wider mb-4 flex items-center gap-2">
            <Cpu size={20} className="text-cyan-400" />
            Модификации
          </h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {IMPLANTS.map(implant => {
               const item = ITEMS[implant.id];
               const hasItem = (state.inventory[implant.id] || 0) > 0 || state.equipment.implant === implant.id;
               const canBuy = state.resources.credits >= implant.cost && !hasItem;
               
               return (
                 <div key={implant.id} className="bg-slate-950 border border-slate-800 p-4 rounded flex flex-col justify-between">
                   <div className="mb-3">
                     <h4 className="text-cyan-400 font-bold flex justify-between items-center">
                        {item.name}
                        {hasItem && <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded">В НАЛИЧИИ</span>}
                     </h4>
                     <p className="text-slate-400 text-xs mt-1">{item.description}</p>
                   </div>
                   <button
                     onClick={() => dispatch({ type: 'BUY_ITEM', itemId: implant.id, cost: implant.cost })}
                     disabled={!canBuy}
                     className={`w-full py-2 rounded text-xs font-bold transition-colors ${
                        hasItem ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : canBuy ? 'bg-green-900/40 text-green-400 border border-green-700/50 hover:bg-green-800'
                        : 'bg-slate-950 text-slate-700 border border-slate-800 cursor-not-allowed'
                     }`}
                   >
                     {hasItem ? 'УЖЕ КУПЛЕНО' : `КУПИТЬ (${implant.cost} КРЕДИТОВ)`}
                   </button>
                 </div>
               );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
