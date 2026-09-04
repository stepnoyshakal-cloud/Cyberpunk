import { Resource, Skill, SkillAction, Item, Enemy, Upgrade } from './types';

export const RESOURCES: Record<Resource, { name: string, color: string }> = {
  data: { name: 'Фрагменты данных', color: 'text-cyan-400' },
  scrap: { name: 'Металлолом', color: 'text-slate-400' },
  components: { name: 'Кибер-компоненты', color: 'text-yellow-400' },
  credits: { name: 'Кредиты', color: 'text-green-400' },
  weapon_parts: { name: 'Оружейные детали', color: 'text-rose-400' },
  engrams: { name: 'Энграммы данных', color: 'text-fuchsia-400' }
};

export const SKILL_INFO: Record<Skill, { name: string, icon: string, description: string }> = {
  netrunning: { name: 'Нетраннинг', icon: 'Terminal', description: 'Подключайтесь к сети для сбора необработанных данных, кредитов и энграмм. Шанс обнаружить уязвимость (ICE Breach).' },
  scavenging: { name: 'Мусорщичество', icon: 'Search', description: 'Обыскивайте улицы, брошенные конвои и руины в поисках полезного лома, компонентов и деталей.' },
  smuggling: { name: 'Контрабанда', icon: 'Truck', description: 'Организация теневых поставок через кордоны Найт-Сити, сбыт краденых грузов и отмывание кредитов.' },
  recon: { name: 'Разведка', icon: 'Radio', description: 'Удаленное сканирование районов города, перехват спутниковых сигналов корпораций и координация дронов.' },
  engineering: { name: 'Инженерия', icon: 'Cpu', description: 'Комбинируйте ресурсы для создания компонентов, снаряжения, кибер-программ и дронов.' },
  combat: { name: 'Бой', icon: 'Crosshair', description: 'Сражайтесь за опыт, лут и репутацию. Внимание: убийства снижают вашу человечность!' }
};

