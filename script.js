document.addEventListener('DOMContentLoaded', () => {
    
    // ----- 1. Atualização Automática do Ano no Rodapé -----
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ----- 2. Animação de Fade-in ao Rolar (Intersection Observer) -----
    // Seleciona todos os elementos que devem "aparecer" ao rolar
    const faders = document.querySelectorAll('.fade-in-section');
    
    const appearOptions = {
        threshold: 0.1, // O elemento precisa estar 10% visível
        rootMargin: "0px 0px -50px 0px" // Começa a carregar 50px antes de atingir o fim da tela
    };

    const appearOnScroll = new IntersectionObserver(function(
        entries,
        appearOnScroll
    ) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return; // Se não estiver visível, não faz nada
            } else {
                entry.target.classList.add('is-visible'); // Adiciona a classe que o torna visível
                appearOnScroll.unobserve(entry.target); // Para de observar (animação só acontece 1 vez)
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader); // Observa cada elemento
    });

    // ----- 3. Animação de Neblina/Fumaça (Canvas) -----
    const canvas = document.getElementById('freshness-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const numParticles = 100; // Quantidade de partículas de fumaça

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 50; // Começa de baixo
                this.size = Math.random() * 35 + 20; // Tamanho da "fumaça"
                this.speedY = -(Math.random() * 0.5 + 0.2); // Velocidade de subida
                this.speedX = Math.random() * 0.4 - 0.2; // Movimento lateral leve
                // Cor cinza-azulada sutil e com opacidade muito baixa
                this.color = `rgba(200, 210, 220, ${Math.random() * 0.05 + 0.02})`; 
            }

            // Atualiza a posição da partícula
            update() {
                this.y += this.speedY;
                this.x += this.speedX;

                // Se a partícula saiu do topo, ela "morre" e renasce embaixo
                if (this.y < -this.size) {
                    this.y = canvas.height + Math.random() * 50;
                    this.x = Math.random() * canvas.width;
                    this.size = Math.random() * 35 + 20;
                    this.speedY = -(Math.random() * 0.5 + 0.2);
                    this.color = `rgba(200, 210, 220, ${Math.random() * 0.05 + 0.02})`;
                }
            }

            // Desenha a partícula (círculo)
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Cria as partículas iniciais
        function initParticles() {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        // Loop da Animação
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(); // Atualiza posição
                particles[i].draw(); // Desenha
            }
            requestAnimationFrame(animateParticles); // Repete o loop
        }

        // Inicializa tudo
        resizeCanvas();
        initParticles();
        animateParticles();

        // Refaz o canvas se a janela mudar de tamanho
        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });
    }

    // ----- 4. Lógica do Pop-up de Saída (Exit-Intent) -----
    const popupModal = document.getElementById('popup-modal');
    const popupOverlay = document.getElementById('popup-overlay');
    const closeButton = document.getElementById('popup-close');
    let popupShown = false; // Flag para mostrar o pop-up apenas uma vez

    function showPopup() {
        if (!popupShown) {
            popupModal.classList.remove('hidden');
            popupOverlay.classList.remove('hidden');
            popupShown = true; // Marca como exibido
        }
    }

    function hidePopup() {
        popupModal.classList.add('hidden');
        popupOverlay.classList.add('hidden');
    }

    // Evento de Saída (Mouse saindo pelo topo da janela)
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0) { // Se o mouse saiu por cima
            showPopup();
        }
    });

    // Eventos para fechar o pop-up
    if (closeButton) {
        closeButton.addEventListener('click', hidePopup);
    }
    if (popupOverlay) {
        popupOverlay.addEventListener('click', hidePopup);
    }
});

