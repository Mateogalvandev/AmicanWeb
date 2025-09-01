let contadorDuenos = 1
let contadorMascotas = 1

function agregarDueno() {
  contadorDuenos++
  const container = document.getElementById("duenosContainer")

  const nuevoDueno = document.createElement("div")
  nuevoDueno.className = "dueno-card"
  nuevoDueno.innerHTML = `
        <div class="card-header">
            <h4>Dueño ${contadorDuenos}</h4>
            <button type="button" class="btn-remove" onclick="eliminarDueno(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" class="field-input" name="nombre_dueno_${contadorDuenos}" required>
            </div>
            <div class="form-group">
                <label>Apellido</label>
                <input type="text" class="field-input" name="apellido_dueno_${contadorDuenos}" required>
            </div>
            <div class="form-group">
                <label>DNI</label>
                <input type="text" class="field-input" name="dni_dueno_${contadorDuenos}" required>
            </div>
            <div class="form-group">
                <label>Número de Celular</label>
                <input type="tel" class="field-input" name="celular_dueno_${contadorDuenos}" required>
            </div>
        </div>
    `

  container.appendChild(nuevoDueno)
}

function agregarMascota() {
  contadorMascotas++
  const container = document.getElementById("mascotasContainer")

  const nuevaMascota = document.createElement("div")
  nuevaMascota.className = "mascota-card"
  nuevaMascota.innerHTML = `
        <div class="card-header">
            <h4>Mascota ${contadorMascotas}</h4>
            <button type="button" class="btn-remove" onclick="eliminarMascota(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="form-grid">
            <div class="form-group">
                <label>Nombre del Perro</label>
                <input type="text" class="field-input" name="nombre_mascota_${contadorMascotas}" required>
            </div>
            <div class="form-group">
                <label>Raza</label>
                <input type="text" class="field-input" name="raza_mascota_${contadorMascotas}" required>
            </div>
            <div class="form-group">
                <label>Tamaño</label>
                <input type="text" class="field-input" name="tamano_mascota_${contadorMascotas}" placeholder="Ej: Pequeño, Mediano, Grande" required>
            </div>
        </div>
    `

  container.appendChild(nuevaMascota)
}

function eliminarDueno(button) {
  const duenoCard = button.closest(".dueno-card")
  duenoCard.remove()
}

function eliminarMascota(button) {
  const mascotaCard = button.closest(".mascota-card")
  mascotaCard.remove()
}

// Manejar envío del formulario
document.getElementById("turnoForm").addEventListener("submit", (e) => {
  e.preventDefault()

  // Aquí se procesarían los datos del formulario
  alert("Turno guardado exitosamente! (Funcionalidad pendiente de implementar con Spring)")

  // Opcional: limpiar formulario o redirigir
  // this.reset();
})
