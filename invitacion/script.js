// CONFIGURACIÓN DE SUPABASE (REMPLAZAR CON TUS CREDENCIALES REALES)
const SUPABASE_URL = "https://TU_PROYECTO.supabase.co";
const SUPABASE_ANON_KEY = "TU_ANON_KEY_DE_SUPABASE";

const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

document.addEventListener("DOMContentLoaded", () => {
    
    // ELEMENTOS DEL DOM
    const envelopeWrapper = document.getElementById("envelope-wrapper");
    // ARREGLO DE CLIC: Seleccionar solo el sello, no el sobre
    const waxSeal = document.getElementById("wax-seal");
    const mainContent = document.getElementById("main-content");
    const bgMusic = document.getElementById("bg-music");
    const musicControl = document.getElementById("music-control");
    const rsvpForm = document.getElementById("rsvp-form");
    const formStatus = document.getElementById("form-status");
    const asistenciaRadios = document.querySelectorAll('input[name="asistencia"]');
    const wrapperAcompanantes = document.getElementById("wrapper-acompanantes");

    // 1. ANIMACIÓN DE APERTURA DEL SOBRE (SOLO AL TOCAR EL SELLO)
    waxSeal.addEventListener("click", (e) => {
        // Evitar comportamientos extraños del navegador en móviles
        e.stopPropagation(); 
        
        if (!envelopeWrapper.classList.contains("open")) {
            envelopeWrapper.classList.add("open");
            
            // Iniciar Audio Sutilmente (solo si el autoplay es exitoso)
            bgMusic.volume = 0.2; // Volumen inicial bajo solicitado
            const playPromise = bgMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicControl.classList.remove("hidden");
                    toggleMusicIcon(true);
                }).catch(error => {
                    console.log("Autoplay bloqueado por el navegador. Se activará tras interactuar.");
                    musicControl.classList.remove("hidden");
                });
            }

            // Transición fluida al contenido principal de la invitación
            setTimeout(() => {
                envelopeWrapper.classList.add("fade-out");
                mainContent.classList.remove("hidden-content");
                mainContent.classList.add("visible-content");
                // Permitir scroll en la página una vez abierta la invitación
                document.body.style.overflowY = "auto";
            }, 2000); // Dar tiempo para ver la carta salir
        }
    });

    // Bloquear scroll inicial mientras el sobre está cerrado
    document.body.style.overflowY = "hidden";

    // 2. SISTEMA DE AUDIO (PLAY / PAUSE)
    musicControl.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play();
            toggleMusicIcon(true);
        } else {
            bgMusic.pause();
            toggleMusicIcon(false);
        }
    });

    function toggleMusicIcon(isPlaying) {
        const iconPlay = musicControl.querySelector(".icon-play");
        const iconPause = musicControl.querySelector(".icon-pause");
        if (isPlaying) {
            iconPlay.classList.add("hidden");
            iconPause.classList.remove("hidden");
        } else {
            iconPlay.classList.remove("hidden");
            iconPause.classList.add("hidden");
        }
    }

    // 3. CUENTA REGRESIVA ELEGANTE
    const targetDate = new Date("October 10, 2026 16:30:00").getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            clearInterval(countdownInterval);
            document.querySelector(".countdown-container").innerHTML = "<p class='prose'>¡Hoy es el gran día!</p>";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = String(days).padStart(2, '0');
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    }, 1000);

    // 4. LÓGICA DINÁMICA DEL FORMULARIO DE ASISTENCIA
    asistenciaRadios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "false") {
                wrapperAcompanantes.style.display = "none";
                document.getElementById("acompanantes").value = "0";
            } else {
                wrapperAcompanantes.style.display = "block";
            }
        });
    });

    // 5. ENVÍO DE DATOS A SUPABASE (COMPATIBLE CON ESPECIFICACIÓN DE TABLA EXACTA)
    rsvpForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById("submit-btn");
        submitBtn.innerText = "PROCESANDO...";
        submitBtn.disabled = true;

        const nombre = document.getElementById("nombre").value.trim();
        const asistencia = document.querySelector('input[name="asistencia"]:checked').value === "true";
        const acompanantes = parseInt(document.getElementById("acompanantes").value, 10) || 0;
        const mensaje = document.getElementById("mensaje").value.trim();

        if (!supabase) {
            formStatus.style.color = "var(--terracota)";
            formStatus.innerText = "Error: Configura las credenciales de Supabase en script.js.";
            submitBtn.innerText = "ENVIAR CONFIRMACIÓN";
            submitBtn.disabled = false;
            return;
        }

        try {
            const { data, error } = await supabase
                .from('invitados')
                .insert([
                    { 
                        nombre: nombre, 
                        asistencia: asistencia, 
                        acompanantes: acompanantes, 
                        mensaje: mensaje 
                    }
                ]);

            if (error) throw error;

            formStatus.style.color = "var(--texto-light)";
            formStatus.innerText = "Gracias. Tu confirmación ha sido recibida con éxito.";
            rsvpForm.reset();
            wrapperAcompanantes.style.display = "block";
            
        } catch (error) {
            console.error("Error al guardar en Supabase:", error);
            formStatus.style.color = "var(--terracota)";
            formStatus.innerText = "Hubo un inconveniente. Por favor, inténtalo nuevamente.";
        } finally {
            submitBtn.innerText = "ENVIAR CONFIRMACIÓN";
            submitBtn.disabled = false;
        }
    });
});
