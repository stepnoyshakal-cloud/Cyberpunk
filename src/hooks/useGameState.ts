import { useEffect, useReducer, useRef } from 'react';
import { gameReducer, initialState } from '../gameReducer';
import { GameState } from '../types';

const STORAGE_KEY = 'cyberpunk_idle_save_v3';

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState, (initial) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const parsedSkills = { ...initial.skills, ...(parsed.skills || {}) };
        const totalSkillLevels: number = (Object.values(parsedSkills) as Array<{ level?: number }>).reduce(
          (acc: number, s) => acc + (s.level || 1),
          0
        );
        const savedPerks: string[] = parsed.perks || [];
        const savedPerkPoints: number = parsed.perkPoints !== undefined 
          ? parsed.perkPoints 
          : Math.max(0, (totalSkillLevels - 4) - savedPerks.length);

        return {
            ...initial,
            ...parsed,
            resources: { ...initial.resources, ...parsed.resources },
            skills: parsedSkills,
            perks: savedPerks,
            perkPoints: savedPerkPoints,
            safehouse: { ...initial.safehouse, ...(parsed.safehouse || {}) },
            combatBuffs: { ...initial.combatBuffs, ...(parsed.combatBuffs || {}) }
        };
      }
    } catch (e) {
      console.error('Failed to load save', e);
    }
    return initial;
  });

  const stateRef = useRef(state);
  stateRef.current = state;
  
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current));
    }, 2000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let lastTime = Date.now();
    let isRunning = true;
    let animationFrameId: number;

    const tick = () => {
      if (!isRunning) return;
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;

      if (delta > 0) {
        dispatch({ type: 'TICK', delta });
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return { state, dispatch };
}
