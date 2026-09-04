import React from 'react';
import { GameState } from '../types';
import { GameAction } from '../gameReducer';
import { ITEMS, getContractRefreshCost } from '../data';
import { Briefcase, Skull, Shield, Target, CheckCircle2, Award, Zap, Cpu, Terminal, Trash2, Wrench, Check, RotateCw, DollarSign, Truck, Radio } from 'lucide-react';
import { playHackSound, playLevelUpSound } from '../sound';

interface SyndicatesViewProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const FACTION_SHOP = [
  // Corporation rewards
  { id: 'prog_black_ice', item: 'prog_black_ice', faction: 'corp' as const, cost: 650, reqRep: 5, category: 'Кибер-программа' },
  { id: 'prog_corp_leaker', item: 'prog_corp_leaker', faction: 'corp' as const, cost: 850, reqRep: 8, category: 'Шпионский Демон' },
  { id: 'corp_armor', item: 'corp_armor', faction: 'corp' as const, cost: 1000, reqRep: 10, category: 'Тяжелая Броня' },
  { id: 'prog_overload', item: 'prog_overload', faction: 'corp' as const, cost: 1200, reqRep: 12, category: 'Кибер-программа' },
  { id: 'prog_threat_scanner', item: 'prog_threat_scanner', faction: 'corp' as const, cost: 1400, reqRep: 14, category: 'Кибер-программа' },
  { id: 'cyberdeck_mk2', item: 'cyberdeck_mk2', faction: 'corp' as const, cost: 1800, reqRep: 16, category: 'Элитная Кибердека' },

  // Street syndicate rewards
  { id: 'prog_crypto_thief', item: 'prog_crypto_thief', faction: 'street' as const, cost: 500, reqRep: 4, category: 'Кибер-программа' },
  { id: 'prog_ghost_stealth', item: 'prog_ghost_stealth', faction: 'street' as const, cost: 650, reqRep: 6, category: 'Кибер-программа' },
  { id: 'prog_swarm_protocol', item: 'prog_swarm_protocol', faction: 'street' as const, cost: 800, reqRep: 8, category: 'Кибер-программа' },
  { id: 'street_katana', item: 'street_katana', faction: 'street' as const, cost: 800, reqRep: 10, category: 'Холодное Оружие' },
  { id: 'prog_contagion', item: 'prog_contagion', faction: 'street' as const, cost: 1300, reqRep: 12, category: 'Боевой Демон' },
  { id: 'prog_short_circuit', item: 'prog_short_circuit', faction: 'street' as const, cost: 1500, reqRep: 14, category: 'Боевой Демон' },
  { id: 'prog_bio_leech', item: 'prog_bio_leech', faction: 'street' as const, cost: 2000, reqRep: 18, category: 'Боевой Демон' },
  { id: 'mantis_blades', item: 'mantis_blades', faction: 'street' as const, cost: 2500, reqRep: 20, category: 'Легендарные Импланты' },
];

