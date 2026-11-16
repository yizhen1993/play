/**
 * Malaysian Cooking Dash — User Interface & HUD Manager
 * Controls HUD bars, skills cooldown buttons, victory modals, shop modal, and menu guidebook.
 */

import { LEVELS, RECIPES, DRINKS, TREATS, SKILLS } from './config.js';
import { audio } from './audio.js';

export class UIManager {
  constructor(game) {
    this.game = game;

    // HUD Elements
    this.levelBadge = document.getElementById('hud-level');
    this.scoreText = document.getElementById('hud-score');
    this.targetText = document.getElementById('hud-target');
    this.timerText = document.getElementById('hud-timer');
    this.comboBadge = document.getElementById('hud-combo');
    this.totalCoinsText = document.getElementById('hud-total-coins');

    // Modals
    this.modalOverlay = document.getElementById('modal-overlay');
    this.recapModal = document.getElementById('recap-modal');
    this.shopModal = document.getElementById('shop-modal');
    this.menuModal = document.getElementById('menu-modal');
    this.levelSelectModal = document.getElementById('level-select-modal');

    // Audio Mute Button
    this.btnMute = document.getElementById('btn-mute');
    if (this.btnMute) {
      this.btnMute.addEventListener('click', () => {
        const isMuted = audio.toggleMute();
        this.btnMute.textContent = isMuted ? '🔇 Unmute' : '🔊 Sound ON';
      });
    }

    // Skills Container
    this.skillsContainer = document.getElementById('skills-bar');
    this.renderSkillsBar();
    this.setupShopUI();
    this.setupMenuUI();
  }

  updateHUD(score, targetScore, timeRemaining, combo, totalCoins, levelIndex) {
    if (this.levelBadge) {
      this.levelBadge.textContent = `Level ${levelIndex + 1}`;
    }
    if (this.scoreText) {
      this.scoreText.textContent = `RM ${score}`;
    }
    if (this.targetText) {
      this.targetText.textContent = `Goal: RM ${targetScore}`;
    }
    if (this.timerText) {
      const mins = Math.floor(timeRemaining / 60);
      const secs = Math.floor(timeRemaining % 60).toString().padStart(2, '0');
      this.timerText.textContent = `⏳ ${mins}:${secs}`;
    }
    if (this.comboBadge) {
      if (combo > 1) {
        this.comboBadge.style.display = 'inline-block';
        this.comboBadge.textContent = `🔥 ${combo}X COMBO!`;
      } else {
        this.comboBadge.style.display = 'none';
      }
    }
    if (this.totalCoinsText) {
      this.totalCoinsText.textContent = `💰 RM ${totalCoins}`;
    }

    // Update skills buttons cooldowns
    this.updateSkillsCooldowns();
  }

  renderSkillsBar() {
    if (!this.skillsContainer) return;
    this.skillsContainer.innerHTML = '';

    const skillKeys = Object.keys(SKILLS);
    skillKeys.forEach((key, idx) => {
      const skill = SKILLS[key];
      const btn = document.createElement('button');
      btn.className = 'skill-btn';
      btn.id = `skill-${key}`;
      btn.title = `${skill.name} (${idx + 1}): ${skill.description}`;
      btn.innerHTML = `
        <span class="skill-icon">${skill.icon}</span>
        <span class="skill-label">${skill.name.split(' ')[0]}</span>
        <span class="skill-key">[${idx + 1}]</span>
        <div class="skill-cooldown-overlay" id="cd-${key}"></div>
      `;

      btn.addEventListener('click', () => {
        this.game.skills.activateSkill(key);
      });

      this.skillsContainer.appendChild(btn);
    });
  }

  updateSkillsCooldowns() {
    if (!this.game.skills) return;

    for (const [key, state] of Object.entries(this.game.skills.states)) {
      const overlay = document.getElementById(`cd-${key}`);
      const btn = document.getElementById(`skill-${key}`);
      if (overlay && btn) {
        if (state.cooldownTimer > 0) {
          const pct = (state.cooldownTimer / state.cooldown) * 100;
          overlay.style.height = `${pct}%`;
          btn.classList.add('on-cooldown');
        } else {
          overlay.style.height = '0%';
          btn.classList.remove('on-cooldown');
        }

        if (state.isActive) {
          btn.classList.add('is-active-skill');
        } else {
          btn.classList.remove('is-active-skill');
        }
      }
    }
  }

  showLevelRecap(isVictory, score, targetScore, expertScore, stars) {
    if (!this.recapModal) return;
    this.modalOverlay.style.display = 'flex';
    this.recapModal.style.display = 'block';

    const titleEl = document.getElementById('recap-title');
    const starsEl = document.getElementById('recap-stars');
    const scoreEl = document.getElementById('recap-score');
    const goalEl = document.getElementById('recap-goal');
    const btnNext = document.getElementById('btn-recap-next');

    if (isVictory) {
      titleEl.textContent = '🎉 Level Complete! Tahniah! 🌟';
      titleEl.style.color = '#10B981';
      let starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
      starsEl.textContent = starStr;
      btnNext.style.display = 'inline-block';
    } else {
      titleEl.textContent = '⏰ Time Expired! Kopitiam Rush Failed';
      titleEl.style.color = '#EF4444';
      starsEl.textContent = '☆☆☆';
      btnNext.style.display = 'none';
    }

    scoreEl.textContent = `Earned: RM ${score}`;
    goalEl.textContent = `Target: RM ${targetScore} (Expert: RM ${expertScore})`;
  }

