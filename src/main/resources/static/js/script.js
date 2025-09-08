// Estado global de la aplicación
const AppState = {
  activeSection: "dashboard",
  sidebarCollapsed: false,
  userDropdownOpen: false,
  editingProfile: false,

  // Datos de ejemplo
  agendaData: [
    {
      id: 1,
      fecha: "2024-01-15",
      hora: "09:00",
      estado: "confirmado",
      servicios: ["Baño", "Corte"],
      mascota: "Max",
      dueno: "Juan Pérez",
      telefono: "+54 11 1234-5678",
    },
    {
      id: 2,
      fecha: "2024-01-15",
      hora: "10:30",
      estado: "pendiente",
      servicios: ["Corte de uñas"],
      mascota: "Luna",
      dueno: "María García",
      telefono: "+54 11 2345-6789",
    },
    {
      id: 3,
      fecha: "2024-01-15",
      hora: "12:00",
      estado: "en proceso",
      servicios: ["Baño completo", "Secado"],
      mascota: "Rocky",
      dueno: "Carlos López",
      telefono: "+54 11 3456-7890",
    },
    {
      id: 4,
      fecha: "2024-01-15",
      hora: "14:00",
      estado: "confirmado",
      servicios: ["Corte", "Peinado"],
      mascota: "Bella",
      dueno: "Ana Martínez",
      telefono: "+54 11 4567-8901",
    },
    {
      id: 5,
      fecha: "2024-01-16",
      hora: "09:30",
      estado: "pendiente",
      servicios: ["Baño"],
      mascota: "Toby",
      dueno: "Luis Rodríguez",
      telefono: "+54 11 5678-9012",
    },
    {
      id: 6,
      fecha: "2024-01-16",
      hora: "11:00",
      estado: "confirmado",
      servicios: ["Corte", "Baño", "Secado"],
      mascota: "Coco",
      dueno: "Elena Fernández",
      telefono: "+54 11 6789-0123",
    },
    {
      id: 7,
      fecha: "2024-01-16",
      hora: "15:30",
      estado: "en proceso",
      servicios: ["Peinado"],
      mascota: "Milo",
      dueno: "Roberto Silva",
      telefono: "+54 11 7890-1234",
    },
  ],

  petshopData: [
    { id: 1, nombre: "Shampoo Premium", categoria: "Higiene", precio: 25.0, stock: 15 },
    { id: 2, nombre: "Collar Antipulgas", categoria: "Accesorios", precio: 18.5, stock: 8 },
    { id: 3, nombre: "Juguete Mordedor", categoria: "Juguetes", precio: 12.0, stock: 22 },
    { id: 4, nombre: "Alimento Premium", categoria: "Alimentación", precio: 45.0, stock: 5 },
    { id: 5, nombre: "Cama Ortopédica", categoria: "Accesorios", precio: 89.99, stock: 3 },
    { id: 6, nombre: "Vitaminas Caninas", categoria: "Salud", precio: 32.5, stock: 12 },
    { id: 7, nombre: "Correa Extensible", categoria: "Accesorios", precio: 24.99, stock: 18 },
    { id: 8, nombre: "Snacks Naturales", categoria: "Alimentación", precio: 15.75, stock: 25 },
    { id: 9, nombre: "Champú Antipulgas", categoria: "Higiene", precio: 28.0, stock: 9 },
    { id: 10, nombre: "Pelota Interactiva", categoria: "Juguetes", precio: 19.99, stock: 14 },
  ],

  // Paginación
  agendaPagination: {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
    totalPages: 0,
  },

  petshopPagination: {
    currentPage: 1,
    itemsPerPage: 8,
    totalItems: 0,
    totalPages: 0,
  },

  // Filtros y ordenamiento
  agendaFilter: "",
  petshopFilter: "",
  agendaSort: { field: null, direction: "asc" },
  petshopSort: { field: null, direction: "asc" },
}

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  setupEventListeners()
  showSection(AppState.activeSection)
  updatePagination()
  renderAgendaTable()
  renderPetshopTable()
}

