/**
 * Malaysian Cooking Dash — Main Game Orchestrator & Loop
 * Connects Canvas rendering, Kitchen Stations, Chef, Customers, Skills, Audio, and UI.
 */

import { LEVELS, RECIPES, DRINKS, TREATS, SKILLS } from './config.js';
import { audio } from './audio.js';
import { TextureRenderer } from './textures.js';
import { ParticleSystem } from './particles.js';
import { KitchenManager } from './kitchen.js';
import { Chef } from './chef.js';
import { CustomerManager } from './customer.js';
import { SkillManager } from './skills.js';
import { UpgradeManager } from './upgrades.js';
import { UIManager } from './ui.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.width = 1040;
    this.height = 580;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.particles = new ParticleSystem();
    this.kitchen = new KitchenManager(this.particles);
    this.chef = new Chef(520, 360);
    this.customers = new CustomerManager(this.particles);
    this.skills = new SkillManager(this.kitchen, this.customers, this.chef, this.particles);
    this.upgrades = new UpgradeManager(this);
    this.ui = new UIManager(this);

    this.currentLevelIndex = 0;
    this.currentLevel = LEVELS[0];
    this.levelScore = 0;
    this.totalCoins = 0;
    this.timeRemaining = 120;
    this.comboCount = 0;
    this.comboTimer = 0;

    this.gameState = 'menu'; // 'playing', 'paused', 'ended', 'menu'
    this.lastTime = 0;

    this.initEvents();
    this.loadProfile();
  }

  // Load player saved progress
  async loadProfile() {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.totalCoins) this.totalCoins = data.totalCoins;
        if (data.currentLevel) this.currentLevelIndex = data.currentLevel;
      }
    } catch (e) {
      console.log('Using local profile');
    }
  }

  // Save player progress
  async saveProfile() {
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalCoins: this.totalCoins,
          currentLevel: this.currentLevelIndex
        })
      });
    } catch (e) {
      // Offline fallback
    }
  }

  // Start a specific level
  startLevel(levelIndex = 0) {
    this.currentLevelIndex = Math.min(LEVELS.length - 1, Math.max(0, levelIndex));
    this.currentLevel = LEVELS[this.currentLevelIndex];

    this.levelScore = 0;
    this.timeRemaining = this.currentLevel.timeLimit;
    this.comboCount = 0;
    this.comboTimer = 0;

    this.chef.carriedItems = [];
    this.chef.clearQueue();
    this.chef.x = 520;
    this.chef.y = 360;

    this.particles.clear();
    this.kitchen.setupForLevel(this.currentLevel);
    this.customers.setupForLevel(this.currentLevel);
    this.skills.reset();

    this.gameState = 'playing';
    audio.ensureContext();
    audio.playClick();
  }

  initEvents() {
    // Canvas click handling
    this.canvas.addEventListener('pointerdown', (e) => {
      if (this.gameState !== 'playing') return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      this.handleClick(clickX, clickY);
    });

    // Keyboard shortcuts (1-5 for skills, M for mute)
    window.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '5') {
        const skillKeys = ['speed_shoes', 'anti_burn', 'fast_cook', 'happy_hour', 'coin_fever'];
        const selected = skillKeys[parseInt(e.key) - 1];
        if (selected) this.skills.activateSkill(selected);
      } else if (e.key === 'm' || e.key === 'M') {
        const isMuted = audio.toggleMute();
        if (this.ui.btnMute) {
          this.ui.btnMute.textContent = isMuted ? '🔇 Unmute' : '🔊 Sound ON';
        }
      }
    });

    // Top Level Select Button
    const btnLevelSelect = document.getElementById('btn-open-levels');
    if (btnLevelSelect) {
      btnLevelSelect.addEventListener('click', () => {
        this.ui.openLevelSelect();
      });
    }

    // Modal Action Buttons
    const btnRecapNext = document.getElementById('btn-recap-next');
    if (btnRecapNext) {
      btnRecapNext.addEventListener('click', () => {
        this.ui.hideModals();
        if (this.currentLevelIndex + 1 < LEVELS.length) {
          this.startLevel(this.currentLevelIndex + 1);
        } else {
          this.startLevel(0); // Loop back or festival victory
        }
      });
    }

    const btnRecapReplay = document.getElementById('btn-recap-replay');
    if (btnRecapReplay) {
      btnRecapReplay.addEventListener('click', () => {
        this.ui.hideModals();
        this.startLevel(this.currentLevelIndex);
      });
    }
  }

  // Route user click coordinates to kitchen appliances, tables, or chef queue
  handleClick(clickX, clickY) {
    // 1. Check Tables
    for (const table of this.customers.tables) {
      if (Math.hypot(table.x - clickX, table.y - clickY) <= table.radius + 15) {
        this.handleTableClick(table);
        return;
      }
    }

    // 2. Check Customer Waiting Queue (click customer to seat at first available table)
    if (clickX <= 220 && clickY >= 430 && clickY <= 520) {
      for (const table of this.customers.tables) {
        if (table.isAvailable()) {
          this.customers.seatCustomerAtTable(table);
          return;
        }
      }
    }

    // 3. Check Kitchen Workstations
    for (const [id, station] of Object.entries(this.kitchen.stations)) {
      if (!station.unlocked) continue;
      const left = station.x - station.w / 2;
      const right = station.x + station.w / 2;
      const top = station.y - station.h / 2;
      const bottom = station.y + station.h / 2;

      if (clickX >= left && clickX <= right && clickY >= top && clickY <= bottom) {
        this.handleStationClick(station);
        return;
      }
    }
  }

  // Handle click on a Dining Table
  handleTableClick(table) {
    // A. Table is empty and we have customers in queue -> Seat next customer!
    if (table.isAvailable()) {
      if (this.customers.queue.length > 0) {
        this.customers.seatCustomerAtTable(table);
        return;
      }
    }

    // B. Table has dirty plates & coins left by finished customer -> Uncle Chef collects!
    if (table.hasDirtyPlate && table.coinAmount > 0) {
      this.chef.queueAction({
        type: 'collect_table',
        targetX: table.x + 30,
        targetY: table.y,
        callback: () => {
          // Double tips skill check
          const multiplier = this.skills.isCoinFeverActive() ? 2 : 1;
          const comboBonus = this.comboCount * 5;
          const finalCoins = table.coinAmount * multiplier + comboBonus;

          this.levelScore += finalCoins;
          this.totalCoins += finalCoins;
          this.comboCount++;
          this.comboTimer = 7000; // 7 seconds combo window

          this.particles.addFloatingText(table.x, table.y - 15, `+RM ${finalCoins}!`, '#F59E0B', 18);
          this.particles.addSparkles(table.x, table.y - 15, 10);
          audio.playKaChing();

          table.coinAmount = 0;

          // Uncle Chef picks up dirty plate
          if (this.chef.canCarryMore()) {
            this.chef.pickUp({ type: 'dirty_plate', id: 'dirty_plate' });
            table.hasDirtyPlate = false;
          }
        }
      });
      return;
    }

    // C. Table has an active customer waiting for food
    if (table.customer && table.customer.state === 'waiting_food') {
      const cust = table.customer;
      const order = cust.order;

      // Check if Chef is carrying customer's requested treat
      const treatIndex = this.chef.carriedItems.findIndex(i => i.type === 'treat');
      if (treatIndex !== -1) {
        const treatItem = this.chef.carriedItems[treatIndex];
        this.chef.queueAction({
          type: 'serve_treat',
          targetX: table.x + 30,
          targetY: table.y,
          callback: () => {
            const removed = this.chef.removeCarried(i => i === treatItem);
            if (removed) {
              cust.feedTreat(removed.id);
              audio.playServeHappy();
              this.particles.addFloatingText(table.x, table.y - 20, '❤️ PATIENCE UP!', '#10B981', 16);
            }
          }
        });
        return;
      }

      // Check if Chef is carrying ordered dish or drink
      const hasDish = !order.dishDelivered && this.chef.carriedItems.some(i => i.type === 'dish' && i.id === order.recipeId && !i.burnt);
      const hasDrink = order.drinkId && !order.drinkDelivered && this.chef.carriedItems.some(i => i.type === 'drink' && i.id === order.drinkId);

      if (hasDish || hasDrink) {
        this.chef.queueAction({
          type: 'deliver_order',
          targetX: table.x + 30,
          targetY: table.y,
          callback: () => {
            if (hasDish) {
              this.chef.removeCarried(i => i.type === 'dish' && i.id === order.recipeId && !i.burnt);
              order.dishDelivered = true;
              audio.playServeHappy();
              this.particles.addSparkles(table.x, table.y - 10, 8);
            }
            if (hasDrink) {
              this.chef.removeCarried(i => i.type === 'drink' && i.id === order.drinkId);
              order.drinkDelivered = true;
              audio.playServeHappy();
              this.particles.addSparkles(table.x, table.y - 10, 8);
            }

            // If all food delivered, customer starts eating!
            if (order.dishDelivered && (order.drinkId === null || order.drinkDelivered)) {
              cust.state = 'eating';
              cust.timer = cust.eatTime;
            }
          }
        });
      }
    }
  }

  // Handle click on Kitchen Station
  handleStationClick(station) {
    // 1. Trash Can
    if (station.type === 'trash') {
      if (this.chef.hasBurntFood() || this.chef.carriedItems.length > 0) {
        this.chef.queueAction({
          type: 'trash_item',
          targetX: station.x - 20,
          targetY: station.y + 40,
          callback: () => {
            // Drop burnt dish first, or top dish
            const burntIdx = this.chef.carriedItems.findIndex(i => i.burnt);
            if (burntIdx !== -1) {
              this.chef.carriedItems.splice(burntIdx, 1);
            } else if (this.chef.carriedItems.length > 0) {
              this.chef.carriedItems.pop();
            }
            audio.playBurnt();
            this.particles.addFloatingText(station.x, station.y - 20, 'DISCARDED', '#94A3B8', 12);
          }
        });
      }
      return;
    }

    // 2. Sink Wash Basin
    if (station.type === 'sink') {
      if (this.chef.hasDirtyPlates()) {
        this.chef.queueAction({
          type: 'wash_plates',
          targetX: station.x - 20,
          targetY: station.y + 40,
          callback: () => {
            while (this.chef.hasDirtyPlates()) {
              this.chef.removeCarried(i => i.type === 'dirty_plate');
              station.platesWashed++;
              this.levelScore += 5; // Clean dish bonus!
              this.totalCoins += 5;
            }
            audio.playKaChing();
            this.particles.addSparkles(station.x, station.y - 10, 8);
            this.particles.addFloatingText(station.x, station.y - 20, '+RM 5 CLEAN!', '#10B981', 14);
          }
        });
      }
      return;
    }

    // 3. Drink Dispensers
    if (station.type === 'drink') {
      if (this.chef.canCarryMore()) {
        this.chef.queueAction({
          type: 'dispense_drink',
          targetX: station.x,
          targetY: station.y + 50,
          callback: () => {
            const item = this.kitchen.pickupFromStation(station.id);
            if (item) {
              this.chef.pickUp(item);
            }
          }
        });
      }
      return;
    }

    // 4. Treat Trays (Karipap / Kuih Lapis)
    if (station.type === 'treat') {
      if (this.chef.canCarryMore() && station.stock > 0) {
        this.chef.queueAction({
          type: 'grab_treat',
          targetX: station.x,
          targetY: station.y + 50,
          callback: () => {
            const item = this.kitchen.pickupFromStation(station.id);
            if (item) {
              this.chef.pickUp(item);
            }
          }
        });
      }
      return;
    }

    // 5. Cooking Appliances (Woks, Fryer, Griddle, Grill, Pot)
    if (station.state === 'idle') {
      // Start cooking immediately
      this.kitchen.startCooking(station.id);
    } else if (station.state === 'ready' || station.state === 'burnt') {
      // Pick up prepared dish
      if (this.chef.canCarryMore()) {
        this.chef.queueAction({
          type: 'pickup_dish',
          targetX: station.x,
          targetY: station.y + 55,
          callback: () => {
            const item = this.kitchen.pickupFromStation(station.id);
            if (item) {
              this.chef.pickUp(item);
              if (item.burnt) {
                this.particles.addFloatingText(this.chef.x, this.chef.y - 20, 'BURNT DISH!', '#EF4444', 13);
              }
            }
          }
        });
      }
    }
  }

  update(dtMs) {
    if (this.gameState !== 'playing') return;

    const dtSec = dtMs / 1000;
    this.timeRemaining -= dtSec;

    // Combo countdown
    if (this.comboTimer > 0) {
      this.comboTimer -= dtMs;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }

    // Update subsystems
    this.chef.update(dtMs);
    this.kitchen.update(dtMs);
    this.customers.update(
      dtMs,
      // On customer leave angry
      () => {
        this.comboCount = 0;
        this.levelScore = Math.max(0, this.levelScore - 15);
      },
      // On customer finish eating
      () => {}
    );
    this.skills.update(dtMs);
    this.particles.update(dtSec);

    // Update HUD
    this.ui.updateHUD(
      this.levelScore,
      this.currentLevel.targetCoins,
      Math.max(0, this.timeRemaining),
      this.comboCount,
      this.totalCoins,
      this.currentLevelIndex
    );

    // Check level completion
    if (this.timeRemaining <= 0) {
      this.endLevel();
    }
  }

  endLevel() {
    this.gameState = 'ended';
    const isVictory = this.levelScore >= this.currentLevel.targetCoins;
    let stars = 0;
    if (isVictory) {
      stars = 1;
      if (this.levelScore >= this.currentLevel.targetCoins * 1.3) stars = 2;
      if (this.levelScore >= this.currentLevel.expertCoins) stars = 3;
      audio.playVictory();
    } else {
      audio.playBurnt();
    }

    this.saveProfile();
    this.ui.showLevelRecap(
      isVictory,
      this.levelScore,
      this.currentLevel.targetCoins,
      this.currentLevel.expertCoins,
      stars
    );
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Kopitiam Floor & Wainscoting
    TextureRenderer.drawKopitiamFloor(this.ctx, this.width, this.height);

    // 2. Draw Dining Tables
    for (const table of this.customers.tables) {
      TextureRenderer.drawDiningTable(this.ctx, table.x, table.y, table.radius, table.customer !== null);

      // Draw Dirty Plate on Table
      if (table.hasDirtyPlate) {
        TextureRenderer.drawCarriedMiniItem(this.ctx, table.x - 12, table.y - 8, { type: 'dirty_plate' });
      }

      // Draw Coins on Table
      if (table.coinAmount > 0) {
        TextureRenderer.drawCoinPile(this.ctx, table.x + 12, table.y - 6, table.coinAmount);
      }
    }

    // 3. Draw Workstations
    for (const station of Object.values(this.kitchen.stations)) {
      if (station.unlocked) {
        TextureRenderer.drawWorkstation(this.ctx, station);
      }
    }

    // 4. Draw Waiting Queue Sign
    this.ctx.fillStyle = '#065F46';
    TextureRenderer.roundRect(this.ctx, 15, 520, 230, 28, 5);
    this.ctx.fill();
    this.ctx.fillStyle = '#FEF08A';
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('⬇ ENTRANCE WAITING QUEUE ⬇', 130, 538);

    // 5. Draw Customers
    for (const cust of this.customers.activeCustomers) {
      TextureRenderer.drawCustomer(
        this.ctx,
        cust.x,
        cust.y,
        cust.type,
        cust.getPatiencePercent(),
        cust.order,
        cust.mood
      );

      // Draw Order Speech Bubble if seated and ordering/waiting
      if (cust.state === 'waiting_food' && cust.order) {
        TextureRenderer.drawOrderBubble(
          this.ctx,
          cust.x,
          cust.y - 50,
          cust.order.dishDelivered ? null : cust.order.recipeId,
          cust.order.drinkDelivered ? null : cust.order.drinkId
        );
      }
    }

    // 6. Draw Chef Action Queue Markers
    this.chef.render(this.ctx);

    // 7. Draw Uncle Chef
    TextureRenderer.drawChef(
      this.ctx,
      this.chef.x,
      this.chef.y,
      this.chef.facing,
      this.chef.isWalking,
      this.chef.walkFrame,
      this.chef.carriedItems,
      this.chef.speedBuffActive
    );

    // 8. Draw Particles & Floating Texts
    this.particles.render(this.ctx);
  }

  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dtMs = Math.min(64, timestamp - this.lastTime);
    this.lastTime = timestamp;

    this.update(dtMs);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  start() {
    this.startLevel(0);
    requestAnimationFrame((t) => this.loop(t));
  }
}

// Boot game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  window.__KOPIDASH_GAME__ = game;
  game.start();
});
