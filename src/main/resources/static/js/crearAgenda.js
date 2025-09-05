document.addEventListener("DOMContentLoaded", () => {
  // Sidebar functionality
  const toggleSidebar = document.getElementById("toggleSidebar")
  const sidebar = document.getElementById("sidebar")
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle")

  // Sidebar toggle
  if (toggleSidebar) {
    toggleSidebar.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed")
    })
  }

  // Dropdown functionality
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault()
      const dropdown = this.nextElementSibling
      const arrow = this.querySelector(".dropdown-arrow")

      // Close other dropdowns
      dropdownToggles.forEach((otherToggle) => {
        if (otherToggle !== this) {
          const otherDropdown = otherToggle.nextElementSibling
          const otherArrow = otherToggle.querySelector(".dropdown-arrow")
          if (otherDropdown) otherDropdown.classList.remove("show")
          if (otherArrow) otherArrow.classList.remove("rotated")
        }
      })

      // Toggle current dropdown
      if (dropdown) dropdown.classList.toggle("show")
      if (arrow) arrow.classList.toggle("rotated")
    })
  })

  // Form functionality
  let duenioCounter = 1
  let mascotaCounter = 1

  // Add Dueño functionality
  const addDuenioBtn = document.getElementById("addDuenioBtn")
  const dueniosContainer = document.getElementById("dueniosContainer")

  addDuenioBtn.addEventListener("click", () => {
    duenioCounter++
    const newDuenioGroup = createDuenioGroup(duenioCounter)
    dueniosContainer.appendChild(newDuenioGroup)
    updateRemoveButtons("owner")
  })

  // Add Mascota functionality
  const addMascotaBtn = document.getElementById("addMascotaBtn")
  const mascotasContainer = document.getElementById("mascotasContainer")

  addMascotaBtn.addEventListener("click", () => {
    mascotaCounter++
    const newMascotaGroup = createMascotaGroup(mascotaCounter)
    mascotasContainer.appendChild(newMascotaGroup)
    updateRemoveButtons("pet")
  })

  // Create Dueño Group
  function createDuenioGroup(index) {
    const div = document.createElement("div")
    div.className = "owner-group"
    div.setAttribute("data-owner", index)

    div.innerHTML = `
            <div class="owner-header">
                <h4><i class="fas fa-user"></i> Dueño #${index}</h4>
                <button type="button" class="btn-remove-owner">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="duenio${index}_nombre">Nombre *</label>
                    <input type="text" id="duenio${index}_nombre" name="dueniosList[${index - 1}].nombre" required>
                </div>
                <div class="form-group">
                    <label for="duenio${index}_apellido">Apellido *</label>
                    <input type="text" id="duenio${index}_apellido" name="dueniosList[${index - 1}].apellido" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="duenio${index}_dni">DNI *</label>
                    <input type="text" id="duenio${index}_dni" name="dueniosList[${index - 1}].dni" required pattern="[0-9]{7,8}" title="Ingrese un DNI válido">
                </div>
                <div class="form-group">
                    <label for="duenio${index}_telefono">Teléfono *</label>
                    <input type="tel" id="duenio${index}_telefono" name="dueniosList[${index - 1}].telefono" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="duenio${index}_email">Email</label>
                    <input type="email" id="duenio${index}_email" name="dueniosList[${index - 1}].email">
                </div>
                <div class="form-group">
                    <label for="duenio${index}_direccion">Dirección</label>
                    <input type="text" id="duenio${index}_direccion" name="dueniosList[${index - 1}].direccion">
                </div>
            </div>
        `

    // Add remove functionality
    const removeBtn = div.querySelector(".btn-remove-owner")
    removeBtn.addEventListener("click", () => {
      div.remove()
      updateRemoveButtons("owner")
      renumberGroups("owner")
    })

    return div
  }

  // Create Mascota Group
  function createMascotaGroup(index) {
    const div = document.createElement("div")
    div.className = "pet-group"
    div.setAttribute("data-pet", index)

    div.innerHTML = `
            <div class="pet-header">
                <h4><i class="fas fa-dog"></i> Mascota #${index}</h4>
                <button type="button" class="btn-remove-pet">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="mascota${index}_nombre">Nombre de la Mascota *</label>
                    <input type="text" id="mascota${index}_nombre" name="mascotasList[${index - 1}].nombre" required>
                </div>
                <div class="form-group">
                    <label for="mascota${index}_raza">Raza *</label>
                    <input type="text" id="mascota${index}_raza" name="mascotasList[${index - 1}].raza" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="mascota${index}_tamaño">Tamaño *</label>
                    <select id="mascota${index}_tamaño" name="mascotasList[${index - 1}].tamaño" required>
                        <option value="">Seleccionar tamaño</option>
                        <option value="Muy Pequeño">Muy Pequeño (hasta 5kg)</option>
                        <option value="Pequeño">Pequeño (5-15kg)</option>
                        <option value="Mediano">Mediano (15-25kg)</option>
                        <option value="Grande">Grande (25-40kg)</option>
                        <option value="Muy Grande">Muy Grande (más de 40kg)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="mascota${index}_edad">Edad</label>
                    <input type="text" id="mascota${index}_edad" name="mascotasList[${index - 1}].edad" placeholder="Ej: 2 años, 6 meses">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="mascota${index}_sexo">Sexo</label>
                    <select id="mascota${index}_sexo" name="mascotasList[${index - 1}].sexo">
                        <option value="">Seleccionar</option>
                        <option value="Macho">Macho</option>
                        <option value="Hembra">Hembra</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="mascota${index}_peso">Peso (kg)</label>
                    <input type="number" id="mascota${index}_peso" name="mascotasList[${index - 1}].peso" min="0" step="0.1">
                </div>
            </div>

            <div class="form-group full-width">
                <label for="mascota${index}_observaciones">Observaciones Médicas</label>
                <textarea id="mascota${index}_observaciones" name="mascotasList[${index - 1}].observaciones" rows="2" placeholder="Alergias, medicamentos, condiciones especiales, etc."></textarea>
            </div>
        `

    // Add remove functionality
    const removeBtn = div.querySelector(".btn-remove-pet")
    removeBtn.addEventListener("click", () => {
      div.remove()
      updateRemoveButtons("pet")
      renumberGroups("pet")
    })

    return div
  }

  // Update remove buttons visibility
  function updateRemoveButtons(type) {
    const container = type === "owner" ? dueniosContainer : mascotasContainer
    const groups = container.querySelectorAll(type === "owner" ? ".owner-group" : ".pet-group")
    const removeButtons = container.querySelectorAll(type === "owner" ? ".btn-remove-owner" : ".btn-remove-pet")

    removeButtons.forEach((btn, index) => {
      btn.style.display = groups.length > 1 ? "flex" : "none"
    })
  }

  // Renumber groups after removal
  function renumberGroups(type) {
    const container = type === "owner" ? dueniosContainer : mascotasContainer
    const groups = container.querySelectorAll(type === "owner" ? ".owner-group" : ".pet-group")

    groups.forEach((group, index) => {
      const newIndex = index + 1
      const header = group.querySelector(type === "owner" ? ".owner-header h4" : ".pet-header h4")
      const prefix = type === "owner" ? "Dueño" : "Mascota"
      const icon = type === "owner" ? "fa-user" : "fa-dog"

      header.innerHTML = `<i class="fas ${icon}"></i> ${prefix} #${newIndex}`

      // Update form field names and IDs
      const inputs = group.querySelectorAll("input, select, textarea")
      inputs.forEach((input) => {
        const oldName = input.name
        const oldId = input.id

        if (oldName) {
          const listName = type === "owner" ? "dueniosList" : "mascotasList"
          input.name = oldName.replace(/\[\d+\]/, `[${index}]`)
        }

        if (oldId) {
          const prefix = type === "owner" ? "duenio" : "mascota"
          input.id = oldId.replace(new RegExp(`${prefix}\\d+`), `${prefix}${newIndex}`)

          // Update corresponding label
          const label = group.querySelector(`label[for="${oldId}"]`)
          if (label) {
            label.setAttribute("for", input.id)
          }
        }
      })

      group.setAttribute(`data-${type}`, newIndex)
    })

    // Update counters
    if (type === "owner") {
      duenioCounter = groups.length
    } else {
      mascotaCounter = groups.length
    }
  }

  // Form submission
  const form = document.getElementById("crearAgendaForm")
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    // Collect form data
    const formData = new FormData(form)
    const data = {}

    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      data[key] = value
    }

    console.log("Form data:", data)

    // Here you would typically send the data to your backend
    alert("Cita creada exitosamente!")
  })

  // Form validation
  function validateForm() {
    const requiredFields = form.querySelectorAll("[required]")
    let isValid = true

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.style.borderColor = "var(--red-500)"
        isValid = false
      } else {
        field.style.borderColor = "var(--gray-300)"
      }
    })

    if (!isValid) {
      alert("Por favor complete todos los campos obligatorios.")
    }

    return isValid
  }

  // Cancel button
  document.getElementById("cancelarBtn").addEventListener("click", () => {
    if (confirm("¿Está seguro que desea cancelar? Se perderán todos los datos ingresados.")) {
      form.reset()
      window.history.back()
    }
  })

  // Save draft button
  document.getElementById("guardarBorradorBtn").addEventListener("click", () => {
    const formData = new FormData(form)
    const data = {}

    for (const [key, value] of formData.entries()) {
      data[key] = value
    }

    // Save to localStorage as draft
    localStorage.setItem("agendaDraft", JSON.stringify(data))
    alert("Borrador guardado exitosamente!")
  })

  // Load draft on page load
  const savedDraft = localStorage.getItem("agendaDraft")
  if (savedDraft) {
    const draftData = JSON.parse(savedDraft)

    if (confirm("Se encontró un borrador guardado. ¿Desea cargarlo?")) {
      // Load draft data into form
      Object.keys(draftData).forEach((key) => {
        const field = form.querySelector(`[name="${key}"]`)
        if (field) {
          field.value = draftData[key]
        }
      })
    }
  }

  // Set minimum date to today
  const fechaInput = document.getElementById("fecha")
  const now = new Date()
  const minDate = now.toISOString().slice(0, 16)
  fechaInput.min = minDate
})