function setupEventListeners() {
  // Sidebar toggle
  const toggleBtn = document.getElementById("toggleSidebar")
  toggleBtn.addEventListener("click", toggleSidebar)

  // Navigation dropdown toggles
  const dropdownToggles = document.querySelectorAll(".nav-item.dropdown-toggle")
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      e.preventDefault()
      const navGroup = this.closest(".nav-group")

      toggleNavDropdown(navGroup)
    })
  })

  // Navigation subitems
  const navSubitems = document.querySelectorAll(".nav-subitem")
  navSubitems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.stopPropagation()
      const section = this.dataset.section
      const action = this.dataset.action

      handleNavSubitemClick(section, action)
      setActiveNavSubitem(this)
    })
  })

  const logoBtn = document.getElementById("logoBtn")
  logoBtn.addEventListener("click", () => {
    showSection("dashboard")
    // Close all dropdowns when going to dashboard
    closeAllDropdowns()
    // Remove active states from all nav items
    document.querySelectorAll(".nav-item, .nav-group, .nav-subitem").forEach((item) => {
      item.classList.remove("active")
    })
  })

  // User menu
  const userMenuBtn = document.getElementById("userMenuBtn")
  const userDropdown = document.getElementById("userDropdown")

  userMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    toggleUserDropdown()
  })

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    if (AppState.userDropdownOpen) {
      closeUserDropdown()
    }
  })

  // User dropdown items
  const dropdownItems = document.querySelectorAll(".dropdown-item")
  dropdownItems.forEach((item) => {
    item.addEventListener("click", function () {
      const section = this.dataset.section
      if (section) {
        showSection(section)
        setActiveNavItem(document.querySelector(`[data-section="${section}"]`))
      }
      closeUserDropdown()
    })
  })

  // Search inputs
  const agendaSearch = document.getElementById("agendaSearch")
  const petshopSearch = document.getElementById("petshopSearch")

  if (agendaSearch) {
    agendaSearch.addEventListener("input", function () {
      AppState.agendaFilter = this.value.toLowerCase()
      AppState.agendaPagination.currentPage = 1
      renderAgendaTable()
      updatePagination()
    })
  }

  if (petshopSearch) {
    petshopSearch.addEventListener("input", function () {
      AppState.petshopFilter = this.value.toLowerCase()
      AppState.petshopPagination.currentPage = 1
      renderPetshopTable()
      updatePagination()
    })
  }

  // Pagination buttons
  setupPaginationListeners()

  // Sort headers
  setupSortListeners()

  // Profile editing
  setupProfileListeners()
}

function setupProfileListeners() {
  const editBtn = document.getElementById("editProfileBtn")
  const cancelBtn = document.getElementById("cancelEditBtn")
  const saveBtn = document.getElementById("saveProfileBtn")

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      toggleProfileEdit(true)
    })
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      toggleProfileEdit(false)
    })
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      saveProfile()
    })
  }
}

function toggleProfileEdit(editing) {
  AppState.editingProfile = editing
  const editBtn = document.getElementById("editProfileBtn")
  const actions = document.getElementById("profileActions")
  const fields = document.querySelectorAll(".profile-field")

  if (editing) {
    editBtn.innerHTML = '<i class="fas fa-save"></i> Guardar'
    editBtn.style.display = "none"
    actions.style.display = "flex"

    fields.forEach((field) => {
      const value = field.querySelector(".field-value")
      const input = field.querySelector(".field-input")
      if (value && input) {
        value.style.display = "none"
        input.style.display = "block"
      }
    })
  } else {
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Editar'
    editBtn.style.display = "flex"
    actions.style.display = "none"

    fields.forEach((field) => {
      const value = field.querySelector(".field-value")
      const input = field.querySelector(".field-input")
      if (value && input) {
        value.style.display = "flex"
        input.style.display = "none"
      }
    })
  }
}

