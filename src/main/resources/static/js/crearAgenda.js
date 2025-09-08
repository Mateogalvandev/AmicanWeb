document.addEventListener('DOMContentLoaded', function() {
    // SIDEBAR RESPONSIVE
    const sidebar = document.getElementById('sidebar')
    const toggleBtn = document.getElementById('toggleSidebar')
    const mobileToggle = document.getElementById('mobileToggle')
    const overlay = document.getElementById('overlay')

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function () {
            if (window.innerWidth > 768) sidebar.classList.toggle('collapsed')
        })
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            sidebar.classList.toggle('show')
            overlay.classList.toggle('active')
        })
    }

    if (overlay) {
        overlay.addEventListener('click', function () {
            sidebar.classList.remove('show')
            overlay.classList.remove('active')
        })
    }

    function handleResize() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('show')
            overlay.classList.remove('active')
        }
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    // MODAL DUEÑO
    const modalDuenio = document.getElementById('modalDuenio');
    const abrirModalDuenio = document.getElementById('abrirModalDuenio');
    const cerrarModalDuenio = document.getElementById('cerrarModalDuenio');
    const buscarInputDuenio = document.getElementById('buscarDuenioInput');
    const ordenarDuenioAsc = document.getElementById('ordenarDuenioAsc');
    const ordenarDuenioDesc = document.getElementById('ordenarDuenioDesc');
    const tablaDuenios = document.getElementById('tablaDuenios');
    const duenioSeleccionado = document.getElementById('duenioSeleccionado');
    const inputIdDuenio = document.getElementById('idDuenio');
    const abrirModalMascota = document.getElementById('abrirModalMascota');
    const mascotaSeleccionada = document.getElementById('mascotaSeleccionada');
    const inputIdMascota = document.getElementById('idMascota');

    // MODAL MASCOTA
    const modalMascota = document.getElementById('modalMascota');
    const cerrarModalMascota = document.getElementById('cerrarModalMascota');
    const buscarInputMascota = document.getElementById('buscarMascotaInput');
    const ordenarMascotaAsc = document.getElementById('ordenarMascotaAsc');
    const ordenarMascotaDesc = document.getElementById('ordenarMascotaDesc');
    const tablaMascotas = document.getElementById('tablaMascotas').querySelector('tbody');

    // --- BUSQUEDA Y ORDENAMIENTO DUEÑOS ---
    function filtrarDuenios() {
        const filter = buscarInputDuenio.value.toLowerCase();
        Array.from(tablaDuenios.querySelectorAll('tbody tr')).forEach(tr => {
            const text = Array.from(tr.children).map(td => td.textContent.toLowerCase()).join(' ');
            tr.style.display = text.includes(filter) ? '' : 'none';
        });
    }
    buscarInputDuenio.addEventListener('input', filtrarDuenios);

    function ordenarDuenios(colIndex, asc) {
        const rows = Array.from(tablaDuenios.querySelectorAll('tbody tr'));
        rows.sort((a, b) => {
            const ta = a.children[colIndex].textContent.trim().toLowerCase();
            const tb = b.children[colIndex].textContent.trim().toLowerCase();
            return asc ? ta.localeCompare(tb) : tb.localeCompare(ta);
        });
        rows.forEach(row => tablaDuenios.querySelector('tbody').appendChild(row));
    }
    ordenarDuenioAsc.addEventListener('click', () => ordenarDuenios(0, true)); // Ordenar por nombre asc
    ordenarDuenioDesc.addEventListener('click', () => ordenarDuenios(0, false)); // Ordenar por nombre desc

    // --- SELECCIONAR DUEÑO ---
    abrirModalDuenio.addEventListener('click', function() {
        modalDuenio.style.display = 'flex';
        buscarInputDuenio.value = '';
        filtrarDuenios();
    });
    cerrarModalDuenio.addEventListener('click', function() {
        modalDuenio.style.display = 'none';
    });

    tablaDuenios.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-seleccionar-duenio')) {
            const tr = e.target.closest('tr');
            const id = tr.getAttribute('data-id');
            const nombre = tr.getAttribute('data-nombre');
            const apellido = tr.getAttribute('data-apellido');
            const celular = tr.getAttribute('data-celular');
            const dni = tr.getAttribute('data-dni');
            const mascotasRaw = tr.getAttribute('data-mascotas') || "";
            // Mostrar info seleccionada
            duenioSeleccionado.innerHTML = `<strong>${nombre} ${apellido}</strong> - Cel: ${celular} - DNI: ${dni}`;
            duenioSeleccionado.style.display = 'block';
            inputIdDuenio.value = id;
            // Limpiar mascota seleccionada si cambia dueño
            mascotaSeleccionada.innerHTML = '';
            mascotaSeleccionada.style.display = 'none';
            inputIdMascota.value = '';
            abrirModalMascota.disabled = false;
            // Guardar mascotas del dueño en variable global temporal
            window._mascotasDueñoSeleccionado = (mascotasRaw !== '')
                ? mascotasRaw.split(',').map(m => {
                    const [id, nombre] = m.split(':');
                    return {id, nombre};
                })
                : [];
            modalDuenio.style.display = 'none';
        }
    });

    // --- MODAL MASCOTA ---
    abrirModalMascota.addEventListener('click', function() {
        // Llenar tablaMascotas SOLO con las mascotas del dueño seleccionado
        const mascotas = window._mascotasDueñoSeleccionado || [];
        tablaMascotas.innerHTML = '';
        mascotas.forEach(m => {
            const tr = document.createElement('tr');
            // Si tienes más datos de mascota puedes agregarlos aquí
            tr.setAttribute('data-id', m.id);
            tr.innerHTML = `
                <td>${m.nombre}</td>
                <td>-</td>
                <td>-</td>
                <td>
                    <button type="button" class="btn btn-primary btn-seleccionar-mascota">Seleccionar</button>
                </td>
            `;
            tablaMascotas.appendChild(tr);
        });
        modalMascota.style.display = 'flex';
        buscarInputMascota.value = '';
        filtrarMascotas();
    });
    cerrarModalMascota.addEventListener('click', function() {
        modalMascota.style.display = 'none';
    });

    // --- BUSQUEDA Y ORDENAMIENTO MASCOTAS ---
    function filtrarMascotas() {
        const filter = buscarInputMascota.value.toLowerCase();
        Array.from(tablaMascotas.querySelectorAll('tr')).forEach(tr => {
            const text = tr.children[0].textContent.toLowerCase();
            tr.style.display = text.includes(filter) ? '' : 'none';
        });
    }
    buscarInputMascota.addEventListener('input', filtrarMascotas);

    function ordenarMascotas(asc) {
        const rows = Array.from(tablaMascotas.querySelectorAll('tr'));
        rows.sort((a, b) => {
            const ta = a.children[0].textContent.trim().toLowerCase();
            const tb = b.children[0].textContent.trim().toLowerCase();
            return asc ? ta.localeCompare(tb) : tb.localeCompare(ta);
        });
        rows.forEach(row => tablaMascotas.appendChild(row));
    }
    ordenarMascotaAsc.addEventListener('click', () => ordenarMascotas(true));
    ordenarMascotaDesc.addEventListener('click', () => ordenarMascotas(false));

    // --- SELECCIONAR MASCOTA ---
    tablaMascotas.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-seleccionar-mascota')) {
            const tr = e.target.closest('tr');
            const id = tr.getAttribute('data-id');
            const nombre = tr.children[0].textContent;
            mascotaSeleccionada.innerHTML = `<strong>${nombre}</strong>`;
            mascotaSeleccionada.style.display = 'block';
            inputIdMascota.value = id;
            modalMascota.style.display = 'none';
        }
    });
});