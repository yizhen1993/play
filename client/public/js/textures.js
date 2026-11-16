/**
 * Malaysian Cooking Dash — Procedural Canvas Vector Texture & Sprite Renderer
 * Generates crisp, colorful cartoon sprites for Chef, Customers, Kitchen Workstations,
 * and Malaysian Hawker Dishes without external image asset dependencies.
 */

export class TextureRenderer {
  constructor() {
    this.cache = new Map();
  }

  // Helper to draw rounded rectangle
  static roundRect(ctx, x, y, w, h, radius) {
    if (w < 2 * radius) radius = w / 2;
    if (h < 2 * radius) radius = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  // Draw Kopitiam Background & Floor
  static drawKopitiamFloor(ctx, width, height) {
    // Vintage kopitiam diamond ceramic tiles
    const tileSize = 48;
    ctx.save();
    for (let y = 0; y < height; y += tileSize) {
      for (let x = 0; x < width; x += tileSize) {
        const isAlt = ((x / tileSize) + (y / tileSize)) % 2 === 0;
        ctx.fillStyle = isAlt ? '#F3EDE2' : '#E8DEC8';
        ctx.fillRect(x, y, tileSize, tileSize);

        // Tile grout lines
        ctx.strokeStyle = '#D1C4AC';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, tileSize, tileSize);

        // Subtle vintage floral center on light tiles
        if (isAlt) {
          ctx.fillStyle = '#C2B294';
          ctx.beginPath();
          ctx.arc(x + tileSize / 2, y + tileSize / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Top kitchen partition / wooden counter panel
    const wallHeight = 110;
    const grad = ctx.createLinearGradient(0, 0, 0, wallHeight);
    grad.addColorStop(0, '#1E293B');
    grad.addColorStop(0.7, '#334155');
    grad.addColorStop(1, '#475569');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, wallHeight);

    // Retro Kopitiam Green Wainscoting stripe
    ctx.fillStyle = '#065F46'; // Emerald kopitiam green
    ctx.fillRect(0, wallHeight - 16, width, 16);

    ctx.fillStyle = '#D97706'; // Gold trim
    ctx.fillRect(0, wallHeight - 20, width, 4);

    // Kopitiam Banner / Signboard
    ctx.fillStyle = '#78350F';
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 3;
    TextureRenderer.roundRect(ctx, width / 2 - 180, 12, 360, 52, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 22px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☕ KOPI TIAM RESTORAN RIA 🥢', width / 2, 38);

    ctx.restore();
  }

  // Draw Kopitiam Round Marble Dining Table
  static drawDiningTable(ctx, x, y, radius = 52, isOccupied = false) {
    ctx.save();
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(x + 3, y + 8, radius + 4, radius * 0.72 + 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cast iron table leg rim
    ctx.fillStyle = '#262626';
    ctx.beginPath();
    ctx.ellipse(x, y + 2, radius + 2, radius * 0.72 + 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark green wooden rim
    ctx.fillStyle = '#064E3B';
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // White marble top with faint veins
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.ellipse(x, y, radius - 6, radius * 0.7 - 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Marble veins
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - radius + 15, y - 8);
    ctx.quadraticCurveTo(x, y - 16, x + radius - 20, y + 6);
    ctx.stroke();

    // Table number badge
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TABLE', x, y - 1);

    ctx.restore();
  }

  // Draw Chef (Malaysian Chef Uncle)
  static drawChef(ctx, x, y, facing = 1, isWalking = false, walkFrame = 0, carriedItems = [], speedBuff = false) {
    ctx.save();
    ctx.translate(x, y);
    if (facing < 0) {
      ctx.scale(-1, 1);
    }

    // Kasut Laju Speed Boots Glow
    if (speedBuff) {
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 5, 34, 48, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 48, 22, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs / Pants
    const legSwing = isWalking ? Math.sin(walkFrame * 8) * 8 : 0;
    ctx.fillStyle = '#1E293B';
    // Left leg
    ctx.fillRect(-12, 28, 8, 18 + legSwing);
    // Right leg
    ctx.fillRect(4, 28, 8, 18 - legSwing);

    // Yellow / Red Hawker Boots
    ctx.fillStyle = speedBuff ? '#EF4444' : '#F59E0B';
    ctx.fillRect(-14, 42 + legSwing, 12, 7);
    ctx.fillRect(2, 42 - legSwing, 12, 7);

    // Torso (White Chef T-Shirt)
    ctx.fillStyle = '#F8FAFC';
    TextureRenderer.roundRect(ctx, -18, -4, 36, 34, 6);
    ctx.fill();

    // Red Kopitiam Apron
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.moveTo(-14, 4);
    ctx.lineTo(14, 4);
    ctx.lineTo(16, 28);
    ctx.lineTo(-16, 28);
    ctx.closePath();
    ctx.fill();

    // Apron tie string & pocket
    ctx.strokeStyle = '#991B1B';
    ctx.lineWidth = 2;
    ctx.strokeRect(-8, 14, 16, 10);

    // Head
    ctx.fillStyle = '#F5D0A9'; // Tan skin
    ctx.beginPath();
    ctx.arc(0, -18, 16, 0, Math.PI * 2);
    ctx.fill();

    // Chef Mustache
    ctx.fillStyle = '#262626';
    ctx.beginPath();
    ctx.moveTo(-8, -12);
    ctx.quadraticCurveTo(0, -16, 8, -12);
    ctx.quadraticCurveTo(0, -8, -8, -12);
    ctx.fill();

    // Friendly Eyes & Eyebrows
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(-5, -20, 2.5, 0, Math.PI * 2);
    ctx.arc(5, -20, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Big White Chef Toque Hat
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    // Hat base band
    ctx.fillRect(-16, -34, 32, 8);
    ctx.strokeRect(-16, -34, 32, 8);
    // Puffy hat top
    ctx.beginPath();
    ctx.arc(0, -42, 18, Math.PI, 0);
    ctx.arc(-12, -40, 11, Math.PI * 0.8, Math.PI * 1.8);
    ctx.arc(12, -40, 11, Math.PI * 1.2, Math.PI * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Red Good Luck Towel over Uncle's shoulder
    ctx.fillStyle = '#B91C1C';
    ctx.fillRect(-16, -6, 8, 22);

    // Carrying hands & Trays
    ctx.fillStyle = '#F5D0A9';
    // Left Hand
    ctx.beginPath();
    ctx.arc(-22, 10, 6, 0, Math.PI * 2);
    ctx.fill();
    // Right Hand
    ctx.beginPath();
    ctx.arc(22, 10, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw carried items above hands
    if (carriedItems && carriedItems.length > 0) {
      carriedItems.forEach((item, idx) => {
        const itemX = idx === 0 ? -26 : 26;
        const itemY = -12;
        TextureRenderer.drawCarriedMiniItem(ctx, itemX, itemY, item);
      });
    }

    ctx.restore();
  }

  // Draw Customer by Archetype
  static drawCustomer(ctx, x, y, type = 'student', patiencePercent = 1.0, order = null, mood = 'normal') {
    ctx.save();
    ctx.translate(x, y);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 36, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body based on type
    if (type === 'businessman') {
      // Suit jacket
      ctx.fillStyle = '#1E3A8A'; // Blue suit
      TextureRenderer.roundRect(ctx, -14, 0, 28, 32, 4);
      ctx.fill();
      // White shirt + red tie
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-4, 0, 8, 12);
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.moveTo(-2, 2);
      ctx.lineTo(2, 2);
      ctx.lineTo(3, 16);
      ctx.lineTo(0, 19);
      ctx.lineTo(-3, 16);
      ctx.closePath();
      ctx.fill();
      // Head
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.arc(0, -14, 13, 0, Math.PI * 2);
      ctx.fill();
      // Sleek parted hair & spectacles
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(0, -18, 14, Math.PI, 0);
      ctx.fill();
      // Glasses
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(-9, -16, 7, 5);
      ctx.strokeRect(2, -16, 7, 5);
      ctx.beginPath();
      ctx.moveTo(-2, -14);
      ctx.lineTo(2, -14);
      ctx.stroke();
    } else if (type === 'critic') {
      // Makcik Salmah with tudung & spectacles
      // Baju kurung
      ctx.fillStyle = '#047857';
      TextureRenderer.roundRect(ctx, -16, 2, 32, 34, 6);
      ctx.fill();
      // Tudung (Lilac Purple)
      ctx.fillStyle = '#A855F7';
      ctx.beginPath();
      ctx.arc(0, -14, 18, Math.PI, 0);
      ctx.lineTo(16, 12);
      ctx.lineTo(-16, 12);
      ctx.closePath();
      ctx.fill();
      // Face
      ctx.fillStyle = '#F5D0A9';
      ctx.beginPath();
      ctx.arc(0, -13, 11, 0, Math.PI * 2);
      ctx.fill();
      // Glasses
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-4, -13, 3.5, 0, Math.PI * 2);
      ctx.arc(4, -13, 3.5, 0, Math.PI * 2);
      ctx.stroke();
    } else if (type === 'tourist') {
      // Sarah with sunhat & camera
      // Floral top
      ctx.fillStyle = '#EC4899';
      TextureRenderer.roundRect(ctx, -13, 2, 26, 32, 4);
      ctx.fill();
      // Head
      ctx.fillStyle = '#FED7AA';
      ctx.beginPath();
      ctx.arc(0, -14, 13, 0, Math.PI * 2);
      ctx.fill();
      // Blonde hair & wide brim hat
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.ellipse(0, -22, 22, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -24, 11, Math.PI, 0);
      ctx.fill();
      // Camera strap
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, 4);
      ctx.lineTo(8, 22);
      ctx.stroke();
      ctx.fillStyle = '#334155';
      ctx.fillRect(4, 16, 12, 9);
    } else {
      // Amir (Student) with cap & hoodie
      ctx.fillStyle = '#F97316'; // Orange hoodie
      TextureRenderer.roundRect(ctx, -14, 2, 28, 32, 5);
      ctx.fill();
      // Face
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.arc(0, -14, 13, 0, Math.PI * 2);
      ctx.fill();
      // Backward snapback cap (Cyan)
      ctx.fillStyle = '#06B6D4';
      ctx.beginPath();
      ctx.arc(0, -18, 14, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(-15, -19, 10, 4); // Back visor
    }

    // Customer Facial Expression based on patience
    ctx.fillStyle = '#1E293B';
    if (patiencePercent < 0.25 || mood === 'angry') {
      // Angry furrowed brows & frown
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-7, -19);
      ctx.lineTo(-2, -17);
      ctx.moveTo(7, -19);
      ctx.lineTo(2, -17);
      ctx.stroke();
      // Frown
      ctx.beginPath();
      ctx.arc(0, -8, 4, Math.PI, 0);
      ctx.stroke();
    } else if (patiencePercent < 0.6) {
      // Neutral / slight worry
      ctx.beginPath();
      ctx.arc(-4, -14, 2, 0, Math.PI * 2);
      ctx.arc(4, -14, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-4, -8);
      ctx.lineTo(4, -8);
      ctx.stroke();
    } else {
      // Happy smile
      ctx.beginPath();
      ctx.arc(-4, -14, 2, 0, Math.PI * 2);
      ctx.arc(4, -14, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, -11, 4, 0, Math.PI);
      ctx.stroke();
    }

    // Customer Patience Meter (Cooking Dash Heart Bar)
    TextureRenderer.drawPatienceHearts(ctx, 0, -42, patiencePercent);

    ctx.restore();
  }

  // Draw 5 Heart Patience Bar
  static drawPatienceHearts(ctx, x, y, percent) {
    ctx.save();
    const totalHearts = 5;
    const filledHearts = Math.ceil(percent * totalHearts);
    const spacing = 11;
    const startX = x - ((totalHearts - 1) * spacing) / 2;

    for (let i = 0; i < totalHearts; i++) {
      const hX = startX + i * spacing;
      const isFilled = i < filledHearts;
      const isDying = percent < 0.25;

      ctx.fillStyle = isFilled ? (isDying ? '#EF4444' : '#10B981') : '#94A3B8';
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;

      // Small heart path
      ctx.beginPath();
      ctx.moveTo(hX, y + 2);
      ctx.bezierCurveTo(hX - 4, y - 4, hX - 6, y, hX, y + 6);
      ctx.bezierCurveTo(hX + 6, y, hX + 4, y - 4, hX, y + 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  // Draw Order Speech Bubble (Dish + Drink)
  static drawOrderBubble(ctx, x, y, recipeId, drinkId = null) {
    ctx.save();
    ctx.translate(x, y);

    const bubbleWidth = drinkId ? 84 : 48;
    const bubbleHeight = 44;

    // Speech bubble shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    TextureRenderer.roundRect(ctx, -bubbleWidth / 2 + 2, -bubbleHeight + 2, bubbleWidth, bubbleHeight, 8);
    ctx.fill();

    // Bubble body
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2.5;
    TextureRenderer.roundRect(ctx, -bubbleWidth / 2, -bubbleHeight, bubbleWidth, bubbleHeight, 8);
    ctx.fill();
    ctx.stroke();

    // Bubble pointer tail
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(0, 8);
    ctx.lineTo(6, 0);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(0, 8);
    ctx.lineTo(6, 0);
    ctx.stroke();

    // Clean inner seam
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-5, -2, 10, 3);

    // Draw Dish Icon inside bubble
    if (recipeId) {
      const foodX = drinkId ? -22 : 0;
      TextureRenderer.drawDishIcon(ctx, foodX, -22, recipeId, 0.65);
    }

    // Draw Drink Icon inside bubble
    if (drinkId) {
      TextureRenderer.drawDrinkIcon(ctx, 22, -22, drinkId, 0.75);
    }

    ctx.restore();
  }

  // Draw Workstations (Wok, Fryer, Griddle, Drink Tap, Sink, Trash)
  static drawWorkstation(ctx, station) {
    const { x, y, w, h, type, state, progress, label } = station;
    ctx.save();
    ctx.translate(x, y);

    // Station Base Table / Countertop
    ctx.fillStyle = '#CBD5E1';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    TextureRenderer.roundRect(ctx, -w / 2, -h / 2, w, h, 6);
    ctx.fill();
    ctx.stroke();

    // Stainless steel top
    ctx.fillStyle = '#F1F5F9';
    TextureRenderer.roundRect(ctx, -w / 2 + 4, -h / 2 + 4, w - 8, h - 8, 4);
    ctx.fill();

    if (type === 'wok') {
      // Cast iron burner ring
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fill();

      // Stove flame if cooking
      if (state === 'cooking') {
        const flamePuff = (Math.sin(Date.now() / 100) + 1) * 2;
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(0, 0, 22 + flamePuff, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Wok Bowl
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Wok Wooden Handle
      ctx.fillStyle = '#78350F';
      ctx.fillRect(-26, -3, 8, 6);
      ctx.fillRect(18, -3, 8, 6);

      // Burnt smoke visual indicator
      if (state === 'burnt') {
        ctx.fillStyle = '#1C1917';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#DC2626';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('BURNT!', 0, -26);
      }
    } else if (type === 'fryer') {
      // Deep fryer oil bath
      ctx.fillStyle = '#CA8A04'; // Golden oil
      ctx.fillRect(-w / 2 + 10, -h / 2 + 10, w - 20, h - 20);

      // Metal wire basket
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28);

      // Bubbling effect if cooking
      if (state === 'cooking') {
        ctx.fillStyle = '#FEF08A';
        for (let b = 0; b < 6; b++) {
          const bx = -w / 2 + 16 + (b * 9) % (w - 32);
          const by = -h / 2 + 16 + ((b * 13 + Date.now() / 50) % (h - 32));
          ctx.beginPath();
          ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (type === 'griddle') {
      // Flat black cast-iron griddle plate
      ctx.fillStyle = '#334155';
      TextureRenderer.roundRect(ctx, -w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 4);
      ctx.fill();

      // Griddle grooves
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1.5;
      for (let gy = -h / 2 + 14; gy <= h / 2 - 14; gy += 10) {
        ctx.beginPath();
        ctx.moveTo(-w / 2 + 12, gy);
        ctx.lineTo(w / 2 - 12, gy);
        ctx.stroke();
      }
    } else if (type === 'drink') {
      // 4 dispenser taps for Teh Tarik, Kopi Peng, Milo, Sirap Bandung
      const drinkColors = ['#D97706', '#78350F', '#92400E', '#F43F5E'];
      const tapSpacing = (w - 20) / 4;
      drinkColors.forEach((color, i) => {
        const tx = -w / 2 + 14 + i * tapSpacing;
        ctx.fillStyle = color;
        ctx.fillRect(tx - 6, -h / 2 + 8, 12, 16);
        // Spout nozzle
        ctx.fillStyle = '#475569';
        ctx.fillRect(tx - 3, -h / 2 + 24, 6, 8);
      });
    } else if (type === 'sink') {
      // Water basin
      ctx.fillStyle = '#0284C7';
      TextureRenderer.roundRect(ctx, -w / 2 + 10, -h / 2 + 10, w - 20, h - 20, 6);
      ctx.fill();
      // Chrome faucet
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(-4, -h / 2 - 4, 8, 14);
      ctx.beginPath();
      ctx.arc(0, -h / 2 - 4, 6, Math.PI, 0);
      ctx.fill();
    } else if (type === 'trash') {
      // Metal trash bin
      ctx.fillStyle = '#64748B';
      TextureRenderer.roundRect(ctx, -16, -20, 32, 40, 4);
      ctx.fill();
      // Red pedal lid
      ctx.fillStyle = '#DC2626';
      TextureRenderer.roundRect(ctx, -19, -24, 38, 7, 3);
      ctx.fill();
      // Trash symbol
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🗑️', 0, 4);
    }

    // Cook / Dispense Timer Circular Progress
    if (state === 'cooking' || state === 'ready') {
      const isReady = state === 'ready';
      const isOverheating = isReady && progress > 0.65;
      const progressColor = isOverheating ? '#DC2626' : (isReady ? '#10B981' : '#F59E0B');

      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.arc(0, -h / 2 - 12, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = progressColor;
      ctx.beginPath();
      ctx.arc(0, -h / 2 - 12, 12, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1.0, progress));
      ctx.stroke();

      if (isReady) {
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(0, -h / 2 - 12, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Station Name Label
    if (label) {
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, 0, h / 2 + 14);
    }

    ctx.restore();
  }

  // Draw Malaysian Food Dishes
  static drawDishIcon(ctx, x, y, recipeId, scale = 1.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (recipeId === 'nasi_lemak') {
      // Green banana leaf base
      ctx.fillStyle = '#15803D';
      ctx.beginPath();
      ctx.ellipse(0, 2, 24, 18, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#166534';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // White coconut santan rice mound
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.arc(-2, 0, 11, 0, Math.PI * 2);
      ctx.fill();

      // Red Sambal chili dollop
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(8, -4, 6, 0, Math.PI * 2);
      ctx.fill();

      // Crispy golden chicken drumstick
      ctx.fillStyle = '#B45309';
      ctx.beginPath();
      ctx.ellipse(-10, 6, 8, 5, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Boiled egg half (white + yellow yolk)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(6, 6, 5, 4, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(6, 6, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Green cucumber slices
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.arc(-4, -10, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (recipeId === 'char_kway_teow') {
      // Round hawker plate (Red/Orange vintage melamine)
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      // Flat brown noodles (Wok-hei dark soy)
      ctx.fillStyle = '#78350F';
      for (let i = 0; i < 5; i++) {
        const nx = -10 + i * 4;
        ctx.fillRect(nx, -10 + (i % 2) * 4, 14, 4);
      }

      // Juicy king prawns (Pink/Red curves)
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.arc(4, -4, 6, 0, Math.PI);
      ctx.fill();

      // Bean sprouts & green chives
      ctx.fillStyle = '#84CC16';
      ctx.fillRect(-6, 2, 8, 2.5);
      ctx.fillRect(2, 6, 6, 2.5);
    } else if (recipeId === 'roti_canai') {
      // Stainless steel mamak plate
      ctx.fillStyle = '#94A3B8';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      // Fluffy golden flatbread folded
      ctx.fillStyle = '#FDE047';
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1.5;
      TextureRenderer.roundRect(ctx, -14, -10, 18, 18, 4);
      ctx.fill();
      ctx.stroke();

      // Small yellow dhal curry bowl
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(10, 4, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (recipeId === 'roti_telur') {
      // Stainless plate
      ctx.fillStyle = '#94A3B8';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      // Golden roti folded with egg inside
      ctx.fillStyle = '#FBBF24';
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 1.5;
      TextureRenderer.roundRect(ctx, -14, -12, 20, 22, 4);
      ctx.fill();
      ctx.stroke();

      // Dhal bowl
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(10, 4, 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (recipeId === 'satay_skewers') {
      // Woven rattan basket plate
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      // 3 Charcoal skewers
      ctx.strokeStyle = '#FDE047'; // Bamboo sticks
      ctx.lineWidth = 2;
      for (let s = -1; s <= 1; s++) {
        ctx.beginPath();
        ctx.moveTo(-16, s * 7);
        ctx.lineTo(16, s * 7);
        ctx.stroke();

        // Charred chicken meat chunks
        ctx.fillStyle = '#92400E';
        ctx.fillRect(-8, s * 7 - 3, 16, 6);
      }

      // Rich peanut gravy bowl
      ctx.fillStyle = '#78350F';
      ctx.beginPath();
      ctx.arc(12, 8, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (recipeId === 'mee_goreng') {
      // Mamak plate
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      // Red chili yellow noodles
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();

      // Fried tofu cubes & green lime wedge
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(-6, -6, 5, 5);
      ctx.fillRect(4, 2, 5, 5);

      // Calamansi lime
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.arc(-8, 6, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (recipeId === 'curry_laksa') {
      // Deep soup bowl (Blue ceramic)
      ctx.fillStyle = '#1D4ED8';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      // Rich orange coconut broth
      ctx.fillStyle = '#F97316';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();

      // Tofu puff & shrimp
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(-6, -6, 6, 6);
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.arc(4, -4, 4, 0, Math.PI);
      ctx.fill();

      // Mint leaf
      ctx.fillStyle = '#16A34A';
      ctx.beginPath();
      ctx.ellipse(0, 6, 4, 2, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Draw Malaysian Drinks
  static drawDrinkIcon(ctx, x, y, drinkId, scale = 1.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Glass mug outline
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.5;
    TextureRenderer.roundRect(ctx, -8, -14, 16, 26, 3);
    ctx.fill();
    ctx.stroke();

    // Mug handle
    ctx.beginPath();
    ctx.arc(10, -2, 6, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    // Liquid Fill
    let liquidColor = '#D97706';
    if (drinkId === 'teh_tarik') liquidColor = '#D97706';
    if (drinkId === 'kopi_peng') liquidColor = '#451A03';
    if (drinkId === 'milo_dinosaur') liquidColor = '#78350F';
    if (drinkId === 'sirap_bandung') liquidColor = '#FB7185';

    ctx.fillStyle = liquidColor;
    ctx.fillRect(-7, -8, 14, 19);

    if (drinkId === 'teh_tarik') {
      // Frothy milk foam
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(-7, -12, 14, 4);
    } else if (drinkId === 'milo_dinosaur') {
      // Mountain of Milo powder on top
      ctx.fillStyle = '#542306';
      ctx.beginPath();
      ctx.moveTo(-8, -10);
      ctx.lineTo(0, -18);
      ctx.lineTo(8, -10);
      ctx.closePath();
      ctx.fill();
    } else {
      // Ice cubes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(-4, -6, 4, 4);
      ctx.fillRect(0, 2, 4, 4);
    }

    ctx.restore();
  }

  // Draw Treats (Karipap / Kuih Lapis)
  static drawTreatIcon(ctx, x, y, treatId, scale = 1.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (treatId === 'karipap') {
      // Golden curry puff crescent with pleats
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(0, 0, 14, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Rainbow Kuih Lapis slice
      const layers = ['#EF4444', '#FFFFFF', '#10B981', '#FFFFFF', '#EF4444'];
      layers.forEach((c, idx) => {
        ctx.fillStyle = c;
        ctx.fillRect(-10, -12 + idx * 5, 20, 5);
      });
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.strokeRect(-10, -12, 20, 25);
    }

    ctx.restore();
  }

  // Draw mini item carried by chef
  static drawCarriedMiniItem(ctx, x, y, item) {
    if (!item) return;
    if (item.type === 'dish') {
      TextureRenderer.drawDishIcon(ctx, x, y, item.id, 0.6);
    } else if (item.type === 'drink') {
      TextureRenderer.drawDrinkIcon(ctx, x, y, item.id, 0.65);
    } else if (item.type === 'treat') {
      TextureRenderer.drawTreatIcon(ctx, x, y, item.id, 0.7);
    } else if (item.type === 'dirty_plate') {
      // Dirty plate stack
      ctx.fillStyle = '#94A3B8';
      ctx.beginPath();
      ctx.ellipse(x, y, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#78350F';
      ctx.fillRect(x - 4, y - 2, 8, 3);
    }
  }

  // Draw Malaysian Ringgit Coins
  static drawCoinPile(ctx, x, y, amount) {
    ctx.save();
    ctx.translate(x, y);

    // Glow
    ctx.shadowColor = '#FBBF24';
    ctx.shadowBlur = 8;

    // Coins stack
    for (let c = 0; c < 3; c++) {
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.ellipse(0, 4 - c * 4, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // "RM" label
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`RM${amount}`, 0, -10);

    ctx.restore();
  }
}