function saveProfile() {
  // Aquí iría la lógica para guardar los datos
  toggleProfileEdit(false)
  // Mostrar mensaje de éxito (opcional)
  alert("Perfil actualizado correctamente")
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar")
  const mainContent = document.querySelector(".main-content")

  AppState.sidebarCollapsed = !AppState.sidebarCollapsed

  if (AppState.sidebarCollapsed) {
    sidebar.classList.add("collapsed")
    mainContent.classList.add("sidebar-collapsed")
  } else {
    sidebar.classList.remove("collapsed")
    mainContent.classList.remove("sidebar-collapsed")
  }
}

function showSection(sectionName) {
  // Hide all sections
  const sections = document.querySelectorAll(".section")
  sections.forEach((section) => {
    section.classList.remove("active")
  })

  // Show selected section
  const targetSection = document.getElementById(`${sectionName}-section`)
  if (targetSection) {
    targetSection.classList.add("active")
    AppState.activeSection = sectionName
  }
}

function setActiveNavItem(activeItem) {
  // Remove active class from all nav items and groups
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })
  document.querySelectorAll(".nav-group").forEach((group) => {
    group.classList.remove("active")
  })
  document.querySelectorAll(".nav-subitem").forEach((item) => {
    item.classList.remove("active")
  })

  // Add active class to selected item
  if (activeItem) {
    activeItem.classList.add("active")
  }
}

function toggleUserDropdown() {
  const dropdown = document.getElementById("userDropdown")
  AppState.userDropdownOpen = !AppState.userDropdownOpen

  if (AppState.userDropdownOpen) {
    dropdown.classList.add("show")
  } else {
    dropdown.classList.remove("show")
  }
}

function closeUserDropdown() {
  const dropdown = document.getElementById("userDropdown")
  dropdown.classList.remove("show")
  AppState.userDropdownOpen = false
}

// Tabla de Agenda
function renderAgendaTable() {
  const tbody = document.getElementById("agendaTableBody")
  if (!tbody) return

  const filteredData = getFilteredAgendaData()
  const paginatedData = getPaginatedData(filteredData, AppState.agendaPagination)

  tbody.innerHTML = ""

  paginatedData.forEach((item) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-clock" style="color: var(--amican-blue);"></i>
                    <div>
                        <div style="font-weight: 600; color: var(--gray-900);">
                            ${formatDate(item.fecha)}
                        </div>
                        <div style="font-size: 0.875rem; color: var(--amican-blue); font-weight: 600;">${item.hora}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="status-badge ${item.estado}">${capitalizeFirst(item.estado)}</span>
            </td>
            <td>
                ${item.servicios.map((servicio) => `<span class="service-badge">${servicio}</span>`).join("")}
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 32px; height: 32px; background: var(--amican-blue); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-dog" style="color: white; font-size: 0.875rem;"></i>
                    </div>
                    <span style="font-weight: 600;">${item.mascota}</span>
                </div>
            </td>
            <td style="color: var(--gray-900);">${item.dueno}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <i class="fas fa-phone" style="color: var(--gray-400); font-size: 0.875rem;"></i>
                    <span style="color: var(--gray-600); font-size: 0.875rem;">${item.telefono}</span>
                </div>
            </td>
            <td>
                <div style="display: flex; justify-content: center; gap: 8px;">
                    <button class="action-btn edit" onclick="editAgendaItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteAgendaItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `
    tbody.appendChild(row)
  })

  updateAgendaPaginationInfo()
}

