import React, { useEffect, useRef } from 'react';

/**
 * Motion Graphics Component - Creates animated visual elements
 * inspired by string-tune.fiddle.digital style
 */
export default function MotionGraphics({ type = 'particles', className = '' }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const lines = [];
    const mouse = { x: width / 2, y: height / 2 };

    // Particle class for floating particles
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.hue = Math.random() > 0.5 ? 345 : 220; // Tactical Red/Blue protocol
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          this.vx -= dx * force * 0.001;
          this.vy -= dy * force * 0.001;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Line class for connecting lines
    class Line {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.length = Math.random() * 100 + 50;
        this.angle = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.hue = Math.random() > 0.5 ? 345 : 220;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += 0.005;

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
          this.reset();
        }
      }

      draw() {
        const x2 = this.x + Math.cos(this.angle) * this.length;
        const y2 = this.y + Math.sin(this.angle) * this.length;

        const gradient = ctx.createLinearGradient(this.x, this.y, x2, y2);
        gradient.addColorStop(0, `hsla(${this.hue}, 70%, 60%, 0)`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 70%, 60%, ${this.opacity})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 70%, 60%, 0)`);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Wave class for flowing waves
    class Wave {
      constructor() {
        this.reset();
      }

      reset() {
        this.y = Math.random() * height;
        this.amplitude = Math.random() * 50 + 20;
        this.frequency = Math.random() * 0.02 + 0.005;
        this.speed = Math.random() * 0.02 + 0.01;
        this.phase = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.1 + 0.05;
        this.hue = Math.random() > 0.5 ? 345 : 220;
      }

      draw(time) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 5) {
          const y = this.y + Math.sin(x * this.frequency + time * this.speed + this.phase) * this.amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Initialize particles
    const particleCount = Math.min(100, Math.floor(width * height / 10000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Initialize lines
    const lineCount = Math.min(30, Math.floor(width * height / 30000));
    for (let i = 0; i < lineCount; i++) {
      lines.push(new Line());
    }

    // Initialize waves
    const waves = [];
    for (let i = 0; i < 3; i++) {
      waves.push(new Wave());
    }

    let time = 0;

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw waves
      waves.forEach(wave => wave.draw(time));

      // Draw lines
      lines.forEach(line => {
        line.update();
        line.draw();
      });

      // Draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(${particles[i].hue}, 70%, 60%, ${0.2 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      time++;
      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.8 }}
    />
  );
}
