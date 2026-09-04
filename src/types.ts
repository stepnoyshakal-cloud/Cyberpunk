export type Resource = 'data' | 'scrap' | 'components' | 'credits' | 'weapon_parts' | 'engrams';
export type Skill = 'netrunning' | 'scavenging' | 'engineering' | 'combat' | 'smuggling' | 'recon';
export type SafehouseModule = 'server' | 'workbench' | 'medpod' | 'terminal';

export type ItemType = 'weapon' | 'armor' | 'implant' | 'drone' | 'consumable' | 'program';

export type EquipmentSlot = 'weapon' | 'armor' | 'implant' | 'program' | 'program2';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  attack?: number;
  defense?: number;
  maxHp?: number;
  critChance?: number;
  attackSpeedMult?: number;
  restoreHumanity?: number;
  description: string;
  sellPrice?: number;
  programEffect?: string;
}

export interface Enemy {
  id: string;
  name: string;
  maxHp: number;
  attack: number;
  defense: number;
  xp: number;
  isBoss?: boolean;
  bossTitle?: string;
  isElite?: boolean;
  humanityLoss?: number;
  rewards: {
    resources?: Partial<Record<Resource, number>>;
    reputation?: { corp?: number; street?: number };
    relic?: string;
  };
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: Partial<Record<Resource, number>>;
}

export interface CombatLog {
  id: number;
  text: string;
  type: 'player' | 'enemy' | 'system';
}

export interface GameNotification {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timeLeft: number;
}

export type ContractType = 'combat' | 'scavenging' | 'netrunning' | 'engineering' | 'smuggling' | 'recon';

export interface FactionContract {
  id: string;
  faction: 'corp' | 'street';
  type: ContractType;
  title: string;
  description: string;
  targetEnemy?: string;
  targetAction?: string;
  targetSkill?: Skill;
  targetAmount: number;
  currentAmount: number;
  killsRequired: number;
  killsCurrent: number;
  rewardCredits: number;
  rewardRep: number;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
}

export interface EventChoice {
  text: string;
  requirements?: {
    resources?: Partial<Record<Resource, number>>;
  };
  outcomes: {
    resources?: Partial<Record<Resource, number>>;
    hpDelta?: number;
    humanityDelta?: number;
    reputation?: { corp?: number; street?: number };
    notification: string;
    type?: 'success' | 'warning' | 'error' | 'info';
  }[]; // Multiple possible outcomes for RNG (e.g. 50/50 chance)
}

export interface GameState {
  tickCount: number;
  resources: Record<Resource, number>;
  marketPrices: Record<'data'|'scrap'|'components', number>;
  marketTrends: Record<'data'|'scrap'|'components', number>;
  activeEvent: RandomEvent | null;
  postponedEventId: string | null;
  postponedEventTimer: number;
  eventCooldown: number;
  inventory: Record<string, number>;
  equipment: {
    weapon: string | null;
    armor: string | null;
    implant: string | null;
    program: string | null;
    program2?: string | null;
  };
  upgrades: string[];
  metaUpgrades: string[];
  skills: Record<Skill, { xp: number; level: number }>;
  playerHp: number;
  humanity: number;
  reputation: { corp: number; street: number };
  combatLogs: CombatLog[];
  notifications: GameNotification[];
  contracts: FactionContract[];
  activeTask: {
    type: 'skill' | 'combat';
    skill?: Skill;
    actionId: string;
    progressTime: number; 
    enemyHp?: number;
    isManualHack?: boolean;
  } | null;
  droneTask: {
    skill: Skill;
    actionId: string;
    progressTime: number;
  } | null;
  iceBreach: {
    active: boolean;
    timeLeft: number;
    reward: number;
  } | null;
  perks: string[];
  perkPoints: number;
  safehouse: {
    server: number;
    workbench: number;
    medpod: number;
    terminal: number;
  };
  combatBuffs: {
    blackLaceTimer: number; // in ms
    overclockShield: number;
  };
  realEstate: Record<string, { level: number }>;
}

export interface SkillAction {
  id: string;
  name: string;
  xp: number;
  time: number; // ms
  reqLevel: number;
  cost?: Partial<Record<Resource, number>>;
  rewards?: Partial<Record<Resource, number>>;
  itemRewards?: Partial<Record<string, number>>;
}
