// Función de estadísticas corregida
function updateStats() {
  const data = MascotasApp.mascotasData;

  const totalMascotas = data.length;

  // Usamos includes() en lugar de comparación exacta para manejar diferentes formatos
  const pequenas = data.filter(m => m.tamanios &&
    m.tamanios.toLowerCase().includes("peque")).length;

  const medianas = data.filter(m => m.tamanios &&
    (m.tamanios.toLowerCase().includes("median") ||
     m.tamanios.toLowerCase().includes("medio"))).length;

  const grandes = data.filter(m => m.tamanios &&
    m.tamanios.toLowerCase().includes("grande")).length;

  document.getElementById("totalMascotas").textContent = totalMascotas;
  document.getElementById("mascotasPequenas").textContent = pequenas;
  document.getElementById("mascotasMedianas").textContent = medianas;
  document.getElementById("mascotasGrandes").textContent = grandes;
}

// JavaScript completo corregido
// Estado global de la aplicación de mascotas
const MascotasApp = {
  sidebarCollapsed: false,
  userDropdownOpen: false,

  // Datos de mascotas (se obtienen del DOM)
  mascotasData: [],

  // Estado de paginación
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  },

  // Estado de filtros y ordenamiento
  searchFilter: "",
  sort: {
    field: null,
    direction: "asc"
  }
};

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  initializeMascotasApp();
});

function initializeMascotasApp() {
  // Extraer datos de las mascotas desde el DOM (Thymeleaf)
  extractMascotasDataFromDOM();
  setupEventListeners();
  updateStats();
  updatePagination();
}

function extractMascotasDataFromDOM() {
  const rows = document.querySelectorAll('#mascotasTableBody tr');
  MascotasApp.mascotasData = [];

  rows.forEach(row => {
    // Saltar la fila de "no hay mascotas"
    if (row.cells.length === 1) return;

    const mascota = {
      idMascotas: parseInt(row.cells[0].textContent),
      nombreMascota: row.cells[1].textContent,
      raza: row.cells[2].textContent,
      tamanios: row.cells[3].textContent,
      duenios: row.cells[4].textContent
    };

    MascotasApp.mascotasData.push(mascota);
  });

  MascotasApp.pagination.totalItems = MascotasApp.mascotasData.length;
  MascotasApp.pagination.totalPages = Math.ceil(MascotasApp.mascotasData.length / MascotasApp.pagination.itemsPerPage);
}

function setupEventListeners() {
  // Sidebar toggle (solo funciona en desktop)
  const toggleBtn = document.getElementById("toggleSidebar");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function() {
      // Solo funciona en desktop (ancho mayor a 768px)
      if (window.innerWidth > 768) {
        toggleSidebar();
      }
    });
  }

  // Toggle sidebar en móviles
  const mobileToggle = document.getElementById("mobileToggle");
  const overlay = document.getElementById("overlay");
  const sidebar = document.getElementById("sidebar");

  if (mobileToggle) {
    mobileToggle.addEventListener("click", function() {
      sidebar.classList.toggle("show");
      overlay.classList.toggle("active");
    });
  }

  // Cerrar sidebar al hacer clic en el overlay
  if (overlay) {
    overlay.addEventListener("click", function() {
      sidebar.classList.remove("show");
      overlay.classList.remove("active");
    });
  }

  // Navigation dropdown toggles
  const dropdownToggles = document.querySelectorAll(".nav-item.dropdown-toggle");
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener("click", function(e) {
      e.preventDefault();
      const navGroup = this.closest(".nav-group");
      toggleNavDropdown(navGroup);
    });
  });

  // User menu
  const userMenuBtn = document.getElementById("userMenuBtn");
  const userDropdown = document.getElementById("userDropdown");

  if (userMenuBtn) {
    userMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleUserDropdown();
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    if (MascotasApp.userDropdownOpen) {
      closeUserDropdown();
    }
  });

  // Search input
  const searchInput = document.getElementById("mascotasSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      MascotasApp.searchFilter = this.value.toLowerCase();
      MascotasApp.pagination.currentPage = 1;
      renderMascotasTable();
      updatePagination();
    });
  }

  // Items per page selector
  const itemsPerPageSelect = document.getElementById("itemsPerPage");
  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener("change", function() {
      MascotasApp.pagination.itemsPerPage = parseInt(this.value);
      MascotasApp.pagination.currentPage = 1;
      renderMascotasTable();
      updatePagination();
    });
  }

  // Pagination buttons
  setupPaginationListeners();

  // Sort headers
  setupSortListeners();

  // Action buttons (solo para redirección)
  setupActionListeners();

  // Manejo responsive al redimensionar
  window.addEventListener('resize', handleResize);
}

