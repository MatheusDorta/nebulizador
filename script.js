document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Atualização do Ano no Rodapé ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- 2. Animação de Fade-in para Seções (Intersection Observer) ---
    const faders = document.querySelectorAll('.fade-in-section');
    const appearOptions = {
        threshold: 0.1, // O elemento precisa estar 10% visível
        rootMargin: "0px 0px -50px 0px" // Começa a "ver" 50px antes do final da tela
    };

    const appearOnScroll = new IntersectionObserver(function(
        entries,
        appearOnScroll
    ) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- 3. Animação de Neblina (Canvas na Seção Hero) ---
    const canvas = document.getElementById('freshness-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const numParticles = 250; // Aumentei o número de partículas

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        class Particle {
            constructor() {
                // Começa de baixo ou levemente fora da tela
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * 100 + canvas.height; // Começa na base
                this.size = Math.random() * 3 + 1; // Partículas um pouco maiores
                this.speedX = Math.random() * 0.4 - 0.2; // Movimento lateral leve
                this.speedY = Math.random() * -0.3 - 0.1; // Sobe lentamente
                // Cor cinza-azulada com opacidade um pouco maior
                this.color = `rgba(200, 210, 220, ${Math.random() * 0.15 + 0.05})`; 
                this.life = 0;
                this.maxLife = Math.random() * 400 + 100; // Tempo de vida da partícula
            }
            
            // Atualiza a posição da partícula
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life++;

                // "Vindo e indo" - Renasce a partícula quando ela morre (sai da tela ou atinge o tempo de vida)
                if (this.y < -this.size || this.life > this.maxLife) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * 100 + canvas.height;
                    this.size = Math.random() * 3 + 1;
                    this.speedX = Math.random() * 0.4 - 0.2;
                    this.speedY = Math.random() * -0.3 - 0.1;
                    this.life = 0;
                    this.color = `rgba(200, 210, 220, ${Math.random() * 0.15 + 0.05})`;
                }
            }
            
            // Desenha a partícula
            draw() {
                // Efeito de "fade out" no final da vida
                let opacity = 1;
                if (this.life > this.maxLife - 100) {
                    opacity = (this.maxLife - this.life) / 100;
                }
                
                ctx.globalAlpha = opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1; // Reseta o alpha global
            }
        }

        // Cria as partículas
        function initParticles() {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        // Loop de animação
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        // Inicialização
        resizeCanvas();
        initParticles();
        animateParticles();

        // Recria as partículas se a janela for redimensionada
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles(); 
        });
    }
    
    // --- 4. Lógica do Pop-up de Saída (Exit-Intent) ---
    const popupOverlay = document.getElementById('popup-overlay');
    const popupModal = document.getElementById('popup-modal');
    const closeButton = document.getElementById('popup-close');
    let popupShown = false; // Garante que o pop-up só apareça uma vez

    // Função para mostrar o pop-up
    function showPopup() {
        if (popupShown) return; // Não mostra se já foi mostrado
        popupOverlay.classList.remove('hidden');
        popupModal.classList.remove('hidden');
        popupShown = true;
    }

    // Função para esconder o pop-up
    function hidePopup() {
        popupOverlay.classList.add('hidden');
        popupModal.classList.add('hidden');
    }

    // Detecta a intenção de saída (mouse saindo pelo topo da tela)
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0) { // Se o mouse saiu pelo topo
            showPopup();
        }
    });

    // Fecha o pop-up ao clicar no 'X'
    if (closeButton) {
        closeButton.addEventListener('click', hidePopup);
    }

    // Fecha o pop-up ao clicar no overlay (fundo escuro)
    if (popupOverlay) {
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) { // Garante que clicou só no fundo, não no modal
                hidePopup();
            }
        });
    }

});


