/* ============================================================
   BRENDA & LEO — Invitación de Boda Premium
   script.js — Lógica completa
   ============================================================ */

// ── Configuración Supabase ──────────────────────────────────
const SUPABASE_URL = "https://wqzavjzfoxzjrijccteh.supabase.co";   // Reemplaza con tu URL
const SUPABASE_KEY = "sb_publishable_fTYkp41FOfaaVFRI1dSZRQ_dXjPstB7";   // Reemplaza con tu anon key

/**
 * Cliente Supabase minimalista (sin SDK externo).
 * Usa la API REST de Supabase directamente con fetch.
 */
const supabase = {
  /**
   * Inserta un registro en la tabla 'invitados'.
   * @param {Object} data — { nombre, asistencia, acompanantes, mensaje }
   * @returns {Promise<{data, error}>}
   */
  async insertInvitado(data) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/invitados`, {
        method: 'POST',
        headers: {
          'apikey':        SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type':  'application/json',
          'Prefer':        'return=representation',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error };
      }

      const result = await response.json();
      return { data: result, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },
};

// ── DOM Ready ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initEnvelope();
  initScrollReveal();
  initCountdown();
  initRSVP();
  initGallery();
  initParallax();
  generateParticles();
});

/* ============================================================
   PANTALLA DE APERTURA (SOBRE)
   ============================================================ */
function initEnvelope() {
  const screen = document.getElementById('envelope-screen');
  if (!screen) return;

  // Al hacer click o tocar, abrir la invitación
  screen.addEventListener('click', openInvitation);
  screen.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') openInvitation();
  });
  screen.setAttribute('tabindex', '0');
  screen.setAttribute('role', 'button');
  screen.setAttribute('aria-label', 'Abrir invitación');
}

/**
 * Anima el cierre del sobre y revela la invitación.
 */
function openInvitation() {
  const screen = document.getElementById('envelope-screen');
  const body   = document.body;

  // Anima la tapa del sobre (SVG path #flap)
  const flap = document.getElementById('envelope-flap');
  if (flap) {
    flap.style.transform     = 'rotateX(180deg)';
    flap.style.transformOrigin = 'top center';
    flap.style.transition    = 'transform 0.7s ease';
  }

  // Espera un poco y oculta el sobre
  setTimeout(() => {
    screen.classList.add('hide');
    body.classList.add('invitation-open');

    // Fuerza reflow para activar transiciones CSS del hero
    document.getElementById('hero')?.offsetHeight;
  }, 600);
}

/* ============================================================
   GENERADOR DE PARTÍCULAS FLOTANTES
   ============================================================ */
function generateParticles() {
  const container = document.querySelector('.envelope-particles');
  if (!container) return;

  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left:     ${Math.random() * 100}%;
      top:      ${Math.random() * 100}%;
      width:    ${Math.random() * 3 + 1}px;
      height:   ${Math.random() * 3 + 1}px;
      opacity:  ${Math.random() * 0.3 + 0.05};
      animation-duration:  ${Math.random() * 20 + 15}s;
      animation-delay:     ${Math.random() * -20}s;
    `;
    container.appendChild(p);
  }
}

/* ============================================================
   REVEAL ON SCROLL
   Utiliza IntersectionObserver para animar elementos al entrar
   en viewport.
   ============================================================ */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Anima solo una vez
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}

/* ============================================================
   CUENTA REGRESIVA
   Actualiza cada segundo hasta la fecha de boda.
   ============================================================ */