export default function SyndicatesView({ state, dispatch }: SyndicatesViewProps) {
  const handleClaim = (contractId: string) => {
    playLevelUpSound();
    dispatch({ type: 'CLAIM_CONTRACT', contractId });
  };

  const refreshCost = getContractRefreshCost(state.inventory);
  const canAffordRefresh = state.resources.credits >= refreshCost;

  const handleRefresh = () => {
    playHackSound();
    dispatch({ type: 'GENERATE_CONTRACTS' });
  };

  const getCorpRank = (rep: number) => {
    if (rep >= 25) return { title: 'Элитный Исполнитель', color: 'text-cyan-300' };
    if (rep >= 10) return { title: 'Контрактник СБ', color: 'text-blue-400' };
    if (rep >= 0) return { title: 'Внештатный Агент', color: 'text-slate-400' };
    return { title: 'В черном списке', color: 'text-rose-500' };
  };

  const getStreetRank = (rep: number) => {
    if (rep >= 25) return { title: 'Легенда Подворотен', color: 'text-amber-300' };
    if (rep >= 10) return { title: 'Авторитетный Соло', color: 'text-orange-400' };
    if (rep >= 0) return { title: 'Уличный Бегущий', color: 'text-slate-400' };
    return { title: 'Предатель Улиц', color: 'text-rose-500' };
  };

  const corpRank = getCorpRank(state.reputation.corp);
  const streetRank = getStreetRank(state.reputation.street);

  const getContractTypeIcon = (type?: string) => {
    switch (type) {
      case 'scavenging':
        return <Trash2 size={14} className="text-emerald-400" />;
      case 'netrunning':
        return <Terminal size={14} className="text-cyan-400" />;
      case 'engineering':
        return <Wrench size={14} className="text-purple-400" />;
      case 'smuggling':
        return <Truck size={14} className="text-amber-400" />;
      case 'recon':
        return <Radio size={14} className="text-blue-400" />;
      case 'combat':
      default:
        return <Skull size={14} className="text-rose-400" />;
    }
  };

  const getContractTypeName = (type?: string) => {
    switch (type) {
      case 'scavenging':
        return 'Сбор Сырья';
      case 'netrunning':
        return 'Сетевой Взлом';
      case 'engineering':
        return 'Инженерия';
      case 'smuggling':
        return 'Контрабанда';
      case 'recon':
        return 'Разведка';
      case 'combat':
      default:
        return 'Ликвидация Врага';
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 px-2">
      {/* Header Banner */}
      <div className="mb-8 border-b border-cyan-900/60 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-cyan-400 font-bold mb-1">
            <Zap size={14} className="animate-pulse text-yellow-400" />
            Теневые каналы Найт-Сити
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 flex items-center gap-3 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <Briefcase size={32} className="text-cyan-400" />
            Синдикаты, Контракты и Программы
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Разнообразные контракты (сбор мусора, взлом серверов, крафт и ликвидация). Покупайте редкие кибер-программы и оружие.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className={`px-4 py-2.5 rounded-xl border text-xs font-bold tracking-wider transition-all flex items-center gap-3 self-start md:self-auto active:scale-95 shadow-md ${
            canAffordRefresh
              ? 'bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 hover:from-cyan-900 hover:to-blue-900 text-cyan-300 border-cyan-500/60 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]'
              : 'bg-slate-900/80 text-slate-400 border-slate-700/60 hover:border-rose-500/50'
          }`}
          title={canAffordRefresh ? `Обновить базу заказов за ${refreshCost} КР` : `Недостаточно кредитов (нужно ${refreshCost} КР)`}
        >
          <div className="flex items-center gap-2">
            <RotateCw size={15} className={canAffordRefresh ? 'text-cyan-400' : 'text-slate-500'} />
            <span>ОБНОВИТЬ ЗАКАЗЫ</span>
          </div>
          <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold border ${
            canAffordRefresh
              ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/40'
              : 'bg-rose-950/60 text-rose-300 border-rose-600/40'
          }`}>
            {refreshCost} КР
          </span>
        </button>
      </div>

      {/* Faction Standing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Corp Standing */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-950/70 via-slate-900 to-slate-950 border border-blue-600/50 rounded-xl p-5 shadow-[0_0_25px_rgba(37,99,235,0.15)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-900/40 border border-blue-500/50 text-blue-400">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-lg">Консорциум Корпораций</h3>
                <p className="text-xs text-blue-300/80 font-mono">Арасака / Канга Тао / Биотехника</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 uppercase tracking-widest block">Репутация</span>
              <span className={`text-2xl font-black ${state.reputation.corp >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                {state.reputation.corp >= 0 ? `+${state.reputation.corp}` : state.reputation.corp}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-900/50 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Award size={14} className="text-blue-400" />
              Статус: <strong className={corpRank.color}>{corpRank.title}</strong>
            </span>
            <span className="text-[11px] text-blue-400/80 font-mono">Шкала доверия открывает программы</span>
          </div>
        </div>

        {/* Street Standing */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-950/70 via-slate-900 to-slate-950 border border-orange-600/50 rounded-xl p-5 shadow-[0_0_25px_rgba(234,88,12,0.15)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-orange-900/40 border border-orange-500/50 text-orange-400">
                <Skull size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-lg">Альянс Улиц и Фиксеров</h3>
                <p className="text-xs text-orange-300/80 font-mono">Валентино / Мальстрём / Теневые Соло</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 uppercase tracking-widest block">Репутация</span>
              <span className={`text-2xl font-black ${state.reputation.street >= 0 ? 'text-orange-400' : 'text-rose-400'}`}>
                {state.reputation.street >= 0 ? `+${state.reputation.street}` : state.reputation.street}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-orange-900/50 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Award size={14} className="text-orange-400" />
              Статус: <strong className={streetRank.color}>{streetRank.title}</strong>
            </span>
            <span className="text-[11px] text-orange-400/80 font-mono">Шкала доверия открывает программы</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Contracts List with Variety */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-200 tracking-wider flex items-center gap-2">
              <Target size={20} className="text-yellow-400" />
              ВАРИАТИВНЫЕ ЗАКАЗЫ СИНДИКАТОВ ({state.contracts.length})
            </h2>
            <span className="text-xs text-slate-500 font-mono">АКТИВНЫ</span>
          </div>

          {state.contracts.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center text-slate-500 flex flex-col items-center gap-2">
              <Briefcase size={32} className="opacity-40 mb-1" />
              <span>Все контракты выполнены или список пуст.</span>
              <button onClick={handleRefresh} className="text-xs text-cyan-400 hover:underline mt-2">
                Запросить новую подборку контрактов
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.contracts.map(contract => {
                const current = contract.currentAmount ?? contract.killsCurrent ?? 0;
                const required = contract.targetAmount ?? contract.killsRequired ?? 1;
                const isComplete = current >= required;
                const isCorp = contract.faction === 'corp';
                const progressPct = Math.min(100, Math.round((current / required) * 100));

                return (
                  <div
                    key={contract.id}
                    className={`rounded-xl p-5 border transition-all ${
                      isComplete
                        ? 'bg-emerald-950/40 border-emerald-500/70 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                        : isCorp
                        ? 'bg-slate-900/90 border-blue-900/50 hover:border-blue-700/60'
                        : 'bg-slate-900/90 border-orange-900/50 hover:border-orange-700/60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                            isCorp
                              ? 'bg-blue-950/90 text-blue-300 border-blue-700/60'
                              : 'bg-orange-950/90 text-orange-300 border-orange-700/60'
                          }`}
                        >
                          {isCorp ? 'Корпорация' : 'Улицы'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                          {getContractTypeIcon(contract.type)}
                          {getContractTypeName(contract.type)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono font-bold">
                        <span className="text-amber-400">+{contract.rewardCredits} КР</span>
                        <span className="text-cyan-400">+{contract.rewardRep} РЕП</span>
                      </div>
                    </div>

                    {contract.title && (
                      <h4 className="text-white font-bold text-base mt-1">{contract.title}</h4>
                    )}
                    <p className="text-xs font-medium text-slate-300 mt-1 mb-3">{contract.description}</p>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Прогресс выполнения:</span>
                        <span className={isComplete ? 'text-emerald-400 font-bold flex items-center gap-1' : 'text-slate-300 font-bold'}>
                          {isComplete && <CheckCircle2 size={13} />}
                          {current} / {required}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            isComplete ? 'bg-emerald-500' : isCorp ? 'bg-blue-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleClaim(contract.id)}
                        disabled={!isComplete}
                        className={`px-4 py-2 rounded-lg text-xs font-black tracking-wider transition-all flex items-center gap-1.5 ${
                          isComplete
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)] active:scale-95 animate-pulse cursor-pointer'
                            : 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed'
                        }`}
                      >
                        {isComplete ? (
                          <>
                            <Check size={14} /> СДАТЬ КОНТРАКТ (+{contract.rewardCredits} КР)
                          </>
                        ) : (
                          'ВЫПОЛНЯЕТСЯ...'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Faction Rewards / Cyber-Programs Arsenal */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-200 tracking-wider flex items-center gap-2">
            <Cpu size={20} className="text-cyan-400" />
            НАГРАДЫ И КИБЕР-ПРОГРАММЫ
          </h2>

          {/* Corp Shop */}
          <div className="bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950 border border-blue-800/60 rounded-xl p-5 shadow-[0_0_15px_rgba(30,58,138,0.2)] space-y-3">
            <div className="flex items-center justify-between border-b border-blue-900/50 pb-3">
              <h3 className="font-bold text-blue-300 flex items-center gap-2 text-base">
                <Shield size={18} className="text-blue-400" /> Корпоративный Спец-Склад
              </h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                Репутация: <strong className={state.reputation.corp >= 10 ? 'text-emerald-400' : 'text-slate-400'}>{state.reputation.corp}</strong>
              </span>
            </div>

            {FACTION_SHOP.filter(s => s.faction === 'corp').map(shopItem => {
              const item = ITEMS[shopItem.item];
              const hasRep = state.reputation.corp >= shopItem.reqRep;
              const hasItem =
                (state.inventory[shopItem.item] || 0) > 0 ||
                state.equipment.armor === shopItem.item ||
                state.equipment.weapon === shopItem.item ||
                state.equipment.implant === shopItem.item ||
                state.equipment.program === shopItem.item ||
                state.equipment.program2 === shopItem.item;
              const canBuy = hasRep && state.resources.credits >= shopItem.cost && !hasItem;

              return (
                <div key={shopItem.id} className="flex justify-between items-center bg-slate-950/90 p-3.5 rounded-lg border border-slate-800">
                  <div className="pr-4">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-200 text-sm">{item?.name || shopItem.item}</p>
                      <span className="text-[10px] bg-blue-950/80 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800/60 font-mono">
                        {shopItem.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item?.description}</p>
                    {!hasRep && <p className="text-xs text-rose-400 mt-1 font-mono">🔒 Требуется Репутация Корп: {shopItem.reqRep}</p>}
                    {hasItem && <p className="text-xs text-emerald-400 mt-1 font-mono">✓ Уже в инвентаре / экипировано</p>}
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'BUY_ITEM', itemId: shopItem.item, cost: shopItem.cost })}
                    disabled={!canBuy}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      hasItem
                        ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                        : canBuy
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/80 hover:bg-cyan-900 shadow-[0_0_10px_rgba(6,182,212,0.2)] active:scale-95'
                        : 'bg-slate-900 text-slate-700 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    {shopItem.cost} КР
                  </button>
                </div>
              );
            })}
          </div>

          {/* Street Shop */}
          <div className="bg-gradient-to-b from-orange-950/40 via-slate-900 to-slate-950 border border-orange-800/60 rounded-xl p-5 shadow-[0_0_15px_rgba(154,52,18,0.2)] space-y-3">
            <div className="flex items-center justify-between border-b border-orange-900/50 pb-3">
              <h3 className="font-bold text-orange-300 flex items-center gap-2 text-base">
                <Skull size={18} className="text-orange-400" /> Оружейная Банд Улиц
              </h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                Репутация: <strong className={state.reputation.street >= 10 ? 'text-emerald-400' : 'text-slate-400'}>{state.reputation.street}</strong>
              </span>
            </div>

            {FACTION_SHOP.filter(s => s.faction === 'street').map(shopItem => {
              const item = ITEMS[shopItem.item];
              const hasRep = state.reputation.street >= shopItem.reqRep;
              const hasItem =
                (state.inventory[shopItem.item] || 0) > 0 ||
                state.equipment.armor === shopItem.item ||
                state.equipment.weapon === shopItem.item ||
                state.equipment.implant === shopItem.item ||
                state.equipment.program === shopItem.item ||
                state.equipment.program2 === shopItem.item;
              const canBuy = hasRep && state.resources.credits >= shopItem.cost && !hasItem;

              return (
                <div key={shopItem.id} className="flex justify-between items-center bg-slate-950/90 p-3.5 rounded-lg border border-slate-800">
                  <div className="pr-4">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-200 text-sm">{item?.name || shopItem.item}</p>
                      <span className="text-[10px] bg-orange-950/80 text-orange-300 px-1.5 py-0.5 rounded border border-orange-800/60 font-mono">
                        {shopItem.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item?.description}</p>
                    {!hasRep && <p className="text-xs text-rose-400 mt-1 font-mono">🔒 Требуется Репутация Улиц: {shopItem.reqRep}</p>}
                    {hasItem && <p className="text-xs text-emerald-400 mt-1 font-mono">✓ Уже в инвентаре / экипировано</p>}
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'BUY_ITEM', itemId: shopItem.item, cost: shopItem.cost })}
                    disabled={!canBuy}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      hasItem
                        ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                        : canBuy
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-700/80 hover:bg-amber-900 shadow-[0_0_10px_rgba(245,158,11,0.2)] active:scale-95'
                        : 'bg-slate-900 text-slate-700 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    {shopItem.cost} КР
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
