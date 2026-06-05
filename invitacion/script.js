/*
   Brenda & Leo - Invitación de Boda Premium
   Controladores de Interactividad, Animaciones e Integración con Supabase
*/
// ==========================================
// 1. CONFIGURACIÓN DE SUPABASE
// ==========================================
// Reemplaza "MI_URL" y "MI_KEY" con los datos correspondientes de tu proyecto de Supabase.
const supabaseUrl = "MI_URL";
const supabaseKey = "MI_KEY";
// Asegurar que todo el código se ejecute cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log("Iniciando script de la invitación...");
    // ==========================================
    // 2. APERTURA DE INVITACIÓN Y MÚSICA
    // ==========================================
    const btnOpenInvitation = document.getElementById('btn-open-invitation');
    const coverOverlay = document.getElementById('invitation-cover');
    const backgroundMusic = document.getElementById('background-music');
    const btnMusicToggle = document.getElementById('btn-music-toggle');
    const iconMusicOn = document.getElementById('icon-music-on');
    const iconMusicOff = document.getElementById('icon-music-off');
    // Verificar si los elementos básicos de apertura existen
    if (!btnOpenInvitation || !coverOverlay) {
        console.error("Error crítico: No se encontró el botón de apertura o la pantalla de cover en el HTML.");
        return;
    }
    // Evento al abrir la invitación
    btnOpenInvitation.addEventListener('click', () => {
        console.log("Abriendo invitación...");
        
        // 1. Añadir clase para la transición hacia arriba
        coverOverlay.classList.add('opened');
        
        // 2. Mostrar el botón flotante de música si existe
        if (btnMusicToggle) {
            btnMusicToggle.style.display = 'flex';
        }
        
        // 3. Intentar reproducir la música de fondo
        if (backgroundMusic) {
            backgroundMusic.play().then(() => {
                console.log("Música reproducida correctamente.");
                if (iconMusicOn && iconMusicOff) {
                    iconMusicOn.style.display = 'block';
                    iconMusicOff.style.display = 'none';
                }
            }).catch(error => {
                console.warn("La autoreproducción de música fue bloqueada por el navegador:", error);
                if (iconMusicOn && iconMusicOff) {
                    iconMusicOn.style.display = 'none';
                    iconMusicOff.style.display = 'block';
                }
            });
        }
        
        // 4. Iniciar animaciones de reveal en la pantalla principal
        setTimeout(triggerInitialScrollReveal, 300);
    });
    // Control manual del reproductor de música
    if (btnMusicToggle && backgroundMusic) {
        btnMusicToggle.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                if (iconMusicOn && iconMusicOff) {
                    iconMusicOn.style.display = 'block';
                    iconMusicOff.style.display = 'none';
                }
            } else {
                backgroundMusic.pause();
                if (iconMusicOn && iconMusicOff) {
                    iconMusicOn.style.display = 'none';
                    iconMusicOff.style.display = 'block';
                }
            }
        });
    }
    // ==========================================
    // 3. REVEAL ON SCROLL (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-fade');
    const revealOnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });
    revealElements.forEach(element => {
        revealOnScrollObserver.observe(element);
    });
    function triggerInitialScrollReveal() {
        const initialElements = document.querySelectorAll('.hero .reveal, .hero .reveal-fade');
        initialElements.forEach(el => {
            el.classList.add('active');
        });
    }
    // ==========================================
    // 4. CUENTA REGRESIVA (COUNTDOWN)
    // ==========================================
    // Fecha del evento: 17 de Octubre de 2026, 16:30:00 (Hora de la Ceremonia)
    const weddingDate = new Date('October 17, 2026 16:30:00').getTime();
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (daysEl && hoursEl && minutesEl && secondsEl) {
        let countdownInterval;
        countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            daysEl.innerText = days.toString().padStart(2, '0');
            hoursEl.innerText = hours.toString().padStart(2, '0');
            minutesEl.innerText = minutes.toString().padStart(2, '0');
            secondsEl.innerText = seconds.toString().padStart(2, '0');
            if (distance < 0) {
                clearInterval(countdownInterval);
                const timerContainer = document.getElementById('countdown-timer');
                if (timerContainer) {
                    timerContainer.innerHTML = "<div class='countdown-item' style='flex: 1; padding: 20px;'><div class='countdown-number' style='font-size: 1.5rem;'>¡Llegó el gran día!</div></div>";
                }
            }
        }, 1000);
    }
    // ==========================================
    // 5. GALERÍA DE FOTOS INTERACTIVA (LIGHTBOX)
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const btnLightboxClose = document.getElementById('btn-lightbox-close');
    const btnLightboxPrev = document.getElementById('btn-lightbox-prev');
    const btnLightboxNext = document.getElementById('btn-lightbox-next');
    if (galleryItems.length > 0 && lightbox && lightboxImg) {
        let currentImageIndex = 0;
        const imagesList = Array.from(galleryItems).map(item => item.querySelector('img').src);
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                currentImageIndex = parseInt(item.getAttribute('data-index'));
                updateLightboxImage();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        if (btnLightboxClose) {
            btnLightboxClose.addEventListener('click', closeLightbox);
        }
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        function updateLightboxImage() {
            lightboxImg.src = imagesList[currentImageIndex];
        }
        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % imagesList.length;
            updateLightboxImage();
        }
        function prevImage() {
            currentImageIndex = (currentImageIndex - 1 + imagesList.length) % imagesList.length;
            updateLightboxImage();
        }
        if (btnLightboxNext) {
            btnLightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                nextImage();
            });
        }
        if (btnLightboxPrev) {
            btnLightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                prevImage();
            });
        }
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
            }
        });
    }
    // ==========================================
    // 6. ENTRADA/COMPORTAMIENTO RSVP FORMULARIO
    // ==========================================
    const rsvpForm = document.getElementById('rsvp-form');
    const radioAsistencia = document.getElementsByName('asistencia');
    const groupAcompanantes = document.getElementById('group-acompanantes');
    const inputAcompanantes = document.getElementById('acompanantes');
    if (radioAsistencia.length > 0 && groupAcompanantes && inputAcompanantes) {
        radioAsistencia.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'true') {
                    groupAcompanantes.style.display = 'block';
                    inputAcompanantes.disabled = false;
                    inputAcompanantes.value = '0';
                } else {
                    groupAcompanantes.style.display = 'none';
                    inputAcompanantes.disabled = true;
                    inputAcompanantes.value = '0';
                }
            });
        });
    }
    // ==========================================
    // 7. ENVÍO DE RSVP A SUPABASE
    // ==========================================
    const btnSubmitRsvp = document.getElementById('btn-submit-rsvp');
    const statusSuccess = document.getElementById('rsvp-status-success');
    const statusError = document.getElementById('rsvp-status-error');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (statusSuccess) statusSuccess.style.display = 'none';
            if (statusError) statusError.style.display = 'none';
            
            const nombre = document.getElementById('nombre').value.trim();
            const asistenciaValue = document.querySelector('input[name="asistencia"]:checked').value;
            const asistencia = asistenciaValue === 'true';
            const acompanantes = asistencia ? parseInt(inputAcompanantes.value, 10) : 0;
            const mensaje = document.getElementById('mensaje').value.trim();
            if (!nombre) {
                alert("Por favor, introduce tu nombre completo.");
                return;
            }
            if (btnSubmitRsvp) {
                btnSubmitRsvp.disabled = true;
                btnSubmitRsvp.innerText = "Registrando...";
            }
            // Simulación local si las credenciales no se han configurado
            if (supabaseUrl === "MI_URL" || supabaseKey === "MI_KEY") {
                console.warn("Advertencia: Las credenciales de Supabase no han sido configuradas todavía.");
                setTimeout(() => {
                    if (btnSubmitRsvp) {
                        btnSubmitRsvp.disabled = false;
                        btnSubmitRsvp.innerText = "Confirmar Asistencia";
                    }
                    if (statusSuccess) {
                        statusSuccess.style.display = 'block';
                        statusSuccess.innerText = "[Simulación de Desarrollo] Los datos se habrían guardado. Configura 'MI_URL' y 'MI_KEY' en script.js.";
                    }
                    rsvpForm.reset();
                    if (groupAcompanantes && inputAcompanantes) {
                        groupAcompanantes.style.display = 'block';
                        inputAcompanantes.disabled = false;
                    }
                }, 1500);
                return;
            }
            // Petición POST real a Supabase
            try {
                const response = await fetch(`${supabaseUrl}/rest/v1/invitados`, {
                    method: 'POST',
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        nombre: nombre,
                        asistencia: asistencia,
                        acompanantes: acompanantes,
                        mensaje: mensaje
                    })
                });
                if (response.ok) {
                    if (statusSuccess) statusSuccess.style.display = 'block';
                    rsvpForm.reset();
                    if (groupAcompanantes && inputAcompanantes) {
                        groupAcompanantes.style.display = 'block';
                        inputAcompanantes.disabled = false;
                    }
                } else {
                    const errorData = await response.json();
                    console.error("Error devuelto por Supabase:", errorData);
                    if (statusError) statusError.style.display = 'block';
                }
            } catch (error) {
                console.error("Error al conectar con la base de datos:", error);
                if (statusError) statusError.style.display = 'block';
            } finally {
                if (btnSubmitRsvp) {
                    btnSubmitRsvp.disabled = false;
                    btnSubmitRsvp.innerText = "Confirmar Asistencia";
                }
            }
        });
    }
});
