document.addEventListener('DOMContentLoaded', () => {
    const btnOpen = document.getElementById('btn-open');
    const welcome = document.getElementById('welcome-screen');
    const main = document.getElementById('main-content');
    const audio = document.getElementById('bg-music');
    const musicControl = document.getElementById('music-control');

    // Al abrir la invitación
    btnOpen.addEventListener('click', () => {
        // 1. Iniciar música (Muchos navegadores bloquean audio si no hay interacción)
        audio.play().catch(e => console.log("Audio bloqueado por navegador"));
        
        // 2. Transición visual
        welcome.style.opacity = '0';
        setTimeout(() => {
            welcome.classList.add('hidden');
            main.classList.remove('hidden');
            musicControl.classList.remove('hidden');
            initScrollReveal();
        }, 800);
    });

    // Control de música manual
    let isPlaying = true;
    musicControl.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicControl.style.opacity = '0.5';
        } else {
            audio.play();
            musicControl.style.opacity = '1';
        }
        isPlaying = !isPlaying;
    });

    // Observer para animaciones al bajar
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
});