export const ITEMS: Record<string, Item> = {
  // Экипировка и оружие
  kevlar_vest: { id: 'kevlar_vest', name: 'Кевларовый бронежилет', type: 'armor', defense: 10, sellPrice: 40, description: 'Базовая защита от уличных бандитов.' },
  militech_armor: { id: 'militech_armor', name: 'Тяжелая броня Милитех', type: 'armor', defense: 30, sellPrice: 180, description: 'Военный уровень защиты.' },
  corp_armor: { id: 'corp_armor', name: 'Броня Экзека Арасаки', type: 'armor', defense: 48, sellPrice: 500, description: 'Высокотехнологичная броня. Доступна только элите корпораций.' },
  scav_exoskeleton: { id: 'scav_exoskeleton', name: 'Экзоскелет Мусорщика', type: 'armor', defense: 55, maxHp: 80, sellPrice: 650, description: 'Тяжелый самодельный каркас для выживания в токсичных руинах.' },
  
  katana: { id: 'katana', name: 'Термальная катана', type: 'weapon', attack: 15, sellPrice: 60, description: 'Режет броню как масло.' },
  smart_pistol: { id: 'smart_pistol', name: 'Умный пистолет', type: 'weapon', attack: 35, sellPrice: 200, description: 'Самонаводящиеся пули.' },
  street_katana: { id: 'street_katana', name: 'Неоновая Катана', type: 'weapon', attack: 55, sellPrice: 450, description: 'Смертоносное клинковое оружие, закаленное в уличных войнах.' },
  arasaka_smart_rifle: { id: 'arasaka_smart_rifle', name: 'Винтовка «Сигма Арасаки»', type: 'weapon', attack: 75, sellPrice: 750, description: 'Высокоточная штурмовая система спецподразделений корпорации.' },
  mono_wire: { id: 'mono_wire', name: 'Моноструна «Потрошитель»', type: 'weapon', attack: 95, critChance: 0.20, sellPrice: 900, description: 'Сверхтонкая молекулярная струна. Наносит колоссальный урон.' },

  // Импланты
  health_booster: { id: 'health_booster', name: 'Подкожный стимулятор', type: 'implant', maxHp: 50, sellPrice: 120, description: 'Увеличивает максимальный запас здоровья на 50 ОЗ.' },
  sandevistan: { id: 'sandevistan', name: 'Милитех Сандевистан', type: 'implant', attackSpeedMult: 2, sellPrice: 400, description: 'Ускоряет рефлексы. Вы атакуете в 2 раза быстрее.' },
  rebel_sandevistan: { id: 'rebel_sandevistan', name: 'Сандевистан «Варп-Тень»', type: 'implant', attackSpeedMult: 3, critChance: 0.15, sellPrice: 850, description: 'Уличный разогнанный имплант. Скорость атак х3, крит +15%.' },
  kiroshi_optics: { id: 'kiroshi_optics', name: 'Оптика «Кироши»', type: 'implant', critChance: 0.25, sellPrice: 250, description: 'Шанс 25% нанести двойной (критический) урон в бою.' },
  subdermal_armor: { id: 'subdermal_armor', name: 'Подкожная броня', type: 'implant', defense: 25, sellPrice: 300, description: 'Вшитые под кожу баллистические нано-пластины.' },
  corp_cyberdeck: { id: 'corp_cyberdeck', name: 'Кибердека «Арасака Mk.4»', type: 'implant', defense: 18, maxHp: 60, sellPrice: 700, description: 'Элитная дека корпоративных нетраннеров (+18 защиты, +60 ОЗ).' },
  corp_bio_monitor: { id: 'corp_bio_monitor', name: 'Био-монитор «Травма Тим»', type: 'implant', maxHp: 150, defense: 22, sellPrice: 850, description: 'Армейский комплекс витального мониторинга (+150 ОЗ, +22 брони).' },

  // Дроны
  spider_bot: { id: 'spider_bot', name: 'Паукобот-помощник', type: 'drone', sellPrice: 350, description: 'Автоматизирует один процесс (работает на 50% медленнее).' },
  combat_drone_mk1: { id: 'combat_drone_mk1', name: 'Боевой дрон Mk.I', type: 'drone', attack: 15, maxHp: 100, sellPrice: 1200, description: 'Сражается вместе с вами в бою. (Автономный режим).' },

  // Реликвии Элиты
  relic_sandevistan: { id: 'relic_sandevistan', name: 'Реликвия: Квантовый Сандевистан', type: 'implant', attackSpeedMult: 4, critChance: 0.3, sellPrice: 5000, description: 'Древняя технология. Взламывает само время.' },
  relic_armor: { id: 'relic_armor', name: 'Реликвия: Броня Бегемота', type: 'armor', defense: 150, maxHp: 500, sellPrice: 6000, description: 'Непробиваемая танковая обшивка.' },

  // Расходники
  neuropozyne: { id: 'neuropozyne', name: 'Нейропозин', type: 'consumable', restoreHumanity: 20, sellPrice: 25, description: 'Предотвращает киберпсихоз. Восстанавливает 20% человечности.' },
  max_doc: { id: 'max_doc', name: 'МаксДок v.1', type: 'consumable', sellPrice: 15, description: 'Боевой инъектор. Мгновенно восстанавливает 50 ОЗ.' },
  black_lace: { id: 'black_lace', name: 'Черное Кружево', type: 'consumable', sellPrice: 30, description: 'Боевой психостимулятор: +50% урона и двойная скорость на 15 сек (-2 Человечности).' },
  emp_grenade: { id: 'emp_grenade', name: 'ЭМИ-граната', type: 'consumable', sellPrice: 35, description: 'Импульсная граната: 120 чистого шокового урона врагу.' },
  overclock_stim: { id: 'overclock_stim', name: 'Оверклок-Инъектор', type: 'consumable', sellPrice: 40, description: 'Нано-щит: поглощает до 75 единиц входящего урона.' },

  // Кибер-программы деки
  prog_crypto_thief: { id: 'prog_crypto_thief', name: 'Программа: «Крипто-Вор v3»', type: 'program', sellPrice: 200, programEffect: 'Каждый успешный нетраннинг приносит +25-60 Кредитов.', description: 'Перехватывает корпоративные микротранзакции при операциях в сети.' },
  prog_black_ice: { id: 'prog_black_ice', name: 'Программа: «Черный Лед Цербер»', type: 'program', sellPrice: 300, programEffect: 'Защищает деку от вирусов и снижает входящий урон в бою на 10%.', description: 'Автономный сторожевой модуль. Защищает от вредоносных атак.' },
  prog_overload: { id: 'prog_overload', name: 'Программа: «Протокол Оверлоад»', type: 'program', sellPrice: 350, programEffect: 'Шанс 35% извлечь 1 редкий кибер-компонент при взломе.', description: 'Взрывает сетевые концентраторы, извлекая полезную микроэлектронику.' },
  prog_ghost_stealth: { id: 'prog_ghost_stealth', name: 'Программа: «Призрак Стелс»', type: 'program', sellPrice: 400, programEffect: 'Ускоряет все операции нетраннинга на 25%.', description: 'Маскирует нейросигнатуру нетраннера от корпоративных систем слежения.' },
  prog_contagion: { id: 'prog_contagion', name: 'Программа: «Вирус Контагион»', type: 'program', sellPrice: 450, programEffect: 'В бою каждую секунду наносит противнику 20 чистого урона.', description: 'Боевой сетевой вирус прямого нейронного заражения.' },

  // 🧠 Нейро-стабилизаторы и Психо-программы (для Человечности и Риппердока)
  prog_zen_protocol: { 
    id: 'prog_zen_protocol', 
    name: 'Программа: «Холодный Рассудок»', 
    type: 'program', 
    sellPrice: 600, 
    programEffect: '-50% потери Человечности в боях с боссами и киберпсихами. +3 ОЗ/сек пассивная регенерация вне боя.', 
    description: 'Программный глушитель стресса и кибернетического отторжения нейроинтерфейсов.' 
  },
  prog_ghost_shell: { 
    id: 'prog_ghost_shell', 
    name: 'Программа: «Призрачный Щит»', 
    type: 'program', 
    sellPrice: 900, 
    programEffect: 'Маскирует био-сигнатуры от облав спецназа. При 0 человечности дает 100% критический урон в бою.', 
    description: 'Маскировка био-сигнатур от сканеров Trauma Team и тяжелых патрулей MAX-TAC.' 
  },

  // 🔬 Нано-инженерия и Дроны (для Сбора сырья и Крафта в Убежище)
  prog_nano_catalyst: { 
    id: 'prog_nano_catalyst', 
    name: 'Программа: «Нано-Катализатор»', 
    type: 'program', 
    sellPrice: 500, 
    programEffect: '20% шанс скрафтить удвоенное количество стимуляторов/снаряжения без доп. затрат сырья.', 
    description: 'Оптимизация химических и аппаратных реакций при создании предметов на верстаке.' 
  },
  prog_swarm_protocol: { 
    id: 'prog_swarm_protocol', 
    name: 'Программа: «Протокол Роя»', 
    type: 'program', 
    sellPrice: 550, 
    programEffect: 'Скорость работы дрона +35%. Шанс 40% найти редкие оружейные детали при завершении задач.', 
    description: 'Разгон автономных подпрограмм паук-бота и оптимизация маршрутов поиска.' 
  },

  // 🛰️ Шпионские и Разведывательные демоны (для Контрактов и Случайных событий)
  prog_corp_leaker: { 
    id: 'prog_corp_leaker', 
    name: 'Программа: «Инсайдер Корпораций»', 
    type: 'program', 
    sellPrice: 650, 
    programEffect: '+30% к награде за контракты синдикатов. Снижает стоимость обновления базы заказов вдвое (75 КР вместо 150).', 
    description: 'Нелегальный бекдор к закрытым базам данных и архивам транзакций Арасаки и Канга Тао.' 
  },
  prog_threat_scanner: { 
    id: 'prog_threat_scanner', 
    name: 'Программа: «Предиктивный Анализ»', 
    type: 'program', 
    sellPrice: 750, 
    programEffect: 'Просчитывает риски в случайных событиях: нейтрализует негативные исходы и предотвращает потери.', 
    description: 'Прогностическая модель угроз Найт-Сити на базе предиктивных нейросетей.' 
  },

  // ☣️ Новые Боевые Демоны (Combat Daemons)
  prog_short_circuit: { 
    id: 'prog_short_circuit', 
    name: 'Программа: «Замыкание»', 
    type: 'program', 
    sellPrice: 700, 
    programEffect: 'Шанс 25% при ударе замкнуть сервоприводы врага ЭМИ-импульсом, оглушая его на 1 ход.', 
    description: 'Направленный ЭМИ-импульс высокого напряжения в сервоприводы и нейросеть врага.' 
  },
  prog_bio_leech: { 
    id: 'prog_bio_leech', 
    name: 'Программа: «Кибер-Вампиризм»', 
    type: 'program', 
    sellPrice: 850, 
    programEffect: 'Восстанавливает 15% от нанесенного урона в виде ОЗ наёмника при каждом ударе.', 
    description: 'Перекачка био-энергии и электролитов из поверженных аугментаций противника.' 
  }
};

