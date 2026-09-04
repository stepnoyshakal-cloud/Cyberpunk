export interface CyberPerk {
  id: string;
  name: string;
  branch: 'solo' | 'netrunner' | 'techie';
  description: string;
  icon: string;
  requires?: string;
  cost: number; // Perk points
}

export type PerkDef = CyberPerk;

export const PERK_BRANCHES = [
  { id: 'solo', name: 'СОЛО', color: 'rose', description: 'Огневая мощь, вампиризм и тяжелая живучесть' },
  { id: 'netrunner', name: 'НЕТРАННЕР', color: 'cyan', description: 'Сетевой доход, быстрый взлом и ментальная защита' },
  { id: 'techie', name: 'ТЕХНАРЬ', color: 'yellow', description: 'Эффективность крафта, дрон-помощник и стимуляторы' }
] as const;

export const CYBER_PERKS: CyberPerk[] = [
  // --- СОЛО (Solo) ---
  {
    id: 'solo_strike',
    name: 'Импульс Силы',
    branch: 'solo',
    description: '+20% к базовой силе атаки наемника.',
    icon: 'Zap',
    cost: 2
  },
  {
    id: 'solo_hp',
    name: 'Укрепленные Кости',
    branch: 'solo',
    description: '+60 к максимальному запасу здоровья.',
    icon: 'Shield',
    requires: 'solo_strike',
    cost: 3
  },
  {
    id: 'solo_vamp',
    name: 'Синтетический Вампиризм',
    branch: 'solo',
    description: 'Каждый критический удар восстанавливает 10 ОЗ.',
    icon: 'Activity',
    requires: 'solo_hp',
    cost: 4
  },
  {
    id: 'solo_armor',
    name: 'Подкожная Броня',
    branch: 'solo',
    description: '+15 к постоянной защите и -15% получаемого урона.',
    icon: 'ShieldCheck',
    requires: 'solo_vamp',
    cost: 5
  },

  // --- НЕТРАННЕР (Netrunner) ---
  {
    id: 'net_mining',
    name: 'Фоновый Демон',
    branch: 'netrunner',
    description: 'Пассивный доход +2 Данных каждую секунду.',
    icon: 'Cpu',
    cost: 2
  },
  {
    id: 'net_speed',
    name: 'Нейро-Ускоритель',
    branch: 'netrunner',
    description: 'Все действия нетраннинга выполняются на 25% быстрее.',
    icon: 'FastForward',
    requires: 'net_mining',
    cost: 3
  },
  {
    id: 'net_ice',
    name: 'Контр-Лед',
    branch: 'netrunner',
    description: 'Успешный взлом ICE Breach дает на 50% больше Данных.',
    icon: 'Terminal',
    requires: 'net_speed',
    cost: 4
  },
  {
    id: 'net_sanity',
    name: 'Ментальный Щит',
    branch: 'netrunner',
    description: 'Шанс потери Человечности в бою снижен на 60%.',
    icon: 'Brain',
    requires: 'net_ice',
    cost: 5
  },

  // --- ТЕХНАРЬ (Techie) ---
  {
    id: 'tech_salvage',
    name: 'Эффективная Разборка',
    branch: 'techie',
    description: 'На 30% больше Лома и Деталей при сборе и дропе.',
    icon: 'Wrench',
    cost: 2
  },
  {
    id: 'tech_drone',
    name: 'Турбо-Привод Дрона',
    branch: 'techie',
    description: 'Паукобот-помощник работает на 35% быстрее.',
    icon: 'Bot',
    requires: 'tech_salvage',
    cost: 3
  },
  {
    id: 'tech_craft',
    name: 'Мастер-Сборщик',
    branch: 'techie',
    description: 'Все улучшения и модули Убежища дешевле на 20%.',
    icon: 'Hammer',
    requires: 'tech_drone',
    cost: 4
  },
  {
    id: 'tech_stim',
    name: 'Химический Синтез',
    branch: 'techie',
    description: 'Все боевые стимуляторы и расходники дают на 50% больше эффекта.',
    icon: 'Sparkles',
    requires: 'tech_craft',
    cost: 5
  }
];

export const PERKS = CYBER_PERKS;