function getFilteredAgendaData() {
  let filtered = AppState.agendaData

  if (AppState.agendaFilter) {
    filtered = filtered.filter(
      (item) =>
        item.mascota.toLowerCase().includes(AppState.agendaFilter) ||
        item.dueno.toLowerCase().includes(AppState.agendaFilter) ||
        item.estado.toLowerCase().includes(AppState.agendaFilter) ||
        item.servicios.some((servicio) => servicio.toLowerCase().includes(AppState.agendaFilter)),
    )
  }

  if (AppState.agendaSort.field) {
    filtered.sort((a, b) => {
      let aVal = a[AppState.agendaSort.field]
      let bVal = b[AppState.agendaSort.field]

      if (AppState.agendaSort.field === "fecha") {
        aVal = new Date(`${a.fecha} ${a.hora}`)
        bVal = new Date(`${b.fecha} ${b.hora}`)
      } else if (AppState.agendaSort.field === "servicios") {
        aVal = aVal.join(", ")
        bVal = bVal.join(", ")
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (AppState.agendaSort.direction === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  AppState.agendaPagination.totalItems = filtered.length
  AppState.agendaPagination.totalPages = Math.ceil(filtered.length / AppState.agendaPagination.itemsPerPage)

  return filtered
}

// Tabla de PetShop
function renderPetshopTable() {
  const tbody = document.getElementById("petshopTableBody")
  if (!tbody) return

  const filteredData = getFilteredPetshopData()
  const paginatedData = getPaginatedData(filteredData, AppState.petshopPagination)

  tbody.innerHTML = ""

  paginatedData.forEach((item) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-box" style="color: var(--amican-orange); font-size: 1.25rem;"></i>
                    <span style="font-weight: 600; color: var(--gray-900);">${item.nombre}</span>
                </div>
            </td>
            <td>
                <span style="background: rgba(255, 165, 0, 0.1); color: var(--amican-orange); padding: 4px 12px; border-radius: 9999px; font-size: 0.875rem; font-weight: 600;">${item.categoria}</span>
            </td>
            <td>
                <div style="display: flex; align-items: center; color: #10b981; font-weight: 700;">
                    <i class="fas fa-dollar-sign" style="color: var(--amican-blue); font-size: 0.875rem; margin-right: 4px;"></i>
                    <span>$${item.precio.toFixed(2)}</span>
                </div>
            </td>
            <td>
                <span class="stock-badge ${getStockClass(item.stock)}" style="font-weight: 700;">${item.stock} unidades</span>
            </td>
            <td>
                <div style="display: flex; justify-content: center; gap: 8px;">
                    <button class="action-btn edit" onclick="editPetshopItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deletePetshopItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `
    tbody.appendChild(row)
  })

  updatePetshopPaginationInfo()
}

function getFilteredPetshopData() {
  let filtered = AppState.petshopData

  if (AppState.petshopFilter) {
    filtered = filtered.filter(
      (item) =>
        item.nombre.toLowerCase().includes(AppState.petshopFilter) ||
        item.categoria.toLowerCase().includes(AppState.petshopFilter) ||
        item.precio.toString().includes(AppState.petshopFilter),
    )
  }

  if (AppState.petshopSort.field) {
    filtered.sort((a, b) => {
      let aVal = a[AppState.petshopSort.field]
      let bVal = b[AppState.petshopSort.field]

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (AppState.petshopSort.direction === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  AppState.petshopPagination.totalItems = filtered.length
  AppState.petshopPagination.totalPages = Math.ceil(filtered.length / AppState.petshopPagination.itemsPerPage)

  return filtered
}

// Utilidades
function getPaginatedData(data, pagination) {
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
  const endIndex = startIndex + pagination.itemsPerPage
  return data.slice(startIndex, endIndex)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getStockClass(stock) {
  if (stock <= 5) return "low"
  if (stock <= 15) return "medium"
  return "high"
}

// Paginación
function setupPaginationListeners() {
  // Agenda pagination
  const agendaPrevBtn = document.getElementById("agendaPrevBtn")
  const agendaNextBtn = document.getElementById("agendaNextBtn")

  if (agendaPrevBtn) {
    agendaPrevBtn.addEventListener("click", () => {
      if (AppState.agendaPagination.currentPage > 1) {
        AppState.agendaPagination.currentPage--
        renderAgendaTable()
        updatePagination()
      }
    })
  }

  if (agendaNextBtn) {
    agendaNextBtn.addEventListener("click", () => {
      if (AppState.agendaPagination.currentPage < AppState.agendaPagination.totalPages) {
        AppState.agendaPagination.currentPage++
        renderAgendaTable()
        updatePagination()
      }
    })
  }

  // PetShop pagination
  const petshopPrevBtn = document.getElementById("petshopPrevBtn")
  const petshopNextBtn = document.getElementById("petshopNextBtn")

  if (petshopPrevBtn) {
    petshopPrevBtn.addEventListener("click", () => {
      if (AppState.petshopPagination.currentPage > 1) {
        AppState.petshopPagination.currentPage--
        renderPetshopTable()
        updatePagination()
      }
    })
  }

  if (petshopNextBtn) {
    petshopNextBtn.addEventListener("click", () => {
      if (AppState.petshopPagination.currentPage < AppState.petshopPagination.totalPages) {
        AppState.petshopPagination.currentPage++
        renderPetshopTable()
        updatePagination()
      }
    })
  }
}

function updatePagination() {
  updateAgendaPaginationInfo()
  updatePetshopPaginationInfo()
}

function updateAgendaPaginationInfo() {
  const pageInfo = document.getElementById("agendaPageInfo")
  const itemsInfo = document.getElementById("agendaItemsInfo")
  const prevBtn = document.getElementById("agendaPrevBtn")
  const nextBtn = document.getElementById("agendaNextBtn")

  if (pageInfo) {
    pageInfo.textContent = `Página ${AppState.agendaPagination.currentPage} de ${AppState.agendaPagination.totalPages}`
  }

  if (itemsInfo) {
    const startIndex = (AppState.agendaPagination.currentPage - 1) * AppState.agendaPagination.itemsPerPage
    const endIndex = Math.min(startIndex + AppState.agendaPagination.itemsPerPage, AppState.agendaPagination.totalItems)
    itemsInfo.textContent = `Mostrando ${startIndex + 1} a ${endIndex} de ${AppState.agendaPagination.totalItems} citas`
  }

  if (prevBtn) {
    prevBtn.disabled = AppState.agendaPagination.currentPage === 1
  }

  if (nextBtn) {
    nextBtn.disabled = AppState.agendaPagination.currentPage === AppState.agendaPagination.totalPages
  }
}

function updatePetshopPaginationInfo() {
  const pageInfo = document.getElementById("petshopPageInfo")
  const itemsInfo = document.getElementById("petshopItemsInfo")
  const prevBtn = document.getElementById("petshopPrevBtn")
  const nextBtn = document.getElementById("petshopNextBtn")

  if (pageInfo) {
    pageInfo.textContent = `Página ${AppState.petshopPagination.currentPage} de ${AppState.petshopPagination.totalPages}`
  }

  if (itemsInfo) {
    const startIndex = (AppState.petshopPagination.currentPage - 1) * AppState.petshopPagination.itemsPerPage
    const endIndex = Math.min(
      startIndex + AppState.petshopPagination.itemsPerPage,
      AppState.petshopPagination.totalItems,
    )
    itemsInfo.textContent = `Mostrando ${startIndex + 1} a ${endIndex} de ${AppState.petshopPagination.totalItems} productos`
  }

  if (prevBtn) {
    prevBtn.disabled = AppState.petshopPagination.currentPage === 1
  }

  if (nextBtn) {
    nextBtn.disabled = AppState.petshopPagination.currentPage === AppState.petshopPagination.totalPages
  }
}

// Ordenamiento
function setupSortListeners() {
  // Agenda sort headers
  const agendaSortHeaders = document.querySelectorAll("#agenda-section .sortable")
  agendaSortHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const field = this.dataset.sort
      sortAgenda(field)
    })
  })

  // PetShop sort headers
  const petshopSortHeaders = document.querySelectorAll("#petshop-section .sortable")
  petshopSortHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const field = this.dataset.sort
      sortPetshop(field)
    })
  })
}

function sortAgenda(field) {
  if (AppState.agendaSort.field === field) {
    AppState.agendaSort.direction = AppState.agendaSort.direction === "asc" ? "desc" : "asc"
  } else {
    AppState.agendaSort.field = field
    AppState.agendaSort.direction = "asc"
  }

  AppState.agendaPagination.currentPage = 1
  renderAgendaTable()
  updatePagination()
  updateSortIcons("agenda", field, AppState.agendaSort.direction)
}

function sortPetshop(field) {
  if (AppState.petshopSort.field === field) {
    AppState.petshopSort.direction = AppState.petshopSort.direction === "asc" ? "desc" : "asc"
  } else {
    AppState.petshopSort.field = field
    AppState.petshopSort.direction = "asc"
  }

  AppState.petshopPagination.currentPage = 1
  renderPetshopTable()
  updatePagination()
  updateSortIcons("petshop", field, AppState.petshopSort.direction)
}

function updateSortIcons(section, activeField, direction) {
  const headers = document.querySelectorAll(`#${section}-section .sortable`)
  headers.forEach((header) => {
    const icon = header.querySelector("i")
    if (header.dataset.sort === activeField) {
      icon.className = direction === "asc" ? "fas fa-sort-up" : "fas fa-sort-down"
    } else {
      icon.className = "fas fa-sort"
    }
  })
}

// Acciones de tabla
function editAgendaItem(id) {
  alert(`Editar cita con ID: ${id}`)
}

function deleteAgendaItem(id) {
  if (confirm("¿Estás seguro de que quieres eliminar esta cita?")) {
    AppState.agendaData = AppState.agendaData.filter((item) => item.id !== id)
    renderAgendaTable()
    updatePagination()
  }
}

function editPetshopItem(id) {
  alert(`Editar producto con ID: ${id}`)
}

function deletePetshopItem(id) {
  if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
    AppState.petshopData = AppState.petshopData.filter((item) => item.id !== id)
    renderPetshopTable()
    updatePagination()
  }
}

