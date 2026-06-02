document.addEventListener('DOMContentLoaded', () => {

    // 1. CONFIGURACIÓN DE LA FECHA (Brenda & Leo)
    // Cambia esta fecha por la real del evento
    const weddingDate = new Date('November 15, 2025 18:00:00').getTime();

    // 2. ABRIR INVITACIÓN
    const openBtn = document.getElementById('open-invitation');
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-content');

    openBtn.addEventListener('click', () => {
        welcomeScreen.style.transform = 'translateY(-100%)';
        
        // Esperamos a que la cortina suba para mostrar el contenido
        setTimeout(() => {
            mainContent.classList.remove('hidden');
            revealOnScroll(); // Disparar primera animación
        }, 600);
    });

    // 3. CUENTA REGRESIVA
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const diff = weddingDate - now;

        if (diff <= 0) {
            clearInterval(timer);
            document.getElementById('countdown').innerHTML = "¡ES HOY!";
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = d < 10 ? '0' + d : d;
        document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
        document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
        document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;
    }, 1000);

    // 4. ANIMACIONES AL HACER SCROLL (FADE IN)
    const revealOnScroll = () => {
        const reveals = document.querySelectorAll('.reveal');
        const triggerBottom = window.innerHeight * 0.85;

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < triggerBottom) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);

    // 5. MANEJO DEL FORMULARIO RSVP
    const form = document.getElementById('wedding-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const status = document.getElementById('attendance').value;
        
        if (status === 'si') {
            alert(`¡Gracias ${name}! Brenda y Leo te esperan con mucha alegría.`);
        } else {
            alert(`Gracias por avisarnos ${name}. Te extrañaremos en la celebración.`);
        }
        
        form.reset();
    });

    // 6. SCROLL SUAVE
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});