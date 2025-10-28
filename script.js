// --- Animação de Frescor (Canvas) ---
const canvas = document.getElementById('freshness-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const numParticles = 100;

function resizeCanvas() {
    if (!canvas) return; // Garante que o canvas exista
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// Classe da Partícula
class Particle {
    constructor() {
        this.reset();
        if (canvas) {
            this.y = Math.random() * canvas.height; // Começa em posições Y aleatórias
        }
    }

    reset() {
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100; // Começa abaixo da tela
        this.radius = Math.random() * 1.5 + 0.5; // Raio pequeno
        this.opacity = 0; // Começa invisível
        this.maxOpacity = Math.random() * 0.5 + 0.1; // Opacidade máxima sutil
        this.speedY = Math.random() * -0.5 - 0.2; // Velocidade de subida lenta
        this.speedX = (Math.random() - 0.5) * 0.3; // Movimento lateral leve
        this.life = 0;
        this.maxLife = 300 + Math.random() * 200; // Tempo de "fade in"
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Gerencia o fade-in e fade-out
        if (this.life < this.maxLife) {
            this.opacity = (this.life / this.maxLife) * this.maxOpacity;
            this.life++;
        }

        // Reseta se sair da tela (pelo topo)
        if (this.y < -10) {
            this.reset();
        }
    }

    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(173, 216, 230, ${this.opacity})`; // Azul claro sutil (light-blue)
        ctx.fill();
    }
}

// Iniciar partículas
function initParticles() {
    if (!canvas) return;
    particles = [];
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

// Loop de Animação
function animate() {
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
    }
    requestAnimationFrame(animate);
}

// --- Animação de Scroll (Intersection Observer) ---
const sections = document.querySelectorAll('.fade-in-section');
if (sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Opcional: parar de observar depois que for visível
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1 // 10% da seção visível
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// --- Inicialização ---
window.addEventListener('load', () => {
    resizeCanvas();
    initParticles();
    animate();
});

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles(); // Reinicia as partículas para o novo tamanho
});

// --- Atualizar Ano do Footer ---
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
