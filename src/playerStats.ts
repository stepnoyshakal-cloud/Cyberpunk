import { GameState } from './types';
import { ITEMS, isProgramEquipped } from './data';

export function getPlayerStats(state: GameState) {
  let maxHp = 100 + (state.skills.combat.level * 10);
  let attack = 5 + state.skills.combat.level;
  let defense = 2 + Math.floor(state.skills.combat.level / 2);
  
  if (state.equipment.weapon) {
    attack += ITEMS[state.equipment.weapon]?.attack || 0;
  }
  if (state.equipment.armor) {
    defense += ITEMS[state.equipment.armor]?.defense || 0;
  }
  if (state.equipment.implant) {
    maxHp += ITEMS[state.equipment.implant]?.maxHp || 0;
  }
  
  if (state.upgrades.includes('upg_titanium_bones')) {
    defense += 10;
  }
  
  if (state.metaUpgrades.includes('meta_combat')) {
    attack = Math.floor(attack * 1.2);
  }

  // Perks
  if (state.perks?.includes('solo_hp')) {
    maxHp += 60;
  }
  if (state.perks?.includes('solo_strike')) {
    attack = Math.floor(attack * 1.20);
  }
  if (state.perks?.includes('solo_armor')) {
    defense += 15;
  }

  // Safehouse bonuses
  if (state.safehouse?.workbench) {
    const wbBonuses = [0, 4, 9, 16, 25, 40];
    attack += wbBonuses[state.safehouse.workbench] || 0;
  }

  // Active Combat Stim Buffs
  if (state.combatBuffs?.blackLaceTimer > 0) {
    attack = Math.floor(attack * 1.50);
  }

  // Cyber-Program: Black ICE (equipped in cyberdeck)
  if (isProgramEquipped(state.equipment, 'prog_black_ice')) {
    defense += 10;
  }
  
  return { maxHp, attack, defense };
}

export function getSkillTimeMultiplier(state: GameState, skill: string, isDrone = false) {
  let mult = 1.0;
  if (skill === 'netrunning' && state.upgrades.includes('upg_cyberdeck_v2')) mult *= 0.8;
  if (skill === 'scavenging' && state.upgrades.includes('upg_krogan_arms')) mult *= 0.8;
  if (skill === 'engineering' && state.upgrades.includes('upg_precision_tools')) mult *= 0.8;
  
  // Recon skill level passively boosts recon speed (up to 25% faster)
  if (skill === 'recon' && state.skills?.recon?.level) {
    mult *= Math.max(0.70, 1 - (state.skills.recon.level - 1) * 0.02);
  }
  // Smuggling skill level passively speeds up supply runs (up to 25% faster)
  if (skill === 'smuggling' && state.skills?.smuggling?.level) {
    mult *= Math.max(0.70, 1 - (state.skills.smuggling.level - 1) * 0.02);
  }

  if (state.metaUpgrades.includes('meta_speed')) {
    mult *= 0.85;
  }

  // Perks
  if (skill === 'netrunning' && state.perks?.includes('net_speed')) {
    mult *= 0.75;
  }

  // Cyber-Program: Ghost Stealth (equipped in cyberdeck)
  if (skill === 'netrunning' && isProgramEquipped(state.equipment, 'prog_ghost_stealth')) {
    mult *= 0.75;
  }
  
  if (isDrone) {
    if (!state.metaUpgrades.includes('meta_drone')) {
      mult *= 2.0; // Drones are 50% slower by default
    }
    // High recon level improves drone coordination
    if (state.skills?.recon?.level) {
      const droneReconBonus = Math.min(0.30, (state.skills.recon.level - 1) * 0.015);
      mult *= (1 - droneReconBonus);
    }
    if (state.perks?.includes('tech_drone')) {
      mult *= 0.65;
    }
    // Cyber-Program: Swarm Protocol (35% speed boost for drones, equipped in cyberdeck)
    if (isProgramEquipped(state.equipment, 'prog_swarm_protocol')) {
      mult *= 0.65;
    }
  }
  
  return mult;
}
