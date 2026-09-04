import React from 'react';
import { GameState } from '../types';
import { GameAction } from '../gameReducer';
import { REAL_ESTATE } from '../data';
import { Briefcase, Map, DollarSign, TrendingUp, Building2, Plus } from 'lucide-react';
import { playClickSound, playTradeSound } from '../sound';

interface RealEstateViewProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function RealEstateView({ state, dispatch }: RealEstateViewProps) {
  const handleBuy = (id: string) => {
    playTradeSound();
    dispatch({ type: 'BUY_REAL_ESTATE', estateId: id });
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
           <h1 className="text-3xl font-bold text-amber-400 mb-2 flex items-center gap-3">
             <Map size={28} />
             Карта Влияния
           </h1>
           <p className="text-slate-400">
             Вкладывайте Кредиты в подпольный бизнес Найт-Сити для получения пассивного дохода.
             Купленные точки генерируют ресурсы даже во время других занятий.
           </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-center min-w-[200px]">
           <span className="text-xs text-slate-500 uppercase font-bold tracking-widest block mb-1">Свободные Кредиты</span>
           <span className="text-xl font-bold text-green-400 flex items-center justify-center gap-1">
             <DollarSign size={20} />
             {state.resources.credits.toLocaleString()}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REAL_ESTATE.map(estate => {
          const currentLevel = state.realEstate?.[estate.id]?.level || 0;
          const cost = Math.floor(estate.baseCost * Math.pow(1.5, currentLevel));
          const canAfford = state.resources.credits >= cost;

          return (
            <div key={estate.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col shadow-lg relative overflow-hidden group">
              {/* Status Banner */}
              <div className="absolute top-0 right-0 px-3 py-1 bg-slate-800 rounded-bl-lg border-b border-l border-slate-700 text-[10px] font-bold text-slate-400 tracking-widest">
                {currentLevel > 0 ? `УРОВЕНЬ ${currentLevel}` : 'ДОСТУПНО К ПОКУПКЕ'}
              </div>

              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className={`p-3 rounded-lg ${currentLevel > 0 ? 'bg-amber-900/40 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200 text-lg leading-tight">{estate.name}</h3>
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed">
                {estate.description}
              </p>

              {currentLevel > 0 && (
                <div className="mb-4 bg-slate-950 rounded p-2 flex items-center gap-2 border border-slate-800">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <span className="text-xs text-slate-300">
                    <span className="text-emerald-400 font-bold">Активный доход (х{currentLevel}): </span>
                    Уровень бизнеса приносит стабильную прибыль.
                  </span>
                </div>
              )}

              <button
                onClick={() => handleBuy(estate.id)}
                disabled={!canAfford}
                className={`w-full py-3 rounded font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  canAfford 
                    ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 hover:shadow-[0_0_15px_rgba(217,119,6,0.4)]'
                    : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                }`}
              >
                {currentLevel > 0 ? <Plus size={16} /> : <Briefcase size={16} />}
                {currentLevel > 0 ? 'РАСШИРИТЬ БИЗНЕС' : 'ПРИОБРЕСТИ'} — {cost} КР
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
