/**
 * Malaysian Cooking Dash — Visual Particle System
 * Handles sizzle steam, burning smoke, coin sparkles, and floating score texts.
 */

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
  }

  // Add cooking steam / sizzle puff
  addSteam(x, y, color = 'rgba(255, 255, 255, 0.6)') {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 16,
      y: y + (Math.random() - 0.5) * 6,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -1.2 - Math.random() * 1.5,
      radius: 4 + Math.random() * 4,
      maxRadius: 16 + Math.random() * 8,
      alpha: 0.7,
      decay: 0.025,
      color: color,
      type: 'steam'
    });
  }

  // Add burnt smoke puff (black/dark grey alarm smoke)
  addBurnSmoke(x, y) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y - 5,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -1.8 - Math.random() * 2.0,
      radius: 6 + Math.random() * 6,
      maxRadius: 26 + Math.random() * 10,
      alpha: 0.85,
      decay: 0.02,
      color: 'rgba(30, 41, 59, 0.8)',
      type: 'smoke'
    });
  }

  // Add coin / star sparkle on successful serve
  addSparkles(x, y, count = 8) {
    const colors = ['#FBBF24', '#F59E0B', '#34D399', '#60A5FA', '#F472B6'];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 3.5;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0,
        radius: 3 + Math.random() * 3,
        alpha: 1.0,
        decay: 0.035,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'sparkle'
      });
    }
  }

  // Add floating floating score / combo text
  addFloatingText(x, y, text, color = '#F59E0B', fontSize = 16) {
    this.floatingTexts.push({
      x: x,
      y: y,
      text: text,
      color: color,
      fontSize: fontSize,
      alpha: 1.0,
      vy: -1.4,
      decay: 0.022
    });
  }

  update(dt = 1) {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha -= p.decay * dt;

      if (p.type === 'steam' || p.type === 'smoke') {
        p.radius += (p.maxRadius - p.radius) * 0.04 * dt;
      }

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update floating texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.alpha -= ft.decay * dt;
      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();
    // Render particles
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render floating texts
    for (const ft of this.floatingTexts) {
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.font = `bold ${ft.fontSize}px "Trebuchet MS", sans-serif`;
      ctx.textAlign = 'center';
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();
  }

  clear() {
    this.particles = [];
    this.floatingTexts = [];
  }
}
