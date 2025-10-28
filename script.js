document.addEventListener('DOMContentLoaded', () => {
    // --- Atualiza o ano no rodapé ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Intersection Observer para animação de fade-in ao rolar ---
    const faders = document.querySelectorAll('.fade-in-section');
    const appearOptions = {
        threshold: 0.1, // O elemento precisa estar 10% visível
        rootMargin: "0px 0px -50px 0px" // Começa a "ver" o elemento 50px antes de ele entrar na tela
    };

    const appearOnScroll = new IntersectionObserver(function(
        entries,
        appearOnScroll
    ) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible'); // Adiciona a classe que o CSS usa para animar
                appearOnScroll.unobserve(entry.target); // Para de observar o elemento depois que ele apareceu
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Animação do Canvas (Partículas de Frescor) na Seção Hero ---
    const canvas = document.getElementById('freshness-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const numParticles = 30; // Número de partículas (baixo para ser sutil)

        // Função para ajustar o tamanho do canvas ao tamanho da tela
        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        // Classe que define cada partícula
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.5; // Tamanho pequeno
                this.speedX = Math.random() * 0.2 - 0.1; // Velocidade horizontal lenta
                this.speedY = Math.random() * 0.2 - 0.1; // Velocidade vertical lenta
                // Cor: Verde da sua marca (essencial-green) com opacidade muito baixa
                this.color = `rgba(139, 197, 63, ${Math.random() * 0.1 + 0.05})`; 
            }
            
            // Atualiza a posição da partícula
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Faz as partículas reaparecerem do outro lado se saírem da tela
                if (this.x > canvas.width + this.size) this.x = -this.size;
                if (this.x < -this.size) this.x = canvas.width + this.size;
                if (this.y > canvas.height + this.size) this.y = -this.size;
                if (this.y < -this.size) this.y = canvas.height + this.size;
            }

            // Desenha a partícula no canvas
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Cria o array inicial de partículas
        function initParticles() {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        // Loop de animação
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(); // Atualiza a posição
                particles[i].draw(); // Desenha
            }
            requestAnimationFrame(animateParticles); // Chama o próximo frame
        }

        // Inicializa tudo
        resizeCanvas();
        initParticles();
        animateParticles();

        // Refaz o canvas se a janela for redimensionada
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles(); 
        });
    }
});

