import React from 'react';
import { Skill, GameState } from '../types';
import { SKILL_INFO, getXpForLevel, getMaxInventory, getTotalInventoryItems } from '../data';
import { 
  Terminal, 
  Search, 
  Cpu, 
  LayoutDashboard, 
  ChevronRight, 
  Crosshair, 
  Package, 
  ArrowUpCircle, 
  BrainCircuit, 
  Activity, 
  Briefcase,
  GitFork,
  Home,
  TrendingUp,
  Truck,
  Radio
} from 'lucide-react';
import { playClickSound } from '../sound';

const iconMap = {
  Terminal: Terminal,
  Search: Search,
  Cpu: Cpu,
  Crosshair: Crosshair,
  Truck: Truck,
  Radio: Radio
};

export type ViewState = Skill | 'dashboard' | 'inventory' | 'upgrades' | 'cyberpsychosis' | 'ripperdoc' | 'syndicates' | 'market' | 'perks' | 'safehouse' | 'realestate';

interface SidebarProps {
  state: GameState;
  currentView: ViewState;
  setCurrentView: (v: ViewState) => void;
}

export default function Sidebar({ state, currentView, setCurrentView }: SidebarProps) {
  const isPsycho = state.humanity <= 0;
  const unspentPerks = state.perkPoints ?? 0;

  const navigate = (view: ViewState) => {
    playClickSound();
    setCurrentView(view);
  };

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col flex-shrink-0 z-10 relative">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-cyan-400 tracking-wider flex items-center gap-2">
          <Terminal size={20} />
          СИСТЕМА
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 space-y-1">
        <button
          onClick={() => navigate('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
            currentView === 'dashboard' 
              ? 'bg-slate-800 text-cyan-400 border-l-2 border-cyan-400' 
              : 'hover:bg-slate-800/50 text-slate-400 border-l-2 border-transparent'
          }`}
        >
          <LayoutDashboard size={18} />
          <span>Сводка</span>
        </button>

        <button
          onClick={() => navigate('safehouse')}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
            currentView === 'safehouse' 
              ? 'bg-slate-800 text-cyan-400 border-l-2 border-cyan-400 font-bold' 
              : 'hover:bg-slate-800/50 text-slate-300 border-l-2 border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <Home size={18} className="text-cyan-400" />
            <span>Убежище</span>
          </div>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
            База
          </span>
        </button>

        <button
          onClick={() => navigate('realestate' as any)}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
            currentView === 'realestate' as any
              ? 'bg-amber-950/40 text-amber-400 border-l-2 border-amber-500 font-bold' 
              : 'hover:bg-slate-800/50 text-slate-300 border-l-2 border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <Briefcase size={18} className="text-amber-400" />
            <span>Недвижимость</span>
          </div>
        </button>

        <button
          onClick={() => navigate('perks')}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
            currentView === 'perks' 
              ? 'bg-slate-800 text-cyan-400 border-l-2 border-cyan-400 font-bold' 
              : 'hover:bg-slate-800/50 text-slate-300 border-l-2 border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <GitFork size={18} className="text-yellow-400" />
            <span>Кибер-Перки</span>
          </div>
          {unspentPerks > 0 ? (
            <span className="text-[11px] bg-yellow-500 text-black font-bold px-1.5 py-0.2 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-pulse">
              +{unspentPerks}
            </span>
          ) : (
            <span className="text-[10px] text-slate-500 font-mono">
              {(state.perks || []).length}/9
            </span>
          )}
        </button>

        {(() => {
          const totalInv = getTotalInventoryItems(state.inventory);
          const maxInv = getMaxInventory(state.upgrades);
          const isInvFull = totalInv >= maxInv;
          return (
            <button
              onClick={() => navigate('inventory')}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                currentView === 'inventory' 
                  ? 'bg-slate-800 text-cyan-400 border-l-2 border-cyan-400 font-bold' 
                  : 'hover:bg-slate-800/50 text-slate-300 border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package size={18} className={isInvFull ? 'text-rose-400' : 'text-cyan-400'} />
                <span>Инвентарь</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                isInvFull
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 font-bold animate-pulse'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                {totalInv}/{maxInv}
              </span>
            </button>
          );
        })()}

        <button
          onClick={() => navigate('upgrades')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
            currentView === 'upgrades' 
              ? 'bg-slate-800 text-cyan-400 border-l-2 border-cyan-400' 
              : 'hover:bg-slate-800/50 text-slate-400 border-l-2 border-transparent'
          }`}
        >
          <ArrowUpCircle size={18} />
          <span>Улучшения</span>
        </button>

        <button
          onClick={() => navigate('ripperdoc')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
            currentView === 'ripperdoc' 
              ? 'bg-slate-800 text-cyan-400 border-l-2 border-cyan-400' 
              : 'hover:bg-slate-800/50 text-slate-400 border-l-2 border-transparent'
          }`}
        >
          <Activity size={18} />
          <span>Риппердок</span>
        </button>

        <button
          onClick={() => navigate('syndicates')}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-all ${
            currentView === 'syndicates' 
              ? 'bg-gradient-to-r from-blue-950/60 to-slate-800 text-cyan-300 border-l-2 border-cyan-400 font-bold shadow-[inset_0_0_12px_rgba(59,130,246,0.2)]' 
              : 'hover:bg-slate-800/60 text-slate-300 border-l-2 border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <Briefcase size={18} className={currentView === 'syndicates' ? 'text-cyan-400' : 'text-blue-400'} />
            <span className="tracking-wide">Синдикаты</span>
          </div>
          {state.contracts.some(c => c.killsCurrent >= c.killsRequired) ? (
            <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.7)]">
              ГОТОВО
            </span>
          ) : (
            <span className="text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-800/40 text-blue-300">
              {state.reputation.corp + state.reputation.street} РЕП
            </span>
          )}
        </button>

        <button
          onClick={() => navigate('market')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
            currentView === 'market' 
              ? 'bg-slate-800 text-cyan-400 border-l-2 border-cyan-400' 
              : 'hover:bg-slate-800/50 text-slate-400 border-l-2 border-transparent'
          }`}
        >
          <TrendingUp size={18} />
          <span>Теневая Биржа</span>
        </button>
        
        <button
          onClick={() => navigate('cyberpsychosis')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
            currentView === 'cyberpsychosis' 
              ? 'bg-rose-950/40 text-rose-400 border-l-2 border-rose-500' 
              : `hover:bg-slate-800/50 border-l-2 border-transparent ${isPsycho ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`
          }`}
        >
          <BrainCircuit size={18} />
          <span>Киберпсихоз</span>
        </button>

        <div className="px-4 py-2 mt-3">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">ПРОГРАММЫ</span>
        </div>

        {(Object.keys(SKILL_INFO) as Skill[]).map(skillId => {
          const info = SKILL_INFO[skillId];
          const skillState = state.skills[skillId];
          const Icon = iconMap[info.icon as keyof typeof iconMap] || Terminal;
          const isActive = (state.activeTask?.type === 'skill' && state.activeTask.skill === skillId) || (state.activeTask?.type === 'combat' && skillId === 'combat');
          const isDroneActive = state.droneTask?.skill === skillId;
          const isSelected = currentView === skillId;
          
          const currentLevelXp = getXpForLevel(skillState.level);
          const nextLevelXp = getXpForLevel(skillState.level + 1);
          const progressPercent = Math.min(100, Math.max(0, ((skillState.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

          return (
            <button
              key={skillId}
              onClick={() => navigate(skillId)}
              className={`w-full group flex flex-col px-4 py-2 text-left transition-colors relative ${
                isSelected 
                  ? 'bg-slate-800 text-cyan-400 border-l-2 border-cyan-400' 
                  : 'hover:bg-slate-800/50 text-slate-400 border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-3">
                  <Icon size={18} className={`${isActive ? 'text-rose-500 animate-pulse' : ''} ${isDroneActive && !isActive ? 'text-yellow-400 animate-pulse' : ''}`} />
                  <span>{info.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${isSelected ? 'text-cyan-500' : 'text-slate-500'}`}>
                    УР {skillState.level}
                  </span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              
              <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden mt-1 flex">
                <div 
                  className="h-full bg-cyan-600 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
         <div className="bg-slate-950 p-2 rounded border border-slate-800">
           <div className="flex justify-between text-xs mb-1">
             <span className="text-slate-400">ОЗ</span>
             <span className="text-rose-400 font-mono font-bold">{Math.floor(state.playerHp)}</span>
           </div>
           <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
             <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, (state.playerHp / (100 + state.skills.combat.level*10)) * 100)}%` }} />
           </div>
         </div>
         
         <div className="bg-slate-950 p-2 rounded border border-slate-800">
           <div className="flex justify-between text-xs mb-1">
             <span className="text-slate-400">Человечность</span>
             <span className={state.humanity > 30 ? "text-cyan-400 font-bold" : "text-rose-500 font-bold animate-pulse"}>{state.humanity}%</span>
           </div>
           <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
             <div className={`h-full rounded-full transition-all ${state.humanity > 30 ? "bg-cyan-500" : "bg-rose-500"}`} style={{ width: `${Math.max(0, state.humanity)}%` }} />
           </div>
         </div>

         <div className="flex justify-between text-[10px] text-slate-500 font-mono">
           <span title="Corp Rep">Корп: <span className={state.reputation.corp >= 0 ? 'text-green-500' : 'text-rose-500'}>{state.reputation.corp}</span></span>
           <span title="Street Rep">Улицы: <span className={state.reputation.street >= 0 ? 'text-green-500' : 'text-rose-500'}>{state.reputation.street}</span></span>
         </div>
      </div>
    </aside>
  );
}
