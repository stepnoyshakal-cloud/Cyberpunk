import { GameState, Resource, Skill, EquipmentSlot } from './types';
import { ACTIONS, ENEMIES, UPGRADES, META_UPGRADES, getLevelFromXp, ITEMS, INITIAL_MARKET, RANDOM_EVENTS, RESOURCES, getMaxInventory, getTotalInventoryItems, canFitItemInInventory, generateRandomContracts, CONTRACT_REFRESH_COST, getContractRefreshCost, isProgramEquipped, REAL_ESTATE } from './data';
import { getPlayerStats, getSkillTimeMultiplier } from './playerStats';
import { CYBER_PERKS } from './perksData';
import { SAFEHOUSE_MODULES, COMBAT_STIMS } from './safehouseData';

export type GameAction =
  | { type: 'TICK'; delta: number }
  | { type: 'START_TASK'; skill: Skill; actionId: string }
  | { type: 'START_DRONE_TASK'; skill: Skill; actionId: string }
  | { type: 'START_COMBAT'; enemyId: string }
  | { type: 'STOP_TASK' }
  | { type: 'STOP_DRONE_TASK' }
  | { type: 'BUY_UPGRADE'; upgradeId: string }
  | { type: 'BUY_META_UPGRADE'; upgradeId: string }
  | { type: 'EQUIP_ITEM'; itemId: string; slot: EquipmentSlot }
  | { type: 'UNEQUIP_ITEM'; slot: EquipmentSlot }
  | { type: 'RESOLVE_ICE_BREACH' }
  | { type: 'CONSUME_ITEM'; itemId: string }
  | { type: 'RIPPERDOC_HEAL' }
  | { type: 'COMBAT_ABILITY'; ability: 'emp' | 'heal' }
  | { type: 'CLAIM_CONTRACT'; contractId: string }
  | { type: 'GENERATE_CONTRACTS' }
  | { type: 'BUY_ITEM'; itemId: string; cost: number }
  | { type: 'SELL_ITEM'; itemId: string; count?: number }
  | { type: 'CHEAT_RESOURCES_322' }
  | { type: 'TRADE_MARKET'; resource: 'data'|'scrap'|'components'; amount: number; tradeType: 'buy' | 'sell' }
  | { type: 'RESOLVE_EVENT'; choiceIndex: number }
  | { type: 'POSTPONE_EVENT' }
  | { type: 'CLEAR_COMBAT_LOG' }
  | { type: 'BUY_PERK'; perkId: string }
  | { type: 'RESET_PERKS' }
  | { type: 'UPGRADE_SAFEHOUSE'; module: 'server' | 'workbench' | 'medpod' | 'terminal' }
  | { type: 'USE_COMBAT_STIM'; stimId: string }
  | { type: 'CRAFT_COMBAT_STIM'; stimId: string }
  | { type: 'PRESTIGE' }
  | { type: 'BUY_REAL_ESTATE'; estateId: string }
  | { type: 'COMPLETE_MANUAL_HACK'; actionId: string; multiplier: number };