function handleResize() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if (window.innerWidth > 768) {
    // En desktop, asegurarse que el sidebar esté visible y sin overlay
    sidebar.classList.remove('show');
    overlay.classList.remove('active');
  }
}

function setupPaginationListeners() {
  const prevBtn = document.getElementById("mascotasPrevBtn");
  const nextBtn = document.getElementById("mascotasNextBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (MascotasApp.pagination.currentPage > 1) {
        MascotasApp.pagination.currentPage--;
        renderMascotasTable();
        updatePagination();
        scrollToTop();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (MascotasApp.pagination.currentPage < MascotasApp.pagination.totalPages) {
        MascotasApp.pagination.currentPage++;
        renderMascotasTable();
        updatePagination();
        scrollToTop();
      }
    });
  }
}

function setupSortListeners() {
  const sortHeaders = document.querySelectorAll(".sortable");
  sortHeaders.forEach(header => {
    header.addEventListener("click", function() {
      const field = this.dataset.sort;
      sortMascotas(field);
    });
  });
}

function setupActionListeners() {
  const newPetBtn = document.getElementById("newPetBtn");
  const exportBtn = document.getElementById("exportBtn");

  if (newPetBtn) {
    newPetBtn.addEventListener("click", () => {
      window.location.href = "/mascotas/crear";
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      exportMascotasData();
    });
  }
}

// Funciones de sidebar y navegación
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  MascotasApp.sidebarCollapsed = !MascotasApp.sidebarCollapsed;

  if (MascotasApp.sidebarCollapsed) {
    sidebar.classList.add("collapsed");
  } else {
    sidebar.classList.remove("collapsed");
  }
}

function toggleNavDropdown(navGroup) {
  const isActive = navGroup.classList.contains("active");

  // Close all other dropdowns
  document.querySelectorAll(".nav-group").forEach(group => {
    if (group !== navGroup) {
      group.classList.remove("active");
      const dropdown = group.querySelector(".nav-dropdown");
      const arrow = group.querySelector(".dropdown-arrow");
      if (dropdown) dropdown.classList.remove("show");
      if (arrow) arrow.classList.remove("rotated");
    }
  });

  // Toggle current dropdown
  if (!isActive) {
    navGroup.classList.add("active");
    const dropdown = navGroup.querySelector(".nav-dropdown");
    const arrow = navGroup.querySelector(".dropdown-arrow");
    if (dropdown) dropdown.classList.add("show");
    if (arrow) arrow.classList.add("rotated");
  }
}

function toggleUserDropdown() {
  const dropdown = document.getElementById("userDropdown");
  MascotasApp.userDropdownOpen = !MascotasApp.userDropdownOpen;

  if (MascotasApp.userDropdownOpen) {
    dropdown.classList.add("show");
  } else {
    dropdown.classList.remove("show");
  }
}

function closeUserDropdown() {
  const dropdown = document.getElementById("userDropdown");
  dropdown.classList.remove("show");
  MascotasApp.userDropdownOpen = false;
}