function toggleNavDropdown(navGroup) {
  const isActive = navGroup.classList.contains("active")

  // Close all other dropdowns
  document.querySelectorAll(".nav-group").forEach((group) => {
    group.classList.remove("active")
  })

  // Toggle current dropdown
  if (!isActive) {
    navGroup.classList.add("active")
  }
}

function closeAllDropdowns() {
  document.querySelectorAll(".nav-group").forEach((group) => {
    group.classList.remove("active")
  })
}

function setActiveNavGroup(activeGroup) {
  // Remove active class from all nav groups
  document.querySelectorAll(".nav-group").forEach((group) => {
    group.classList.remove("active")
  })

  // Add active class to selected group
  if (activeGroup) {
    activeGroup.classList.add("active")
  }
}

function setActiveNavSubitem(activeSubitem) {
  // Remove active class from all subitems
  document.querySelectorAll(".nav-subitem").forEach((item) => {
    item.classList.remove("active")
  })

  // Add active class to selected subitem
  if (activeSubitem) {
    activeSubitem.classList.add("active")
  }
}

function handleNavSubitemClick(section, action) {
  console.log(`[v0] Navigation: ${section} - ${action}`)

  if (action === "create") {
    handleCreateAction(section)
  } else if (action === "manage") {
    handleManageAction(section)
  }
}

