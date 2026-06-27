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

        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,

        radius: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.5,

        phase: Math.random() * Math.PI * 2,
        life: Math.random(),
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

    if (Math.random() < 0.002 && this.nodes.length < 70) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,

        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,

        radius: 2,

        alpha: 0.3,

        phase: Math.random() * Math.PI * 2,

        life: 0,
      });
    }
  };

  moveNodes() {
    const time = performance.now() * 0.0002;

    this.nodes.forEach((node) => {
      node.phase += 0.01;

      node.vx += Math.cos(time + node.phase) * 0.003;
      node.vy += Math.sin(time + node.phase) * 0.003;

      node.vx *= 0.995;
      node.vy *= 0.995;

      const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);

      if (speed > 0.35) {
        node.vx *= 0.9;
        node.vy *= 0.9;
      }

      const dx = node.x - this.mouse.x;
      const dy = node.y - this.mouse.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0 && distance < 140) {
        const force = (140 - distance) / 140;

        node.vx += (dx / distance) * force * 0.08;
        node.vy += (dy / distance) * force * 0.08;
      }

      node.x += node.vx;
      node.y += node.vy;

      if (node.x < -30) node.x = this.canvas.width + 30;
      if (node.x > this.canvas.width + 30) node.x = -30;

      if (node.y < -30) node.y = this.canvas.height + 30;
      if (node.y > this.canvas.height + 30) node.y = -30;

      node.life += 0.01;
    });
  }

  drawNodes() {
    this.nodes.forEach((node) => {
      const pulse = 1 + Math.sin(node.phase * 2) * 0.2;

      this.ctx.beginPath();

      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = '#ec4899';

      this.ctx.fillStyle = `rgba(236,72,153,${node.alpha})`;

      this.ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);

      this.ctx.fill();
    });

    this.ctx.shadowBlur = 0;
  }

  drawLines() {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const a = this.nodes[i];
        const b = this.nodes[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 170) {
          const alpha = Math.pow((170 - distance) / 170, 2) * 0.2;

          this.ctx.strokeStyle = `rgba(236,72,153,${alpha})`;

          this.ctx.lineWidth = 1;

          this.ctx.beginPath();

          this.ctx.moveTo(a.x, a.y);

          this.ctx.lineTo(b.x, b.y);

          this.ctx.stroke();
        }
      }
    }
  }
}
