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
        const numParticles = 150; // Mais partículas para um efeito de "neblina"

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1; // Partículas ligeiramente maiores
                this.speedX = Math.random() * 0.1 - 0.05; // Movimento MUITO lento
                this.speedY = Math.random() * 0.1 - 0.05; // Movimento MUITO lento
                // Cor cinza-azulada etérea com opacidade muito baixa
                this.color = `rgba(200, 210, 220, ${Math.random() * 0.1 + 0.02})`; 
            }
            
            // Atualiza a posição da partícula
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Faz as partículas reaparecerem do outro lado (wrap)
                if (this.x > canvas.width + this.size) this.x = -this.size;
                if (this.x < -this.size) this.x = canvas.width + this.size;
                if (this.y > canvas.height + this.size) this.y = -this.size;
                if (this.y < -this.size) this.y = canvas.height + this.size;
            }
            
            // Desenha a partícula
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
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