function handleManageAction(section) {
  switch (section) {
    case "agenda":
      showManageAgenda()
      break
    case "petshop":
      showSection("petshop")
      break
    case "empleados":
      showSection("empleados")
      break
    default:
      console.log(`[v0] Manage action for ${section} not implemented`)
  }
}

function showManageAgenda() {
  // Mostrar la sección agenda
  showSection("agenda")

  // Ocultar crear agenda y mostrar administrar agenda
  const createSubsection = document.getElementById("agenda-create")
  const manageSubsection = document.getElementById("agenda-manage")

  if (createSubsection) {
    createSubsection.style.display = "none"
  }

  if (manageSubsection) {
    manageSubsection.style.display = "block"
  }
}

function handleCreateAction(section) {
  switch (section) {
    case "agenda":
      showCreateAgendaForm()
      break
    case "petshop":
      alert("Crear Nuevo Producto - Aquí se abriría el formulario de creación de productos")
      break
    case "empleados":
      alert("Crear Nuevo Empleado - Aquí se abriría el formulario de creación de empleados")
      break
    default:
      console.log(`[v0] Create action for ${section} not implemented`)
  }
}

function showCreateAgendaForm() {
  // Mostrar la sección agenda
  showSection("agenda")

  // Mostrar crear agenda y ocultar administrar agenda
  const createSubsection = document.getElementById("agenda-create")
  const manageSubsection = document.getElementById("agenda-manage")

  if (createSubsection) {
    createSubsection.style.display = "block"
  }

  if (manageSubsection) {
    manageSubsection.style.display = "none"
  }
}

