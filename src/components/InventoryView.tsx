import React, { useState } from 'react';
import { GameState, EquipmentSlot } from '../types';
import { ITEMS, getMaxInventory, getTotalInventoryItems } from '../data';
import { GameAction } from '../gameReducer';
import { Shield, Crosshair, Heart, Coins, Trash2, Cpu, Zap, AlertTriangle, Layers, Terminal } from 'lucide-react';

interface InventoryViewProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function InventoryView({ state, dispatch }: InventoryViewProps) {
  const [filter, setFilter] = useState<'all' | 'equipment' | 'program' | 'consumable'>('all');

  const totalItems = getTotalInventoryItems(state.inventory);
  const maxCap = getMaxInventory(state.upgrades);
  const isFull = totalItems >= maxCap;
  const isNearFull = totalItems >= maxCap * 0.8;

  const inventoryEntries = Object.entries(state.inventory).filter(([_, count]) => count > 0);

  const filteredEntries = inventoryEntries.filter(([itemId]) => {
    const item = ITEMS[itemId];
    if (!item) return false;
    if (filter === 'all') return true;
    if (filter === 'equipment') return item.type === 'weapon' || item.type === 'armor' || item.type === 'implant';
    if (filter === 'program') return item.type === 'program';
    if (filter === 'consumable') return item.type === 'consumable';
    return true;
  });

