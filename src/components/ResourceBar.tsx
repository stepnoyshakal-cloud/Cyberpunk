import React from 'react';
import { GameState } from '../types';
import { RESOURCES } from '../data';
import { Database, Zap, Cpu, CircleDollarSign, Wrench, BrainCircuit } from 'lucide-react';

const resIcons = {
  data: Database,
  scrap: Zap,
  components: Cpu,
  credits: CircleDollarSign,
  weapon_parts: Wrench,
  engrams: BrainCircuit
};

export default function ResourceBar({ resources }: { resources: GameState['resources'] }) {
  return (
    <div className="h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center px-4 overflow-x-auto gap-6 flex-shrink-0">
      {(Object.entries(resources) as [keyof typeof resources, number][]).map(([key, amount]) => {
        const info = RESOURCES[key];
        const Icon = resIcons[key as keyof typeof resIcons] || Database;
        
        return (
          <div key={key} className="flex items-center gap-2 whitespace-nowrap">
            <Icon size={16} className={info.color} />
            <div className="flex flex-col">
               <span className="text-[10px] text-slate-500 uppercase leading-none">{info.name}</span>
               <span className="text-sm font-bold text-slate-200 leading-tight">
                 {amount.toLocaleString()}
               </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