export const INITIAL_MARKET = { data: 5, scrap: 2, components: 15 };

import { RandomEvent } from './types';
export const RANDOM_EVENTS: RandomEvent[] = [
  // --- 7 ПОЗИТИВНЫХ СОБЫТИЙ (50/50 исход) ---
  {
    id: 'pos_wallet', title: 'Забытый криптокошелек', description: 'В подворотне вы наткнулись на чей-то потерянный чип. Попытаться взломать?',
    choices: [ { text: 'Взломать', outcomes: [
      { resources: { credits: 150 }, notification: '50/50: Успех! Вы скачали 150 КР.', type: 'success' },
      { hpDelta: -10, notification: '50/50: Защита чипа ударила током. -10 HP.', type: 'error' }
    ] } ]
  },
  {
    id: 'pos_data', title: 'Открытый Терминал', description: 'Кто-то забыл выйти из системы. Скачать данные?',
    choices: [ { text: 'Скачать', outcomes: [
      { resources: { data: 100 }, notification: '50/50: Легкая добыча: +100 Данных.', type: 'success' },
      { humanityDelta: -5, notification: '50/50: Вирус повредил нейроинтерфейс. -5 Человечности.', type: 'error' }
    ] } ]
  },
  {
    id: 'pos_ripper', title: 'Сомнительная Клиника', description: 'Неизвестный Риппердок предлагает экспериментальную терапию.',
    choices: [ { text: 'Согласиться', outcomes: [
      { humanityDelta: 15, notification: '50/50: Терапия сработала отлично (+15 Человечности).', type: 'success' },
      { hpDelta: -30, notification: '50/50: Ошибка препарата! Вы отравились (-30 HP).', type: 'error' }
    ] } ]
  },
  {
    id: 'pos_scrap', title: 'Разбитый Дрон', description: 'Грузовой дрон разбился неподалеку. Попробовать разобрать?',
    choices: [ { text: 'Разобрать', outcomes: [
      { resources: { scrap: 50 }, notification: '50/50: Вы собрали 50 Лома.', type: 'success' },
      { resources: { scrap: 10 }, notification: '50/50: Дрон взорвался в руках. Удалось спасти лишь 10 Лома.', type: 'error' }
    ] } ]
  },
  {
    id: 'pos_trade', title: 'Уличный Торговец', description: 'Мутный тип предлагает ящик с деталями за 50 кредитов. Внутри может быть что угодно.',
    choices: [
      { text: 'Купить (50 КР)', requirements: { resources: { credits: 50 } }, outcomes: [
        { resources: { credits: -50, components: 25 }, notification: '50/50: Удача! Внутри редкие детали (+25 Комп).', type: 'success' },
        { resources: { credits: -50, components: 5 }, notification: '50/50: Обман! Почти все — мусор (+5 Комп).', type: 'error' }
      ]},
      { text: 'Пройти мимо', outcomes: [{ notification: 'Вы решили не рисковать.', type: 'info' }] }
    ]
  },
  {
    id: 'pos_hack', title: 'Уязвимость в Сети', description: 'Вы заметили брешь в корпоративном брандмауэре.',
    choices: [
      { text: 'Взломать', outcomes: [
        { resources: { data: 300 }, notification: '50/50: Вы скачали 300 Данных из скрытого архива.', type: 'success' },
        { hpDelta: -40, notification: '50/50: Черный лед сжег ваши синапсы! -40 HP.', type: 'error' }
      ]},
      { text: 'Игнорировать', outcomes: [{ notification: 'Осторожность не повредит.', type: 'info' }] }
    ]
  },
  {
    id: 'pos_ally', title: 'Помощь Банды', description: 'Группировка скинула координаты тайника. Это может быть ловушкой.',
    choices: [ 
      { text: 'Проверить тайник', outcomes: [
        { resources: { weapon_parts: 5 }, reputation: { street: 1 }, notification: '50/50: Внутри оказались пушки! +5 Оружейных деталей.', type: 'success' },
        { hpDelta: -25, notification: '50/50: Засада! Едва унесли ноги (-25 HP).', type: 'error' }
      ] },
      { text: 'Игнорировать', outcomes: [{ notification: 'Береженого Бог бережет.', type: 'info' }] }
    ]
  },

  // --- 7 НЕГАТИВНЫХ СОБЫТИЙ (50/50 исход) ---
  {
    id: 'neg_ambush', title: 'Корпоративная Засада', description: 'Патруль корпорации перехватил ваш сигнал. Они требуют взятку или угрожают открыть огонь.',
    choices: [
      { text: 'Откупиться (150 КР)', requirements: { resources: { credits: 150 } }, outcomes: [{ resources: { credits: -150 }, notification: 'Вы откупились от патруля.', type: 'error' }] },
      { text: 'Попытаться скрыться', outcomes: [
        { notification: '50/50: Вам удалось незаметно ускользнуть.', type: 'success' },
        { hpDelta: -40, notification: '50/50: Провал! По вам открыли огонь. Потеряно 40 HP.', type: 'error' }
      ]}
    ]
  },
  {
    id: 'neg_glitch', title: 'Сбой Имплантов', description: 'Ваша оптика барахлит, а руки дрожат. Экстренный ремонт стоит компонентов, иначе придется бить по нервной системе.',
    choices: [
      { text: 'Ремонт (20 Комп)', requirements: { resources: { components: 20 } }, outcomes: [{ resources: { components: -20 }, notification: 'Ремонт прошел успешно.', type: 'error' }] },
      { text: 'Жесткая перезагрузка', outcomes: [
        { notification: '50/50: Система восстановилась без потерь.', type: 'success' },
        { humanityDelta: -15, notification: '50/50: Болевой шок повредил психику. -15 Человечности.', type: 'error' }
      ]}
    ]
  },
  {
    id: 'neg_virus', title: 'Лед-Вирус', description: 'Вражеский нетраннер подкинул вирус в вашу деку. Можно сжечь его, пожертвовав Ломом.',
    choices: [
      { text: 'Очистить (30 Лома)', requirements: { resources: { scrap: 30 } }, outcomes: [{ resources: { scrap: -30 }, notification: 'Вирус успешно удален.', type: 'error' }] },
      { text: 'Игнорировать', outcomes: [
        { notification: '50/50: Вирус оказался неактивным.', type: 'success' },
        { resources: { data: -150 }, notification: '50/50: Вирус стер часть ваших архивов! -150 Данных.', type: 'error' }
      ]}
    ]
  },
  {
    id: 'neg_power', title: 'Сбой Питания', description: 'Резкий скачок напряжения в энергосети угрожает вашему оборудованию.',
    choices: [
      { text: 'Купить стабилизатор (100 КР)', requirements: { resources: { credits: 100 } }, outcomes: [{ resources: { credits: -100 }, notification: 'Оборудование спасено.', type: 'error' }] },
      { text: 'Заземлить вручную', outcomes: [
        { notification: '50/50: Вы успели перекинуть провода. Все в порядке.', type: 'success' },
        { hpDelta: -25, resources: { scrap: -25 }, notification: '50/50: Удар током! Вы потеряли 25 HP и часть Лома.', type: 'error' }
      ]}
    ]
  },
  {
    id: 'neg_maxtac', title: 'Облава Макс-Так', description: 'Спецназ зачищает ваш сектор. Можно отсидеться, если стереть следы, или попытаться проскользнуть.',
    choices: [
      { text: 'Стереть логи (Отдать 100 Данных)', requirements: { resources: { data: 100 } }, outcomes: [{ resources: { data: -100 }, notification: 'Вы стерли логи и отсиделись в тени.', type: 'error' }] },
      { text: 'Проскользнуть', outcomes: [
        { resources: { scrap: 40 }, reputation: { street: 1 }, notification: '50/50: Вы проскользнули и облутали труп! +40 Лома.', type: 'success' },
        { hpDelta: -50, notification: '50/50: Вас заметили! Шквальный огонь снес 50 HP.', type: 'error' }
      ]}
    ]
  },
  {
    id: 'neg_bounty', title: 'Охотники за головами', description: 'Кто-то назначил награду за вашу голову. Наемники уже у дверей.',
    choices: [
      { text: 'Откупиться через фиксера (250 КР)', requirements: { resources: { credits: 250 } }, outcomes: [{ resources: { credits: -250 }, notification: 'Фиксер уладил вопрос. Наемники ушли.', type: 'error' }] },
      { text: 'Устроить засаду', outcomes: [
        { resources: { weapon_parts: 10 }, notification: '50/50: Вы перебили их! +10 Оружейных деталей.', type: 'success' },
        { hpDelta: -60, notification: '50/50: Они оказались сильнее. Чудом ушли, потеряв 60 HP.', type: 'error' }
      ]}
    ]
  },
  {
    id: 'neg_ai', title: 'Дикий ИИ', description: 'Агрессивный ИИ прорвался через файрвол и пытается сжечь ваш нейроинтерфейс.',
    choices: [
      { text: 'Разорвать связь (Потерять 150 Данных)', requirements: { resources: { data: 150 } }, outcomes: [{ resources: { data: -150 }, notification: 'Связь разорвана. ИИ остановлен.', type: 'error' }] },
      { text: 'Попытаться изолировать его', outcomes: [
        { resources: { components: 30 }, notification: '50/50: Вы захватили часть кода ИИ! +30 Компонентов.', type: 'success' },
        { humanityDelta: -25, notification: '50/50: ИИ атаковал ваш разум! -25 Человечности.', type: 'error' }
      ]}
    ]
  },
  {
    id: 'neg_blackmail', title: 'Шантаж Фиксера', description: 'Теневой информатор узнал координаты вашего убежища и требует откуп.',
    choices: [
      { text: 'Заплатить за молчание (120 КР)', requirements: { resources: { credits: 120 } }, outcomes: [{ resources: { credits: -120 }, notification: 'Вы откупились от шантажиста.', type: 'error' }] },
      { text: 'Контр-взлом компромата', outcomes: [
        { resources: { credits: 150, data: 50 }, notification: '50/50: Успех! Вы вскрыли его тайник: +150 КР, +50 Данных.', type: 'success' },
        { hpDelta: -35, notification: '50/50: Провал! Фиксер прислал головорезов. -35 HP.', type: 'error' }
      ]}
    ]
  },
  {
    id: 'neg_overheat', title: 'Термальный Разгон', description: 'Ваш нейропроцессор раскалился до предела. Риск выгорания нейросети!',
    choices: [
      { text: 'Залить хладагент (30 Лома)', requirements: { resources: { scrap: 30 } }, outcomes: [{ resources: { scrap: -30 }, notification: 'Температура стабилизирована.', type: 'error' }] },
      { text: 'Перенаправить энергию', outcomes: [
        { resources: { components: 25 }, notification: '50/50: Избыточный ток зарядил энергоячейки! +25 Комп.', type: 'success' },
        { hpDelta: -30, notification: '50/50: Ожог синапсов! -30 HP.', type: 'error' }
      ]}
    ]
  },
  {
    id: 'neg_syndicate_toll', title: 'Поборы Синдиката', description: 'Бойцы синдиката перекрыли шлюз и требуют плату за проход.',
    choices: [
      { text: 'Заплатить дань (80 КР)', requirements: { resources: { credits: 80 } }, outcomes: [{ resources: { credits: -80 }, notification: 'Вы заплатили дань синдикату.', type: 'error' }] },
      { text: 'Дать жесткий отпор', outcomes: [
        { resources: { weapon_parts: 8, scrap: 30 }, notification: '50/50: Вы разнесли патруль! +8 Деталей, +30 Лома.', type: 'success' },
        { hpDelta: -45, notification: '50/50: Вас ранили в перестрелке. -45 HP.', type: 'error' }
      ]}
    ]
  },
  {
    id: 'neg_bad_stim', title: 'Токсичный Контрафакт', description: 'Партия медикаментов в убежище оказалась заражена техническим спиртом.',
    choices: [
      { text: 'Утилизировать партию (15 Комп)', requirements: { resources: { components: 15 } }, outcomes: [{ resources: { components: -15 }, notification: 'Токсины утилизированы.', type: 'error' }] },
      { text: 'Очистить через фильтры', outcomes: [
        { hpDelta: 30, notification: '50/50: Фильтрация прошла идеально! +30 HP восстановлено.', type: 'success' },
        { humanityDelta: -12, notification: '50/50: Токсины проникли в кровь. -12 Человечности.', type: 'error' }
      ]}
    ]
  },
  {
    id: 'neg_net_leak', title: 'Утечка Нейро-Данных', description: 'Вражеский шпионский сканер перехватывает ваши каналы передачи.',
    choices: [
      { text: 'Экстренно сбросить ключ (80 Данных)', requirements: { resources: { data: 80 } }, outcomes: [{ resources: { data: -80 }, notification: 'Ключи сброшены. Канал чист.', type: 'error' }] },
      { text: 'Отследить перехватчика', outcomes: [
        { resources: { data: 180 }, notification: '50/50: Вы перехватили данные шпиона! +180 Данных.', type: 'success' },
        { humanityDelta: -10, notification: '50/50: Шпион успел провести пси-атаку. -10 Человечности.', type: 'error' }
      ]}
    ]
  }
];

