/**
 * Malaysian Cooking Dash — Kitchen Upgrades Shop System
 * Allows players to invest earned Ringgits into faster woks, bigger trays, and better decor.
 */

export const UPGRADES = [
  {
    id: 'chef_tray',
    name: '3-Dish Serving Platter',
    cost: 250,
    icon: '🍽️',
    description: 'Enables Uncle Chef to carry up to 3 dishes and drinks simultaneously instead of 2!',
    purchased: false,
    apply: (game) => {
      game.chef.maxCarried = 3;
    }
  },
  {
    id: 'faster_woks',
    name: 'Mamak High-Pressure Burners',
    cost: 150,
    icon: '🔥',
    description: 'Increases cooking and stir-fry speed by +30% on all woks and griddles!',
    purchased: false,
    apply: (game) => {
      game.kitchen.speedMultiplier = 1.35;
    }
  },
  {
    id: 'kasut_getah',
    name: 'Kasut Getah Chef Sneakers',
    cost: 180,
    icon: '👟',
    description: 'Permanent +25% movement speed boost across the entire Kopitiam kitchen!',
    purchased: false,
    apply: (game) => {
      game.chef.speed = game.chef.baseSpeed * 1.25;
    }
  },
  {
    id: 'marble_tables',
    name: 'Vintage Kopitiam Marble Tables',
    cost: 200,
    icon: '🪑',
    description: 'Customers love the cozy ambiance, increasing starting patience by +25%!',
    purchased: false,
    apply: (game) => {
      game.customers.tables.forEach(t => {
        t.patienceBoost = 1.25;
      });
    }
  },
  {
    id: 'turbo_drinks',
    name: 'Turbo Teh Tarik & Kopi Taps',
    cost: 120,
    icon: '☕',
    description: 'Pours Teh Tarik, Kopi Peng, and Milo Dinosaur with lightning speed!',
    purchased: false,
    apply: (game) => {
      // Applied in kitchen drink taps
    }
  }
];

export class UpgradeManager {
  constructor(game) {
    this.game = game;
    this.upgrades = UPGRADES;
  }

  isPurchased(upgradeId) {
    const up = this.upgrades.find(u => u.id === upgradeId);
    return up ? up.purchased : false;
  }

  purchase(upgradeId) {
    const up = this.upgrades.find(u => u.id === upgradeId);
    if (!up || up.purchased) return false;

    if (this.game.totalCoins >= up.cost) {
      this.game.totalCoins -= up.cost;
      up.purchased = true;
      up.apply(this.game);
      return true;
    }
    return false;
  }
}
