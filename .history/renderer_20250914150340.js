// renderer.js - Versión Corregida

document.addEventListener('DOMContentLoaded', () => {
    const btnBuscar = document.getElementById('btn-buscar');
    const palabrasClaveInput = document.getElementById('palabras-clave');
    const listaOfertasDiv = document.getElementById('lista-ofertas');
    const loader = document.getElementById('loader');

    btnBuscar.addEventListener('click', async () => {
        const palabrasClave = palabrasClaveInput.value;

        if (!palabrasClave) {
            alert('Por favor, ingresa al menos una palabra clave para buscar.');
            return;
        }

        loader.classList.remove('hidden');
        listaOfertasDiv.innerHTML = '';
        
        try {
            // Enviamos solo las palabras clave, que es lo que main.js espera
            const ofertas = await window.electronAPI.buscarOfertas(palabrasClave);
            mostrarOfertas(ofertas);
        } catch (error) {
            listaOfertasDiv.innerHTML = `<p style="color: red;">Ocurrió un error durante la búsqueda.</p>`;
        } finally {
            loader.classList.add('hidden');
        }
    });

    function mostrarOfertas(ofertas) {
        if (ofertas.length === 0) {
            listaOfertasDiv.innerHTML = '<p>No se encontraron ofertas con esos criterios.</p>';
            return;
        }

        ofertas.forEach(oferta => {
            const ofertaElement = document.createElement('div');
            ofertaElement.className = 'oferta';
            ofertaElement.innerHTML = `
                <div class="oferta-info">
                    <h3>${oferta.titulo}</h3>
                    <p>${oferta.empresa} - <em>${oferta.ubicacion || ''}</em></p>
                </div>
                <button class="btn-postular" data-url="${oferta.url}">Autocompletar Postulación</button>
            `;
            listaOfertasDiv.appendChild(ofertaElement);
        });
        
        document.querySelectorAll('.btn-postular').forEach(button => {
            button.addEventListener('click', handleAutocompletar);
        });
    }

    async function handleAutocompletar(event) {
        const url = event.target.getAttribute('data-url');
        const datosPersonales = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
        };

        if (!datosPersonales.nombre || !datosPersonales.email) {
            alert('Por favor, completa tus datos personales (nombre y email) antes de continuar.');
            return;
        }

        const resultado = await window.electronAPI.autocompletar({ url, datosPersonales });
        if (resultado && !resultado.success) {
            alert('Hubo un problema al iniciar el asistente. Revisa la consola para más detalles.');
        }
    }
});