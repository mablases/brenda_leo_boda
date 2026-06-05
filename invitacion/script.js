// CONFIGURACIÓN SUPABASE (Reemplaza con tus datos reales)
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_KEY = 'TU_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ELEMENTOS DEL DOM
const welcomeScreen = document.getElementById('welcome-screen');
const btnOpen = document.getElementById('btn-open');
const mainContent = document.getElementById('main-content');
const rsvpForm = document.getElementById('rsvp-form');
const formResponse = document.getElementById('form-response');

// 1. MANEJO DE PANTALLA DE BIENVENIDA
btnOpen.addEventListener('click', () => {
    welcomeScreen.style.opacity = '0';
    setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        window.scrollTo(0, 0);
        initAnimations();
    }, 1000);
});

// 2. CUENTA REGRESIVA
const weddingDate = new Date('October 12, 2024 17:00:00').getTime();

const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = d < 10 ? '0' + d : d;
    document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
    document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
    document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;

    if (distance < 0) {
        clearInterval(countdown);
        document.getElementById('countdown').innerHTML = "<h3>¡HOY ES EL GRAN DÍA!</h3>";
    }
}, 1000);

// 3. ANIMACIONES AL HACER SCROLL (Reveal)
function initAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

// 4. RSVP A SUPABASE
rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = 'ENVIANDO...';
    submitBtn.disabled = true;

    const formData = {
        nombre: document.getElementById('name').value,
        asistencia: document.getElementById('attendance').value,
        acompanantes: parseInt(document.getElementById('guests').value) || 0,
        mensaje: document.getElementById('message').value,
        fecha_registro: new Date()
    };

    try {
        // Asegúrate de crear una tabla llamada 'confirmaciones' en Supabase
        const { data, error } = await supabase
            .from('confirmaciones')
            .insert([formData]);

        if (error) throw error;

        rsvpForm.classList.add('hidden');
        formResponse.classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al enviar tu respuesta. Por favor intenta de nuevo.');
        submitBtn.innerText = 'ENVIAR CONFIRMACIÓN';
        submitBtn.disabled = false;
    }
});
