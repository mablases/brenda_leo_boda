// 1. CONFIGURACIÓN SUPABASE
const _URL = 'https://TU_PROYECTO.supabase.co';
const _KEY = 'TU_ANON_KEY';
const supabaseClient = (typeof supabase !== 'undefined') ? supabase.createClient(_URL, _KEY) : null;

// 2. ANIMACIÓN DE ENTRADA (GSAP)
window.onload = () => {
    const tl = gsap.timeline();
    
    tl.to(".welcome-anim", {
        opacity: 1,
        y: -20,
        duration: 1.2,
        stagger: 0.3,
        ease: "power2.out"
    });
};

// 3. BOTÓN INICIO EXPERIENCIA
document.getElementById('btn-start').addEventListener('click', () => {
    gsap.to("#welcome-screen", {
        y: "-100%",
        duration: 1.5,
        ease: "expo.inOut",
        onComplete: () => {
            document.getElementById('welcome-screen').classList.add('hidden');
            document.getElementById('main-content').classList.remove('hidden');
            startMainAnimations();
        }
    });
    
    gsap.to("#main-content", { opacity: 1, duration: 2 });
});

// 4. ANIMACIONES DE SCROLL (MAISON OLIVE STYLE)
function startMainAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Animación de los textos que suben
    gsap.utils.toArray(".reveal-text").forEach(text => {
        gsap.to(text, {
            scrollTrigger: {
                trigger: text,
                start: "top 90%",
            },
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power4.out"
        });
    });

    // Efecto Zoom en la foto principal
    gsap.to("#hero-image", {
        scale: 1,
        duration: 20,
        ease: "none"
    });
}

// 5. CURSOR PERSONALIZADO
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: "power2.out"
    });
});

// 6. ENVÍO RSVP A SUPABASE
document.getElementById('rsvp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.innerHTML = "PROCESANDO...";
    btn.disabled = true;

    const data = {
        nombre: document.getElementById('name').value,
        asistencia: document.getElementById('attendance').value,
        acompanantes: document.getElementById('guests').value,
        mensaje: document.getElementById('message').value
    };

    if (supabaseClient) {
        const { error } = await supabaseClient.from('confirmaciones').insert([data]);
        if (error) {
            alert("Error al enviar. Inténtalo de nuevo.");
            btn.innerHTML = "ENVIAR CONFIRMACIÓN";
            btn.disabled = false;
            return;
        }
    } else {
        // Simulación si no hay Supabase
        console.log("Simulación de envío:", data);
    }

    gsap.to("#rsvp-form", { opacity: 0, height: 0, duration: 1 });
    document.getElementById('success-msg').classList.remove('hidden');
});