function agregarDueno() {
  const container = document.getElementById("duenos-container")
  const duenoCount = container.querySelectorAll(".dueno-form").length + 1

  const newDuenoForm = document.createElement("div")
  newDuenoForm.className = "dueno-form"
  newDuenoForm.setAttribute("data-dueno", duenoCount)
  newDuenoForm.innerHTML = `
    <div class="form-row">
      <div class="form-group">
        <label for="nombre_${duenoCount}">Nombre</label>
        <input type="text" id="nombre_${duenoCount}" name="nombre_${duenoCount}" required>
      </div>
      <div class="form-group">
        <label for="apellido_${duenoCount}">Apellido</label>
        <input type="text" id="apellido_${duenoCount}" name="apellido_${duenoCount}" required>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="dni_${duenoCount}">DNI</label>
        <input type="text" id="dni_${duenoCount}" name="dni_${duenoCount}" required>
      </div>
      <div class="form-group">
        <label for="telefono_${duenoCount}">Número de Celular</label>
        <input type="tel" id="telefono_${duenoCount}" name="telefono_${duenoCount}" required>
      </div>
    </div>
    <button type="button" class="btn-remove" onclick="this.parentElement.remove()">
      <i class="fas fa-trash"></i> Eliminar Dueño
    </button>
  `

  const addButton = container.querySelector(".btn-add")
  container.insertBefore(newDuenoForm, addButton)
}

function agregarMascota() {
  const container = document.getElementById("mascotas-container")
  const mascotaCount = container.querySelectorAll(".mascota-form").length + 1

  const newMascotaForm = document.createElement("div")
  newMascotaForm.className = "mascota-form"
  newMascotaForm.setAttribute("data-mascota", mascotaCount)
  newMascotaForm.innerHTML = `
    <div class="form-row">
      <div class="form-group">
        <label for="nombre_mascota_${mascotaCount}">Nombre del Perro</label>
        <input type="text" id="nombre_mascota_${mascotaCount}" name="nombre_mascota_${mascotaCount}" required>
      </div>
      <div class="form-group">
        <label for="raza_${mascotaCount}">Raza</label>
        <input type="text" id="raza_${mascotaCount}" name="raza_${mascotaCount}" required>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="tamano_${mascotaCount}">Tamaño</label>
        <input type="text" id="tamano_${mascotaCount}" name="tamano_${mascotaCount}" placeholder="Ej: Pequeño, Mediano, Grande" required>
      </div>
    </div>
    <button type="button" class="btn-remove" onclick="this.parentElement.remove()">
      <i class="fas fa-trash"></i> Eliminar Mascota
    </button>
  `

  const addButton = container.querySelector(".btn-add")
  container.insertBefore(newMascotaForm, addButton)
}
