/**
 * ============================================================================
 * Malaysian Cooking Dash — Game Configuration & Menu Recipes
 * ============================================================================
 * Replaces every Cooking Dash recipe with authentic Malaysian Kopitiam & Mamak dishes!
 * ============================================================================
 */

export const RECIPES = {
  // 1. Nasi Lemak Special
  nasi_lemak: {
    id: 'nasi_lemak',
    name: 'Nasi Lemak Special',
    base: 'coconut_rice',
    protein: 'ayam_goreng',
    garnish: 'sambal_egg',
    serveWare: 'banana_leaf',
    basePrice: 15,
    prepTime: 4000,
    cookType: 'fryer',
    description: 'Fragrant santan rice with crispy Ayam Goreng Berempah, sambal, boiled egg, anchovies & peanuts.'
  },

  // 2. Penang Char Kway Teow (Wok-Hei)
  char_kway_teow: {
    id: 'char_kway_teow',
    name: 'Penang Char Kway Teow',
    base: 'kway_teow_noodles',
    protein: 'prawns_cockles',
    garnish: 'taugeh_chives',
    serveWare: 'hawker_plate',
    basePrice: 14,
    prepTime: 4500,
    cookType: 'wok',
    description: 'Flat rice noodles stir-fried with king prawns, kerang, bean sprouts, chives, and intense wok hei.'
  },

  // 3. Roti Canai & Roti Telur
  roti_canai: {
    id: 'roti_canai',
    name: 'Crispy Roti Canai',
    base: 'roti_dough',
    protein: 'none',
    garnish: 'dhal_curry',
    serveWare: 'metal_plate',
    basePrice: 8,
    prepTime: 3500,
    cookType: 'griddle',
    description: 'Fluffy layered flatbread flipped to perfection, served with warm dhal curry and sambal.'
  },

  roti_telur: {
    id: 'roti_telur',
    name: 'Roti Telur Special',
    base: 'roti_dough',
    protein: 'egg_filling',
    garnish: 'dhal_curry',
    serveWare: 'metal_plate',
    basePrice: 10,
    prepTime: 4000,
    cookType: 'griddle',
    description: 'Savory flatbread folded with whipped egg and onions, served with spicy dhal dip.'
  },

  // 4. Kajang Satay Skewers
  satay_skewers: {
    id: 'satay_skewers',
    name: 'Kajang Satay Skewers',
    base: 'satay_meat',
    protein: 'chicken_skewer',
    garnish: 'peanut_sauce',
    serveWare: 'satay_basket',
    basePrice: 16,
    prepTime: 5000,
    cookType: 'grill',
    description: 'Lemongrass marinated chicken skewers charred over hot coals, served with rich peanut sauce.'
  },

  // 5. Mee Goreng Mamak
  mee_goreng: {
    id: 'mee_goreng',
    name: 'Mee Goreng Mamak',
    base: 'yellow_noodles',
    protein: 'tofu_fritter',
    garnish: 'chili_lime',
    serveWare: 'hawker_plate',
    basePrice: 12,
    prepTime: 4000,
    cookType: 'wok',
    description: 'Yellow noodles stir-fried with cucur fritters, bean curd, spicy chili paste, and fresh calamansi lime.'
  },

  // 6. Curry Laksa
  curry_laksa: {
    id: 'curry_laksa',
    name: 'Nyonya Curry Laksa',
    base: 'laksa_noodles',
    protein: 'tofu_pok_prawn',
    garnish: 'mint_sambal',
    serveWare: 'soup_bowl',
    basePrice: 15,
    prepTime: 4500,
    cookType: 'pot',
    description: 'Springy noodles submerged in aromatic, rich spiced coconut curry broth with prawns and tofu puffs.'
  }
};

export const DRINKS = {
  teh_tarik: {
    id: 'teh_tarik',
    name: 'Teh Tarik ("Pulled Tea")',
    price: 6,
    dispenseTime: 2500,
    color: '#D97706',
    description: 'Classic Malaysian black tea frothy-pulled with sweet condensed milk.'
  },
  kopi_peng: {
    id: 'kopi_peng',
    name: 'Kopi Peng (Iced Coffee)',
    price: 6,
    dispenseTime: 2500,
    color: '#78350F',
    description: 'Rich dark Hainanese roast coffee over ice with condensed milk.'
  },
  milo_dinosaur: {
    id: 'milo_dinosaur',
    name: 'Milo Dinosaur',
    price: 8,
    dispenseTime: 3000,
    color: '#92400E',
    description: 'Iced malt chocolate beverage heaped with a giant mountain of undissolved Milo powder.'
  },
  sirap_bandung: {
    id: 'sirap_bandung',
    name: 'Sirap Bandung Soda',
    price: 7,
    dispenseTime: 2500,
    color: '#F43F5E',
    description: 'Vibrant fragrant rose syrup blended with chilled evaporated milk and ice.'
  }
};

export const TREATS = {
  karipap: {
    id: 'karipap',
    name: 'Crispy Karipap (Curry Puff)',
    patienceRestore: 40,
    stock: 5,
    description: 'Golden spiral pastry filled with spiced curry potato. Instantly boosts customer patience by 40%!'
  },
  kuih_lapis: {
    id: 'kuih_lapis',
    name: 'Rainbow Kuih Lapis',
    patienceRestore: 50,
    stock: 5,
    description: 'Chewy multi-colored steamed pandan coconut cake. Restores 50% customer patience!'
  }
};