  hideModals() {
    if (this.modalOverlay) this.modalOverlay.style.display = 'none';
    if (this.recapModal) this.recapModal.style.display = 'none';
    if (this.shopModal) this.shopModal.style.display = 'none';
    if (this.menuModal) this.menuModal.style.display = 'none';
    if (this.levelSelectModal) this.levelSelectModal.style.display = 'none';
  }

  openShop() {
    this.hideModals();
    this.modalOverlay.style.display = 'flex';
    this.shopModal.style.display = 'block';
    this.renderShopItems();
  }

  setupShopUI() {
    const btnShop = document.getElementById('btn-open-shop');
    if (btnShop) {
      btnShop.addEventListener('click', () => {
        this.openShop();
      });
    }

    const btnCloseShop = document.getElementById('btn-close-shop');
    if (btnCloseShop) {
      btnCloseShop.addEventListener('click', () => {
        this.hideModals();
      });
    }
  }

  renderShopItems() {
    const list = document.getElementById('shop-items-list');
    if (!list) return;
    list.innerHTML = '';

    this.game.upgrades.upgrades.forEach(up => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      const isBought = up.purchased;

      card.innerHTML = `
        <div class="shop-icon">${up.icon}</div>
        <div class="shop-info">
          <div class="shop-name">${up.name}</div>
          <div class="shop-desc">${up.description}</div>
        </div>
        <div class="shop-action">
          ${isBought
            ? '<span class="badge-bought">✓ OWNED</span>'
            : `<button class="btn-buy" ${this.game.totalCoins < up.cost ? 'disabled' : ''}>RM ${up.cost}</button>`
          }
        </div>
      `;

      if (!isBought) {
        const btnBuy = card.querySelector('.btn-buy');
        btnBuy.addEventListener('click', () => {
          if (this.game.upgrades.purchase(up.id)) {
            audio.playKaChing();
            this.renderShopItems();
            this.updateHUD(
              this.game.levelScore,
              this.game.currentLevel.targetCoins,
              this.game.timeRemaining,
              this.game.comboCount,
              this.game.totalCoins,
              this.game.currentLevelIndex
            );
          }
        });
      }

      list.appendChild(card);
    });
  }

  openMenuGuide() {
    this.hideModals();
    this.modalOverlay.style.display = 'flex';
    this.menuModal.style.display = 'block';
  }

  setupMenuUI() {
    const btnMenu = document.getElementById('btn-open-menu');
    if (btnMenu) {
      btnMenu.addEventListener('click', () => {
        this.openMenuGuide();
      });
    }

    const btnCloseMenu = document.getElementById('btn-close-menu');
    if (btnCloseMenu) {
      btnCloseMenu.addEventListener('click', () => {
        this.hideModals();
      });
    }

    // Render Recipes & Drinks inside menu modal
    const recipeList = document.getElementById('menu-recipes-list');
    if (recipeList) {
      recipeList.innerHTML = '';
      for (const recipe of Object.values(RECIPES)) {
        const item = document.createElement('div');
        item.className = 'menu-dish-item';
        item.innerHTML = `
          <div class="menu-dish-header">
            <strong>${recipe.name}</strong>
            <span class="menu-dish-price">RM ${recipe.basePrice}</span>
          </div>
          <p class="menu-dish-desc">${recipe.description}</p>
        `;
        recipeList.appendChild(item);
      }
    }

    const drinksList = document.getElementById('menu-drinks-list');
    if (drinksList) {
      drinksList.innerHTML = '';
      for (const drink of Object.values(DRINKS)) {
        const item = document.createElement('div');
        item.className = 'menu-dish-item';
        item.innerHTML = `
          <div class="menu-dish-header">
            <strong>${drink.name}</strong>
            <span class="menu-dish-price">RM ${drink.price}</span>
          </div>
          <p class="menu-dish-desc">${drink.description}</p>
        `;
        drinksList.appendChild(item);
      }
    }
  }

  openLevelSelect() {
    this.hideModals();
    this.modalOverlay.style.display = 'flex';
    this.levelSelectModal.style.display = 'block';
    this.renderLevelSelectList();
  }

  renderLevelSelectList() {
    const list = document.getElementById('level-select-list');
    if (!list) return;
    list.innerHTML = '';

    LEVELS.forEach((lvl, idx) => {
      const card = document.createElement('div');
      card.className = 'level-card';
      card.innerHTML = `
        <div class="level-card-left">
          <div class="level-card-num">Stage ${lvl.level}</div>
          <div class="level-card-title">${lvl.title}</div>
          <div class="level-card-sub">${lvl.subtitle}</div>
        </div>
        <div class="level-card-right">
          <div class="level-card-goal">Target: RM ${lvl.targetCoins}</div>
          <button class="btn-play-level">PLAY</button>
        </div>
      `;

      card.querySelector('.btn-play-level').addEventListener('click', () => {
        this.hideModals();
        this.game.startLevel(idx);
      });

      list.appendChild(card);
    });
  }
}
