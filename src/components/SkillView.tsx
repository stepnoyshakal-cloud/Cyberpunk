import React from 'react';
import { GameState, Skill } from '../types';
import { SKILL_INFO, ACTIONS, getXpForLevel, RESOURCES, ITEMS } from '../data';
import { getSkillTimeMultiplier } from '../playerStats';
import { GameAction } from '../gameReducer';
import { Play, Square, Bot, Terminal } from 'lucide-react';

interface SkillViewProps {
  skillId: Skill;
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function SkillView({ skillId, state, dispatch }: SkillViewProps) {
  const info = SKILL_INFO[skillId];
  const skillState = state.skills[skillId];
  const actions = ACTIONS[skillId];
  const isActiveSkill = state.activeTask?.type === 'skill' && state.activeTask.skill === skillId;
  const isDroneActiveSkill = state.droneTask?.skill === skillId;
  
  const timeMultiplier = getSkillTimeMultiplier(state, skillId, false);
  const droneTimeMultiplier = getSkillTimeMultiplier(state, skillId, true);

  const currentLevelXp = getXpForLevel(skillState.level);
  const nextLevelXp = getXpForLevel(skillState.level + 1);
  const progressPercent = Math.min(100, Math.max(0, ((skillState.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

  const [hackModalOpen, setHackModalOpen] = React.useState(false);
  const [hackAction, setHackAction] = React.useState('');
  const [hackTimeLeft, setHackTimeLeft] = React.useState(10);
  const [hackScore, setHackScore] = React.useState(0);
  const [hackTarget, setHackTarget] = React.useState(0);

  // Manual hack timer
  React.useEffect(() => {
    if (hackModalOpen && hackTimeLeft > 0) {
      const timer = setTimeout(() => setHackTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (hackModalOpen && hackTimeLeft <= 0) {
      handleHackComplete();
    }
  }, [hackModalOpen, hackTimeLeft]);

  const handleStartHack = (actionId: string) => {
    setHackAction(actionId);
    setHackTimeLeft(10);
    setHackScore(0);
    setHackTarget(Math.floor(Math.random() * 20) + 10);
    setHackModalOpen(true);
  };

  const handleHackClick = () => {
    setHackScore(prev => prev + 1);
  };

  const handleHackComplete = () => {
    setHackModalOpen(false);
    const multiplier = hackScore >= hackTarget ? 2 : 1;
    dispatch({ type: 'COMPLETE_MANUAL_HACK', actionId: hackAction, multiplier });
  };

  const hasDrone = state.inventory['spider_bot'] > 0;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">{info.name}</h1>
        <p className="text-slate-400">{info.description}</p>
        
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-lg p-4">
           <div className="flex justify-between text-sm mb-2">
             <span className="text-slate-300 font-bold">Уровень {skillState.level}</span>
             <span className="text-slate-500">{skillState.xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
           </div>
           <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300"
               style={{ width: `${progressPercent}%` }}
             />
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-300 mb-4 tracking-wider">ДОСТУПНЫЕ ДЕЙСТВИЯ</h2>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {actions.map(action => {
            const isUnlocked = skillState.level >= action.reqLevel;
            const isRunningThis = isActiveSkill && state.activeTask?.actionId === action.id;
            const isDroneRunningThis = isDroneActiveSkill && state.droneTask?.actionId === action.id;
            
            let canAfford = true;
            if (action.cost) {
              for (const [res, amount] of Object.entries(action.cost)) {
                if (state.resources[res as keyof typeof state.resources] < amount) {
                  canAfford = false;
                }
              }
            }
            
            const actualTime = action.time * timeMultiplier;
            const actualDroneTime = action.time * droneTimeMultiplier;

            return (
              <div 
                key={action.id}
                className={`relative overflow-hidden border rounded-lg p-5 transition-colors ${
                  !isUnlocked 
                    ? 'border-slate-800 bg-slate-900/50 opacity-50 grayscale' 
                    : isRunningThis
                      ? 'border-cyan-500 bg-cyan-950/20'
                      : isDroneRunningThis
                        ? 'border-yellow-500 bg-yellow-950/20'
                        : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                }`}
              >
                {isRunningThis && (
                  <div 
                    className="absolute inset-0 bg-cyan-900/20 pointer-events-none transition-all duration-100 ease-linear"
                    style={{ width: `${(state.activeTask!.progressTime / actualTime) * 100}%` }}
                  />
                )}
                {isDroneRunningThis && (
                  <div 
                    className="absolute inset-0 bg-yellow-900/20 pointer-events-none transition-all duration-100 ease-linear"
                    style={{ width: `${(state.droneTask!.progressTime / actualDroneTime) * 100}%` }}
                  />
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">
                        {action.name}
                        {!isUnlocked && ` (Требуется Ур. ${action.reqLevel})`}
                      </h3>
                      <div className="text-sm text-cyan-500 mt-1">
                        +{action.xp} XP / {(actualTime / 1000).toFixed(1)}с
                        {hasDrone && <span className="text-yellow-500 ml-2">(Дрон: {(actualDroneTime / 1000).toFixed(1)}с)</span>}
                      </div>
                    </div>
                    
                    {isUnlocked && (
                      <div className="flex gap-2 z-20">
                        <button
                          onClick={() => {
                            if (isRunningThis) {
                              dispatch({ type: 'STOP_TASK' });
                            } else if (canAfford) {
                              dispatch({ type: 'START_TASK', skill: skillId, actionId: action.id });
                            }
                          }}
                          disabled={(!canAfford && !isRunningThis) || isDroneRunningThis}
                          className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition-colors ${
                            isRunningThis
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30'
                              : canAfford && !isDroneRunningThis
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30'
                                : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                          }`}
                        >
                          {isRunningThis ? (
                            <><Square size={16} /> ОТМЕНА</>
                          ) : (
                            <><Play size={16} /> НАЧАТЬ</>
                          )}
                        </button>
                        
                        {skillId === 'netrunning' && !isRunningThis && isUnlocked && canAfford && (
                          <button
                            onClick={() => handleStartHack(action.id)}
                            disabled={!canAfford || isDroneRunningThis}
                            className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition-colors ${
                              canAfford && !isDroneRunningThis
                                ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50 hover:bg-fuchsia-500/30'
                                : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                            }`}
                            title="Сыграть в мини-игру для увеличения награды"
                          >
                            <Terminal size={16} /> ВЗЛОМ
                          </button>
                        )}
                        
                        {hasDrone && (
                          <button
                            onClick={() => {
                              if (isDroneRunningThis) {
                                dispatch({ type: 'STOP_DRONE_TASK' });
                              } else if (canAfford) {
                                dispatch({ type: 'START_DRONE_TASK', skill: skillId, actionId: action.id });
                              }
                            }}
                            disabled={(!canAfford && !isDroneRunningThis) || isRunningThis}
                            className={`flex items-center gap-2 px-3 py-2 rounded font-bold transition-colors ${
                              isDroneRunningThis
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30'
                                : canAfford && !isRunningThis
                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-500/30'
                                  : 'bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed'
                            }`}
                            title="Отправить дрона"
                          >
                            {isDroneRunningThis ? (
                              <Square size={16} />
                            ) : (
                              <Bot size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto grid grid-cols-2 gap-4">
                    {action.cost && (
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-xs text-rose-400 uppercase font-bold block mb-1">Стоимость</span>
                        <div className="space-y-1">
                          {Object.entries(action.cost).map(([res, amount]) => (
                             <div key={res} className="text-sm flex justify-between">
                               <span className="text-slate-400">{RESOURCES[res as keyof typeof RESOURCES].name}</span>
                               <span className={state.resources[res as keyof typeof state.resources] >= amount ? 'text-slate-300' : 'text-rose-500'}>
                                 {amount}
                               </span>
                             </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {(action.rewards || action.itemRewards) && (
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-xs text-green-400 uppercase font-bold block mb-1">Награды</span>
                        <div className="space-y-1">
                          {action.rewards && Object.entries(action.rewards).map(([res, amount]) => (
                             <div key={res} className="text-sm flex justify-between">
                               <span className="text-slate-400">{RESOURCES[res as keyof typeof RESOURCES].name}</span>
                               <span className="text-green-400">+{amount}</span>
                             </div>
                          ))}
                          {action.itemRewards && Object.entries(action.itemRewards).map(([itemId, amount]) => (
                             <div key={itemId} className="text-sm flex justify-between">
                               <span className="text-slate-400">{ITEMS[itemId]?.name || itemId}</span>
                               <span className="text-green-400">+{amount}</span>
                             </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Hack Minigame Modal */}
      {hackModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-fuchsia-500 rounded-lg max-w-sm w-full p-6 text-center">
            <h2 className="text-2xl font-bold text-fuchsia-400 mb-2">РУЧНОЙ ВЗЛОМ</h2>
            <p className="text-slate-400 mb-6">
              Кликайте как можно быстрее! Наберите <span className="text-white font-bold">{hackTarget}</span> очков для двойной награды.
            </p>
            
            <div className="text-5xl font-mono font-bold text-white mb-6">
              {hackTimeLeft}с
            </div>

            <button
              onClick={handleHackClick}
              className="w-full h-32 bg-fuchsia-600 hover:bg-fuchsia-500 active:bg-fuchsia-700 active:scale-95 transition-all rounded-lg shadow-[0_0_20px_rgba(217,70,239,0.4)] flex items-center justify-center text-4xl font-bold text-white mb-6 select-none"
            >
              {hackScore}
            </button>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${hackScore >= hackTarget ? 'bg-green-500' : 'bg-fuchsia-500'}`}
                style={{ width: `${Math.min(100, (hackScore / hackTarget) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