export const UPGRADES: Record<string, Upgrade> = {
  upg_cyberdeck_v2: { id: 'upg_cyberdeck_v2', name: 'Кибердека V2', description: 'Действия нетраннинга на 20% быстрее.', cost: { data: 200, credits: 500 } },
  upg_krogan_arms: { id: 'upg_krogan_arms', name: 'Гидравлические руки', description: 'Поиск лома на 20% быстрее.', cost: { scrap: 200, credits: 500 } },
  upg_precision_tools: { id: 'upg_precision_tools', name: 'Точные лазеры', description: 'Инженерия на 20% быстрее.', cost: { components: 100, credits: 800 } },
  upg_titanium_bones: { id: 'upg_titanium_bones', name: 'Титановые кости', description: 'Постоянно +10 к защите.', cost: { credits: 2000, components: 250 } },
  
  // Дорогостоящие расширители инвентаря
  upg_inv_1: { id: 'upg_inv_1', name: 'Нейро-Склад I (+10 слотов)', description: 'Базовое расширение вместимости инвентаря на +10 ячеек.', cost: { credits: 2500, scrap: 400, components: 150 } },
  upg_inv_2: { id: 'upg_inv_2', name: 'Нано-Контейнер II (+10 слотов)', description: 'Субмолекулярное сжатие предметов в инвентаре (+10 ячеек).', cost: { credits: 8000, scrap: 1200, components: 500, weapon_parts: 30 } },
  upg_inv_3: { id: 'upg_inv_3', name: 'Армейский Склад III (+15 слотов)', description: 'Элитный тактический модуль расширения емкости (+15 ячеек).', cost: { credits: 25000, scrap: 3500, components: 1500, weapon_parts: 80 } },
  upg_inv_4: { id: 'upg_inv_4', name: 'Квантовый Карман IV (+20 слотов)', description: 'Сингулярная свертка пространства под бесконечные запасы (+20 ячеек).', cost: { credits: 75000, scrap: 8000, components: 3500, weapon_parts: 200, engrams: 10 } }
};

