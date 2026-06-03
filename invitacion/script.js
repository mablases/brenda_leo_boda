document.addEventListener('DOMContentLoaded', () => {

```
/* ==========================
   CONFIGURACIÓN FECHA BODA
========================== */

const weddingDate = new Date('November 15, 2026 18:00:00').getTime();

/* ==========================
   ABRIR INVITACIÓN
========================== */

const openBtn = document.getElementById('open-invitation');
const welcomeScreen = document.getElementById('welcome-screen');
const mainContent = document.getElementById('main-content');

const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

if(openBtn){

    openBtn.addEventListener('click', () => {

        welcomeScreen.style.transform = 'translateY(-100%)';

        setTimeout(() => {

            mainContent.classList.remove('hidden');

            revealOnScroll();

        },600);

        if(bgMusic){

            bgMusic.play().catch(() => {});

            if(musicBtn){
                musicBtn.innerHTML = '⏸ Música';
            }

        }

    });

}

/* ==========================
   BOTÓN MÚSICA
========================== */

if(musicBtn && bgMusic){

    musicBtn.addEventListener('click', () => {

        if(bgMusic.paused){

            bgMusic.play();

            musicBtn.innerHTML = '⏸ Música';

        }else{

            bgMusic.pause();

            musicBtn.innerHTML = '🎵 Música';

        }

    });

}

/* ==========================
   CUENTA REGRESIVA
========================== */

const timer = setInterval(() => {

    const now = new Date().getTime();

    const diff = weddingDate - now;

    if(diff <= 0){

        clearInterval(timer);

        const countdown = document.getElementById('countdown');

        if(countdown){

            countdown.innerHTML = `
                <h2>¡Llegó el gran día!</h2>
            `;

        }

        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));

    const h = Math.floor(
        (diff % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
    );

    const m = Math.floor(
        (diff % (1000 * 60 * 60))
        / (1000 * 60)
    );

    const s = Math.floor(
        (diff % (1000 * 60))
        / 1000
    );

    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    if(days) days.innerText = d;
    if(hours) hours.innerText = h;
    if(minutes) minutes.innerText = m;
    if(seconds) seconds.innerText = s;

},1000);

/* ==========================
   REVEAL ANIMATION
========================== */

function revealOnScroll(){

    const reveals = document.querySelectorAll('.reveal');

    const triggerBottom =
        window.innerHeight * 0.85;

    reveals.forEach(reveal => {

        const revealTop =
            reveal.getBoundingClientRect().top;

        if(revealTop < triggerBottom){

            reveal.classList.add('active');

        }

    });

}

revealOnScroll();

window.addEventListener(
    'scroll',
    revealOnScroll
);

/* ==========================
   SUPABASE
========================== */

const supabaseUrl =
"https://wqzavjzfoxzjrijccteh.supabase.co";

const supabaseKey =
"sb_publishable_fTYkp41FOfaaVFRI1dSZRQ_dXjPstB7";

const supabaseClient =
supabase.createClient(
    supabaseUrl,
    supabaseKey
);

/* ==========================
   RSVP
========================== */

const form =
document.getElementById('rsvp-form');

if(form){

    form.addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();

            const nombre =
            document.getElementById('name').value;

            const asistencia =
            document.getElementById('attendance').value;

            const acompanantes =
            parseInt(
                document.getElementById('guests').value
            ) || 0;

            const mensaje =
            document.getElementById('message').value;

            const { error } =
            await supabaseClient
            .from('invitados')
            .insert([
                {
                    nombre,
                    asistencia,
                    acompanantes,
                    mensaje
                }
            ]);

            if(error){

                console.error(error);

                alert(
                    'Error al guardar la confirmación'
                );

                return;
            }

            if(asistencia === 'si'){

                alert(
                    `¡Gracias ${nombre}! Tu asistencia ha sido confirmada.`
                );

            }else{

                alert(
                    `Gracias por avisarnos ${nombre}.`
                );

            }

            form.reset();

        }
    );

}

/* ==========================
   SCROLL SUAVE
========================== */

document
.querySelectorAll('a[href^="#"]')
.forEach(anchor => {

    anchor.addEventListener(
        'click',
        function(e){

            e.preventDefault();

            const target =
            document.querySelector(
                this.getAttribute('href')
            );

            if(target){

                target.scrollIntoView({
                    behavior:'smooth'
                });

            }

        }
    );

});
```

});
