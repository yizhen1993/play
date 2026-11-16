/**
 * Malaysian Cooking Dash — Customer State Machine & Table Management
 * Handles arrival, seating, patience meters, ordering, eating, tipping, and departure.
 */

import { CUSTOMER_TYPES, RECIPES, DRINKS, TREATS } from './config.js';
import { audio } from './audio.js';

export class Table {
  constructor(id, x, y, number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.number = number;
    this.radius = 50;
    this.customer = null;
    this.hasDirtyPlate = false;
    this.coinAmount = 0;
  }

  isAvailable() {
    return this.customer === null && !this.hasDirtyPlate && this.coinAmount === 0;
  }
}

export class Customer {
  constructor(id, archetype, targetLevelConfig) {
    this.id = id;
    this.archetype = archetype;
    this.type = archetype.id;
    this.name = archetype.name;
    this.eatTime = archetype.eatTime;

    this.maxPatience = archetype.patience;
    this.patience = this.maxPatience;
    this.decayRate = archetype.decayRate * (targetLevelConfig.customerPatienceRate || 1.0);
    this.tipMultiplier = archetype.tipMultiplier;

    // States: 'queue', 'walking_to_table', 'thinking', 'waiting_food', 'eating', 'leaving_happy', 'leaving_angry'
    this.state = 'queue';
    this.x = 80;
    this.y = 480;
    this.targetX = this.x;
    this.targetY = this.y;

    this.table = null;
    this.order = null; // { recipeId, drinkId, dishDelivered: false, drinkDelivered: false }
    this.timer = 0;
    this.mood = 'normal';
  }

  // Generate random order based on available recipes and drinks in the current level
  generateOrder(availableRecipes, availableDrinks) {
    const recipeId = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
    let drinkId = null;
    // 50% chance customer also wants a drink if drinks are unlocked
    if (availableDrinks && availableDrinks.length > 0 && Math.random() < 0.6) {
      drinkId = availableDrinks[Math.floor(Math.random() * availableDrinks.length)];
    }

    this.order = {
      recipeId,
      drinkId,
      dishDelivered: false,
      drinkDelivered: drinkId === null ? true : false
    };
  }

  // Restore patience when served a treat (Karipap / Kuih Lapis)
  feedTreat(treatId) {
    const treat = TREATS[treatId];
    if (!treat) return;
    const boost = (treat.patienceRestore / 100) * this.maxPatience;
    this.patience = Math.min(this.maxPatience, this.patience + boost);
    this.mood = 'happy';
  }

  // Fully restore patience to 100% (Lagu P. Ramlee skill)
  maxOutPatience() {
    this.patience = this.maxPatience;
    this.mood = 'happy';
  }

  getPatiencePercent() {
    return Math.max(0, this.patience / this.maxPatience);
  }

  update(dtMs, onLeaveAngry, onFinishEating) {
    const dtSec = dtMs / 1000;

    // Movement interpolation
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 4) {
      const move = Math.min(dist, 160 * dtSec);
      this.x += (dx / dist) * move;
      this.y += (dy / dist) * move;
    } else {
      this.x = this.targetX;
      this.y = this.targetY;
    }

    // State behavior
    if (this.state === 'queue') {
      // Patience decays slower in queue
      this.patience -= 4.0 * dtSec * this.decayRate;
      if (this.patience <= 0) {
        this.state = 'leaving_angry';
        audio.playCustomerAngry();
        if (onLeaveAngry) onLeaveAngry(this);
      }
    } else if (this.state === 'walking_to_table') {
      if (dist <= 4) {
        this.state = 'thinking';
        this.timer = 2000; // 2 seconds to decide order
      }
    } else if (this.state === 'thinking') {
      this.timer -= dtMs;
      if (this.timer <= 0) {
        this.state = 'waiting_food';
      }
    } else if (this.state === 'waiting_food') {
      this.patience -= 6.5 * dtSec * this.decayRate;

      if (this.patience <= 0) {
        this.state = 'leaving_angry';
        audio.playCustomerAngry();
        if (this.table) {
          this.table.customer = null;
          this.table = null;
        }
        if (onLeaveAngry) onLeaveAngry(this);
      }
    } else if (this.state === 'eating') {
      this.timer -= dtMs;
      if (this.timer <= 0) {
        // Finished eating! Leaves coins & dirty plate
        if (this.table) {
          const recipe = RECIPES[this.order.recipeId];
          const drink = this.order.drinkId ? DRINKS[this.order.drinkId] : null;

          let earned = (recipe ? recipe.basePrice : 10) + (drink ? drink.price : 0);
          // Tip bonus proportional to remaining patience hearts
          const tipPercent = this.getPatiencePercent();
          const tip = Math.round(earned * 0.4 * tipPercent * this.tipMultiplier);
          const totalCoin = earned + tip;

          this.table.coinAmount = totalCoin;
          this.table.hasDirtyPlate = true;
          this.table.customer = null;
        }

        this.state = 'leaving_happy';
        this.targetX = -60;
        this.targetY = 480;
        audio.playServeHappy();
        if (onFinishEating) onFinishEating(this);
      }
    } else if (this.state === 'leaving_angry' || this.state === 'leaving_happy') {
      this.targetX = -60;
      this.targetY = 480;
    }
  }
}

