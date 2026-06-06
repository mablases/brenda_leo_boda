// 1. Función para quitar el sobre y abrir la invitación
function openInvitation() {
    const envelopeScreen = document.getElementById('envelope-screen');
    envelopeScreen.classList.add('hide');
}

// 2. Animación suave de aparición al hacer Scroll (Intersection Observer)
document.addEventListener("DOMContentLoaded", () => {
    const elementsToReveal = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15
    });

    elementsToReveal.forEach(element => observer.observe(element));
});

// 3. Lógica Automática del Contador Regresivo
const weddingDate = new Date('October 30, 2026 16:30:00').getTime();

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;

    // Si la fecha ya pasó
    if (timeLeft < 0) {
        clearInterval(countdownInterval);
        document.querySelector('.countdown-grid').innerHTML = "<p>¡Llegó el gran día!</p>";
        return;
    }

    // Cálculos matemáticos de tiempo
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Asignar al HTML añadiendo un cero a la izquierda si es menor de 10
    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
}, 1000);

// 4. Captura simple del Formulario RSVP
const rsvpForm = document.getElementById('wedding-form');
if(rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('¡Muchas gracias por tu respuesta!');
    });
}
