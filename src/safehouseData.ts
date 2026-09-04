export interface SafehouseModule {
  id: 'server' | 'workbench' | 'medpod' | 'terminal';
  name: string;
  icon: string;
  description: string;
  maxLevel: number;
  levels: {
    level: number;
    title: string;
    bonusDesc: string;
    cost: {
      credits?: number;
      scrap?: number;
      components?: number;
      data?: number;
    };
  }[];
}

export type SafehouseModuleDef = SafehouseModule;
export type CombatStimDef = CombatStimItem;

export const SAFEHOUSE_MODULES: SafehouseModule[] = [
  {
    id: 'server',
    name: 'Серверный Кластер',
    icon: 'Server',
    description: 'Автономный нетраннер-сервер для фонового майнинга фрагментов данных.',
    maxLevel: 5,
    levels: [
      { level: 1, title: 'Базовая стойка «Субару»', bonusDesc: '+2 Данных / сек', cost: { credits: 200, scrap: 50 } },
      { level: 2, title: 'Оптоволоконный узел', bonusDesc: '+5 Данных / сек', cost: { credits: 600, components: 30 } },
      { level: 3, title: 'Криогенное охлаждение', bonusDesc: '+10 Данных / сек', cost: { credits: 1500, components: 75, scrap: 150 } },
      { level: 4, title: 'Нейропроцессорный кластер', bonusDesc: '+18 Данных / сек', cost: { credits: 3500, components: 150 } },
      { level: 5, title: 'Квантовый сервер Черного Заслона', bonusDesc: '+30 Данных / сек', cost: { credits: 8000, components: 300, data: 1000 } }
    ]
  },
  {
    id: 'workbench',
    name: 'Оружейный Верстак',
    icon: 'Wrench',
    description: 'Станция калибровки арсенала и сборки боевых стимуляторов.',
    maxLevel: 5,
    levels: [
      { level: 1, title: 'Набор прецизионных отверток', bonusDesc: '+4 к постоянной атаке', cost: { credits: 250, scrap: 80 } },
      { level: 2, title: 'Лазерный калибратор', bonusDesc: '+9 к постоянной атаке', cost: { credits: 700, components: 40 } },
      { level: 3, title: 'Молекулярный точильный станок', bonusDesc: '+16 к постоянной атаке', cost: { credits: 1800, scrap: 250, components: 80 } },
      { level: 4, title: 'Плазменный сварочный манипулятор', bonusDesc: '+25 к постоянной атаке', cost: { credits: 4000, components: 180 } },
      { level: 5, title: 'Военный авто-фабрикатор «Милитех»', bonusDesc: '+40 к постоянной атаке', cost: { credits: 9000, components: 350 } }
    ]
  },
  {
    id: 'medpod',
    name: 'Мед-Капсула «Траума»',
    icon: 'HeartPulse',
    description: 'Капсула клеточного синтеза для восстановления здоровья и рассудка.',
    maxLevel: 5,
    levels: [
      { level: 1, title: 'Капельница с физраствором', bonusDesc: '+2 ОЗ / сек пассивно', cost: { credits: 300, scrap: 60 } },
      { level: 2, title: 'Синтезатор плазмы крови', bonusDesc: '+5 ОЗ / сек пассивно', cost: { credits: 800, components: 40 } },
      { level: 3, title: 'Нейро-стабилизатор', bonusDesc: '+9 ОЗ / сек, регенерация Человечности (+1 / 60 сек)', cost: { credits: 2000, components: 90 } },
      { level: 4, title: 'Хирургический нано-док', bonusDesc: '+15 ОЗ / сек, регенерация Человечности (+1 / 40 сек)', cost: { credits: 4500, components: 200 } },
      { level: 5, title: 'Капсула бессмертия Trauma Team', bonusDesc: '+25 ОЗ / сек, регенерация Человечности (+1 / 20 сек)', cost: { credits: 10000, components: 400 } }
    ]
  },
  {
    id: 'terminal',
    name: 'Терминал Фиксеров',
    icon: 'Radio',
    description: 'Зашифрованный канал связи с заказчиками и скупщиками краденого.',
    maxLevel: 5,
    levels: [
      { level: 1, title: 'Радиоперехватчик полиции', bonusDesc: '+5 Кредитов / 5 сек пассивно', cost: { credits: 200, scrap: 70 } },
      { level: 2, title: 'Контрабандный VPN-шлюз', bonusDesc: '+15 Кредитов / 5 сек, +10% к наградам контрактов', cost: { credits: 750, components: 45 } },
      { level: 3, title: 'Скрытый сервер в Посмертии', bonusDesc: '+30 Кредитов / 5 сек, +20% к наградам контрактов', cost: { credits: 1900, components: 100 } },
      { level: 4, title: 'Шпионский спутниковый апгрейд', bonusDesc: '+55 Кредитов / 5 сек, +30% к наградам контрактов', cost: { credits: 4200, components: 220 } },
      { level: 5, title: 'Прямой канал с Руководством Сети', bonusDesc: '+90 Кредитов / 5 сек, +50% к наградам контрактов', cost: { credits: 9500, components: 450 } }
    ]
  }
];

export interface CombatStimItem {
  id: string;
  name: string;
  desc: string;
  color: string;
  cost: {
    scrap?: number;
    components?: number;
    credits?: number;
    data?: number;
  };
  effect: string;
}

export const COMBAT_STIMS: CombatStimItem[] = [
  {
    id: 'max_doc',
    name: 'Инъектор «МаксДок v.1»',
    desc: 'Мгновенно восстанавливает 50 ОЗ бойца.',
    color: 'emerald',
    cost: { scrap: 6, credits: 40 },
    effect: '+50 ОЗ мгновенно'
  },
  {
    id: 'black_lace',
    name: 'Стимулятор «Черное Кружево»',
    desc: 'На 15 секунд увеличивает урон на +50% и удваивает скорость ударов. (-2 Человечности).',
    color: 'rose',
    cost: { components: 4, data: 15, credits: 80 },
    effect: '+50% урона, x2 скорость на 15 сек'
  },
  {
    id: 'emp_grenade',
    name: 'Импульсная ЭМИ-граната',
    desc: 'Мгновенно наносит врагу 120 единиц чистого шокового урона.',
    color: 'cyan',
    cost: { scrap: 10, components: 3, data: 20 },
    effect: '120 урона текущей цели'
  },
  {
    id: 'overclock_stim',
    name: 'Оверклок-Инъектор',
    desc: 'Активирует кинетический нано-щит, поглощающий до 75 единиц урона.',
    color: 'amber',
    cost: { components: 6, scrap: 12 },
    effect: '+75 кинетический энергощит'
  },
  {
    id: 'neuropozyne',
    name: 'Препарат «Нейропозин»',
    desc: 'Стабилизирует рассудок наемника. Восстанавливает 50 ОЗ и 15 Человечности.',
    color: 'purple',
    cost: { scrap: 15, data: 20 },
    effect: '+50 ОЗ, +15 Человечности'
  }
];
