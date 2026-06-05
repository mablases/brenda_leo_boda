/**
 * CONFIGURACIÓN DE CRÉDENCIALES
 * Reemplaza con tus datos de Supabase cuando los tengas.
 * Si dejas esto como está, la invitación funcionará igual, 
 * solo que el formulario de RSVP mostrará un error al enviar.
 */
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';
const SUPABASE_KEY = 'TU_ANON_KEY';

// Inicialización segura de Supabase
let supabaseClient = null;
if (typeof supabase !== 'undefined' && !SUPABASE_URL.includes('TU_PROYECTO')) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECTORES
    const welcomeScreen = document.getElementById('welcome-screen');
    const btnOpen = document.getElementById('btn-open');
    const mainContent = document.getElementById('main-content');
    const rsvpForm = document.getElementById('rsvp-form');
    const formResponse = document.getElementById('form-response');

    // 2. LÓGICA DE APERTURA (Optimizada)
    if (btnOpen) {
        btnOpen.addEventListener('click', () => {
            // Efecto de desvanecimiento suave
            welcomeScreen.style.opacity = '0';
            welcomeScreen.style.transition = 'opacity 1s ease';
            
            setTimeout(() => {
                welcomeScreen.classList.add('hidden');
                mainContent.classList.remove('hidden');
                
                // Forzar un pequeño delay para que las animaciones de entrada se activen
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    initAnimations();
                }, 50);
            }, 1000);
        });
    }

    // 3. CUENTA REGRESIVA (Brenda & Leo - 12 Oct 2024)
    const weddingDate = new Date('October 12, 2024 17:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            const countdownEl = document.getElementById('countdown');
            if (countdownEl) countdownEl.innerHTML = "<h3>¡Llegó el gran día!</h3>";
            return;
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = d < 10 ? '0' + d : d;
        document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
        document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
        document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 4. ANIMACIONES AL HACER SCROLL
    function initAnimations() {
        const reveals = document.querySelectorAll('.reveal');
        const observerOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        reveals.forEach(reveal => {
            observer.observe(reveal);
        });
    }

    // 5. RSVP FORM (Envío a Supabase)
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const originalBtnText = submitBtn.innerText;
            
            submitBtn.innerText = 'ENVIANDO...';
            submitBtn.disabled = true;

            const formData = {
                nombre: document.getElementById('name').value,
                asistencia: document.getElementById('attendance').value,
                acompanantes: parseInt(document.getElementById('guests').value) || 0,
                mensaje: document.getElementById('message').value,
                fecha_registro: new Date().toISOString()
            };

            // Si Supabase no está configurado, simulamos éxito para que veas el diseño
            if (!supabaseClient) {
                console.warn("Supabase no configurado. Datos recibidos localmente:", formData);
                setTimeout(() => {
                    rsvpForm.classList.add('hidden');
                    formResponse.classList.remove('hidden');
                }, 1500);
                return;
            }

            try {
                const { error } = await supabaseClient
                    .from('confirmaciones')
                    .insert([formData]);

                if (error) throw error;

                rsvpForm.classList.add('hidden');
                formResponse.classList.remove('hidden');
            } catch (error) {
                console.error('Error de Supabase:', error.message);
                alert('Error al conectar con la base de datos. Verifica las credenciales.');
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
