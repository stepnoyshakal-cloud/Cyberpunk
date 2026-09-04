/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import Sidebar, { ViewState } from './components/Sidebar';
import ResourceBar from './components/ResourceBar';
import SkillView from './components/SkillView';
import CombatView from './components/CombatView';
import InventoryView from './components/InventoryView';
import UpgradesView from './components/UpgradesView';
import CyberpsychosisView from './components/CyberpsychosisView';
import RipperdocView from './components/RipperdocView';
import SyndicatesView from './components/SyndicatesView';
import MarketView from './components/MarketView';
import PerksView from './components/PerksView';
import SafehouseView from './components/SafehouseView';
import RealEstateView from './components/RealEstateView';
import TopBar from './components/TopBar';
import { Terminal, AlertTriangle, CheckCircle2, AlertOctagon, Info } from 'lucide-react';

export default function App() {
  const { state, dispatch } = useGameState();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');

  // Очистка лога боя при смене вкладок
  useEffect(() => {
    dispatch({ type: 'CLEAR_COMBAT_LOG' });
  }, [currentView, dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-300 font-mono selection:bg-cyan-900">
      <Sidebar state={state} currentView={currentView} setCurrentView={setCurrentView} />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar state={state} dispatch={dispatch} />
        <ResourceBar resources={state.resources} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Notifications Overlay */}
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {state.notifications.map(n => (
              <div 
                key={n.id} 
                className={`px-4 py-3 rounded-lg shadow-xl border backdrop-blur-md animate-in slide-in-from-right-8 fade-in duration-300 flex items-center gap-3 ${
                  n.type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]' :
                  n.type === 'warning' ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                  n.type === 'error' ? 'bg-rose-950/90 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]' :
                  'bg-slate-900/90 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                }`}
              >
                {n.type === 'success' && <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />}
                {n.type === 'error' && <AlertOctagon size={20} className="shrink-0 text-rose-400" />}
                {n.type === 'warning' && <AlertTriangle size={20} className="shrink-0 text-amber-400" />}
                {n.type === 'info' && <Info size={20} className="shrink-0 text-cyan-400" />}
                <span className="font-semibold text-sm leading-snug">{n.message}</span>
              </div>
            ))}
          </div>

          {/* Random Event Modal */}
          {state.activeEvent && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
               <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="bg-rose-950/50 border-b border-rose-900/50 p-4 flex items-center gap-3">
                     <AlertTriangle className="text-rose-500" size={24} />
                     <h2 className="text-xl font-bold text-rose-400">{state.activeEvent.title}</h2>
                  </div>
                  <div className="p-6">
                     <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                       {state.activeEvent.description}
                     </p>
                     <div className="space-y-3">
                        {state.activeEvent.choices.map((choice, idx) => {
                           // Check requirements
                           let canAfford = true;
                           if (choice.requirements?.resources) {
                             Object.entries(choice.requirements.resources).forEach(([res, amt]) => {
                               if (state.resources[res as any] < amt) canAfford = false;
                             });
                           }

                           return (
                             <button
                               key={idx}
                               onClick={() => dispatch({ type: 'RESOLVE_EVENT', choiceIndex: idx })}
                               disabled={!canAfford}
                               className={`w-full text-left p-4 border rounded transition-colors group flex items-center justify-between ${
                                 canAfford 
                                   ? 'bg-slate-950 hover:bg-slate-800 border-slate-800 hover:border-slate-600' 
                                   : 'bg-slate-950/50 border-slate-800/50 cursor-not-allowed opacity-50'
                               }`}
                             >
                               <span className={`font-bold ${canAfford ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-slate-500'}`}>{choice.text}</span>
                               <span className="text-xs text-slate-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                 {canAfford ? 'ВЫБРАТЬ' : 'НЕДОСТАТОЧНО РЕСУРСОВ'}
                               </span>
                             </button>
                           );
                        })}
                        
                        {/* Check if ALL choices are blocked */}
                        {(() => {
                           const allBlocked = state.activeEvent.choices.every(choice => {
                             if (!choice.requirements?.resources) return false;
                             return Object.entries(choice.requirements.resources).some(([res, amt]) => state.resources[res as any] < amt);
                           });

                           if (allBlocked) {
                             return (
                               <button
                                 onClick={() => dispatch({ type: 'POSTPONE_EVENT' })}
                                 className="w-full text-center p-4 bg-yellow-950/30 hover:bg-yellow-900/50 border border-yellow-700/50 rounded transition-colors mt-6 font-bold text-yellow-500"
                               >
                                 ОТЛОЖИТЬ ДЕЙСТВИЕ (Вернется через 5 минут)
                               </button>
                             );
                           }
                           return null;
                        })()}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {currentView === 'dashboard' && (
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-full text-center space-y-6">
              <Terminal size={64} className="text-cyan-400 mb-4" />
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-rose-500">
                CYBERPUNK IDLE v1.2
              </h1>
              <p className="text-slate-400 text-lg max-w-lg">
                Добро пожаловать в темное будущее. Взламывайте сеть, создавайте смертоносное снаряжение и покоряйте улицы.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-lg">
                <div className="p-4 border border-cyan-500/30 bg-cyan-950/20 rounded-lg">
                  <p className="text-cyan-400 mb-2 font-bold tracking-widest text-xs">ИГРОК</p>
                  <p className="text-slate-300 font-bold mb-4">{state.activeTask ? (state.activeTask.type === 'skill' ? state.activeTask.skill?.toUpperCase() : 'БОЙ') : 'ОЖИДАНИЕ'}</p>
                  {state.activeTask && (
                    <button 
                      onClick={() => setCurrentView(state.activeTask!.type === 'skill' ? state.activeTask!.skill! : 'combat')}
                      className="px-4 py-2 w-full text-xs bg-cyan-900/50 hover:bg-cyan-800/80 text-cyan-200 border border-cyan-500/50 rounded transition-colors cursor-pointer"
                    >
                      ПЕРЕЙТИ
                    </button>
                  )}
                </div>
                
                <div className="p-4 border border-yellow-500/30 bg-yellow-950/20 rounded-lg">
                  <p className="text-yellow-400 mb-2 font-bold tracking-widest text-xs">ДРОН</p>
                  <p className="text-slate-300 font-bold mb-4">{state.droneTask ? state.droneTask.skill.toUpperCase() : 'ОЖИДАНИЕ'}</p>
                  {state.droneTask && (
                    <button 
                      onClick={() => setCurrentView(state.droneTask!.skill)}
                      className="px-4 py-2 w-full text-xs bg-yellow-900/50 hover:bg-yellow-800/80 text-yellow-200 border border-yellow-500/50 rounded transition-colors cursor-pointer"
                    >
                      ПЕРЕЙТИ
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {(currentView === 'netrunning' || currentView === 'scavenging' || currentView === 'engineering' || currentView === 'smuggling' || currentView === 'recon') && (
            <SkillView skillId={currentView} state={state} dispatch={dispatch} />
          )}
          
          {currentView === 'combat' && (
            <CombatView state={state} dispatch={dispatch} />
          )}

          {currentView === 'inventory' && (
            <InventoryView state={state} dispatch={dispatch} />
          )}

          {currentView === 'upgrades' && (
            <UpgradesView state={state} dispatch={dispatch} />
          )}
          
          {currentView === 'cyberpsychosis' && (
            <CyberpsychosisView state={state} dispatch={dispatch} />
          )}
          
          {currentView === 'ripperdoc' && (
            <RipperdocView state={state} dispatch={dispatch} />
          )}
          
          {currentView === 'syndicates' && (
            <SyndicatesView state={state} dispatch={dispatch} />
          )}

          {currentView === 'market' && (
            <MarketView state={state} dispatch={dispatch} />
          )}

          {currentView === 'safehouse' && (
            <SafehouseView state={state} dispatch={dispatch} />
          )}

          {currentView === 'realestate' && (
            <RealEstateView state={state} dispatch={dispatch} />
          )}

          {currentView === 'perks' && (
            <PerksView state={state} dispatch={dispatch} />
          )}
        </main>
      </div>
    </div>
  );
}