  const slots: { slot: EquipmentSlot; title: string; code: string; isProgram?: boolean }[] = [
    { slot: 'weapon', title: 'Оружейный слот', code: 'SLOT_WEAPON' },
    { slot: 'armor', title: 'Броня / Экзокостюм', code: 'SLOT_ARMOR' },
    { slot: 'implant', title: 'Киберимплант / Разгон', code: 'SLOT_IMPLANT' },
    { slot: 'program', title: 'Кибердека: Слот Программы #1', code: 'DECK_ROM_01', isProgram: true },
    { slot: 'program2', title: 'Кибердека: Слот Программы #2', code: 'DECK_ROM_02', isProgram: true },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-16 px-2">
      {/* Header & Capacity Bar */}
      <div className="mb-6 bg-slate-900/80 border border-slate-800 rounded-xl p-6 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-black text-cyan-400 tracking-wider flex items-center gap-3">
              <Layers className="text-cyan-400" />
              ИНВЕНТАРЬ И КИБЕРДЕКА
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Управление снаряжением, 2 слота активных программ кибердеки, тайник и утилизация излишков.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 min-w-[260px]">
            <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
              <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {isFull ? <AlertTriangle size={14} className="text-rose-500 animate-pulse" /> : null}
                Вместимость склада:
              </span>
              <span className={isFull ? 'text-rose-400 font-mono text-sm' : isNearFull ? 'text-amber-400 font-mono text-sm' : 'text-cyan-400 font-mono text-sm'}>
                {totalItems} / {maxCap} слотов
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  isFull ? 'bg-rose-500' : isNearFull ? 'bg-amber-500' : 'bg-cyan-500'
                }`}
                style={{ width: `${Math.min(100, (totalItems / maxCap) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5 font-mono">
              <span>База: 15</span>
              {maxCap > 15 && <span className="text-emerald-400 font-bold">+ {maxCap - 15} апгрейды</span>}
              <span className="text-slate-400 font-bold">= {maxCap} макс</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {isFull ? (
                <span className="text-rose-400 font-medium">Склад переполнен! Продайте вещи или купите расширение в Улучшениях.</span>
              ) : (
                <span>Дорогие апгрейды склада доступны в разделе «Улучшения».</span>
              )}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          {(
            [
              { id: 'all', label: `Все предметы (${inventoryEntries.length})` },
              { id: 'equipment', label: 'Снаряжение' },
              { id: 'program', label: 'Кибер-программы' },
              { id: 'consumable', label: 'Расходники / Стимы' },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Currently Equipped Slots */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Cpu size={16} className="text-cyan-400" />
              Экипировка и Кибердека
            </h2>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 backdrop-blur">
            {slots.map(({ slot, title, code, isProgram }) => {
              const equippedId = state.equipment[slot];
              const item = equippedId ? ITEMS[equippedId] : null;

              return (
                <div 
                  key={slot} 
                  className={`border rounded-lg p-4 relative group ${
                    isProgram 
                      ? 'border-amber-900/40 bg-amber-950/10' 
                      : 'border-slate-800 bg-slate-950/80'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono tracking-wider mb-2 flex justify-between">
                    <span className={isProgram ? 'text-amber-400 flex items-center gap-1 font-bold' : 'text-cyan-500/80'}>
                      {isProgram && <Terminal size={11} />}
                      {title}
                    </span>
                    <span className="text-slate-600 font-normal">{code}</span>
                  </div>

                  {item ? (
                    <div>
                      <div className="text-white font-bold text-base flex items-center justify-between">
                        <span className={isProgram ? 'text-amber-300' : 'text-white'}>{item.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                          isProgram 
                            ? 'bg-amber-950/80 border border-amber-700 text-amber-300' 
                            : 'bg-cyan-950/60 border border-cyan-800 text-cyan-300'
                        }`}>
                          АКТИВНО
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 mb-2.5">{item.description}</p>
                      
                      {/* Program effect banner */}
                      {item.programEffect && (
                        <div className="text-xs text-amber-200 mb-3 bg-amber-950/40 p-2 rounded border border-amber-900/50 flex items-start gap-1.5 font-mono">
                          <Zap size={13} className="text-amber-400 shrink-0 mt-0.5" />
                          <span>{item.programEffect}</span>
                        </div>
                      )}

                      {/* Equipment stats */}
                      {(item.attack || item.defense || item.maxHp || item.attackSpeedMult) ? (
                        <div className="text-xs text-slate-300 flex flex-wrap gap-2.5 mb-3 bg-slate-900/80 p-2 rounded border border-slate-800">
                          {item.attack && (
                            <span className="flex items-center gap-1 text-rose-400 font-mono">
                              <Crosshair size={13} /> +{item.attack} УРОН
                            </span>
                          )}
                          {item.defense && (
                            <span className="flex items-center gap-1 text-cyan-400 font-mono">
                              <Shield size={13} /> +{item.defense} БРОНЯ
                            </span>
                          )}
                          {item.maxHp && (
                            <span className="flex items-center gap-1 text-green-400 font-mono">
                              <Heart size={13} /> +{item.maxHp} ОЗ
                            </span>
                          )}
                          {item.attackSpeedMult && (
                            <span className="flex items-center gap-1 text-amber-400 font-mono">
                              <Zap size={13} /> Скорость x{item.attackSpeedMult}
                            </span>
                          )}
                        </div>
                      ) : null}

                      <button
                        onClick={() => dispatch({ type: 'UNEQUIP_ITEM', slot })}
                        className={`text-xs px-3 py-1.5 rounded transition-all w-full border font-medium ${
                          isProgram
                            ? 'bg-slate-900 hover:bg-amber-950/60 text-slate-300 hover:text-amber-300 border-slate-800 hover:border-amber-700/60'
                            : 'bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 hover:border-rose-700/50 border-slate-800'
                        }`}
                      >
                        {isProgram ? 'Выгрузить из кибердеки' : 'Снять в инвентарь'}
                      </button>
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <div className="text-slate-600 text-sm font-mono italic">
                        {isProgram ? 'Слот кибердеки свободен' : 'Слот свободен'}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        {isProgram ? 'Установите программу из хранилища справа' : 'Выберите подходящий предмет из тайника справа'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inventory Items and Selling Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Layers size={16} className="text-cyan-400" />
              Хранилище предметов
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Показано: {filteredEntries.length} из {inventoryEntries.length} типов
            </span>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
              <Layers size={40} className="mx-auto mb-3 opacity-30 text-cyan-400" />
              <p className="text-base text-slate-400 font-medium">В этой категории нет предметов.</p>
              <p className="text-xs text-slate-600 mt-1">
                Создавайте снаряжение в Инженерии или покупайте кибер-программы у Синдикатов.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEntries.map(([itemId, count]) => {
                const item = ITEMS[itemId];
                if (!item) return null;

                const unitSell = item.sellPrice || 15;
                const totalSell = unitSell * count;
                const isProgInSlot1 = state.equipment.program === itemId;
                const isProgInSlot2 = state.equipment.program2 === itemId;

                return (
                  <div
                    key={itemId}
                    className={`border bg-slate-900/90 rounded-xl p-4 flex flex-col justify-between transition-all group ${
                      item.type === 'program' ? 'border-amber-900/40 hover:border-amber-700/60' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <h3 className={`font-bold transition-colors flex items-center gap-1.5 ${
                          item.type === 'program' ? 'text-amber-300 group-hover:text-amber-200' : 'text-white group-hover:text-cyan-300'
                        }`}>
                          {item.name}
                          <span className="text-cyan-400 font-mono text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            x{count}
                          </span>
                        </h3>
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                          item.type === 'program'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}>
                          {item.type === 'program' ? 'КИБЕР-ПРОГРАММА' : item.type}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mb-3">{item.description}</p>

                      {/* Stats / Program effect preview */}
                      <div className="text-xs text-slate-300 flex flex-wrap gap-2 mb-3">
                        {item.attack && (
                          <span className="flex items-center gap-1 text-rose-400 font-mono text-[11px]">
                            <Crosshair size={12} /> +{item.attack} УРОН
                          </span>
                        )}
                        {item.defense && (
                          <span className="flex items-center gap-1 text-cyan-400 font-mono text-[11px]">
                            <Shield size={12} /> +{item.defense} БРОНЯ
                          </span>
                        )}
                        {item.maxHp && (
                          <span className="flex items-center gap-1 text-green-400 font-mono text-[11px]">
                            <Heart size={12} /> +{item.maxHp} ОЗ
                          </span>
                        )}
                        {item.programEffect && (
                          <div className="w-full text-[11px] text-amber-300 font-mono bg-amber-950/30 px-2.5 py-1.5 rounded border border-amber-900/40 flex items-center gap-1.5">
                            <Zap size={12} className="text-amber-400 shrink-0" />
                            <span>{item.programEffect}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons & Selling */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-2">
                      {/* Equip / Program Slot Choices / Consume */}
                      {item.type === 'consumable' ? (
                        <button
                          onClick={() => dispatch({ type: 'CONSUME_ITEM', itemId })}
                          className="w-full text-xs bg-emerald-950 hover:bg-emerald-900/80 text-emerald-300 px-3 py-2 rounded-lg transition-colors font-bold border border-emerald-800/60"
                        >
                          Использовать
                        </button>
                      ) : item.type === 'program' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => dispatch({ type: 'EQUIP_ITEM', itemId, slot: 'program' })}
                            className={`text-xs py-2 px-2 rounded-lg font-bold border transition-colors flex items-center justify-center gap-1 ${
                              isProgInSlot1
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                                : 'bg-slate-950 hover:bg-amber-950/60 text-slate-300 hover:text-amber-200 border-slate-800 hover:border-amber-700/60'
                            }`}
                          >
                            <Terminal size={12} />
                            <span>{isProgInSlot1 ? 'Слот #1 ✓' : 'В Слот #1'}</span>
                          </button>
                          <button
                            onClick={() => dispatch({ type: 'EQUIP_ITEM', itemId, slot: 'program2' })}
                            className={`text-xs py-2 px-2 rounded-lg font-bold border transition-colors flex items-center justify-center gap-1 ${
                              isProgInSlot2
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                                : 'bg-slate-950 hover:bg-amber-950/60 text-slate-300 hover:text-amber-200 border-slate-800 hover:border-amber-700/60'
                            }`}
                          >
                            <Terminal size={12} />
                            <span>{isProgInSlot2 ? 'Слот #2 ✓' : 'В Слот #2'}</span>
                          </button>
                        </div>
                      ) : item.type === 'weapon' || item.type === 'armor' || item.type === 'implant' ? (
                        <button
                          onClick={() => dispatch({ type: 'EQUIP_ITEM', itemId, slot: item.type as 'weapon' | 'armor' | 'implant' })}
                          className="w-full text-xs bg-cyan-950 hover:bg-cyan-900/80 text-cyan-300 px-3 py-2 rounded-lg transition-colors font-bold border border-cyan-800/60 flex items-center justify-center gap-1.5"
                        >
                          <Cpu size={14} />
                          <span>Экипировать</span>
                        </button>
                      ) : null}

                      {/* Selling controls */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => dispatch({ type: 'SELL_ITEM', itemId, count: 1 })}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-slate-950 hover:bg-amber-950/50 text-amber-400 hover:text-amber-300 border border-slate-800 hover:border-amber-800/60 px-2.5 py-1.5 rounded-lg transition-all"
                          title="Продать 1 штуку скупщикам"
                        >
                          <Coins size={13} />
                          <span>Прод. 1 (+{unitSell} КР)</span>
                        </button>

                        {count > 1 && (
                          <button
                            onClick={() => dispatch({ type: 'SELL_ITEM', itemId, count })}
                            className="flex items-center justify-center gap-1.5 text-xs bg-slate-950 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800/60 px-2.5 py-1.5 rounded-lg transition-all"
                            title={`Продать все ${count} шт. оптом`}
                          >
                            <Trash2 size={13} />
                            <span>Все (+{totalSell} КР)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