function initCountdown() {
  const WEDDING_DATE = new Date('2026-09-12T17:00:00');

  const elDays  = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins  = document.getElementById('cd-mins');
  const elSecs  = document.getElementById('cd-secs');

  // Si no encuentra los IDs en el HTML, se detiene para no dar error
  if (!elDays || !elHours || !elMins || !elSecs) return;

  function update() {
    const now  = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      elDays.textContent  = '00';
      elHours.textContent = '00';
      elMins.textContent  = '00';
      elSecs.textContent  = '00';
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    elDays.textContent  = String(days).padStart(2, '0');
    elHours.textContent = String(hours).padStart(2, '0');
    elMins.textContent  = String(mins).padStart(2, '0');
    elSecs.textContent  = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ESTA ES LA LLAVE QUE ENCIENDE EL MOTOR
document.addEventListener('DOMContentLoaded', function() {
  initCountdown();
});

/* ============================================================
   PARALAJE SUAVE
   Mueve el fondo del hero ligeramente al hacer scroll.
   ============================================================ */
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        // Desplaza el fondo a la mitad de la velocidad del scroll
        heroBg.style.transform = `translateY(${scrollY * 0.35}px) scale(1.05)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   GALERÍA CON LIGHTBOX (ACTUALIZADA PARA LEER ETIQUETAS IMG)
   ============================================================ */
function initGallery() {
  // Ahora buscamos todos los elementos de la galería, sin importar si tienen data-src
  const items    = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbClose  = document.getElementById('lightbox-close');

  if (!lightbox) return;

  // Abrir lightbox
  items.forEach(item => {
    item.addEventListener('click', () => {
      // Buscar la etiqueta <img ...> que está dentro de este cuadro
      const img = item.querySelector('img');
      // Si no hay imagen o no tiene 'src', no hacer nada
      if (!img || !img.src) return;
      
      lbImg.src = img.src; // Pasar la foto real al lightbox
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Cerrar lightbox
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 400);
  }

  lbClose?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

/* ============================================================
   RSVP — Formulario + Supabase
   ============================================================ */
function initRSVP() {
  const form       = document.getElementById('rsvp-form');
  const success    = document.getElementById('rsvp-success');
  const errorBox   = document.getElementById('rsvp-error');
  const submitBtn  = document.getElementById('rsvp-submit');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();

    // ── Recoger datos del formulario ──
    const nombre       = form.querySelector('#field-nombre')?.value.trim();
    const asistencia   = form.querySelector('input[name="asistencia"]:checked')?.value;
    const acompanantes = parseInt(form.querySelector('#field-acompanantes')?.value || '0', 10);
    const mensaje      = form.querySelector('#field-mensaje')?.value.trim() || '';

    // ── Validaciones básicas ──
    if (!nombre) {
      showError('Por favor, ingresa tu nombre completo.');
      return;
    }
    if (!asistencia) {
      showError('Por favor, indica si podrás asistir.');
      return;
    }

    // ── Estado de carga ──
    setSubmitLoading(true, submitBtn);

    // ── Enviar a Supabase ──
    const { error } = await supabase.insertInvitado({
      nombre,
      asistencia,
      acompanantes,
      mensaje,
    });

    setSubmitLoading(false, submitBtn);

    if (error) {
      console.error('Supabase error:', error);
      showError('Hubo un problema al enviar tu confirmación. Por favor, inténtalo de nuevo.');
      return;
    }

    // ── Éxito ──
    form.style.opacity    = '0';
    form.style.transform  = 'translateY(-10px)';
    form.style.transition = '0.5s ease';

    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('show');
    }, 500);
  });

  // ── Helpers ──
  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.add('show');
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearErrors() {
    errorBox.textContent = '';
    errorBox.classList.remove('show');
  }

  function setSubmitLoading(isLoading, btn) {
    if (isLoading) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Enviando...';
    } else {
      btn.disabled = false;
      btn.innerHTML = 'Confirmar Asistencia';
    }
  }
}

/* ============================================================
   SMOOTH SCROLL para anclas internas
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ============================================================
   FUNCIÓN: COPIAR PORTAPAPELES (MESA DE REGALOS)
   ============================================================ */
function copyToClipboard(text, btnElement) {
  // Verifica si el navegador soporta la API moderna del portapapeles
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showCopySuccess(btnElement);
    }).catch(err => console.error('Error al copiar: ', err));
  } else {
    // Fallback seguro para navegadores o celulares más antiguos
    let textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showCopySuccess(btnElement);
    } catch (err) {
      console.error('Error al copiar usando fallback: ', err);
    }
    textArea.remove();
  }
}

function showCopySuccess(btnElement) {
  // Guardamos el icono original de copiar
  const originalHTML = btnElement.innerHTML;
  
  // Cambiamos el icono a una palomita (Checkmark) animada con color de éxito
  btnElement.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--olive)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: scale(1.2); transition: all 0.3s ease;">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;
  
  // Deshabilitamos el botón temporalmente para evitar clics dobles
  btnElement.style.pointerEvents = "none";
  
  // Restauramos el icono original después de 2.5 segundos
  setTimeout(() => {
    btnElement.innerHTML = originalHTML;
    btnElement.style.pointerEvents = "auto";
  }, 2500);
}
