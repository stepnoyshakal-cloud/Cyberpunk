import React, { useState } from 'react';
import { GameState } from '../types';
import { GameAction } from '../gameReducer';
import { TrendingUp, TrendingDown, RefreshCcw, DollarSign, ShieldAlert, Info } from 'lucide-react';
import { RESOURCES } from '../data';
import { playTradeSound } from '../sound';

interface MarketViewProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function MarketView({ state, dispatch }: MarketViewProps) {
  const [tradeAmount, setTradeAmount] = useState(1);
  const resources = ['data', 'scrap', 'components'] as const;
  const brokerFee = 2;

  const handleTrade = (resource: typeof resources[number], tradeType: 'buy' | 'sell') => {
    playTradeSound();
    dispatch({ type: 'TRADE_MARKET', resource, amount: tradeAmount, tradeType });
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8 border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 flex items-center gap-3">
            <TrendingUp size={28} />
            Теневая Биржа Найт-Сити
          </h1>
          <p className="text-slate-400 text-sm">
            Комиссия биржи: <span className="text-amber-400 font-semibold">{brokerFee} КР</span> за операцию. Спред: 30%. Крупные сделки (50+) сдвигают котировки.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">ОБЪЕМ:</span>
          <div className="flex gap-1 bg-slate-900 p-1 rounded border border-slate-800">
            {[1, 5, 25, 50].map(amt => (
              <button
                key={amt}
                onClick={() => setTradeAmount(amt)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${tradeAmount === amt ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-700' : 'text-slate-400 hover:text-slate-200'}`}
              >
                x{amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 mb-6 flex items-center gap-3 text-xs text-slate-400">
        <Info size={16} className="text-cyan-400 shrink-0" />
        <span>
          Баланс биржи стабилизирован: защита от бесконечного пассивного арбитража. Покупка крупной партии поднимает цену, а сброс излишков роняет курс.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map(res => {
           const price = state.marketPrices[res];
           const buyUnit = Math.ceil(price * 1.30);
           const sellUnit = Math.max(1, Math.floor(price * 0.70));
           const trend = state.marketTrends[res];
           const inStock = state.resources[res];
           const color = RESOURCES[res].color;
           const buyCost = (buyUnit * tradeAmount) + brokerFee;
           const sellGain = Math.max(0, (sellUnit * tradeAmount) - brokerFee);
           const canBuy = state.resources.credits >= buyCost;
           const canSell = inStock >= tradeAmount;

           return (
             <div key={res} className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-6 flex flex-col items-center transition-all shadow-lg">
               <div className="flex justify-between w-full items-center mb-2">
                 <h3 className={`font-bold text-lg ${color}`}>{RESOURCES[res].name}</h3>
                 <span className="text-xs bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800">
                   У вас: <strong className="text-slate-200">{inStock}</strong>
                 </span>
               </div>

               <div className="flex items-center justify-between w-full my-6 bg-slate-950/80 p-4 rounded-lg border border-slate-800/80">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Базовый курс</span>
                   <span className="text-2xl font-black text-slate-200 flex items-center">
                     <DollarSign size={18} className="mr-0.5 text-cyan-400"/>{price}
                   </span>
                 </div>
                 
                 <div className="flex flex-col items-end">
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Тренд рынка</span>
                   <div className="flex items-center gap-1.5 mt-0.5">
                     {trend > 0 ? (
                       <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                         <TrendingUp size={16} className="animate-pulse" /> Рост
                       </span>
                     ) : trend < 0 ? (
                       <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                         <TrendingDown size={16} className="animate-pulse" /> Спад
                       </span>
                     ) : (
                       <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                         <RefreshCcw size={14} /> Стабильно
                       </span>
                     )}
                   </div>
                 </div>
               </div>

               {tradeAmount >= 50 && (
                 <div className="w-full mb-4 px-2 py-1 rounded bg-amber-950/40 border border-amber-800/50 flex items-center gap-1.5 text-[11px] text-amber-300">
                   <ShieldAlert size={13} className="shrink-0" />
                   <span>Сдвинет курс актива на ±1 КР</span>
                 </div>
               )}

               <div className="text-xs w-full text-slate-400 mb-4 space-y-1 bg-slate-950/40 p-2.5 rounded border border-slate-800/40">
                 <div className="flex justify-between">
                   <span>Цена продажи:</span>
                   <span className="text-rose-400 font-medium">{sellUnit} КР / шт</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Цена покупки:</span>
                   <span className="text-emerald-400 font-medium">{buyUnit} КР / шт</span>
                 </div>
                 <div className="flex justify-between border-t border-slate-800/60 pt-1 text-[11px] text-slate-500">
                   <span>Сбор брокера:</span>
                   <span>{brokerFee} КР</span>
                 </div>
               </div>

               <div className="flex w-full gap-2.5 mt-auto">
                 <button
                    onClick={() => handleTrade(res, 'sell')}
                    disabled={!canSell}
                    className={`flex-1 py-2.5 px-2 rounded-lg font-bold text-xs transition-all flex flex-col items-center justify-center gap-0.5 ${canSell ? 'bg-rose-950/60 text-rose-300 border border-rose-800/80 hover:bg-rose-900/80 active:scale-95 shadow-[0_0_10px_rgba(244,63,94,0.15)]' : 'bg-slate-950 text-slate-700 border border-slate-800 cursor-not-allowed'}`}
                 >
                    <span>ПРОДАТЬ x{tradeAmount}</span>
                    <span className="text-[11px] font-mono opacity-90">(+{sellGain} КР)</span>
                 </button>
                 <button
                    onClick={() => handleTrade(res, 'buy')}
                    disabled={!canBuy}
                    className={`flex-1 py-2.5 px-2 rounded-lg font-bold text-xs transition-all flex flex-col items-center justify-center gap-0.5 ${canBuy ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/80 active:scale-95 shadow-[0_0_10px_rgba(16,185,129,0.15)]' : 'bg-slate-950 text-slate-700 border border-slate-800 cursor-not-allowed'}`}
                 >
                    <span>КУПИТЬ x{tradeAmount}</span>
                    <span className="text-[11px] font-mono opacity-90">(-{buyCost} КР)</span>
                 </button>
               </div>
             </div>
           );
        })}
      </div>
    </div>
  );
}