// Funciones de tabla
function renderMascotasTable() {
  const tbody = document.getElementById("mascotasTableBody");
  if (!tbody) return;

  const filteredData = getFilteredMascotasData();
  const paginatedData = getPaginatedData(filteredData);

  // Limpiar tabla
  tbody.innerHTML = "";

  if (paginatedData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-dog"></i>
          </div>
          <div class="empty-title">No se encontraron mascotas</div>
          <div class="empty-message">
            ${MascotasApp.searchFilter ? 'Intenta con otros términos de búsqueda' : 'No hay mascotas registradas aún'}
          </div>
        </td>
      </tr>
    `;
    return;
  }

  paginatedData.forEach(mascota => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${mascota.idMascotas}</td>
      <td>${mascota.nombreMascota}</td>
      <td>${mascota.raza}</td>
      <td>${mascota.tamanios}</td>
      <td>${mascota.duenios}</td>
      <td class="actions-cell">
        <button class="btn btn-view" onclick="window.location.href='/mascotas/ver/${mascota.idMascotas}'">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-edit" onclick="window.location.href='/mascotas/editar/${mascota.idMascotas}'">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-delete" onclick="if(confirm('¿Estás seguro de eliminar esta mascota?')) window.location.href='/mascotas/eliminar/${mascota.idMascotas}'">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  updatePaginationInfo();
}

function getFilteredMascotasData() {
  let filtered = [...MascotasApp.mascotasData];

  // Aplicar filtro de búsqueda
  if (MascotasApp.searchFilter) {
    filtered = filtered.filter(mascota =>
      (mascota.nombreMascota && mascota.nombreMascota.toLowerCase().includes(MascotasApp.searchFilter)) ||
      (mascota.raza && mascota.raza.toLowerCase().includes(MascotasApp.searchFilter)) ||
      (mascota.tamanios && mascota.tamanios.toLowerCase().includes(MascotasApp.searchFilter)) ||
      (mascota.duenios && mascota.duenios.toLowerCase().includes(MascotasApp.searchFilter)) ||
      (mascota.idMascotas && mascota.idMascotas.toString().includes(MascotasApp.searchFilter))
    );
  }

  // Aplicar ordenamiento
  if (MascotasApp.sort.field) {
    filtered.sort((a, b) => {
      let aVal = a[MascotasApp.sort.field];
      let bVal = b[MascotasApp.sort.field];

      // Manejar valores nulos o indefinidos
      if (aVal === null || aVal === undefined) aVal = "";
      if (bVal === null || bVal === undefined) bVal = "";

      // Convertir a números si es ID
      if (MascotasApp.sort.field === 'idMascotas') {
        aVal = parseInt(aVal) || 0;
        bVal = parseInt(bVal) || 0;
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (MascotasApp.sort.direction === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  // Actualizar totales de paginación
  MascotasApp.pagination.totalItems = filtered.length;
  MascotasApp.pagination.totalPages = Math.ceil(filtered.length / MascotasApp.pagination.itemsPerPage);

  return filtered;
}

function getPaginatedData(data) {
  const startIndex = (MascotasApp.pagination.currentPage - 1) * MascotasApp.pagination.itemsPerPage;
  const endIndex = startIndex + MascotasApp.pagination.itemsPerPage;
  return data.slice(startIndex, endIndex);
}

// Funciones de ordenamiento
function sortMascotas(field) {
  if (MascotasApp.sort.field === field) {
    MascotasApp.sort.direction = MascotasApp.sort.direction === "asc" ? "desc" : "asc";
  } else {
    MascotasApp.sort.field = field;
    MascotasApp.sort.direction = "asc";
  }

  MascotasApp.pagination.currentPage = 1;
  renderMascotasTable();
  updatePagination();
  updateSortIcons(ffield, MascotasApp.sort.direction);
}

function updateSortIcons(activeField, direction) {
  const headers = document.querySelectorAll(".sortable");
  headers.forEach(header => {
    const icon = header.querySelector(".sort-icon");
    if (header.dataset.sort === activeField) {
      icon.className = direction === "asc" ? "fas fa-sort-up sort-icon" : "fas fa-sort-down sort-icon";
    } else {
      icon.className = "fas fa-sort sort-icon";
    }
  });
}

// Funciones de paginación
function updatePagination() {
  updatePaginationInfo();
  updatePaginationButtons();
  renderPageNumbers();
}

function updatePaginationInfo() {
  const itemsInfo = document.getElementById("mascotasItemsInfo");
  if (!itemsInfo) return;

  const startIndex = (MascotasApp.pagination.currentPage - 1) * MascotasApp.pagination.itemsPerPage;
  const endIndex = Math.min(startIndex + MascotasApp.pagination.itemsPerPage, MascotasApp.pagination.totalItems);

  if (MascotasApp.pagination.totalItems === 0) {
    itemsInfo.textContent = "No hay mascotas para mostrar";
  } else {
    itemsInfo.textContent = `Mostrando ${startIndex + 1} a ${endIndex} de ${MascotasApp.pagination.totalItems} mascotas`;
  }
}

function updatePaginationButtons() {
  const prevBtn = document.getElementById("mascotasPrevBtn");
  const nextBtn = document.getElementById("mascotasNextBtn");

  if (prevBtn) {
    prevBtn.disabled = MascotasApp.pagination.currentPage === 1;
  }

  if (nextBtn) {
    nextBtn.disabled = MascotasApp.pagination.currentPage === MascotasApp.pagination.totalPages || MascotasApp.pagination.totalPages === 0;
  }
}

function renderPageNumbers() {
  const pageNumbersContainer = document.getElementById("pageNumbers");
  if (!pageNumbersContainer) return;

  pageNumbersContainer.innerHTML = "";

  const totalPages = MascotasApp.pagination.totalPages;
  const currentPage = MascotasApp.pagination.currentPage;

  if (totalPages <= 1) return;

  // Lógica para mostrar números de página con ellipsis
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  // Ajustar para mostrar siempre 5 páginas si es posible
  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + 4);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }
  }

  // Primera página y ellipsis
  if (startPage > 1) {
    createPageButton(1);
    if (startPage > 2) {
      createEllipsis();
    }
  }

  // Páginas del rango actual
  for (let i = startPage; i <= endPage; i++) {
    createPageButton(i);
  }

  // Ellipsis y última página
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      createEllipsis();
    }
    createPageButton(totalPages);
  }
}

function createPageButton(pageNumber) {
  const pageNumbersContainer = document.getElementById("pageNumbers");
  const button = document.createElement("button");
  button.className = `page-number ${pageNumber === MascotasApp.pagination.currentPage ? 'active' : ''}`;
  button.textContent = pageNumber;
  button.addEventListener("click", () => {
    MascotasApp.pagination.currentPage = pageNumber;
    renderMascotasTable();
    updatePagination();
    scrollToTop();
  });
  pageNumbersContainer.appendChild(button);
}

function createEllipsis() {
  const pageNumbersContainer = document.getElementById("pageNumbers");
  const ellipsis = document.createElement("span");
  ellipsis.className = "page-number ellipsis";
  ellipsis.textContent = "...";
  pageNumbersContainer.appendChild(ellipsis);
}

function exportMascotasData() {
  const filteredData = getFilteredMascotasData();

  // Crear CSV
  const headers = ["ID", "Nombre", "Raza", "Tamaño", "Dueño"];
  const csvContent = [
    headers.join(","),
    ...filteredData.map(mascota => [
      mascota.idMascotas,
      `"${mascota.nombreMascota}"`,
      `"${mascota.raza}"`,
      `"${mascota.tamanios}"`,
      `"${mascota.duenios}"`
    ].join(","))
  ].join("\n");

  // Descargar archivo
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `mascotas_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Utilidades
function scrollToTop() {
  document.querySelector(".table-wrapper").scrollTop = 0;
}