export const META_UPGRADES: Record<string, Upgrade> = {
  meta_speed: { id: 'meta_speed', name: 'Ускорение синапсов', description: 'Глобальное ускорение всех действий на 15%.', cost: { engrams: 5 } },
  meta_combat: { id: 'meta_combat', name: 'Боевые рефлексы', description: 'Глобальное увеличение урона на 20%.', cost: { engrams: 10 } },
  meta_drone: { id: 'meta_drone', name: 'Оверклок ИИ', description: 'Дроны работают с нормальной (100%) скоростью.', cost: { engrams: 15 } }
};

export const REAL_ESTATE = [
  { id: 're_bar', name: 'Бар «Послежизнь»', baseCost: 5000, description: 'Пассивный доход: +1 КР / сек' },
  { id: 're_clinic', name: 'Подпольная Клиника', baseCost: 8000, description: 'Пассивный доход: +1 Лом / сек' },
  { id: 're_server', name: 'Серверная Ферма', baseCost: 12000, description: 'Пассивный доход: +5 Данных / сек' },
];

export const ENEMIES: Record<string, Enemy> = {
  // Elite Bosses
  elite_cyber_ninja: {
    id: 'elite_cyber_ninja',
    name: 'Арасака «Кибер-Ниндзя»',
    maxHp: 2500,
    attack: 85,
    defense: 45,
    attackSpeed: 0.8,
    xp: 2500,
    humanityLoss: 5,
    isBoss: true,
    isElite: true,
    bossTitle: 'ЭЛИТНЫЙ БОСС',
    rewards: {
      resources: { credits: 3500, weapon_parts: 20 },
      reputation: { corp: 150 }
    }
  },
  elite_tank: {
    id: 'elite_tank',
    name: 'Милитех «Бегемот»',
    maxHp: 6500,
    attack: 65,
    defense: 85,
    attackSpeed: 3.5,
    xp: 3500,
    humanityLoss: 5,
    isBoss: true,
    isElite: true,
    bossTitle: 'ЭЛИТНЫЙ БОСС',
    rewards: {
      resources: { credits: 4000, components: 30 },
      reputation: { corp: 200 }
    }
  },

  street_thug: { 
    id: 'street_thug', 
    name: 'Уличный бандит', 
    maxHp: 60, 
    attack: 8, 
    defense: 2, 
    xp: 15, 
    humanityLoss: 1,
    rewards: { resources: { scrap: 5, credits: 12 }, reputation: { corp: 1, street: -1 } } 
  },
  scav_raider: { 
    id: 'scav_raider', 
    name: 'Мусорщик-Потрошитель', 
    maxHp: 130, 
    attack: 14, 
    defense: 6, 
    xp: 35, 
    humanityLoss: 1,
    rewards: { resources: { scrap: 20, components: 4, credits: 30 }, reputation: { corp: 1, street: 1 } } 
  },
  corp_sec: { 
    id: 'corp_sec', 
    name: 'Охрана корпорации', 
    maxHp: 220, 
    attack: 22, 
    defense: 12, 
    xp: 65, 
    humanityLoss: 1,
    rewards: { resources: { weapon_parts: 3, credits: 50 }, reputation: { corp: -3, street: 3 } } 
  },
  net_assassin: { 
    id: 'net_assassin', 
    name: 'Сетевой Киллер «Мальстрём»', 
    maxHp: 420, 
    attack: 36, 
    defense: 20, 
    xp: 140, 
    humanityLoss: 1,
    rewards: { resources: { data: 50, components: 10, credits: 100 }, reputation: { corp: 4, street: -4 } } 
  },
  cyber_psycho: { 
    id: 'cyber_psycho', 
    name: 'Киберпсих из трущоб', 
    maxHp: 850, 
    attack: 52, 
    defense: 30, 
    xp: 300, 
    isBoss: true, 
    bossTitle: 'МИНИ-БОСС',
    humanityLoss: 2,
    rewards: { resources: { weapon_parts: 15, components: 12, credits: 250 }, reputation: { corp: 5, street: 8 } } 
  },
  militech_mech: { 
    id: 'militech_mech', 
    name: 'Штурмовой Мех «Центавр»', 
    maxHp: 1600, 
    attack: 78, 
    defense: 48, 
    xp: 550, 
    isBoss: true, 
    bossTitle: 'МИНИ-БОСС',
    humanityLoss: 2,
    rewards: { resources: { weapon_parts: 30, scrap: 100, credits: 500 }, reputation: { corp: -8, street: 15 } } 
  },
  arasaka_ninja: { 
    id: 'arasaka_ninja', 
    name: 'Элитный Шиноби Арасаки', 
    maxHp: 2600, 
    attack: 110, 
    defense: 65, 
    xp: 1000, 
    isBoss: true, 
    bossTitle: 'БОСС',
    humanityLoss: 3,
    rewards: { resources: { weapon_parts: 50, components: 35, credits: 1000 }, reputation: { corp: -18, street: 35 } } 
  },
  adam_smasher: { 
    id: 'adam_smasher', 
    name: 'Адам Смэшер: Кибер-Монолит', 
    maxHp: 6000, 
    attack: 165, 
    defense: 95, 
    xp: 3000, 
    isBoss: true, 
    bossTitle: 'ЭПИЧЕСКИЙ БОСС',
    humanityLoss: 5,
    rewards: { resources: { weapon_parts: 120, credits: 3500, engrams: 15 }, reputation: { corp: -35, street: 70 } } 
  },
  alt_cunningham_ai: { 
    id: 'alt_cunningham_ai', 
    name: 'Дикий ИИ «Чёрного Заслона»', 
    maxHp: 12000, 
    attack: 240, 
    defense: 130, 
    xp: 8000, 
    isBoss: true, 
    bossTitle: 'СВЕРХ-БОСС СЕТИ',
    humanityLoss: 6,
    rewards: { resources: { data: 600, credits: 7500, engrams: 30 }, reputation: { corp: 50, street: 50 } } 
  }
};

