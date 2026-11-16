/**
 * Malaysian Cooking Dash — Kitchen Workstations & Appliance Logic
 * Manages Woks, Fryer, Griddle, Grill, Pot, Drink Bar, Plating Counter, Sink, and Trash.
 */

import { RECIPES, DRINKS, TREATS } from './config.js';
import { audio } from './audio.js';

export class KitchenManager {
  constructor(particleSystem) {
    this.particles = particleSystem;
    this.antiBurnActive = false;
    this.speedMultiplier = 1.0;

    // Workstation definitions with coordinates mapped to the Kopitiam kitchen layout
    this.stations = {
      wok_1: {
        id: 'wok_1',
        type: 'wok',
        label: 'Wok 1 (Char Kway Teow)',
        recipeId: 'char_kway_teow',
        x: 480,
        y: 190,
        w: 64,
        h: 60,
        state: 'idle', // idle, cooking, ready, burnt
        progress: 0,
        cookTime: 4000,
        burnTime: 6500,
        timer: 0,
        burnWarningPlayed: false
      },
      wok_2: {
        id: 'wok_2',
        type: 'wok',
        label: 'Wok 2 (Mee Goreng)',
        recipeId: 'mee_goreng',
        x: 560,
        y: 190,
        w: 64,
        h: 60,
        state: 'idle',
        progress: 0,
        cookTime: 4000,
        burnTime: 6500,
        timer: 0,
        burnWarningPlayed: false
      },
      fryer: {
        id: 'fryer',
        type: 'fryer',
        label: 'Fryer (Ayam Goreng)',
        recipeId: 'nasi_lemak',
        x: 640,
        y: 190,
        w: 64,
        h: 60,
        state: 'idle',
        progress: 0,
        cookTime: 3800,
        burnTime: 6500,
        timer: 0,
        burnWarningPlayed: false
      },
      griddle: {
        id: 'griddle',
        type: 'griddle',
        label: 'Griddle (Roti Canai)',
        recipeId: 'roti_canai',
        altRecipeId: 'roti_telur',
        x: 720,
        y: 190,
        w: 64,
        h: 60,
        state: 'idle',
        progress: 0,
        cookTime: 3600,
        burnTime: 6500,
        timer: 0,
        burnWarningPlayed: false
      },
      grill: {
        id: 'grill',
        type: 'griddle',
        label: 'Charcoal Grill (Satay)',
        recipeId: 'satay_skewers',
        x: 800,
        y: 190,
        w: 64,
        h: 60,
        state: 'idle',
        progress: 0,
        cookTime: 4500,
        burnTime: 6500,
        timer: 0,
        burnWarningPlayed: false
      },
      pot: {
        id: 'pot',
        type: 'wok',
        label: 'Soup Pot (Laksa)',
        recipeId: 'curry_laksa',
        x: 880,
        y: 190,
        w: 64,
        h: 60,
        state: 'idle',
        progress: 0,
        cookTime: 4200,
        burnTime: 7000,
        timer: 0,
        burnWarningPlayed: false
      },
      drink_teh: {
        id: 'drink_teh',
        type: 'drink',
        drinkId: 'teh_tarik',
        label: 'Teh Tarik',
        x: 480,
        y: 280,
        w: 60,
        h: 54,
        state: 'ready',
        progress: 1
      },
      drink_kopi: {
        id: 'drink_kopi',
        type: 'drink',
        drinkId: 'kopi_peng',
        label: 'Kopi Peng',
        x: 550,
        y: 280,
        w: 60,
        h: 54,
        state: 'ready',
        progress: 1
      },
      drink_milo: {
        id: 'drink_milo',
        type: 'drink',
        drinkId: 'milo_dinosaur',
        label: 'Milo Dino',
        x: 620,
        y: 280,
        w: 60,
        h: 54,
        state: 'ready',
        progress: 1
      },
      drink_bandung: {
        id: 'drink_bandung',
        type: 'drink',
        drinkId: 'sirap_bandung',
        label: 'Bandung',
        x: 690,
        y: 280,
        w: 60,
        h: 54,
        state: 'ready',
        progress: 1
      },
      treat_karipap: {
        id: 'treat_karipap',
        type: 'treat',
        treatId: 'karipap',
        label: 'Karipap',
        x: 770,
        y: 280,
        w: 54,
        h: 54,
        stock: 5
      },
      treat_kuih: {
        id: 'treat_kuih',
        type: 'treat',
        treatId: 'kuih_lapis',
        label: 'Kuih Lapis',
        x: 830,
        y: 280,
        w: 54,
        h: 54,
        stock: 5
      },
      sink: {
        id: 'sink',
        type: 'sink',
        label: 'Wash Basin',
        x: 900,
        y: 280,
        w: 64,
        h: 54,
        platesWashed: 0
      },
      trash: {
        id: 'trash',
        type: 'trash',
        label: 'Tong Sampah',
        x: 970,
        y: 280,
        w: 50,
        h: 54
      }
    };
  }

