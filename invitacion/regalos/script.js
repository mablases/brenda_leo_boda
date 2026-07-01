// Configuración de Supabase
const supabaseUrl = 'https://wqzavjzfoxzjrijccteh.supabase.co';
const supabaseKey = 'TU_ANON_KEY';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Elementos del DOM
const contenedorRegalos = document.getElementById('lista-regalos');
const modal = document.getElementById('modal-reserva');
const btnCerrarModal = document.getElementById('cerrar-modal');
const formReserva = document.getElementById('form-reserva');
const regaloIdInput = document.getElementById('regalo-id');
const nombreRegaloModal = document.getElementById('nombre-regalo-modal');
const formMensaje = document.getElementById('form-mensaje');
const btnConfirmar = document.getElementById('btn-confirmar');

// Al cargar la página, obtener la lista de regalos
document.addEventListener('DOMContentLoaded', cargarRegalos);

// Función para obtener y renderizar los regalos desde Supabase
async function cargarRegalos() {
    try {
        const { data: regalos, error } = await supabase
            .from('regalos')
            .select('*')
            .order('estado', { ascending: true }) // Muestra disponibles primero
            .order('nombre', { ascending: true });

        if (error) throw error;

        contenedorRegalos.innerHTML = ''; // Limpiar el estado de "Cargando..."

        if (regalos.length === 0) {
            contenedorRegalos.innerHTML = '<p class="loading">No hay regalos disponibles en este momento.</p>';
            return;
        }

        regalos.forEach(regalo => {
            const card = document.createElement('div');
            card.className = 'regalo-card';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'regalo-info';
            
            const titulo = document.createElement('h3');
            titulo.textContent = regalo.nombre;
            infoDiv.appendChild(titulo);

            if (regalo.categoria) {
                const categoria = document.createElement('p');
                categoria.className = 'regalo-categoria';
                categoria.textContent = regalo.categoria;
                infoDiv.appendChild(categoria);
            }

            const accionDiv = document.createElement('div');

            if (regalo.estado === 'disponible') {
                const btnReservar = document.createElement('button');
                btnReservar.className = 'btn-reservar';
                btnReservar.textContent = 'Reservar';
                // Pasar datos del regalo al modal al hacer clic
                btnReservar.onclick = () => abrirModal(regalo.id, regalo.nombre);
                accionDiv.appendChild(btnReservar);
            } else {
                const badge = document.createElement('span');
                badge.className = 'badge-reservado';
                badge.textContent = 'Reservado';
                accionDiv.appendChild(badge);
            }

            card.appendChild(infoDiv);
            card.appendChild(accionDiv);
            contenedorRegalos.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar regalos:', error);
        contenedorRegalos.innerHTML = '<p class="loading" style="color: red;">Ocurrió un error al cargar la lista. Por favor, recarga la página.</p>';
    }
}

// Funciones del Modal
function abrirModal(id, nombre) {
    regaloIdInput.value = id;
    nombreRegaloModal.textContent = nombre;
    formMensaje.textContent = ''; // Limpiar mensajes anteriores
    formReserva.reset(); // Limpiar campos del formulario
    modal.classList.remove('hidden');
}

function cerrarModal() {
    modal.classList.add('hidden');
}

btnCerrarModal.addEventListener('click', cerrarModal);

// Cerrar modal haciendo clic afuera del contenido
modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
});

// Manejo del formulario de reserva
formReserva.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Deshabilitar el botón para evitar dobles envíos
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = 'Procesando...';
    formMensaje.textContent = '';
    formMensaje.className = 'form-status';

    const regaloId = regaloIdInput.value;
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    try {
        // 1. Verificar si el regalo sigue disponible (Control de concurrencia)
        const { data: regaloCheck, error: checkError } = await supabase
            .from('regalos')
            .select('estado')
            .eq('id', regaloId)
            .single();

        if (checkError) throw checkError;

        if (regaloCheck.estado === 'reservado') {
            mostrarMensaje('Lo sentimos, alguien acaba de reservar este regalo.', 'error');
            await cargarRegalos(); // Actualizar lista visualmente
            setTimeout(cerrarModal, 3000);
            return;
        }

        // 2. Insertar los datos en reservas_regalos
        const { error: insertError } = await supabase
            .from('reservas_regalos')
            .insert([
                { 
                    regalo_id: regaloId, 
                    nombre_completo: nombre, 
                    telefono: telefono, 
                    mensaje: mensaje 
                }
            ]);

        if (insertError) throw insertError;

        // 3. Actualizar el estado del regalo a "reservado"
        const { error: updateError } = await supabase
            .from('regalos')
            .update({ estado: 'reservado' })
            .eq('id', regaloId);

        if (updateError) {
            // Manejo de error si falla la actualización (idealmente requiere una transacción RPC, 
            // pero esto es funcional para este contexto).
            console.error('Error al actualizar el estado:', updateError);
        }

        // 4. Éxito: Mostrar mensaje, recargar la lista y cerrar modal
        mostrarMensaje('¡Reserva confirmada con éxito! Muchas gracias.', 'success');
        await cargarRegalos();
        
        setTimeout(cerrarModal, 2500);

    } catch (error) {
        console.error('Error en el proceso de reserva:', error);
        mostrarMensaje('Ocurrió un error inesperado. Intenta de nuevo.', 'error');
    } finally {
        // Restaurar el botón
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = 'Confirmar reserva';
    }
});

// Función de utilidad para mostrar mensajes en el formulario
function mostrarMensaje(texto, tipo) {
    formMensaje.textContent = texto;
    formMensaje.className = `form-status status-${tipo}`;
}