export const MAX_ITEM_STACK = 99;

export function getMaxInventory(upgrades: string[] = []): number {
  let capacity = 15; // базовый лимит: 15 слотов под уникальные типы предметов (до 99 шт. в слоте)
  if (upgrades.includes('upg_inv_1')) capacity += 10;
  if (upgrades.includes('upg_inv_2')) capacity += 10;
  if (upgrades.includes('upg_inv_3')) capacity += 15;
  if (upgrades.includes('upg_inv_4')) capacity += 20;
  return capacity;
}

export function getTotalInventoryItems(inventory: Record<string, number> = {}): number {
  // Количество занятых слотов (каждая пачка до 99 шт занимает 1 слот)
  return Object.values(inventory).reduce((occupiedSlots, count) => {
    if (!count || count <= 0) return occupiedSlots;
    return occupiedSlots + Math.max(1, Math.ceil(count / MAX_ITEM_STACK));
  }, 0);
}

export function canFitItemInInventory(
  inventory: Record<string, number> = {},
  upgrades: string[] = [],
  itemId: string,
  addCount: number = 1
): boolean {
  const currentCount = inventory[itemId] || 0;
  const maxSlots = getMaxInventory(upgrades);
  const currentSlots = getTotalInventoryItems(inventory);

  if (currentCount > 0) {
    const currentSlotsForThisItem = Math.max(1, Math.ceil(currentCount / MAX_ITEM_STACK));
    const newSlotsForThisItem = Math.max(1, Math.ceil((currentCount + addCount) / MAX_ITEM_STACK));
    const delta = newSlotsForThisItem - currentSlotsForThisItem;
    return currentSlots + delta <= maxSlots;
  }

  const slotsNeeded = Math.max(1, Math.ceil(addCount / MAX_ITEM_STACK));
  return currentSlots + slotsNeeded <= maxSlots;
}

import { FactionContract } from './types';

export function isProgramEquipped(
  equipment?: { program?: string | null; program2?: string | null } | null,
  programId: string = ''
): boolean {
  if (!equipment) return false;
  return equipment.program === programId || equipment.program2 === programId;
}

export const CONTRACT_REFRESH_COST = 150;

export function getContractRefreshCost(stateOrEquipment?: any): number {
  const equipment = stateOrEquipment?.equipment || stateOrEquipment;
  if (isProgramEquipped(equipment, 'prog_corp_leaker')) {
    return 75; // 50% скидка на обновление заказов при установленном в деку «Инсайдере Корпораций»
  }
  return 150;
}