  // Configure which stations are unlocked for current level
  setupForLevel(levelConfig) {
    const availableRecipes = new Set(levelConfig.availableRecipes);
    const availableDrinks = new Set(levelConfig.availableDrinks);

    for (const [key, station] of Object.entries(this.stations)) {
      station.state = 'idle';
      station.progress = 0;
      station.timer = 0;
      station.burnWarningPlayed = false;

      // Lock / unlock based on level recipe list
      if (station.recipeId) {
        station.unlocked = availableRecipes.has(station.recipeId) ||
          (station.altRecipeId && availableRecipes.has(station.altRecipeId));
      } else if (station.drinkId) {
        station.unlocked = availableDrinks.has(station.drinkId);
        station.state = 'ready';
      } else {
        station.unlocked = true;
      }
    }
  }

  // Start cooking on a station
  startCooking(stationId, recipeIdOverride = null) {
    const s = this.stations[stationId];
    if (!s || !s.unlocked) return false;
    if (s.state !== 'idle') return false;

    s.state = 'cooking';
    s.timer = 0;
    s.progress = 0;
    s.currentRecipeId = recipeIdOverride || s.recipeId;
    s.burnWarningPlayed = false;
    audio.playSizzle();
    return true;
  }

  // Instant Cook skill booster (Api Besar)
  triggerInstantCook() {
    let triggered = false;
    for (const s of Object.values(this.stations)) {
      if (s.state === 'cooking') {
        s.state = 'ready';
        s.progress = 0;
        s.timer = 0;
        triggered = true;
        this.particles.addSparkles(s.x, s.y, 12);
      }
    }
    if (triggered) {
      audio.playReadyDing();
    }
  }

  // Update loop for all stations
  update(dtMs) {
    for (const s of Object.values(this.stations)) {
      if (!s.unlocked) continue;

      if (s.state === 'cooking') {
        s.timer += dtMs * this.speedMultiplier;
        const totalCook = s.cookTime;
        s.progress = Math.min(1.0, s.timer / totalCook);

        // Emit cooking steam
        if (Math.random() < 0.25) {
          this.particles.addSteam(s.x, s.y - 10);
        }

        if (s.timer >= totalCook) {
          s.state = 'ready';
          s.timer = 0;
          s.progress = 0;
          audio.playReadyDing();
          this.particles.addSparkles(s.x, s.y - 12, 6);
        }
      } else if (s.state === 'ready') {
        // If anti-burn is active, food never burns!
        if (!this.antiBurnActive) {
          s.timer += dtMs;
          s.progress = Math.min(1.0, s.timer / s.burnTime);

          // Overheat warning (starts smoking and playing alarm)
          if (s.progress > 0.65) {
            this.particles.addBurnSmoke(s.x, s.y - 12);
            if (!s.burnWarningPlayed || s.timer % 800 < 50) {
              audio.playBurnAlarm();
              s.burnWarningPlayed = true;
            }
          }

          if (s.timer >= s.burnTime) {
            s.state = 'burnt';
            s.progress = 1.0;
            audio.playBurnt();
            this.particles.addFloatingText(s.x, s.y - 20, 'BURNT!', '#EF4444', 14);
          }
        }
      }
    }
  }

  // Chef picks up dish from station
  pickupFromStation(stationId) {
    const s = this.stations[stationId];
    if (!s) return null;

    if (s.state === 'ready') {
      const item = {
        type: 'dish',
        id: s.currentRecipeId || s.recipeId
      };
      s.state = 'idle';
      s.progress = 0;
      s.timer = 0;
      s.currentRecipeId = null;
      return item;
    } else if (s.state === 'burnt') {
      const item = {
        type: 'dish',
        id: s.currentRecipeId || s.recipeId,
        burnt: true
      };
      s.state = 'idle';
      s.progress = 0;
      s.timer = 0;
      s.currentRecipeId = null;
      return item;
    } else if (s.type === 'drink') {
      // Pick up drink
      audio.playDrinkPour();
      return {
        type: 'drink',
        id: s.drinkId
      };
    } else if (s.type === 'treat') {
      if (s.stock > 0) {
        s.stock--;
        audio.playClick();
        return {
          type: 'treat',
          id: s.treatId
        };
      }
    }
    return null;
  }
}
