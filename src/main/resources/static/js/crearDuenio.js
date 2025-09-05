// Contadores para IDs únicos
let mascotaCounter = 0
let turnoCounter = 0

// Referencias a elementos del DOM
const mascotasList = document.getElementById("mascotasList")
const turnosList = document.getElementById("turnosList")
const agregarMascotaBtn = document.getElementById("agregarMascota")
const agregarTurnoBtn = document.getElementById("agregarTurno")
const form = document.getElementById("crearDuenioForm")

// Event listeners
agregarMascotaBtn.addEventListener("click", agregarMascota)
agregarTurnoBtn.addEventListener("click", agregarTurno)
form.addEventListener("submit", handleSubmit)

// Función para agregar una nueva mascota
function agregarMascota() {
  mascotaCounter++
  const mascotaDiv = document.createElement("div")
  mascotaDiv.className = "dynamic-item"
  mascotaDiv.innerHTML = `
        <div class="item-header">
            <h4>Mascota ${mascotaCounter}</h4>
            <button type="button" class="btn-remove" onclick="eliminarMascota(this)">
                ✕
            </button>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label>Nombre de la Mascota *</label>
                <input type="text" name="mascota_nombre_${mascotaCounter}" required>
            </div>
            <div class="form-group">
                <label>Especie *</label>
                <select name="mascota_especie_${mascotaCounter}" required>
                    <option value="">Seleccionar especie</option>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="ave">Ave</option>
                    <option value="roedor">Roedor</option>
                    <option value="reptil">Reptil</option>
                    <option value="otro">Otro</option>
                </select>
            </div>
            <div class="form-group">
                <label>Raza</label>
                <input type="text" name="mascota_raza_${mascotaCounter}">
            </div>
            <div class="form-group">
                <label>Edad</label>
                <input type="number" name="mascota_edad_${mascotaCounter}" min="0">
            </div>
            <div class="form-group">
                <label>Peso (kg)</label>
                <input type="number" name="mascota_peso_${mascotaCounter}" step="0.1" min="0">
            </div>
            <div class="form-group">
                <label>Color</label>
                <input type="text" name="mascota_color_${mascotaCounter}">
            </div>
        </div>
        <div class="form-group">
            <label>Observaciones</label>
            <textarea name="mascota_observaciones_${mascotaCounter}" rows="2"></textarea>
        </div>
    `
  mascotasList.appendChild(mascotaDiv)
}

// Función para agregar un nuevo turno
function agregarTurno() {
  turnoCounter++
  const turnoDiv = document.createElement("div")
  turnoDiv.className = "dynamic-item"
  turnoDiv.innerHTML = `
        <div class="item-header">
            <h4>Turno ${turnoCounter}</h4>
            <button type="button" class="btn-remove" onclick="eliminarTurno(this)">
                ✕
            </button>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label>Fecha *</label>
                <input type="date" name="turno_fecha_${turnoCounter}" required>
            </div>
            <div class="form-group">
                <label>Hora *</label>
                <input type="time" name="turno_hora_${turnoCounter}" required>
            </div>
            <div class="form-group">
                <label>Tipo de Consulta *</label>
                <select name="turno_tipo_${turnoCounter}" required>
                    <option value="">Seleccionar tipo</option>
                    <option value="consulta_general">Consulta General</option>
                    <option value="vacunacion">Vacunación</option>
                    <option value="cirugia">Cirugía</option>
                    <option value="control">Control</option>
                    <option value="emergencia">Emergencia</option>
                </select>
            </div>
            <div class="form-group">
                <label>Veterinario</label>
                <input type="text" name="turno_veterinario_${turnoCounter}">
            </div>
        </div>
        <div class="form-group">
            <label>Motivo de la Consulta</label>
            <textarea name="turno_motivo_${turnoCounter}" rows="2"></textarea>
        </div>
    `
  turnosList.appendChild(turnoDiv)
}

// Función para eliminar una mascota
function eliminarMascota(button) {
  const mascotaDiv = button.closest(".dynamic-item")
  mascotaDiv.remove()
}

// Función para eliminar un turno
function eliminarTurno(button) {
  const turnoDiv = button.closest(".dynamic-item")
  turnoDiv.remove()
}

// Función para manejar el envío del formulario
function handleSubmit(event) {
  event.preventDefault()

  // Recopilar datos del formulario
  const formData = new FormData(form)
  const duenioData = {
    nombreDuenio: formData.get("nombreDuenio"),
    apellido: formData.get("apellido"),
    celular: formData.get("celular"),
    dni: formData.get("dni"),
    mascotasList: [],
    turnosDuenios: [],
  }

  // Recopilar datos de mascotas
  for (let i = 1; i <= mascotaCounter; i++) {
    const nombre = formData.get(`mascota_nombre_${i}`)
    if (nombre) {
      duenioData.mascotasList.push({
        nombre: nombre,
        especie: formData.get(`mascota_especie_${i}`),
        raza: formData.get(`mascota_raza_${i}`),
        edad: formData.get(`mascota_edad_${i}`),
        peso: formData.get(`mascota_peso_${i}`),
        color: formData.get(`mascota_color_${i}`),
        observaciones: formData.get(`mascota_observaciones_${i}`),
      })
    }
  }

  // Recopilar datos de turnos
  for (let i = 1; i <= turnoCounter; i++) {
    const fecha = formData.get(`turno_fecha_${i}`)
    if (fecha) {
      duenioData.turnosDuenios.push({
        fecha: fecha,
        hora: formData.get(`turno_hora_${i}`),
        tipo: formData.get(`turno_tipo_${i}`),
        veterinario: formData.get(`turno_veterinario_${i}`),
        motivo: formData.get(`turno_motivo_${i}`),
      })
    }
  }

  // Aquí enviarías los datos al backend
  console.log("Datos del dueño:", duenioData)

  // Mostrar mensaje de éxito
  alert("Dueño creado exitosamente")

  // Opcional: redirigir o limpiar el formulario
  // window.location.href = 'index.html';
}

// Agregar una mascota por defecto al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  agregarMascota()
})
