/**
 * Malaysian Cooking Dash — Skills & Booster System
 * Implements the 5 classic Cooking Dash power-ups with cooldowns, active durations,
 * sound effects, and visual triggers.
 */

import { SKILLS } from './config.js';
import { audio } from './audio.js';

export class SkillManager {
  constructor(kitchenManager, customerManager, chef, particleSystem) {
    this.kitchen = kitchenManager;
    this.customers = customerManager;
    this.chef = chef;
    this.particles = particleSystem;

    this.states = {};
    for (const [key, skill] of Object.entries(SKILLS)) {
      this.states[key] = {
        id: key,
        name: skill.name,
        icon: skill.icon,
        duration: skill.duration,
        cooldown: skill.cooldown,
        activeTimer: 0,
        cooldownTimer: 0,
        isActive: false
      };
    }
  }

  // Trigger a skill booster
  activateSkill(skillId) {
    const s = this.states[skillId];
    if (!s || s.cooldownTimer > 0) return false;

    s.cooldownTimer = s.cooldown;
    audio.playSkillActivation();

    if (skillId === 'speed_shoes') {
      s.isActive = true;
      s.activeTimer = s.duration;
      this.chef.speedBuffActive = true;
      this.particles.addFloatingText(this.chef.x, this.chef.y - 30, '⚡ KASUT LAJU!', '#FBBF24', 18);
    } else if (skillId === 'anti_burn') {
      s.isActive = true;
      s.activeTimer = s.duration;
      this.kitchen.antiBurnActive = true;
      this.particles.addFloatingText(550, 160, '🛡️ WOK EMAS!', '#F59E0B', 18);
    } else if (skillId === 'fast_cook') {
      this.kitchen.triggerInstantCook();
      this.particles.addFloatingText(550, 160, '🔥 API BESAR!', '#EF4444', 18);
    } else if (skillId === 'happy_hour') {
      this.customers.restoreAllPatience();
      this.particles.addFloatingText(200, 200, '🎵 LAGU P. RAMLEE!', '#10B981', 18);
    } else if (skillId === 'coin_fever') {
      s.isActive = true;
      s.activeTimer = s.duration;
      this.particles.addFloatingText(200, 200, '💰 DEMAM UNTUNG 2X!', '#F59E0B', 18);
    }

    return true;
  }

  isCoinFeverActive() {
    return this.states['coin_fever'] && this.states['coin_fever'].isActive;
  }

  update(dtMs) {
    for (const s of Object.values(this.states)) {
      // Cooldown timer
      if (s.cooldownTimer > 0) {
        s.cooldownTimer = Math.max(0, s.cooldownTimer - dtMs);
      }

      // Active duration timer
      if (s.isActive) {
        s.activeTimer -= dtMs;
        if (s.activeTimer <= 0) {
          s.isActive = false;

          // Revert effects
          if (s.id === 'speed_shoes') {
            this.chef.speedBuffActive = false;
          } else if (s.id === 'anti_burn') {
            this.kitchen.antiBurnActive = false;
          }
        }
      }
    }
  }

  // Reset skills on level restart
  reset() {
    for (const s of Object.values(this.states)) {
      s.activeTimer = 0;
      s.cooldownTimer = 0;
      s.isActive = false;
    }
    this.chef.speedBuffActive = false;
    this.kitchen.antiBurnActive = false;
  }
}