export const initialState: GameState = {
  tickCount: 0,
  resources: {
    data: 0, scrap: 0, components: 0, credits: 0, weapon_parts: 0, engrams: 0
  },
  marketPrices: { ...INITIAL_MARKET },
  marketTrends: { data: 0, scrap: 0, components: 0 },
  activeEvent: null,
  postponedEventId: null,
  postponedEventTimer: 0,
  eventCooldown: 3000 + Math.floor(Math.random() * 3001), // 5-10 минут (при 10 тиках в секунду = 3000-6000 тиков)
  inventory: {},
  equipment: { weapon: null, armor: null, implant: null, program: null, program2: null },
  upgrades: [],
  metaUpgrades: [],
  skills: {
    netrunning: { xp: 0, level: 1 },
    scavenging: { xp: 0, level: 1 },
    smuggling: { xp: 0, level: 1 },
    recon: { xp: 0, level: 1 },
    engineering: { xp: 0, level: 1 },
    combat: { xp: 0, level: 1 }
  },
  playerHp: 110,
  humanity: 100,
  reputation: { corp: 0, street: 0 },
  combatLogs: [],
  notifications: [],
  contracts: generateRandomContracts(),
  activeTask: null,
  droneTask: null,
  iceBreach: null,
  perks: [],
  perkPoints: 0,
  safehouse: {
    server: 0,
    workbench: 0,
    medpod: 0,
    terminal: 0
  },
  combatBuffs: {
    blackLaceTimer: 0,
    overclockShield: 0
  },
  realEstate: {}
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'COMPLETE_MANUAL_HACK': {
      const taskDef = ACTIONS.netrunning.find(a => a.id === action.actionId);
      if (!taskDef) return state;
      const nextState = { ...state, resources: { ...state.resources } };
      
      const multiplier = action.multiplier;
      if (taskDef.rewards) {
        for (const [res, amt] of Object.entries(taskDef.rewards)) {
          nextState.resources[res as Resource] += amt * multiplier;
        }
      }
      if (taskDef.itemRewards) {
        nextState.inventory = { ...state.inventory };
        for (const [item, amt] of Object.entries(taskDef.itemRewards)) {
          nextState.inventory[item] = Math.min((nextState.inventory[item] || 0) + amt * multiplier, getMaxInventory(nextState));
        }
      }
      
      const xpGain = taskDef.xp * multiplier;
      nextState.skills = { ...state.skills, netrunning: { ...state.skills.netrunning, xp: state.skills.netrunning.xp + xpGain } };
      
      // Update level
      const newLevel = getLevelFromXp(nextState.skills.netrunning.xp);
      if (newLevel > nextState.skills.netrunning.level) {
        nextState.skills.netrunning.level = newLevel;
        if (newLevel % 3 === 0) nextState.perkPoints = (nextState.perkPoints || 0) + 1;
        nextState.notifications = [...state.notifications, { id: Date.now(), message: `Уровень Нетраннинга повышен до ${newLevel}!`, type: 'success', timeLeft: 4000 }];
      }

      nextState.notifications = [...(nextState.notifications || []), {
        id: Date.now(),
        message: `Взлом завершен (x${multiplier})!`,
        type: 'success',
        timeLeft: 3000
      }];
      return nextState;
    }

    case 'BUY_REAL_ESTATE': {
      const estate = REAL_ESTATE.find(r => r.id === action.estateId);
      if (!estate) return state;
      
      const currentLevel = state.realEstate[action.estateId]?.level || 0;
      const cost = estate.baseCost * Math.pow(1.5, currentLevel);
      
      if (state.resources.credits < cost) return state;
      
      return {
        ...state,
        resources: { ...state.resources, credits: state.resources.credits - cost },
        realEstate: {
          ...state.realEstate,
          [action.estateId]: {
            ...state.realEstate[action.estateId],
            level: currentLevel + 1
          }
        }
      };
    }

    case 'PRESTIGE': {
      let totalLevels = Object.values(state.skills).reduce((acc, skill) => acc + skill.level, 0);
      let earnedEngrams = Math.floor(totalLevels / 10); // 1 engram per 10 total levels
      
      return {
        ...initialState,
        resources: { ...initialState.resources, engrams: state.resources.engrams + earnedEngrams },
        metaUpgrades: [...state.metaUpgrades]
      };
    }
    
    case 'CONSUME_ITEM': {
      const item = ITEMS[action.itemId];
      if (!item || item.type !== 'consumable' || !state.inventory[action.itemId]) return state;
      const nextState = { ...state, inventory: { ...state.inventory } };
      nextState.inventory[action.itemId] -= 1;
      
      if (item.restoreHumanity) {
         nextState.humanity = Math.min(100, nextState.humanity + item.restoreHumanity);
         nextState.notifications = [...state.notifications, { id: Date.now(), message: `Восстановлено ${item.restoreHumanity} человечности!`, type: 'success', timeLeft: 3000 }];
      }
      return nextState;
    }

    case 'RIPPERDOC_HEAL': {
      const cost = 250;
      if (state.resources.credits < cost || state.humanity >= 100) return state;
      return {
         ...state,
         resources: { ...state.resources, credits: state.resources.credits - cost },
         humanity: Math.min(100, state.humanity + 10),
         notifications: [...state.notifications, { id: Date.now(), message: `Терапия пройдена. +10 Человечности.`, type: 'success', timeLeft: 3000 }]
      };
    }

    case 'COMBAT_ABILITY': {
      if (state.activeTask?.type !== 'combat') return state;
      const nextState = { ...state, combatLogs: [...state.combatLogs], resources: { ...state.resources } };
      if (action.ability === 'emp') {
         if (nextState.resources.data < 50) return state;
         nextState.resources.data -= 50;
         nextState.activeTask = { ...nextState.activeTask, enemyHp: nextState.activeTask.enemyHp! - 100 };
         nextState.combatLogs.unshift({ id: Date.now(), text: `⚡ ВЫ ПРИМЕНИЛИ ЭМИ! Нанесено 100 урона.`, type: 'player' });
      }
      if (action.ability === 'heal') {
         if (!nextState.inventory['neuropozyne']) return state;
         nextState.inventory = { ...nextState.inventory, neuropozyne: nextState.inventory['neuropozyne'] - 1 };
         const stats = getPlayerStats(nextState);
         nextState.playerHp = Math.min(stats.maxHp, nextState.playerHp + 50);
         nextState.humanity = Math.min(100, nextState.humanity + 20);
         nextState.combatLogs.unshift({ id: Date.now(), text: `💊 Нейропозин применен! +50 ОЗ, +20 Человечности.`, type: 'player' });
      }
      return nextState;
    }

    case 'GENERATE_CONTRACTS': {
      const cost = getContractRefreshCost(state.inventory);
      if (state.resources.credits < cost) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            {
              id: Date.now(),
              message: `[ОШИБКА] Недостаточно кредитов для обновления контрактов! Требуется ${cost} КР (в наличии: ${state.resources.credits} КР).`,
              type: 'error',
              timeLeft: 4000
            }
          ]
        };
      }
      return {
        ...state,
        resources: {
          ...state.resources,
          credits: state.resources.credits - cost
        },
        contracts: generateRandomContracts(),
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            message: `📡 [ФИКСЕР] База контрактов обновлена (-${cost} КР)${isProgramEquipped(state.equipment, 'prog_corp_leaker') ? ' [Скидка Инсайдера 50%]' : ''}. Доступны новые заказы!`,
            type: 'info',
            timeLeft: 3500
          }
        ]
      };
    }

    case 'CLAIM_CONTRACT': {
      const contract = state.contracts.find(c => c.id === action.contractId);
      if (!contract) return state;
      const current = contract.currentAmount ?? contract.killsCurrent ?? 0;
      const required = contract.targetAmount ?? contract.killsRequired ?? 1;
      if (current < required) return state;
      
      const termBonus = 1 + ((state.safehouse?.terminal || 0) * 0.1);
      const isLeakerActive = isProgramEquipped(state.equipment, 'prog_corp_leaker');
      const corpLeakerMult = isLeakerActive ? 1.3 : 1.0;
      const rewardCredits = Math.round(contract.rewardCredits * termBonus * corpLeakerMult);
      const rewardRep = Math.round(contract.rewardRep * corpLeakerMult) || (contract.rewardRep + (isLeakerActive ? 1 : 0));
      return {
        ...state,
        contracts: state.contracts.filter(c => c.id !== action.contractId),
        resources: { ...state.resources, credits: state.resources.credits + rewardCredits },
        reputation: { ...state.reputation, [contract.faction]: state.reputation[contract.faction] + rewardRep },
        notifications: [
          ...state.notifications, 
          { 
            id: Date.now(), 
            message: `Контракт «${contract.title || contract.description}» закрыт: +${rewardCredits} Кредитов${corpLeakerMult > 1 ? ' (+30% Инсайдер)' : ''}, +${rewardRep} Репутации`, 
            type: 'success', 
            timeLeft: 3500 
          }
        ]
      };
    }
    
    case 'BUY_ITEM': {
      if (state.resources.credits < action.cost) return state;
      const canFit = canFitItemInInventory(state.inventory, state.upgrades, action.itemId, 1);
      if (!canFit) {
        const currentSlots = getTotalInventoryItems(state.inventory);
        const maxSlots = getMaxInventory(state.upgrades);
        return {
          ...state,
          notifications: [...state.notifications, { id: Date.now(), message: `[ОШИБКА] Склад переполнен (${currentSlots}/${maxSlots} слотов)! Продайте вещи или улучшите вместимость.`, type: 'error', timeLeft: 3500 }]
        };
      }
      const currentCount = state.inventory[action.itemId] || 0;
      return {
        ...state,
        resources: { ...state.resources, credits: state.resources.credits - action.cost },
        inventory: { ...state.inventory, [action.itemId]: Math.min(99, currentCount + 1) },
        notifications: [...state.notifications, { id: Date.now(), message: `Куплено: ${ITEMS[action.itemId]?.name || action.itemId}`, type: 'success', timeLeft: 3000 }]
      };
    }

    case 'SELL_ITEM': {
      const currentCount = state.inventory[action.itemId] || 0;
      if (currentCount <= 0) return state;
      const countToSell = action.count && action.count > 0 ? Math.min(currentCount, action.count) : 1;
      const item = ITEMS[action.itemId];
      const unitPrice = item?.sellPrice || 15;
      const totalGain = unitPrice * countToSell;

      const nextInventory = { ...state.inventory };
      if (nextInventory[action.itemId] <= countToSell) {
        delete nextInventory[action.itemId];
      } else {
        nextInventory[action.itemId] -= countToSell;
      }

      return {
        ...state,
        inventory: nextInventory,
        resources: {
          ...state.resources,
          credits: state.resources.credits + totalGain
        },
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            message: `Продано: ${item?.name || action.itemId} x${countToSell} (+${totalGain} КР)`,
            type: 'success',
            timeLeft: 2500
          }
        ]
      };
    }

    case 'CHEAT_RESOURCES_322': {
      const stats = getPlayerStats(state);
      return {
        ...state,
        resources: {
          credits: state.resources.credits + 10000,
          data: state.resources.data + 10000,
          scrap: state.resources.scrap + 10000,
          components: state.resources.components + 10000,
          weapon_parts: state.resources.weapon_parts + 10000,
          engrams: state.resources.engrams + 10000,
        },
        playerHp: stats.maxHp,
        humanity: 100,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            message: `⚡ [ЧИТ 322 АКТИВИРОВАН] +10,000 всех ресурсов начислено! Здоровье и Человечность восстановлены до 100%.`,
            type: 'success',
            timeLeft: 6000
          }
        ]
      };
    }

    case 'TRADE_MARKET': {
      const price = state.marketPrices[action.resource];
      const buyPrice = Math.ceil(price * 1.30); // 30% наценка при покупке
      const sellPrice = Math.max(1, Math.floor(price * 0.70)); // 30% уценка при продаже
      const brokerFee = 2; // Фиксированная комиссия брокера

      const MAX_PRICES = { data: 10, scrap: 4, components: 22 };
      const MIN_PRICES = { data: 2, scrap: 1, components: 6 };

      if (action.tradeType === 'buy') {
        const cost = (buyPrice * action.amount) + brokerFee;
        if (state.resources.credits < cost) return state;

        // Влияние на рынок: крупная покупка повышает цену
        const priceImpact = action.amount >= 50 ? 1 : 0;
        const newPrice = Math.min(MAX_PRICES[action.resource], price + priceImpact);

        return {
          ...state,
          resources: { 
            ...state.resources, 
            credits: state.resources.credits - cost, 
            [action.resource]: state.resources[action.resource] + action.amount 
          },
          marketPrices: {
            ...state.marketPrices,
            [action.resource]: newPrice
          },
          notifications: [...state.notifications, { id: Date.now(), message: `Куплено ${action.amount} ${RESOURCES[action.resource]?.name || action.resource} (-${cost} КР, вкл. сбор ${brokerFee} КР)`, type: 'info', timeLeft: 2500 }]
        };
      } else {
        const grossGain = sellPrice * action.amount;
        const gain = Math.max(0, grossGain - brokerFee);
        if (state.resources[action.resource] < action.amount) return state;

        // Влияние на рынок: крупная продажа сбивает цену
        const priceImpact = action.amount >= 50 ? 1 : 0;
        const newPrice = Math.max(MIN_PRICES[action.resource], price - priceImpact);

        return {
          ...state,
          resources: { 
            ...state.resources, 
            credits: state.resources.credits + gain, 
            [action.resource]: state.resources[action.resource] - action.amount 
          },
          marketPrices: {
            ...state.marketPrices,
            [action.resource]: newPrice
          },
          notifications: [...state.notifications, { id: Date.now(), message: `Продано ${action.amount} ${RESOURCES[action.resource]?.name || action.resource} (+${gain} КР, сбор биржи ${brokerFee} КР)`, type: 'info', timeLeft: 2500 }]
        };
      }
    }

    case 'POSTPONE_EVENT': {
      if (!state.activeEvent) return state;
      return {
        ...state,
        postponedEventId: state.activeEvent.id,
        postponedEventTimer: 3000 + Math.floor(Math.random() * 3001), // 5-10 минут (при 10 тиках в секунду = 3000-6000 тиков)
        activeEvent: null,
        notifications: [...state.notifications, { id: Date.now(), message: `Событие отложено. Оно вернется через 5-10 минут.`, type: 'info', timeLeft: 4000 }]
      };
    }

    case 'CLEAR_COMBAT_LOG': {
      return { ...state, combatLogs: [] };
    }

    case 'BUY_PERK': {
      if (state.perks.includes(action.perkId)) return state;
      const perk = CYBER_PERKS.find(p => p.id === action.perkId);
      if (!perk) return state;
      if (perk.requires && !state.perks.includes(perk.requires)) return state;
      if (state.perkPoints < perk.cost) return state;

      return {
        ...state,
        perks: [...state.perks, action.perkId],
        perkPoints: state.perkPoints - perk.cost,
        notifications: [...state.notifications, { id: Date.now(), message: `Перк разблокирован: «${perk.name}»!`, type: 'success', timeLeft: 3000 }]
      };
    }

    case 'RESET_PERKS': {
      if (state.perks.length === 0) return state;
      let refunded = 0;
      state.perks.forEach(pId => {
        const perk = CYBER_PERKS.find(p => p.id === pId);
        refunded += perk ? perk.cost : 1;
      });
      return {
        ...state,
        perks: [],
        perkPoints: state.perkPoints + refunded,
        notifications: [...state.notifications, { id: Date.now(), message: `Перки сброшены. Возвращено ${refunded} очков!`, type: 'info', timeLeft: 3000 }]
      };
    }

    case 'UPGRADE_SAFEHOUSE': {
      const moduleDef = SAFEHOUSE_MODULES.find(m => m.id === action.module);
      if (!moduleDef) return state;
      const currentLevel = state.safehouse[action.module] || 0;
      if (currentLevel >= moduleDef.maxLevel) return state;
      const nextLevelDef = moduleDef.levels[currentLevel];
      if (!nextLevelDef) return state;

      const discount = state.perks?.includes('tech_craft') ? 0.8 : 1.0;
      const adjustedCost: Record<string, number> = {};
      for (const [res, amt] of Object.entries(nextLevelDef.cost)) {
        adjustedCost[res] = Math.ceil((amt || 0) * discount);
      }

      for (const [res, amt] of Object.entries(adjustedCost)) {
        if (state.resources[res as Resource] < amt) return state;
      }

      const nextResources = { ...state.resources };
      for (const [res, amt] of Object.entries(adjustedCost)) {
        nextResources[res as Resource] -= amt;
      }

      return {
        ...state,
        resources: nextResources,
        safehouse: {
          ...state.safehouse,
          [action.module]: currentLevel + 1
        },
        notifications: [...state.notifications, { id: Date.now(), message: `Убежище: ${moduleDef.name} улучшен до Ур. ${currentLevel + 1}!`, type: 'success', timeLeft: 3500 }]
      };
    }

    case 'USE_COMBAT_STIM': {
      if (!state.inventory[action.stimId] || state.inventory[action.stimId] <= 0) return state;
      const stim = COMBAT_STIMS.find(s => s.id === action.stimId);
      const nextInventory = { ...state.inventory, [action.stimId]: state.inventory[action.stimId] - 1 };
      const nextBuffs = { ...state.combatBuffs };
      let hp = state.playerHp;
      let humanity = state.humanity;
      const stats = getPlayerStats(state);
      const logs = [...state.combatLogs];
      const stimMult = state.perks?.includes('tech_stim') ? 1.5 : 1.0;

      if (action.stimId === 'max_doc') {
        const healAmt = Math.round(50 * stimMult);
        hp = Math.min(stats.maxHp, hp + healAmt);
        logs.unshift({ id: Date.now(), text: `💉 МАКСДОК: +${healAmt} ОЗ восстановлено!`, type: 'player' as const });
      } else if (action.stimId === 'black_lace') {
        const duration = Math.round(15000 * stimMult);
        nextBuffs.blackLaceTimer = duration;
        const humanityLoss = state.perks?.includes('net_sanity') ? 1 : 2;
        humanity = Math.max(0, humanity - humanityLoss);
        logs.unshift({ id: Date.now(), text: `⚡ ЧЕРНОЕ КРУЖЕВО: +50% урона и ускорение атак на ${Math.round(duration/1000)}с! (-${humanityLoss} Человечности)`, type: 'player' as const });
      } else if (action.stimId === 'emp_grenade') {
        const dmg = Math.round(120 * stimMult);
        if (state.activeTask?.type === 'combat') {
          return {
            ...state,
            inventory: nextInventory,
            combatLogs: [{ id: Date.now(), text: `💥 ЭМИ-ГРАНАТА: Нанесено ${dmg} шокового урона!`, type: 'player' as const }, ...logs].slice(0, 30),
            activeTask: {
              ...state.activeTask,
              enemyHp: Math.max(0, (state.activeTask.enemyHp || 0) - dmg)
            },
            notifications: [...state.notifications, { id: Date.now(), message: `ЭМИ-граната нанесла ${dmg} урона!`, type: 'success', timeLeft: 2500 }]
          };
        }
      } else if (action.stimId === 'overclock_stim') {
        const shieldAmt = Math.round(75 * stimMult);
        nextBuffs.overclockShield = (nextBuffs.overclockShield || 0) + shieldAmt;
        logs.unshift({ id: Date.now(), text: `🛡️ ОВЕРКЛОК: Нано-щит активирован (+${shieldAmt} ОЗ поглощения)!`, type: 'player' as const });
      } else if (action.stimId === 'neuropozyne') {
        const healAmt = Math.round(50 * stimMult);
        const humAmt = Math.round(15 * stimMult);
        hp = Math.min(stats.maxHp, hp + healAmt);
        humanity = Math.min(100, humanity + humAmt);
        logs.unshift({ id: Date.now(), text: `💊 НЕЙРОПОЗИН: +${healAmt} ОЗ, +${humAmt} Человечности!`, type: 'player' as const });
      }

      return {
        ...state,
        inventory: nextInventory,
        playerHp: hp,
        humanity,
        combatBuffs: nextBuffs,
        combatLogs: logs.slice(0, 30),
        notifications: [...state.notifications, { id: Date.now(), message: `Применен: ${stim?.name || action.stimId}`, type: 'success', timeLeft: 2500 }]
      };
    }

    case 'CRAFT_COMBAT_STIM': {
      const stim = COMBAT_STIMS.find(s => s.id === action.stimId);
      if (!stim) return state;

      const canFit = canFitItemInInventory(state.inventory, state.upgrades, action.stimId, 1);
      if (!canFit) {
        const currentTotal = getTotalInventoryItems(state.inventory);
        const maxCap = getMaxInventory(state.upgrades);
        return {
          ...state,
          notifications: [...state.notifications, { id: Date.now(), message: `[ОШИБКА] Склад полон (${currentTotal}/${maxCap} слотов)! Освободите ячейку или расширьте склад.`, type: 'error', timeLeft: 3500 }]
        };
      }

      const discount = state.perks?.includes('tech_craft') ? 0.8 : 1.0;
      const adjustedCost: Record<string, number> = {};
      for (const [res, amt] of Object.entries(stim.cost)) {
        adjustedCost[res] = Math.ceil((amt || 0) * discount);
      }

      for (const [res, amt] of Object.entries(adjustedCost)) {
        if (state.resources[res as Resource] < amt) return state;
      }

      const nextResources = { ...state.resources };
      for (const [res, amt] of Object.entries(adjustedCost)) {
        nextResources[res as Resource] -= amt;
      }

      // Cyber-Program: Nano-Catalyst (20% chance for double craft, equipped in cyberdeck)
      const isDoubled = isProgramEquipped(state.equipment, 'prog_nano_catalyst') && Math.random() < 0.20;
      const addedCount = isDoubled ? 2 : 1;
      const currentCount = state.inventory[action.stimId] || 0;

      return {
        ...state,
        resources: nextResources,
        inventory: {
          ...state.inventory,
          [action.stimId]: Math.min(99, currentCount + addedCount)
        },
        notifications: [
          ...state.notifications, 
          { 
            id: Date.now(), 
            message: isDoubled 
              ? `⚗️ Скрафчено: ${stim.name} x2 (Сработал «Нано-Катализатор»!)` 
              : `Скрафчено: ${stim.name}`, 
            type: 'success', 
            timeLeft: 2500 
          }
        ]
      };
    }

    case 'RESOLVE_EVENT': {
      if (!state.activeEvent) return state;
      const choice = state.activeEvent.choices[action.choiceIndex];
      if (!choice) return state;
      
      let outcome = choice.outcomes[Math.floor(Math.random() * choice.outcomes.length)];
      let threatScanned = false;

      // Cyber-Program: Threat Scanner (picks positive outcome or mitigates hazards, equipped in cyberdeck)
      if (isProgramEquipped(state.equipment, 'prog_threat_scanner')) {
        const positiveOutcome = choice.outcomes.find(o => o.type === 'success' || (o.hpDelta && o.hpDelta > 0) || (o.humanityDelta && o.humanityDelta > 0));
        if (positiveOutcome) {
          outcome = positiveOutcome;
          threatScanned = true;
        } else if ((outcome.hpDelta && outcome.hpDelta < 0) || (outcome.humanityDelta && outcome.humanityDelta < 0)) {
          // Mitigate danger
          outcome = {
            ...outcome,
            hpDelta: 0,
            humanityDelta: 0,
            notification: `🛰️ [Предиктивный Анализ] Угроза заранее обнаружена и нейтрализована! Потери предотвращены.`
          };
          threatScanned = true;
        }
      }

      // Cyber-Program: Ghost Shell (evades MAX-TAC / trauma scans completely, equipped in cyberdeck)
      if (isProgramEquipped(state.equipment, 'prog_ghost_shell') && state.activeEvent.id === 'neg_maxtac') {
        outcome = {
          hpDelta: 0,
          humanityDelta: 0,
          notification: `👻 [Призрачный Щит] Био-сигнатуры полностью замаскированы. Патруль MAX-TAC прошел мимо.`,
          type: 'success'
        };
      }
      
      const nextState = { ...state, resources: { ...state.resources }, reputation: { ...state.reputation } };
      if (outcome.resources) {
        Object.entries(outcome.resources).forEach(([res, val]) => {
          nextState.resources[res as Resource] = Math.max(0, nextState.resources[res as Resource] + val);
        });
      }
      if (outcome.hpDelta) {
        nextState.playerHp = Math.max(0, Math.min(getPlayerStats(nextState).maxHp, nextState.playerHp + outcome.hpDelta));
      }
      if (outcome.humanityDelta) {
        nextState.humanity = Math.max(0, Math.min(100, nextState.humanity + outcome.humanityDelta));
      }
      if (outcome.reputation) {
        if (outcome.reputation.corp) nextState.reputation.corp += outcome.reputation.corp;
        if (outcome.reputation.street) nextState.reputation.street += outcome.reputation.street;
      }
      
      let notifType: 'success' | 'warning' | 'error' | 'info' = outcome.type || 'info';
      if (!outcome.type || outcome.type === 'info') {
        const isDamaged = (outcome.hpDelta && outcome.hpDelta < 0) || (outcome.humanityDelta && outcome.humanityDelta < 0);
        const isHealed = (outcome.hpDelta && outcome.hpDelta > 0) || (outcome.humanityDelta && outcome.humanityDelta > 0);
        const resLoss = outcome.resources && Object.values(outcome.resources).some(v => (v || 0) < 0);
        const resGain = outcome.resources && Object.values(outcome.resources).some(v => (v || 0) > 0);

        if (isDamaged || (resLoss && !resGain)) {
          notifType = 'error'; // Красное уведомление
        } else if (isHealed || resGain) {
          notifType = 'success'; // Зеленое уведомление
        }
      }
      
      nextState.notifications = [
        ...state.notifications, 
        { 
          id: Date.now(), 
          message: threatScanned && outcome.notification && !outcome.notification.includes('Предиктивный')
            ? `🛰️ [Предиктивный Анализ] ${outcome.notification}`
            : outcome.notification, 
          type: notifType, 
          timeLeft: 5000 
        }
      ];
      nextState.activeEvent = null;
      nextState.eventCooldown = 3000 + Math.floor(Math.random() * 3001); // 5-10 минут (3000-6000 тиков)
      
      return nextState;
    }
    
    case 'RESOLVE_ICE_BREACH': {
      if (!state.iceBreach) return state;
      const rewardMultiplier = state.perks?.includes('net_ice') ? 1.5 : 1;
      const finalReward = Math.round(state.iceBreach.reward * rewardMultiplier);
      const newNotif = { id: Date.now(), message: `УСПЕШНЫЙ ВЗЛОМ: +${finalReward} Данных!`, type: 'success' as const, timeLeft: 3000 };
      return {
        ...state,
        resources: { ...state.resources, data: state.resources.data + finalReward },
        combatLogs: [{ id: state.tickCount, text: `УСПЕШНЫЙ ВЗЛОМ: +${finalReward} Фрагментов данных`, type: 'system' as const }, ...state.combatLogs].slice(0, 30),
        iceBreach: null,
        notifications: [...state.notifications, newNotif]
      };
    }

    case 'BUY_UPGRADE': {
      if (state.upgrades.includes(action.upgradeId)) return state;
      const upgrade = UPGRADES[action.upgradeId];
      if (!upgrade) return state;
      for (const [res, amount] of Object.entries(upgrade.cost)) {
        if (state.resources[res as Resource] < amount) return state;
      }
      const nextState = { ...state, resources: { ...state.resources }, upgrades: [...state.upgrades, action.upgradeId] };
      for (const [res, amount] of Object.entries(upgrade.cost)) {
        nextState.resources[res as Resource] -= amount;
      }
      
      let notifMsg = `[УЛУЧШЕНИЕ] Приобретено: «${upgrade.name}». ${upgrade.description}`;
      if (action.upgradeId.startsWith('upg_inv_')) {
        const oldCap = getMaxInventory(state.upgrades);
        const newCap = getMaxInventory(nextState.upgrades);
        notifMsg = `[РАСШИРЕНИЕ СКЛАДА] «${upgrade.name}» установлено! Вместимость инвентаря: ${oldCap} → ${newCap} слотов.`;
      }
      nextState.notifications = [
        ...nextState.notifications,
        { id: Date.now(), message: notifMsg, type: 'info', timeLeft: 5000 }
      ];
      return nextState;
    }

    case 'BUY_META_UPGRADE': {
      if (state.metaUpgrades.includes(action.upgradeId)) return state;
      const upgrade = META_UPGRADES[action.upgradeId];
      if (!upgrade) return state;
      for (const [res, amount] of Object.entries(upgrade.cost)) {
        if (state.resources[res as Resource] < amount) return state;
      }
      const nextState = { ...state, resources: { ...state.resources }, metaUpgrades: [...state.metaUpgrades, action.upgradeId] };
      for (const [res, amount] of Object.entries(upgrade.cost)) {
        nextState.resources[res as Resource] -= amount;
      }
      nextState.notifications = [
        ...nextState.notifications,
        { id: Date.now(), message: `[МЕТА-УЛУЧШЕНИЕ] «${upgrade.name}» активно! ${upgrade.description}`, type: 'info', timeLeft: 5000 }
      ];
      return nextState;
    }
    
    case 'EQUIP_ITEM': {
      if (!state.inventory[action.itemId] || state.inventory[action.itemId] <= 0) return state;
      const itemToEquip = ITEMS[action.itemId];
      if (!itemToEquip) return state;

      const nextState = { 
        ...state, 
        equipment: { ...state.equipment }, 
        inventory: { ...state.inventory },
        notifications: [...state.notifications]
      };

      // If equipping a program, prevent having the exact same program in both slots
      if (itemToEquip.type === 'program') {
        const otherSlot = action.slot === 'program' ? 'program2' : action.slot === 'program2' ? 'program' : null;
        if (otherSlot && nextState.equipment[otherSlot] === action.itemId) {
          nextState.equipment[otherSlot] = null;
        }
      }

      const currentEquipped = nextState.equipment[action.slot];
      if (currentEquipped) {
        nextState.inventory[currentEquipped] = Math.min(99, (nextState.inventory[currentEquipped] || 0) + 1);
      }

      nextState.equipment[action.slot] = action.itemId;
      const rem = (nextState.inventory[action.itemId] || 1) - 1;
      if (rem <= 0) {
        delete nextState.inventory[action.itemId];
      } else {
        nextState.inventory[action.itemId] = rem;
      }

      const newStats = getPlayerStats(nextState);
      if (nextState.playerHp > newStats.maxHp) nextState.playerHp = newStats.maxHp;

      nextState.notifications.push({
        id: Date.now() + Math.random(),
        message: itemToEquip.type === 'program'
          ? `💾 Программа «${itemToEquip.name}» загружена в слот ${action.slot === 'program2' ? '#2' : '#1'} деки!`
          : `Экипировано: ${itemToEquip.name}`,
        type: 'success',
        timeLeft: 3000
      });

      return nextState;
    }

    case 'UNEQUIP_ITEM': {
      const currentEquipped = state.equipment[action.slot];
      if (!currentEquipped) return state;
      const canFit = canFitItemInInventory(state.inventory, state.upgrades, currentEquipped, 1);
      if (!canFit) {
        const currentSlots = getTotalInventoryItems(state.inventory);
        const maxSlots = getMaxInventory(state.upgrades);
        return {
          ...state,
          notifications: [...state.notifications, { id: Date.now(), message: `[СКЛАД ПОЛОН] Нет свободной ячейки (${currentSlots}/${maxSlots}) для снятого предмета!`, type: 'error', timeLeft: 3500 }]
        };
      }
      const nextState = { 
        ...state, 
        equipment: { ...state.equipment }, 
        inventory: { ...state.inventory },
        notifications: [...state.notifications]
      };
      nextState.inventory[currentEquipped] = Math.min(99, (nextState.inventory[currentEquipped] || 0) + 1);
      nextState.equipment[action.slot] = null;
      const newStats = getPlayerStats(nextState);
      if (nextState.playerHp > newStats.maxHp) nextState.playerHp = newStats.maxHp;

      const unequippedItem = ITEMS[currentEquipped];
      nextState.notifications.push({
        id: Date.now() + Math.random(),
        message: unequippedItem?.type === 'program'
          ? `⏏️ Программа «${unequippedItem.name}» выгружена из памяти деки`
          : `Снято: ${unequippedItem?.name || currentEquipped}`,
        type: 'info',
        timeLeft: 2500
      });

      return nextState;
    }

    case 'START_TASK': {
      const taskDef = ACTIONS[action.skill].find(a => a.id === action.actionId);
      if (!taskDef || taskDef.reqLevel > state.skills[action.skill].level) return state;
      if (taskDef.cost) {
        for (const [res, amount] of Object.entries(taskDef.cost)) {
          if (state.resources[res as Resource] < amount) return state;
        }
      }
      return { ...state, activeTask: { type: 'skill', skill: action.skill, actionId: action.actionId, progressTime: 0 } };
    }

    case 'START_DRONE_TASK': {
      const taskDef = ACTIONS[action.skill].find(a => a.id === action.actionId);
      if (!taskDef || taskDef.reqLevel > state.skills[action.skill].level) return state;
      if (taskDef.cost) {
        for (const [res, amount] of Object.entries(taskDef.cost)) {
          if (state.resources[res as Resource] < amount) return state;
        }
      }
      return { ...state, droneTask: { skill: action.skill, actionId: action.actionId, progressTime: 0 } };
    }

    case 'START_COMBAT': {
      const enemy = ENEMIES[action.enemyId];
      if (!enemy) return state;
      return { ...state, activeTask: { type: 'combat', actionId: action.enemyId, progressTime: 0, enemyHp: enemy.maxHp } };
    }

    case 'STOP_TASK': return { ...state, activeTask: null };
    case 'STOP_DRONE_TASK': return { ...state, droneTask: null };

    case 'TICK': {
      if (state.activeEvent) {
         // Остановка времени (пауза) пока активно событие
         return state;
      }

      const nextState: GameState = {
        ...state,
        tickCount: state.tickCount + 1,
        resources: { ...state.resources },
        inventory: { ...state.inventory },
        reputation: { ...state.reputation },
        marketPrices: { ...state.marketPrices },
        marketTrends: { ...state.marketTrends },
        skills: { 
            netrunning: state.skills?.netrunning ? { ...state.skills.netrunning } : { xp: 0, level: 1 },
            scavenging: state.skills?.scavenging ? { ...state.skills.scavenging } : { xp: 0, level: 1 },
            smuggling: state.skills?.smuggling ? { ...state.skills.smuggling } : { xp: 0, level: 1 },
            recon: state.skills?.recon ? { ...state.skills.recon } : { xp: 0, level: 1 },
            engineering: state.skills?.engineering ? { ...state.skills.engineering } : { xp: 0, level: 1 },
            combat: state.skills?.combat ? { ...state.skills.combat } : { xp: 0, level: 1 }
        },
        combatLogs: [...state.combatLogs],
        notifications: state.notifications.map(n => ({ ...n, timeLeft: n.timeLeft - action.delta })).filter(n => n.timeLeft > 0),
        activeTask: state.activeTask ? { ...state.activeTask } : null,
        droneTask: state.droneTask ? { ...state.droneTask } : null,
        iceBreach: state.iceBreach ? { ...state.iceBreach } : null,
        perks: state.perks || [],
        perkPoints: state.perkPoints ?? 0,
        safehouse: { ...state.safehouse },
        combatBuffs: {
          blackLaceTimer: Math.max(0, (state.combatBuffs?.blackLaceTimer || 0) - action.delta),
          overclockShield: state.combatBuffs?.overclockShield || 0
        }
      };

      // Safehouse & Perk Passives
      if (nextState.realEstate) {
        if (nextState.tickCount % 10 === 0) {
           for (const [id, est] of Object.entries(nextState.realEstate)) {
             if (id === 're_bar') {
                nextState.resources.credits += 1 * est.level;
             } else if (id === 're_clinic') {
                nextState.resources.scrap += 1 * est.level;
             } else if (id === 're_server') {
                nextState.resources.data += 5 * est.level;
             }
           }
        }
      }

      if (nextState.safehouse?.server > 0 && nextState.tickCount % 10 === 0) {
        const serverBonuses = [0, 2, 5, 10, 18, 30];
        nextState.resources.data += serverBonuses[nextState.safehouse.server] || 0;
      }
      if (nextState.perks?.includes('net_mining') && nextState.tickCount % 10 === 0) {
        nextState.resources.data += 2;
      }
      if (nextState.safehouse?.terminal > 0 && nextState.tickCount % 50 === 0) {
        const termBonuses = [0, 5, 15, 30, 55, 90];
        nextState.resources.credits += termBonuses[nextState.safehouse.terminal] || 0;
      }
      if (nextState.safehouse?.medpod > 0 && nextState.tickCount % 10 === 0) {
        const medBonuses = [0, 2, 5, 9, 15, 25];
        const heal = medBonuses[nextState.safehouse.medpod] || 0;
        const currentStats = getPlayerStats(nextState);
        if (nextState.playerHp < currentStats.maxHp) {
          nextState.playerHp = Math.min(currentStats.maxHp, nextState.playerHp + heal);
        }
      }
      if (nextState.safehouse?.medpod >= 3) {
        const tickIntervals = [0, 0, 0, 600, 400, 200];
        const interval = tickIntervals[nextState.safehouse.medpod] || 600;
        if (nextState.tickCount % interval === 0 && nextState.humanity < 100) {
          nextState.humanity = Math.min(100, nextState.humanity + 1);
        }
      }

      if (nextState.tickCount % 300 === 0) { // Every 30 seconds at 10 ticks/sec
         const BASE_PRICES = { data: 5, scrap: 2, components: 15 };
         const MAX_PRICES = { data: 12, scrap: 5, components: 25 };
         const MIN_PRICES = { data: 2, scrap: 1, components: 5 };

         (['data', 'scrap', 'components'] as const).forEach(key => {
            if (Math.random() < 0.3) { // 30% chance to change trend
               nextState.marketTrends[key] = Math.random() > 0.5 ? 1 : -1;
            }
            
            // Force trend reversal if near bounds to prevent wild inflation/deflation
            if (nextState.marketPrices[key] >= MAX_PRICES[key]) nextState.marketTrends[key] = -1;
            if (nextState.marketPrices[key] <= MIN_PRICES[key]) nextState.marketTrends[key] = 1;

            const move = nextState.marketTrends[key] * (Math.random() > 0.5 ? 1 : 0); // slower movement
            
            nextState.marketPrices[key] = Math.max(MIN_PRICES[key], Math.min(MAX_PRICES[key], nextState.marketPrices[key] + move));
         });
      }

      // Helper to add XP and grant perk points on milestone level-ups (every 3 levels)
      const addXpAndCheckLevel = (skillKey: Skill, xpGain: number) => {
        const oldLvl = nextState.skills[skillKey].level;
        nextState.skills[skillKey].xp += xpGain;
        const newLvl = getLevelFromXp(nextState.skills[skillKey].xp);
        if (newLvl > oldLvl) {
          nextState.skills[skillKey].level = newLvl;
          // Очки перков даются за каждые 3 уровня любого навыка (на 3, 6, 9, 12, 15, 18... ур.)
          const oldMilestones = Math.floor(oldLvl / 3);
          const newMilestones = Math.floor(newLvl / 3);
          const perkPointsGained = newMilestones - oldMilestones;

          if (perkPointsGained > 0) {
            nextState.perkPoints += perkPointsGained;
            nextState.notifications.push({
              id: Date.now() + Math.random(),
              message: `🎉 ПОВЫШЕНИЕ: ${skillKey.toUpperCase()} [${newLvl}]! Достигнут рубеж — получено +${perkPointsGained} очко перков!`,
              type: 'success',
              timeLeft: 4500
            });
          } else {
            nextState.notifications.push({
              id: Date.now() + Math.random(),
              message: `🎉 ПОВЫШЕНИЕ: ${skillKey.toUpperCase()} [${newLvl}]!`,
              type: 'success',
              timeLeft: 3500
            });
          }
        }
      };

      // Случайные события и отложенные события
      if (nextState.postponedEventTimer > 0) {
         nextState.postponedEventTimer--;
         if (nextState.postponedEventTimer <= 0 && nextState.postponedEventId) {
            nextState.activeEvent = RANDOM_EVENTS.find(e => e.id === nextState.postponedEventId) || null;
            nextState.postponedEventId = null;
         }
      } else if (nextState.eventCooldown > 0) {
         nextState.eventCooldown--;
      } else if (!nextState.activeEvent) {
         // Случайное событие раз в 5-10 минут (3000-6000 тиков)
         nextState.activeEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
         nextState.eventCooldown = 3000 + Math.floor(Math.random() * 3001);
      }

      const stats = getPlayerStats(nextState);

      // ICE Breach timer
      if (nextState.iceBreach) {
         nextState.iceBreach.timeLeft -= action.delta;
         if (nextState.iceBreach.timeLeft <= 0) {
             nextState.iceBreach = null;
             nextState.combatLogs.unshift({ id: nextState.tickCount, text: "ICE Breach упущен...", type: 'system' });
             nextState.notifications.push({ id: Date.now(), message: 'ICE Breach упущен...', type: 'warning', timeLeft: 3000 });
             nextState.combatLogs = nextState.combatLogs.slice(0, 30);
         }
      }

      // Passive HP Regen
      if (!nextState.activeTask || nextState.activeTask.type !== 'combat') {
          if (nextState.playerHp < stats.maxHp) {
              const baseRegen = stats.maxHp * 0.05 * (action.delta / 1000);
              const zenBonus = isProgramEquipped(nextState.equipment, 'prog_zen_protocol') ? (3 * (action.delta / 1000)) : 0;
              nextState.playerHp = Math.min(stats.maxHp, nextState.playerHp + baseRegen + zenBonus);
          }
      }

      // Process Player Task
      if (nextState.activeTask?.type === 'skill') {
          const { skill, actionId, progressTime, isManualHack } = nextState.activeTask;
          if (skill) {
             const taskDef = ACTIONS[skill].find(a => a.id === actionId);
             if (taskDef) {
                 if (isManualHack) {
                    // Manual hacks do not progress via ticks, they are completed instantly by COMPLETE_MANUAL_HACK
                    return state; 
                 }
                 
                 let newProgressTime = progressTime + action.delta;
                 const timeMult = getSkillTimeMultiplier(nextState, skill, false);
                 const actualTimeNeeded = taskDef.time * timeMult;
                 
                 // ICE Breach Chance
                 if (skill === 'netrunning' && !nextState.iceBreach) {
                     if (Math.random() < (action.delta / 1000) * 0.02) { // 2% chance per second
                         nextState.iceBreach = { active: true, timeLeft: 4000, reward: 50 };
                         nextState.combatLogs.unshift({ id: nextState.tickCount, text: "ОБНАРУЖЕН ICE BREACH! Требуется взлом!", type: 'system' });
                     }
                 }
                 
                 let maxAffordable = Infinity;
                 if (taskDef.cost) {
                    for (const [res, amount] of Object.entries(taskDef.cost)) {
                       const max = Math.floor(nextState.resources[res as Resource] / amount);
                       if (max < maxAffordable) maxAffordable = max;
                    }
                 }
                 if (maxAffordable === 0) {
                   nextState.activeTask = null;
                 } else {
                   const completions = Math.min(Math.floor(newProgressTime / actualTimeNeeded), maxAffordable);
                   if (completions > 0) {
                       if (taskDef.cost) Object.entries(taskDef.cost).forEach(([res, amt]) => nextState.resources[res as Resource] -= amt * completions);
                       if (taskDef.rewards) {
                         Object.entries(taskDef.rewards).forEach(([res, amt]) => {
                           let finalAmt = amt * completions;
                           if (skill === 'scavenging' && nextState.perks?.includes('tech_salvage')) {
                             finalAmt = Math.round(finalAmt * 1.3);
                           }
                           nextState.resources[res as Resource] += finalAmt;
                         });
                       }
                       if (taskDef.itemRewards) {
                          Object.entries(taskDef.itemRewards).forEach(([itemId, amt]) => {
                            let finalAmt = amt * completions;
                            // Cyber-Program: Nano-Catalyst (20% chance for extra item, equipped in cyberdeck)
                            if (skill === 'engineering' && isProgramEquipped(nextState.equipment, 'prog_nano_catalyst') && Math.random() < 0.20) {
                              finalAmt += 1;
                              nextState.notifications.push({
                                id: Date.now() + Math.random(),
                                message: `⚗️ «Нано-Катализатор»: реакция удвоена! Получен дополнительный предмет.`,
                                type: "success",
                                timeLeft: 3000
                              });
                            }
                            const canFit = canFitItemInInventory(nextState.inventory, nextState.upgrades, itemId, finalAmt);
                            if (canFit) {
                              nextState.inventory[itemId] = Math.min(99, (nextState.inventory[itemId] || 0) + finalAmt);
                            } else {
                              const currentInvTotal = getTotalInventoryItems(nextState.inventory);
                              const maxInv = getMaxInventory(nextState.upgrades);
                              nextState.notifications.push({
                                id: Date.now() + Math.random(),
                                message: `[СКЛАД ПОЛОН] Инвентарь переполнен (${currentInvTotal}/${maxInv} слотов)! Предмет не поместился.`,
                                type: "warning",
                                timeLeft: 3500
                              });
                            }
                          });
                        }

                        // Cyber-programs bonuses (equipped in cyberdeck)
                        if (skill === "netrunning") {
                          if (isProgramEquipped(nextState.equipment, "prog_crypto_thief")) {
                            const extraCr = (Math.floor(Math.random() * 30) + 25) * completions;
                            nextState.resources.credits += extraCr;
                            nextState.combatLogs.unshift({ id: nextState.tickCount + Math.random(), text: `💰 «Крипто-Вор»: перехвачено +${extraCr} КР из корпоративной сети.`, type: "system" });
                          }
                          if (isProgramEquipped(nextState.equipment, "prog_overload") && Math.random() < 0.35) {
                            nextState.resources.components += 1 * completions;
                            nextState.combatLogs.unshift({ id: nextState.tickCount + Math.random(), text: `⚡ «Протокол Оверлоад»: извлечен редкий компонент (+${completions})!`, type: "system" });
                          }
                        }

                        // Advance non-combat contracts
                        nextState.contracts = nextState.contracts.map(c => {
                          const isMatch = (c.targetSkill === skill || c.type === (skill as string)) &&
                            (!c.targetAction || c.targetAction === actionId);
                          if (isMatch) {
                            const cur = (c.currentAmount ?? c.killsCurrent ?? 0) + completions;
                            const req = c.targetAmount ?? c.killsRequired ?? 1;
                            return { ...c, currentAmount: Math.min(req, cur), killsCurrent: Math.min(req, cur) };
                          }
                          return c;
                        });

                        addXpAndCheckLevel(skill, taskDef.xp * completions);
                       newProgressTime -= (actualTimeNeeded * completions);
                       if (completions === maxAffordable) nextState.activeTask = null;
                   }
                   if (nextState.activeTask) nextState.activeTask.progressTime = newProgressTime;
                 }
             } else { nextState.activeTask = null; }
          }
      } else if (nextState.activeTask?.type === 'combat') {
          const { actionId, progressTime } = nextState.activeTask;
          let enemyHp = nextState.activeTask.enemyHp!;
          const enemy = ENEMIES[actionId];
          if (enemy) {
              let newProgressTime = progressTime + action.delta;
              const turnTime = 2000;
              const turns = Math.floor(newProgressTime / turnTime);
              if (turns > 0) {
                  newProgressTime -= (turns * turnTime);
                  for (let i = 0; i < turns; i++) {
                      let enemyStunned = false;

                      // Cyber-Program: Contagion combat virus (equipped in cyberdeck)
                      if (isProgramEquipped(nextState.equipment, 'prog_contagion')) {
                        const virusDmg = 20;
                        enemyHp -= virusDmg;
                        nextState.combatLogs.unshift({ id: nextState.tickCount + i + 0.05, text: `☣️ «Вирус Контагион»: противник заражен и получил ${virusDmg} чистого урона!`, type: 'player' });
                      }

                      // Combat Drone Mk.I
                      if (nextState.inventory['combat_drone_mk1'] > 0) {
                        const drone = ITEMS['combat_drone_mk1'];
                        const droneDmg = Math.max(1, (drone.attack || 15) - enemy.defense);
                        enemyHp -= droneDmg;
                        nextState.combatLogs.unshift({ id: nextState.tickCount + i + 0.08, text: `🤖 Боевой Дрон нанес ${droneDmg} урона!`, type: 'player' });
                      }

                      // Player attacks
                      if (enemyHp > 0) {
                        const playerImplant = nextState.equipment.implant ? ITEMS[nextState.equipment.implant] : null;
                        const baseSpeedMult = playerImplant?.attackSpeedMult || 1;
                        const blackLaceActive = (nextState.combatBuffs?.blackLaceTimer || 0) > 0;
                        const attackSpeedMult = baseSpeedMult * (blackLaceActive ? 2 : 1);
                        let critChance = playerImplant?.critChance || 0;

                        // Cyber-Program: Ghost Shell (100% crit when humanity <= 0, equipped in cyberdeck)
                        if (isProgramEquipped(nextState.equipment, 'prog_ghost_shell') && nextState.humanity <= 0) {
                          critChance = 1.0;
                        }

                        const attacks = Math.max(1, Math.floor(attackSpeedMult));
                        for (let a = 0; a < attacks; a++) {
                            const isCrit = Math.random() < critChance;
                            let playerDmg = Math.max(1, stats.attack - enemy.defense);
                            if (isCrit) {
                              playerDmg = Math.floor(playerDmg * (nextState.humanity <= 0 && isProgramEquipped(nextState.equipment, 'prog_ghost_shell') ? 2.5 : 2));
                              if (nextState.perks?.includes('solo_vamp')) {
                                nextState.playerHp = Math.min(stats.maxHp, nextState.playerHp + 10);
                                nextState.combatLogs.unshift({ id: nextState.tickCount + i + 0.12 + (a*0.01), text: '💉 Синтетический вампиризм: +10 ОЗ при крите!', type: 'player' });
                              }
                            }
                            
                            // Cyber-Program: Short Circuit (25% chance to stun enemy, equipped in cyberdeck)
                            if (isProgramEquipped(nextState.equipment, 'prog_short_circuit') && Math.random() < 0.25) {
                              enemyStunned = true;
                              nextState.combatLogs.unshift({ id: nextState.tickCount + i + 0.11 + (a*0.01), text: `⚡ «Замыкание»: ЭМИ-импульс замкнул сервоприводы ${enemy.name}! Враг оглушен на 1 ход!`, type: 'player' });
                            }

                            // Cyber-Program: Bio-Leech (15% vampirism, equipped in cyberdeck)
                            if (isProgramEquipped(nextState.equipment, 'prog_bio_leech')) {
                              const leech = Math.max(1, Math.floor(playerDmg * 0.15));
                              nextState.playerHp = Math.min(stats.maxHp, nextState.playerHp + leech);
                              nextState.combatLogs.unshift({ id: nextState.tickCount + i + 0.13 + (a*0.01), text: `🩸 «Кибер-Вампиризм»: поглощено +${leech} ОЗ!`, type: 'player' });
                            }

                            enemyHp -= playerDmg;
                            nextState.combatLogs.unshift({ id: nextState.tickCount + i + 0.1 + (a*0.01), text: isCrit ? `💥 КРИТ! Вы нанесли ${playerDmg} урона ${enemy.name}.` : `Вы нанесли ${playerDmg} урона ${enemy.name}.`, type: 'player' });
                            if (enemyHp <= 0) break;
                        }
                      }
                      
                      if (enemyHp <= 0) {
                          // Потеря человечности за каждый бой с кем-то
                          let baseLoss = enemy.humanityLoss || (enemy.isBoss ? (enemy.maxHp > 5000 ? 5 : 2) : 1);
                          // Cyber-Program: Zen-Protocol (-50% humanity loss, equipped in cyberdeck)
                          if (isProgramEquipped(nextState.equipment, 'prog_zen_protocol')) {
                            baseLoss = Math.max(1, Math.floor(baseLoss * 0.5));
                          }
                          const sanityProtected = nextState.perks?.includes('net_sanity') && Math.random() < 0.6;
                          if (!sanityProtected && nextState.humanity > 0) {
                              nextState.humanity = Math.max(0, nextState.humanity - baseLoss);
                          }

                          const corpChange = enemy.rewards.reputation?.corp || 0;
                          const streetChange = enemy.rewards.reputation?.street || 0;
                          const corpStr = corpChange !== 0 ? `Корп: ${corpChange > 0 ? '+' : ''}${corpChange}` : '';
                          const streetStr = streetChange !== 0 ? `Улицы: ${streetChange > 0 ? '+' : ''}${streetChange}` : '';
                          const repStr = [corpStr, streetStr].filter(Boolean).join(', ');

                          nextState.combatLogs.unshift({
                              id: nextState.tickCount + i + 0.2,
                              text: `💀 ${enemy.bossTitle ? `[${enemy.bossTitle}] ` : ''}${enemy.name} повержен! [${repStr || 'Без изм. репутации'}] Человечность: -${baseLoss}%${isProgramEquipped(nextState.equipment, 'prog_zen_protocol') ? ' (Холодный Рассудок)' : ''} (Осталось: ${nextState.humanity}%).`,
                              type: 'system'
                          });

                          if (enemy.rewards.resources) Object.entries(enemy.rewards.resources).forEach(([res, amt]) => nextState.resources[res as Resource] += amt);
                          if (enemy.rewards.reputation) {
                              if (enemy.rewards.reputation.corp) nextState.reputation.corp += enemy.rewards.reputation.corp;
                              if (enemy.rewards.reputation.street) nextState.reputation.street += enemy.rewards.reputation.street;
                          }
                          if (enemy.rewards.relic) {
                              nextState.inventory[enemy.rewards.relic] = (nextState.inventory[enemy.rewards.relic] || 0) + 1;
                              nextState.notifications.push({ id: Date.now(), message: `ЭЛИТА ПОВЕРЖЕНА! Получена реликвия: ${ITEMS[enemy.rewards.relic].name}!`, type: 'success', timeLeft: 6000 });
                              nextState.activeTask = null; // Boss defeated, stop loop
                          }
                          
                          // Process contracts
                          nextState.contracts = nextState.contracts.map(c => {
                             if ((c.type === 'combat' || !c.type) && c.targetEnemy === enemy.id) {
                                const cur = (c.currentAmount ?? c.killsCurrent ?? 0) + 1;
                                const req = c.targetAmount ?? c.killsRequired ?? 1;
                                return { ...c, currentAmount: Math.min(req, cur), killsCurrent: Math.min(req, cur) };
                             }
                             return c;
                          });

                          addXpAndCheckLevel('combat', enemy.xp);
                          enemyHp = enemy.maxHp; 
                      } else {
                          if (enemyStunned) {
                            nextState.combatLogs.unshift({ id: nextState.tickCount + i + 0.29, text: `🌀 ${enemy.name} оглушен ЭМИ-импульсом и пропускает атаку!`, type: 'system' });
                          } else {
                            let enemyDmg = Math.max(1, enemy.attack - stats.defense);
                            if (nextState.perks?.includes('solo_armor')) {
                              enemyDmg = Math.max(1, Math.floor(enemyDmg * 0.85));
                            }

                            // Nanoshield absorption
                            if (nextState.combatBuffs?.overclockShield > 0) {
                              if (nextState.combatBuffs.overclockShield >= enemyDmg) {
                                nextState.combatBuffs.overclockShield -= enemyDmg;
                                nextState.combatLogs.unshift({ id: nextState.tickCount + i + 0.28, text: `🛡️ Нано-щит поглотил ${enemyDmg} урона! (Остаток: ${nextState.combatBuffs.overclockShield})`, type: 'system' });
                                enemyDmg = 0;
                              } else {
                                enemyDmg -= nextState.combatBuffs.overclockShield;
                                nextState.combatBuffs.overclockShield = 0;
                                nextState.combatLogs.unshift({ id: nextState.tickCount + i + 0.28, text: `🛡️ Нано-щит истощен! Пробитие на ${enemyDmg} урона.`, type: 'system' });
                              }
                            }

                            if (enemyDmg > 0) {
                              nextState.playerHp -= enemyDmg;
                              nextState.combatLogs.unshift({ id: nextState.tickCount + i + 0.3, text: `${enemy.name} нанес вам ${enemyDmg} урона.`, type: 'enemy' });
                            }

                            if (nextState.playerHp <= 0) {
                                nextState.playerHp = 0;
                                nextState.activeTask = null;
                                nextState.combatLogs.unshift({ id: nextState.tickCount + i + 0.4, text: "КРИТИЧЕСКОЕ ПОВРЕЖДЕНИЕ. БОЙ ПРЕРВАН.", type: 'system' });
                                break;
                            }
                          }
                      }
                  }
                  nextState.combatLogs = nextState.combatLogs.slice(0, 30);
              }
              if (nextState.activeTask) {
                  nextState.activeTask.progressTime = newProgressTime;
                  nextState.activeTask.enemyHp = enemyHp;
              }
          } else { nextState.activeTask = null; }
      }

      // Process Drone Task
      if (nextState.droneTask) {
         const { skill, actionId, progressTime } = nextState.droneTask;
         const taskDef = ACTIONS[skill].find(a => a.id === actionId);
         if (taskDef) {
             let newProgressTime = progressTime + action.delta;
             const timeMult = getSkillTimeMultiplier(nextState, skill, true);
             const actualTimeNeeded = taskDef.time * timeMult;
             
             let maxAffordable = Infinity;
             if (taskDef.cost) {
                for (const [res, amount] of Object.entries(taskDef.cost)) {
                   const max = Math.floor(nextState.resources[res as Resource] / amount);
                   if (max < maxAffordable) maxAffordable = max;
                }
             }
             if (maxAffordable === 0) {
               nextState.droneTask = null;
             } else {
               const completions = Math.min(Math.floor(newProgressTime / actualTimeNeeded), maxAffordable);
               if (completions > 0) {
                   if (taskDef.cost) Object.entries(taskDef.cost).forEach(([res, amt]) => nextState.resources[res as Resource] -= amt * completions);
                   if (taskDef.rewards) {
                     Object.entries(taskDef.rewards).forEach(([res, amt]) => {
                       let finalAmt = amt * completions;
                       if (skill === 'scavenging' && nextState.perks?.includes('tech_salvage')) {
                         finalAmt = Math.round(finalAmt * 1.3);
                       }
                       nextState.resources[res as Resource] += finalAmt;
                     });
                   }
                   if (taskDef.itemRewards) {
                      Object.entries(taskDef.itemRewards).forEach(([itemId, amt]) => {
                        const finalAmt = amt * completions;
                        const canFit = canFitItemInInventory(nextState.inventory, nextState.upgrades, itemId, finalAmt);
                        if (canFit) {
                          nextState.inventory[itemId] = Math.min(99, (nextState.inventory[itemId] || 0) + finalAmt);
                        }
                      });
                    }

                    // Cyber-Program: Swarm Protocol (drone gathers rare weapon parts, equipped in cyberdeck)
                    if (isProgramEquipped(nextState.equipment, 'prog_swarm_protocol') && Math.random() < 0.40) {
                      const bonusParts = Math.floor(Math.random() * 2) + 1;
                      nextState.resources.weapon_parts += bonusParts;
                      nextState.notifications.push({
                        id: Date.now() + Math.random(),
                        message: `🤖 «Протокол Роя»: дрон обнаружил +${bonusParts} оружейных деталей!`,
                        type: 'info',
                        timeLeft: 3000
                      });
                    }

                    // Drone also contributes to contracts
                    nextState.contracts = nextState.contracts.map(c => {
                      const isMatch = (c.targetSkill === skill || c.type === (skill as string)) &&
                        (!c.targetAction || c.targetAction === actionId);
                      if (isMatch) {
                        const cur = (c.currentAmount ?? c.killsCurrent ?? 0) + completions;
                        const req = c.targetAmount ?? c.killsRequired ?? 1;
                        return { ...c, currentAmount: Math.min(req, cur), killsCurrent: Math.min(req, cur) };
                      }
                      return c;
                    });

                    addXpAndCheckLevel(skill, taskDef.xp * completions); // Drone gives XP to player
                   newProgressTime -= (actualTimeNeeded * completions);
                   if (completions === maxAffordable) nextState.droneTask = null;
               }
               if (nextState.droneTask) nextState.droneTask.progressTime = newProgressTime;
             }
         } else { nextState.droneTask = null; }
      }

      return nextState;
    }
    default: return state;
  }
}
