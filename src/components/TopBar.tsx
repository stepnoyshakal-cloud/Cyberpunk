import React, { useState } from 'react';
import { GameState } from '../types';
import { GameAction } from '../gameReducer';
import { Terminal, Bot, AlertTriangle, Volume2, VolumeX, KeyRound, ShieldAlert, X, Sparkles } from 'lucide-react';
import { ACTIONS, ENEMIES } from '../data';
import { isSoundMuted, toggleSoundMute, playClickSound, playHackSound, playLevelUpSound } from '../sound';

interface TopBarProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function TopBar({ state, dispatch }: TopBarProps) {
  const [muted, setMuted] = useState(isSoundMuted());
  const [showCheatModal, setShowCheatModal] = useState(false);
  const [cheatCode, setCheatCode] = useState('');
  const [cheatError, setCheatError] = useState('');
  const [cheatSuccess, setCheatSuccess] = useState(false);

  const handleToggleSound = () => {
    const nextMuted = toggleSoundMute();
    setMuted(nextMuted);
    if (!nextMuted) {
      playClickSound();
    }
  };

  const handleCheatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cheatCode.trim() === '322') {
      playLevelUpSound();
      dispatch({ type: 'CHEAT_RESOURCES_322', password: '322' });
      setCheatSuccess(true);
      setCheatError('');
      setTimeout(() => {
        setCheatSuccess(false);
        setShowCheatModal(false);
        setCheatCode('');
      }, 1200);
    } else {
      playHackSound();
      setCheatError('ОТКАЗ В ДОСТУПЕ: Неверный защитный код!');
      setCheatSuccess(false);
    }
  };

  const getTaskDescription = () => {
    if (!state.activeTask) return null;
    if (state.activeTask.type === 'skill' && state.activeTask.skill) {
      const action = ACTIONS[state.activeTask.skill]?.find(a => a.id === state.activeTask?.actionId);
      const skillNames: Record<string, string> = {
        netrunning: 'Нетраннинг',
        scavenging: 'Сбор сырья',
        engineering: 'Инженерия',
        smuggling: 'Контрабанда',
        recon: 'Разведка',
      };
      const skillColors: Record<string, string> = {
        netrunning: 'text-cyan-400 border-cyan-800 bg-cyan-950/70',
        scavenging: 'text-emerald-400 border-emerald-800 bg-emerald-950/70',
        engineering: 'text-purple-400 border-purple-800 bg-purple-950/70',
        smuggling: 'text-amber-400 border-amber-800 bg-amber-950/70',
        recon: 'text-blue-400 border-blue-800 bg-blue-950/70',
      };
      return {
        category: skillNames[state.activeTask.skill] || state.activeTask.skill,
        detail: action?.name || state.activeTask.actionId,
        color: skillColors[state.activeTask.skill] || 'text-cyan-400 border-cyan-800 bg-cyan-950/70'
      };
    }
    if (state.activeTask.type === 'combat') {
      const enemy = ENEMIES[state.activeTask.actionId];
      return {
        category: 'Бой',
        detail: enemy ? `${enemy.name}` : 'Схватка',
        color: 'text-rose-400 border-rose-800 bg-rose-950/70'
      };
    }
    return null;
  };

  const getDroneDescription = () => {
    if (!state.droneTask) return null;
    const action = ACTIONS[state.droneTask.skill]?.find(a => a.id === state.droneTask?.actionId);
    const skillNames: Record<string, string> = {
      netrunning: 'Нетраннинг',
      scavenging: 'Сбор сырья',
      engineering: 'Инженерия',
      smuggling: 'Контрабанда',
      recon: 'Разведка',
    };
    return {
      category: skillNames[state.droneTask.skill] || state.droneTask.skill,
      detail: action?.name || state.droneTask.actionId
    };
  };

  const playerTask = getTaskDescription();
  const droneTask = getDroneDescription();

  return (
    <>
      <div className="h-13 border-b border-slate-800 bg-slate-950/95 backdrop-blur flex items-center justify-between px-4 z-20 shadow-md flex-shrink-0 relative">
        {/* Left / Center: Active Process Indicators */}
        <div className="flex gap-4 sm:gap-6 items-center flex-1 h-full overflow-hidden mr-3">
          {/* Player Active Process with category -> specific step */}
          <div className="flex items-center gap-2 h-full truncate">
            <span className="relative flex h-2 w-2">
              {playerTask && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${playerTask ? 'bg-cyan-500' : 'bg-slate-700'}`} />
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline shrink-0">
              ПРОЦЕСС:
            </span>

            {playerTask ? (
              <div className="flex items-center gap-1.5 truncate">
                <span className={`text-[11px] font-bold uppercase font-mono px-2 py-0.5 rounded border shrink-0 ${playerTask.color}`}>
                  {playerTask.category}
                </span>
                <span className="text-slate-500 text-xs font-mono">→</span>
                <span className="text-xs font-bold text-slate-100 truncate tracking-wide">
                  {playerTask.detail}
                </span>
              </div>
            ) : (
              <span className="text-xs font-mono font-medium text-slate-600 italic">СИСТЕМА В РЕЖИМЕ ОЖИДАНИЯ</span>
            )}
          </div>

          {/* Drone Process */}
          {state.inventory['spider_bot'] > 0 && (
            <div className="flex items-center gap-2 h-full border-l border-slate-800/80 pl-4 sm:pl-6 truncate">
              <Bot size={14} className={droneTask ? 'text-amber-400 shrink-0 animate-pulse' : 'text-slate-600 shrink-0'} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden md:inline shrink-0">
                ДРОН:
              </span>
              {droneTask ? (
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[10px] font-bold uppercase font-mono px-1.5 py-0.5 rounded border border-amber-800/80 bg-amber-950/70 text-amber-300 shrink-0">
                    {droneTask.category}
                  </span>
                  <span className="text-slate-500 text-xs font-mono">→</span>
                  <span className="text-xs font-medium text-slate-300 truncate">
                    {droneTask.detail}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-mono text-slate-600 italic">Спит</span>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Cheat Button, Breach Alert, Audio */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* ICE Breach Alert */}
          {state.iceBreach && (
            <button
              onClick={() => {
                playHackSound();
                dispatch({ type: 'RESOLVE_ICE_BREACH' });
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg border border-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.6)] animate-bounce"
            >
              <AlertTriangle size={14} className="animate-pulse" />
              ВЗЛОМ ICE ({(state.iceBreach.timeLeft / 1000).toFixed(1)}с)
            </button>
          )}

          {/* Cheat Button requested by user (password 322) */}
          <button
            onClick={() => {
              playClickSound();
              setShowCheatModal(true);
              setCheatError('');
              setCheatSuccess(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-300 hover:text-purple-100 border border-purple-700/60 text-xs font-bold tracking-wider transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)] hover:shadow-[0_0_16px_rgba(168,85,247,0.4)]"
            title="Консоль чит-кодов Найт-Сити"
          >
            <KeyRound size={13} className="text-purple-400" />
            <span className="hidden sm:inline">ЧИТЫ</span>
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={handleToggleSound}
            title={muted ? 'Включить звук' : 'Выключить звук'}
            className={`p-1.5 rounded-lg border transition-colors ${
              muted
                ? 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 bg-slate-900'
                : 'border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/50 bg-cyan-950/20 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
            }`}
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </div>

      {/* Cyberpunk Cheat Modal */}
      {showCheatModal && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-purple-500/60 max-w-sm w-full rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.25)] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-950/80 to-slate-900 border-b border-purple-900/60 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-purple-400" size={20} />
                <h3 className="text-base font-black text-purple-200 tracking-wider">КОНСОЛЬ РАЗРАБОТЧИКА</h3>
              </div>
              <button
                onClick={() => setShowCheatModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCheatSubmit} className="p-5 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Введите код разблокировки черного рынка (подсказка: <strong className="text-purple-400 font-mono">322</strong>). Предоставляет <strong className="text-cyan-400 font-mono">+10 000</strong> каждого ресурса и кредитов.
              </p>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Пароль авторизации:
                </label>
                <input
                  type="password"
                  value={cheatCode}
                  onChange={(e) => setCheatCode(e.target.value)}
                  placeholder="Введите пароль..."
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-purple-200 font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {cheatError && (
                <div className="text-xs text-rose-400 font-bold bg-rose-950/40 border border-rose-800/60 rounded-lg p-2.5">
                  {cheatError}
                </div>
              )}

              {cheatSuccess && (
                <div className="text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-800/60 rounded-lg p-2.5 flex items-center gap-1.5 animate-pulse">
                  <Sparkles size={14} /> ЧИТ АКТИВИРОВАН: +10 000 всех ресурсов зачислено!
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheatModal(false)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  ОТМЕНА
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-black tracking-wider transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] active:scale-95"
                >
                  АКТИВИРОВАТЬ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
