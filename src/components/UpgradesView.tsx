import React from 'react';
import { GameState } from '../types';
import { UPGRADES, RESOURCES, getMaxInventory, getTotalInventoryItems } from '../data';
import { GameAction } from '../gameReducer';
import { ArrowUpCircle, Package, Layers, Info } from 'lucide-react';

interface UpgradesViewProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function UpgradesView({ state, dispatch }: UpgradesViewProps) {
  const currentInvTotal = getTotalInventoryItems(state.inventory);
  const currentMaxCap = getMaxInventory(state.upgrades);
  const bonusFromUpgrades = currentMaxCap - 15;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 flex items-center gap-3">
            <Layers className="text-cyan-400" /> Улучшения Черного Рынка
          </h1>
          <p className="text-slate-400 text-sm">
            Покупка постоянных улучшений для тела, инструментов и расширения склада инвентаря.
          </p>
        </div>

        {/* Current Storage Capacity Summary Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 min-w-[280px]">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <Package size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Склад инвентаря</span>
              <span className="text-sm font-mono font-bold text-cyan-400">
                {currentInvTotal} / {currentMaxCap} слотов
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Базовый: 15 слотов {bonusFromUpgrades > 0 && <span className="text-emerald-400 font-bold">(+{bonusFromUpgrades} от апгрейдов)</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-slate-900/50 border border-slate-800/80 rounded-lg p-3.5 flex items-start gap-3 text-xs text-slate-400">
        <Info size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-slate-300 font-bold">Как работает склад: </span>
          Слоты инвентаря используются под физические предметы (оружие, броню, импланты, программы, гранаты и стимуляторы).
          Сырьевые ресурсы (кредиты, данные, металлолом, компоненты) хранятся на счетах без ограничений по объему.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(UPGRADES).map(upgrade => {
          const isPurchased = state.upgrades.includes(upgrade.id);
          const isInvUpgrade = upgrade.id.startsWith('upg_inv_');
          
          let canAfford = true;
          if (!isPurchased) {
             for (const [res, amount] of Object.entries(upgrade.cost)) {
                if (state.resources[res as keyof typeof state.resources] < amount) {
                  canAfford = false;
                }
             }
          }

          return (
            <div 
              key={upgrade.id}
              className={`border rounded-lg p-5 flex flex-col transition-all ${
                isPurchased 
                  ? 'border-cyan-500/40 bg-cyan-950/20' 
                  : isInvUpgrade
                    ? 'border-indigo-800/60 bg-slate-900/90 hover:border-indigo-500/50'
                    : 'border-slate-700 bg-slate-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                 <h3 className={`text-lg font-bold flex items-center gap-2 ${isPurchased ? 'text-cyan-400' : 'text-slate-100'}`}>
                   {isInvUpgrade && <Package size={18} className={isPurchased ? 'text-cyan-400' : 'text-indigo-400'} />}
                   {upgrade.name}
                 </h3>
                 {isPurchased ? (
                   <span className="text-xs font-bold text-cyan-400 bg-cyan-950/90 border border-cyan-500/40 px-2.5 py-1 rounded">
                     ✓ УСТАНОВЛЕНО
                   </span>
                 ) : isInvUpgrade ? (
                   <span className="text-[11px] font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-700/40 px-2 py-0.5 rounded">
                     СКЛАД
                   </span>
                 ) : null}
              </div>

              <p className="text-slate-400 text-sm mb-4 flex-1">{upgrade.description}</p>

              {/* Special indicator for inventory upgrades */}
              {isInvUpgrade && (
                <div className="mb-4 px-3 py-2 rounded bg-slate-950/60 border border-slate-800 text-xs">
                  {isPurchased ? (
                    <span className="text-emerald-400 font-medium">
                      ✓ Вместимость увеличена (Текущий макс: {currentMaxCap} слотов)
                    </span>
                  ) : (
                    <span className="text-cyan-300">
                      Увеличит склад: <span className="font-mono font-bold text-slate-400">{currentMaxCap}</span> → <span className="font-mono font-bold text-emerald-400">{currentMaxCap + (upgrade.id === 'upg_inv_3' ? 15 : upgrade.id === 'upg_inv_4' ? 20 : 10)}</span> слотов
                    </span>
                  )}
                </div>
              )}
              
              {!isPurchased && (
                <div className="flex items-end justify-between mt-auto pt-2 border-t border-slate-800/80">
                   <div className="space-y-1">
                     <span className="text-xs text-rose-400 uppercase font-bold block mb-1">Стоимость</span>
                     {Object.entries(upgrade.cost).map(([res, amount]) => (
                        <div key={res} className="text-sm flex gap-3">
                          <span className={state.resources[res as keyof typeof state.resources] >= amount ? 'text-slate-300' : 'text-rose-500'}>
                            {amount}
                          </span>
                          <span className="text-slate-500">{RESOURCES[res as keyof typeof RESOURCES].name}</span>
                        </div>
                     ))}
                   </div>
                   <button
                     onClick={() => dispatch({ type: 'BUY_UPGRADE', upgradeId: upgrade.id })}
                     disabled={!canAfford}
                     className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition-colors ${
                       canAfford
                         ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30'
                         : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                     }`}
                   >
                     <ArrowUpCircle size={16} /> КУПИТЬ
                   </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
