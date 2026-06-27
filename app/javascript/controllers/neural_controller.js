import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['canvas'];

  connect() {
    this.canvas = this.canvasTarget;
    this.ctx = this.canvas.getContext('2d');

    this.mouse = {
      x: -9999,
      y: -9999,
    };

    this.resize = this.resize.bind(this);

    window.addEventListener('resize', this.resize);
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('mouseleave', this.mouseLeave);

    this.resize();

    this.nodes = [];

    for (let i = 0; i < 60; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,

        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,

        radius: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.5,
      });
    }

    this.animate();
  }

  disconnect() {
    cancelAnimationFrame(this.frame);

    window.removeEventListener('resize', this.resize);
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('mouseleave', this.mouseLeave);
  }

  mouseMove = (e) => {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  };

  mouseLeave = () => {
    this.mouse.x = -9999;
    this.mouse.y = -9999;
  };

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate = () => {
    this.frame = requestAnimationFrame(this.animate);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.moveNodes();
    this.drawLines();
    this.drawNodes();
  };

  moveNodes() {
    const padding = 40;

    this.nodes.forEach((node) => {
      const dx = node.x - this.mouse.x;
      const dy = node.y - this.mouse.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0 && distance < 140) {
        const force = (140 - distance) / 140;

        node.x += (dx / distance) * force * 1.6;
        node.y += (dy / distance) * force * 1.6;
      }

      node.x += node.vx;
      node.y += node.vy;

      if (node.x < padding || node.x > this.canvas.width - padding) {
        node.vx *= -1;
      }

      if (node.y < padding || node.y > this.canvas.height - padding) {
        node.vy *= -1;
      }
    });
  }

  drawNodes() {
    this.nodes.forEach((node) => {
      this.ctx.beginPath();

      this.ctx.fillStyle = `rgba(236,72,153,${node.alpha})`;

      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

      this.ctx.fill();
    });
  }

  drawLines() {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const a = this.nodes[i];
        const b = this.nodes[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const alpha = ((150 - distance) / 150) * 0.15;

          this.ctx.strokeStyle = `rgba(236,72,153,${alpha})`;

          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.stroke();
        }
      }
    }
  }
}