export function generateRandomContracts(): FactionContract[] {
  const templates: Omit<FactionContract, 'id' | 'killsCurrent' | 'currentAmount'>[] = [
    // Боевые контракты (высокая награда в кредитах и репутации)
    {
      faction: 'corp',
      type: 'combat',
      title: 'Очистка сектора от уличных банд',
      description: 'Устранить 5 уличных бандитов, угрожающих корпоративным курьерам.',
      targetEnemy: 'street_thug',
      targetAmount: 5,
      killsRequired: 5,
      rewardCredits: 220,
      rewardRep: 4
    },
    {
      faction: 'street',
      type: 'combat',
      title: 'Возмездие корпоративной охране',
      description: 'Ликвидировать 3 бойцов охраны корпораций в промышленной зоне.',
      targetEnemy: 'corp_sec',
      targetAmount: 3,
      killsRequired: 3,
      rewardCredits: 280,
      rewardRep: 5
    },
    {
      faction: 'corp',
      type: 'combat',
      title: 'Устранение киллера Мальстрём',
      description: 'Уничтожить 2 сетевых киллеров группировки Мальстрём.',
      targetEnemy: 'net_assassin',
      targetAmount: 2,
      killsRequired: 2,
      rewardCredits: 400,
      rewardRep: 6
    },
    {
      faction: 'street',
      type: 'combat',
      title: 'Нейтрализация киберпсиха',
      description: 'Ликвидировать 1 опасного киберпсиха, терроризирующего район.',
      targetEnemy: 'cyber_psycho',
      targetAmount: 1,
      killsRequired: 1,
      rewardCredits: 550,
      rewardRep: 8
    },

    // Контракты: Контрабанда и Теневой Рынок
    {
      faction: 'street',
      type: 'smuggling',
      title: 'Поставка нелегального груза через кордон',
      description: 'Провести 4 теневые операции по доставке грузов в Кабуки или «Шельмам».',
      targetSkill: 'smuggling',
      targetAmount: 4,
      killsRequired: 4,
      rewardCredits: 320,
      rewardRep: 4
    },
    {
      faction: 'corp',
      type: 'smuggling',
      title: 'Теневой перехват орбитального контейнера',
      description: 'Завершить 2 разгрузки орбитальных контейнеров или проводку военного конвоя.',
      targetSkill: 'smuggling',
      targetAmount: 2,
      killsRequired: 2,
      rewardCredits: 450,
      rewardRep: 5
    },

    // Контракты: Разведка и Радиоэлектронная борьба
    {
      faction: 'corp',
      type: 'recon',
      title: 'Глушение частот банд и перехват спутников',
      description: 'Выполнить 4 сеанса разведки радиочастот или глушения радаров.',
      targetSkill: 'recon',
      targetAmount: 4,
      killsRequired: 4,
      rewardCredits: 260,
      rewardRep: 3
    },
    {
      faction: 'street',
      type: 'recon',
      title: 'Перехват управления корпоративными дронами',
      description: 'Осуществить 2 взлома спутников слежения или перехвата дронов.',
      targetSkill: 'recon',
      targetAmount: 2,
      killsRequired: 2,
      rewardCredits: 380,
      rewardRep: 4
    },

    // Мирные контракты: Мусорщичество / Добыча
    {
      faction: 'street',
      type: 'scavenging',
      title: 'Партия утиля для подпольной мастерской',
      description: 'Провести 5 рейдов по поиску металлолома на улицах или свалке.',
      targetSkill: 'scavenging',
      targetAmount: 5,
      killsRequired: 5,
      rewardCredits: 140,
      rewardRep: 2
    },
    {
      faction: 'corp',
      type: 'scavenging',
      title: 'Сбор обломков Милитех для анализа',
      description: 'Завершить 3 операции по исследованию обломков Милитех или турелей.',
      targetSkill: 'scavenging',
      targetAmount: 3,
      killsRequired: 3,
      rewardCredits: 180,
      rewardRep: 3
    },

    // Мирные контракты: Нетраннинг / Взлом
    {
      faction: 'corp',
      type: 'netrunning',
      title: 'Зондирование узлов коммуникаций',
      description: 'Выполнить 6 взломов общественных терминалов или подсетей.',
      targetSkill: 'netrunning',
      targetAmount: 6,
      killsRequired: 6,
      rewardCredits: 150,
      rewardRep: 2
    },
    {
      faction: 'street',
      type: 'netrunning',
      title: 'Взлом серверов корпорации',
      description: 'Осуществить 3 успешных проникновения в подсеть корпораций или крипто-хаб.',
      targetSkill: 'netrunning',
      targetAmount: 3,
      killsRequired: 3,
      rewardCredits: 220,
      rewardRep: 3
    },

    // Мирные контракты: Инженерия / Крафт
    {
      faction: 'street',
      type: 'engineering',
      title: 'Поставка партии микросхем',
      description: 'Собрать 4 микросхемы или ИИ-чипа для уличных техников.',
      targetSkill: 'engineering',
      targetAmount: 4,
      killsRequired: 4,
      rewardCredits: 160,
      rewardRep: 2
    },
    {
      faction: 'corp',
      type: 'engineering',
      title: 'Синтез стимуляторов для службы безопасности',
      description: 'Синтезировать 2 дозы Нейропозина или боевого стимулятора.',
      targetSkill: 'engineering',
      targetAmount: 2,
      killsRequired: 2,
      rewardCredits: 240,
      rewardRep: 3
    }
  ];

  const shuffled = [...templates].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4).map((t, idx) => ({
    ...t,
    id: `c_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
    currentAmount: 0,
    killsCurrent: 0
  }));
}

export const ACTIONS: Record<Skill, SkillAction[]> = {
  netrunning: [
    { id: 'hack_terminal', name: 'Взлом терминала вендинга', xp: 10, time: 3000, reqLevel: 1, rewards: { data: 1, credits: 6 } },
    { id: 'hack_traffic_cam', name: 'Перехват трафика подсети Кабуки', xp: 22, time: 4500, reqLevel: 3, rewards: { data: 3, credits: 18 } },
    { id: 'hack_corp', name: 'Взлом банка данных корпораций', xp: 45, time: 7000, reqLevel: 5, rewards: { data: 8, credits: 45 } },
    { id: 'hack_lab_network', name: 'Пробитие брандмауэра био-лаборатории', xp: 90, time: 10000, reqLevel: 8, rewards: { data: 20, components: 1, credits: 100 } },
    { id: 'hack_crypto_hub', name: 'Эксплойт крипто-хаба Арасака', xp: 170, time: 14000, reqLevel: 12, rewards: { data: 45, credits: 400, engrams: 1 } },
    { id: 'hack_blackwall', name: 'Глубокое зондирование Черного Заслона', xp: 340, time: 19000, reqLevel: 16, rewards: { data: 110, engrams: 3, credits: 750 } },
    { id: 'hack_omega_supercomputer', name: 'Взлом суперкомпьютера «Омега»', xp: 750, time: 28000, reqLevel: 20, rewards: { data: 260, engrams: 6, credits: 2400 } },
  ],
  scavenging: [
    { id: 'scavenge_alley', name: 'Обыск переулков и мусорных баков', xp: 10, time: 3000, reqLevel: 1, rewards: { scrap: 1, credits: 4 } },
    { id: 'scavenge_delamain_cabs', name: 'Разбор разбитых такси «Деламейн»', xp: 22, time: 4500, reqLevel: 3, rewards: { scrap: 3, components: 1 } },
    { id: 'scavenge_junkyard', name: 'Рейд на свалку боевых дронов', xp: 45, time: 7000, reqLevel: 5, rewards: { scrap: 8, components: 2 } },
    { id: 'scavenge_turrets', name: 'Утилизация турелей в Пасифике', xp: 95, time: 10000, reqLevel: 8, rewards: { scrap: 20, weapon_parts: 1, components: 2 } },
    { id: 'scavenge_militech', name: 'Обыск обломков конвоя Милитех', xp: 170, time: 13000, reqLevel: 10, rewards: { scrap: 40, weapon_parts: 2, components: 5 } },
    { id: 'scavenge_underground_lab', name: 'Демонтаж подпольной кибер-лаборатории', xp: 340, time: 18000, reqLevel: 15, rewards: { scrap: 85, components: 14, weapon_parts: 4 } },
    { id: 'scavenge_arasaka_av', name: 'Разграбление рухнувшего ави Арасака', xp: 750, time: 26000, reqLevel: 20, rewards: { scrap: 180, weapon_parts: 8, engrams: 3, credits: 1500 } },
  ],
  smuggling: [
    { id: 'smuggle_chips', name: 'Сбыт немаркированных чипов памяти в Кабуки', xp: 12, time: 3500, reqLevel: 1, rewards: { credits: 40, scrap: 1 } },
    { id: 'smuggle_delamain_pass', name: 'Теневой транзит контрабанды через посты', xp: 30, time: 5500, reqLevel: 3, rewards: { credits: 100, components: 1 } },
    { id: 'smuggle_mox_stims', name: 'Доставка военных стимуляторов банде «Шельмы»', xp: 65, time: 8000, reqLevel: 5, cost: { components: 1 }, rewards: { credits: 280, engrams: 1 } },
    { id: 'smuggle_scav_tech', name: 'Сбыт нелегальной оптики на Черном Рынке', xp: 120, time: 11000, reqLevel: 8, rewards: { credits: 550, weapon_parts: 1 } },
    { id: 'smuggle_militech_convoy', name: 'Проводка конвоя с оружием через посты Милитех', xp: 220, time: 15000, reqLevel: 10, cost: { scrap: 10 }, rewards: { credits: 1200, weapon_parts: 2, scrap: 25 } },
    { id: 'smuggle_arasaka_container', name: 'Взлом и разгрузка орбитального контейнера Арасака', xp: 450, time: 22000, reqLevel: 15, cost: { components: 5 }, rewards: { credits: 3000, weapon_parts: 5, engrams: 2 } },
    { id: 'smuggle_orbital_blackmarket', name: 'Контрабанда запрещенных ИИ-ядер с орбиты', xp: 900, time: 32000, reqLevel: 20, cost: { components: 15, weapon_parts: 2 }, rewards: { credits: 7500, weapon_parts: 10, engrams: 6 } },
  ],
  recon: [
    { id: 'recon_ncpd_radio', name: 'Сканирование частот радиопереговоров полиции NCPD', xp: 12, time: 3000, reqLevel: 1, rewards: { data: 2, credits: 18 } },
    { id: 'recon_watson_cameras', name: 'Перехват камер наблюдения в Уотсоне', xp: 30, time: 5000, reqLevel: 3, rewards: { data: 7, credits: 45 } },
    { id: 'recon_radar_jammers', name: 'Глушение радарных вышек в Уотсоне', xp: 70, time: 7500, reqLevel: 5, rewards: { data: 18, components: 2, credits: 110 } },
    { id: 'recon_traffic_satellite', name: 'Взлом орбитального ретранслятора связи', xp: 130, time: 11000, reqLevel: 8, rewards: { data: 38, credits: 240, engrams: 1 } },
    { id: 'recon_kang_tao_sat', name: 'Взлом спутника слежения «Канга Тао»', xp: 240, time: 15000, reqLevel: 10, rewards: { data: 75, weapon_parts: 2, credits: 500 } },
    { id: 'recon_drone_hijack', name: 'Перехват управления боевыми дронами корпораций', xp: 480, time: 22000, reqLevel: 15, cost: { data: 20 }, rewards: { data: 160, weapon_parts: 4, components: 20, credits: 1300 } },
    { id: 'recon_orbital_strike', name: 'Наведение орбитального ЭМИ-удара по датацентру', xp: 950, time: 32000, reqLevel: 20, cost: { data: 60, engrams: 1 }, rewards: { data: 400, engrams: 5, credits: 3800, weapon_parts: 6 } },
  ],
  engineering: [
    { id: 'craft_circuit', name: 'Пайка микросхемы', xp: 15, time: 5000, reqLevel: 1, cost: { scrap: 2 }, rewards: { components: 1 } },
    { id: 'craft_chip', name: 'Компиляция ИИ-чипа', xp: 40, time: 10000, reqLevel: 5, cost: { data: 5, scrap: 5 }, rewards: { components: 3 } },
    { id: 'craft_neuropozyne', name: 'Синтез Нейропозина', xp: 50, time: 8000, reqLevel: 5, cost: { scrap: 10, data: 10 }, itemRewards: { neuropozyne: 1 } },
    { id: 'craft_kevlar', name: 'Создание бронежилета', xp: 100, time: 15000, reqLevel: 8, cost: { scrap: 50 }, itemRewards: { kevlar_vest: 1 } },
    { id: 'craft_nano_catalyst', name: 'Сборка «Нано-Катализатора»', xp: 180, time: 18000, reqLevel: 10, cost: { data: 40, components: 25 }, itemRewards: { prog_nano_catalyst: 1 } },
    { id: 'craft_katana', name: 'Ковка термальной катаны', xp: 250, time: 20000, reqLevel: 12, cost: { scrap: 100, components: 20 }, itemRewards: { katana: 1 } },
    { id: 'craft_health', name: 'Синтез стимулятора', xp: 300, time: 25000, reqLevel: 15, cost: { data: 50, components: 50 }, itemRewards: { health_booster: 1 } },
    { id: 'craft_militech', name: 'Сборка брони Милитех', xp: 500, time: 30000, reqLevel: 20, cost: { scrap: 200, components: 100 }, itemRewards: { militech_armor: 1 } },
    { id: 'craft_smart_pistol', name: 'Сборка умного пистолета', xp: 600, time: 35000, reqLevel: 25, cost: { weapon_parts: 50, components: 100 }, itemRewards: { smart_pistol: 1 } },
    { id: 'craft_spider_bot', name: 'Сборка Паукобота', xp: 1000, time: 60000, reqLevel: 30, cost: { components: 300, data: 150 }, itemRewards: { spider_bot: 1 } },
  ],
  combat: [] 
};

export function getXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += Math.floor(i + 300 * Math.pow(2, i / 7.0));
  }
  return Math.floor(total / 4);
}

export function getLevelFromXp(xp: number): number {
  let level = 1;
  while (getXpForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
}