export class CustomerManager {
  constructor(particleSystem) {
    this.particles = particleSystem;
    this.tables = [
      new Table('table_1', 140, 160, 1),
      new Table('table_2', 280, 160, 2),
      new Table('table_3', 140, 320, 3),
      new Table('table_4', 280, 320, 4)
    ];

    this.queue = [];
    this.activeCustomers = [];
    this.spawnTimer = 0;
    this.spawnInterval = 6000;
    this.currentLevelConfig = null;
  }

  setupForLevel(levelConfig) {
    this.currentLevelConfig = levelConfig;
    this.spawnInterval = levelConfig.customerSpawnInterval || 6000;
    this.spawnTimer = 2000; // First customer spawns shortly after start
    this.queue = [];
    this.activeCustomers = [];
    this.tables.forEach(t => {
      t.customer = null;
      t.hasDirtyPlate = false;
      t.coinAmount = 0;
    });
  }

  // Spawn a new customer into the waiting line
  spawnCustomer() {
    if (this.queue.length >= 4) return; // Queue full

    const randomArchetype = CUSTOMER_TYPES[Math.floor(Math.random() * CUSTOMER_TYPES.length)];
    const custId = 'cust_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const customer = new Customer(custId, randomArchetype, this.currentLevelConfig);
    customer.generateOrder(this.currentLevelConfig.availableRecipes, this.currentLevelConfig.availableDrinks);

    // Queue position
    const qIndex = this.queue.length;
    customer.targetX = 60 + qIndex * 46;
    customer.targetY = 470;
    customer.x = customer.targetX;
    customer.y = customer.targetY;

    this.queue.push(customer);
    this.activeCustomers.push(customer);
  }

  // Seat customer at an available table
  seatCustomerAtTable(table) {
    if (this.queue.length === 0 || !table.isAvailable()) return false;

    const customer = this.queue.shift();
    // Shift remaining queue forward
    this.queue.forEach((c, idx) => {
      c.targetX = 60 + idx * 46;
      c.targetY = 470;
    });

    customer.table = table;
    table.customer = customer;
    customer.state = 'walking_to_table';
    customer.targetX = table.x;
    customer.targetY = table.y;
    audio.playClick();
    return true;
  }

  // Auto seat next waiting customer if table clicked
  seatNextAvailable(tableId) {
    const table = this.tables.find(t => t.id === tableId);
    if (!table || !table.isAvailable()) return false;
    return this.seatCustomerAtTable(table);
  }

  // Find table at coordinates (x, y)
  getTableAt(x, y) {
    return this.tables.find(t => Math.hypot(t.x - x, t.y - y) <= t.radius + 10);
  }

  update(dtMs, onLeaveAngry, onFinishEating) {
    // Spawn timer
    this.spawnTimer -= dtMs;
    if (this.spawnTimer <= 0) {
      this.spawnCustomer();
      this.spawnInterval = this.currentLevelConfig ? this.currentLevelConfig.customerSpawnInterval : 6000;
      this.spawnTimer = this.spawnInterval;
    }

    // Update customers
    for (let i = this.activeCustomers.length - 1; i >= 0; i--) {
      const cust = this.activeCustomers[i];
      cust.update(
        dtMs,
        (c) => {
          this.particles.addFloatingText(c.x, c.y - 20, 'ANGRY! -RM10', '#EF4444', 16);
          if (onLeaveAngry) onLeaveAngry(c);
        },
        (c) => {
          this.particles.addSparkles(c.x, c.y - 20, 10);
          if (onFinishEating) onFinishEating(c);
        }
      );

      // Remove customer once exited off screen
      if ((cust.state === 'leaving_happy' || cust.state === 'leaving_angry') && cust.x <= -40) {
        this.activeCustomers.splice(i, 1);
      }
    }
  }

  // Restore patience to all current customers (Lagu P. Ramlee skill)
  restoreAllPatience() {
    this.activeCustomers.forEach(c => {
      c.maxOutPatience();
      this.particles.addSparkles(c.x, c.y - 20, 8);
    });
  }
}