export const SKILLS = {
  speed_shoes: {
    id: 'speed_shoes',
    name: 'Kasut Laju (Speed Boost)',
    duration: 18000,
    cooldown: 35000,
    icon: '⚡',
    description: 'The Chef dashes at +70% speed across all kitchen stations for 18 seconds!'
  },
  anti_burn: {
    id: 'anti_burn',
    name: 'Wok Emas (Anti-Burn Magic)',
    duration: 22000,
    cooldown: 45000,
    icon: '🛡️',
    description: 'Prevents all woks and grills from burning dishes for 22 seconds!'
  },
  fast_cook: {
    id: 'fast_cook',
    name: 'Api Besar (Instant Cook)',
    duration: 0,
    cooldown: 30000,
    icon: '🔥',
    description: 'Instantly finishes cooking all food currently on the woks and grills!'
  },
  happy_hour: {
    id: 'happy_hour',
    name: 'Lagu P. Ramlee (Patience Max)',
    duration: 0,
    cooldown: 50000,
    icon: '🎵',
    description: 'Plays lively classic Kopitiam music, instantly restoring ALL customers to 100% full hearts!'
  },
  coin_fever: {
    id: 'coin_fever',
    name: 'Demam Untung (Double Tips)',
    duration: 15000,
    cooldown: 40000,
    icon: '💰',
    description: 'Customers pay 2X coins and 2X tips on every dish served for 15 seconds!'
  }
};

export const LEVELS = [
  {
    level: 1,
    title: 'Morning Kopitiam Rush',
    subtitle: 'Nasi Lemak & Roti Canai Breakfast',
    targetCoins: 120,
    expertCoins: 220,
    timeLimit: 110,
    availableRecipes: ['nasi_lemak', 'roti_canai'],
    availableDrinks: ['teh_tarik', 'kopi_peng'],
    customerPatienceRate: 1.0,
    customerSpawnInterval: 6500
  },
  {
    level: 2,
    title: 'Penang Hawker Lunch Peak',
    subtitle: 'Smoky Char Kway Teow & Nasi Lemak',
    targetCoins: 260,
    expertCoins: 420,
    timeLimit: 120,
    availableRecipes: ['nasi_lemak', 'char_kway_teow', 'roti_canai'],
    availableDrinks: ['teh_tarik', 'kopi_peng', 'milo_dinosaur'],
    customerPatienceRate: 1.15,
    customerSpawnInterval: 5500
  },
  {
    level: 3,
    title: 'Mamak Stall Supper Frenzy',
    subtitle: 'Mee Goreng Mamak & Roti Telur',
    targetCoins: 450,
    expertCoins: 680,
    timeLimit: 125,
    availableRecipes: ['char_kway_teow', 'mee_goreng', 'roti_telur', 'nasi_lemak'],
    availableDrinks: ['teh_tarik', 'kopi_peng', 'milo_dinosaur', 'sirap_bandung'],
    customerPatienceRate: 1.3,
    customerSpawnInterval: 4800
  },
  {
    level: 4,
    title: 'Kajang Satay Pasar Malam',
    subtitle: 'Charcoal Satay Skewers & Curry Laksa',
    targetCoins: 700,
    expertCoins: 980,
    timeLimit: 130,
    availableRecipes: ['satay_skewers', 'curry_laksa', 'mee_goreng', 'nasi_lemak'],
    availableDrinks: ['teh_tarik', 'kopi_peng', 'milo_dinosaur', 'sirap_bandung'],
    customerPatienceRate: 1.45,
    customerSpawnInterval: 4200
  },
  {
    level: 5,
    title: 'Grand Merdeka Food Festival',
    subtitle: 'The Ultimate Master Chef Malaysian Banquet',
    targetCoins: 1050,
    expertCoins: 1450,
    timeLimit: 140,
    availableRecipes: ['nasi_lemak', 'char_kway_teow', 'roti_canai', 'satay_skewers', 'curry_laksa', 'mee_goreng'],
    availableDrinks: ['teh_tarik', 'kopi_peng', 'milo_dinosaur', 'sirap_bandung'],
    customerPatienceRate: 1.6,
    customerSpawnInterval: 3600
  }
];

export const CUSTOMER_TYPES = [
  {
    id: 'businessman',
    name: 'Encik Wong (Rush Executive)',
    patience: 100,
    decayRate: 1.4, // Impatient
    tipMultiplier: 2.0, // Big tipper!
    eatTime: 3500,
    sprite: 'cust_businessman'
  },
  {
    id: 'critic',
    name: 'Makcik Salmah (Food Critic)',
    patience: 140,
    decayRate: 0.85, // Patient
    tipMultiplier: 1.8,
    eatTime: 5000,
    sprite: 'cust_makcik'
  },
  {
    id: 'student',
    name: 'Amir (College Student)',
    patience: 110,
    decayRate: 1.0,
    tipMultiplier: 1.1,
    eatTime: 4000,
    sprite: 'cust_student'
  },
  {
    id: 'tourist',
    name: 'Sarah (Global Foodie)',
    patience: 130,
    decayRate: 0.9,
    tipMultiplier: 1.5,
    eatTime: 4500,
    sprite: 'cust_tourist'
  }
];
