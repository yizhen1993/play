/**
 * Malaysian Cooking Dash — Chef Entity & Action Queue System
 * Handles movement, pathing, action queueing, carrying capacity, and task execution.
 */

import { audio } from './audio.js';

export class Chef {
  constructor(x = 600, y = 350) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.baseSpeed = 260; // pixels per second
    this.speed = this.baseSpeed;
    this.speedBuffActive = false;

    this.maxCarried = 2; // Upgradable to 3 in shop
    this.carriedItems = []; // [{ type: 'dish'|'drink'|'treat'|'dirty_plate', id, burnt }]

    this.actionQueue = []; // [{ type, targetX, targetY, stationId, tableId, callback }]
    this.isWalking = false;
    this.facing = 1; // 1 = right, -1 = left
    this.walkFrame = 0;
  }

  // Add an action to the queue
  queueAction(action) {
    this.actionQueue.push(action);
    audio.playClick();
  }

  // Clear pending actions
  clearQueue() {
    this.actionQueue = [];
  }

  // Check if chef has capacity to pick up another item
  canCarryMore() {
    return this.carriedItems.length < this.maxCarried;
  }

  // Pick up an item
  pickUp(item) {
    if (this.canCarryMore() && item) {
      this.carriedItems.push(item);
      return true;
    }
    return false;
  }

  // Drop or deliver an item by predicate
  removeCarried(predicate) {
    const idx = this.carriedItems.findIndex(predicate);
    if (idx !== -1) {
      return this.carriedItems.splice(idx, 1)[0];
    }
    return null;
  }

  // Has dirty plates
  hasDirtyPlates() {
    return this.carriedItems.some(i => i.type === 'dirty_plate');
  }

  // Has burnt food
  hasBurntFood() {
    return this.carriedItems.some(i => i.burnt);
  }

  update(dtMs) {
    const dt = dtMs / 1000;
    const currentSpeed = this.speedBuffActive ? this.speed * 1.7 : this.speed;

    if (this.actionQueue.length > 0) {
      const currentAction = this.actionQueue[0];
      const dx = currentAction.targetX - this.x;
      const dy = currentAction.targetY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 6) {
        // Move towards target
        this.isWalking = true;
        this.walkFrame += dt;
        const moveDist = Math.min(dist, currentSpeed * dt);
        this.x += (dx / dist) * moveDist;
        this.y += (dy / dist) * moveDist;

        if (dx > 2) this.facing = 1;
        else if (dx < -2) this.facing = -1;
      } else {
        // Arrived at action target!
        this.x = currentAction.targetX;
        this.y = currentAction.targetY;
        this.isWalking = false;

        // Execute action callback
        if (currentAction.callback) {
          currentAction.callback();
        }

        // Shift next action
        this.actionQueue.shift();
      }
    } else {
      this.isWalking = false;
    }
  }

  render(ctx) {
    // Render action queue path markers
    if (this.actionQueue.length > 0) {
      ctx.save();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      this.actionQueue.forEach(act => {
        ctx.lineTo(act.targetX, act.targetY);
      });
      ctx.stroke();

      // Draw click waypoint targets
      this.actionQueue.forEach(act => {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(act.targetX, act.targetY, 6, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }
  }
}
