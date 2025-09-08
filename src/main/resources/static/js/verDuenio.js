// Estado global de la aplicación de dueños
const ClientesApp = {
  sidebarCollapsed: false,
  userDropdownOpen: false,

  // Datos de dueños (se obtienen del DOM)
  clientesData: [],

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
  initializeClientesApp();
});

function initializeClientesApp() {
  // Extraer datos de los dueños desde el DOM (Thymeleaf)
  extractClientesDataFromDOM();
  setupEventListeners();
  updateStats();
  updatePagination();
}

function extractClientesDataFromDOM() {
  const rows = document.querySelectorAll('#clientesTableBody tr');
  ClientesApp.clientesData = [];

  rows.forEach(row => {
    // Saltar la fila de "no hay dueños"
    if (row.cells.length === 1) return;

    const duenio = {
      idDuenio: parseInt(row.cells[0].textContent),
      nombreDuenio: row.cells[1].textContent,
      apellido: row.cells[2].textContent,
      celular: row.cells[3].textContent,
      dni: row.cells[4].textContent.trim()
    };

    ClientesApp.clientesData.push(duenio);
  });

  ClientesApp.pagination.totalItems = ClientesApp.clientesData.length;
  ClientesApp.pagination.totalPages = Math.ceil(ClientesApp.clientesData.length / ClientesApp.pagination.itemsPerPage);
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
    if (ClientesApp.userDropdownOpen) {
      closeUserDropdown();
    }
  });

  // Search input
  const searchInput = document.getElementById("clientesSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      ClientesApp.searchFilter = this.value.toLowerCase();
      ClientesApp.pagination.currentPage = 1;
      renderClientesTable();
      updatePagination();
    });
  }

  // Items per page selector
  const itemsPerPageSelect = document.getElementById("itemsPerPage");
  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener("change", function() {
      ClientesApp.pagination.itemsPerPage = parseInt(this.value);
      ClientesApp.pagination.currentPage = 1;
      renderClientesTable();
      updatePagination();
    });
  }

  // Pagination buttons
  setupPaginationListeners();

  // Sort headers
  setupSortListeners();

  // Action buttons
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
  const prevBtn = document.getElementById("clientesPrevBtn");
  const nextBtn = document.getElementById("clientesNextBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (ClientesApp.pagination.currentPage > 1) {
        ClientesApp.pagination.currentPage--;
        renderClientesTable();
        updatePagination();
        scrollToTop();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (ClientesApp.pagination.currentPage < ClientesApp.pagination.totalPages) {
        ClientesApp.pagination.currentPage++;
        renderClientesTable();
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
      sortClientes(field);
    });
  });
}

function setupActionListeners() {
  const newClientBtn = document.getElementById("newClientBtn");
  const exportBtn = document.getElementById("exportBtn");

  if (newClientBtn) {
    newClientBtn.addEventListener("click", () => {
      window.location.href = "/duenios/crear";
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      exportClientesData();
    });
  }
}

// Funciones de sidebar y navegación
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  ClientesApp.sidebarCollapsed = !ClientesApp.sidebarCollapsed;

  if (ClientesApp.sidebarCollapsed) {
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
  ClientesApp.userDropdownOpen = !ClientesApp.userDropdownOpen;

  if (ClientesApp.userDropdownOpen) {
    dropdown.classList.add("show");
  } else {
    dropdown.classList.remove("show");
  }
}

function closeUserDropdown() {
  const dropdown = document.getElementById("userDropdown");
  dropdown.classList.remove("show");
  ClientesApp.userDropdownOpen = false;
}

// Función de estadísticas
function updateStats() {
  const data = ClientesApp.clientesData;

  const totalClientes = data.length;
  const activos = data.filter(c => c.estado && c.estado.toLowerCase().includes("activo")).length;
  const inactivos = data.filter(c => c.estado && c.estado.toLowerCase().includes("inactivo")).length;

  // Para clientes recientes, asumimos que tienes una fecha de registro
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const recientes = data.filter(c => {
    if (c.fechaRegistro) {
      const fecha = new Date(c.fechaRegistro);
      return fecha.getMonth() === thisMonth && fecha.getFullYear() === thisYear;
    }
    return false;
  }).length;

  document.getElementById("totalClientes").textContent = totalClientes;
  document.getElementById("clientesActivos").textContent = activos;
  document.getElementById("clientesInactivos").textContent = inactivos;
  document.getElementById("clientesRecientes").textContent = recientes;
}

// Funciones de tabla
    function renderClientesTable() {
      const tbody = document.getElementById("clientesTableBody");
      if (!tbody) return;

      const filteredData = getFilteredClientesData();
      const paginatedData = getPaginatedData(filteredData);

      // Limpiar tabla
      tbody.innerHTML = "";

      if (paginatedData.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="empty-state">
              <div class="empty-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="empty-title">No se encontraron dueños</div>
              <div class="empty-message">
                ${ClientesApp.searchFilter ? 'Intenta con otros términos de búsqueda' : 'No hay dueños registrados aún'}
              </div>
            </td>
          </tr>
        `;
        return;
      }

      paginatedData.forEach(duenio => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${duenio.idDuenio}</td>
          <td>${duenio.nombreDuenio}</td>
          <td>${duenio.apellido}</td>
          <td>${duenio.celular}</td>
          <td>${duenio.dni}</td>
          <td class="actions-cell">
            <button class="btn btn-edit" onclick="window.location.href='/duenios/editar/${duenio.idDuenio}'">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-delete" onclick="if(confirm('¿Estás seguro de eliminar este dueño?')) window.location.href='/duenios/eliminar/${duenio.idDuenio}'">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        `;
        tbody.appendChild(row);
      });

      updatePaginationInfo();
    }

function getFilteredClientesData() {
  let filtered = [...ClientesApp.clientesData];

  // Aplicar filtro de búsqueda
  if (ClientesApp.searchFilter) {
    filtered = filtered.filter(cliente =>
      (cliente.nombre && cliente.nombre.toLowerCase().includes(ClientesApp.searchFilter)) ||
      (cliente.email && cliente.email.toLowerCase().includes(ClientesApp.searchFilter)) ||
      (cliente.telefono && cliente.telefono.toLowerCase().includes(ClientesApp.searchFilter)) ||
      (cliente.estado && cliente.estado.toLowerCase().includes(ClientesApp.searchFilter)) ||
      (cliente.idCliente && cliente.idCliente.toString().includes(ClientesApp.searchFilter))
    );
  }

  // Aplicar ordenamiento
  if (ClientesApp.sort.field) {
    filtered.sort((a, b) => {
      let aVal = a[ClientesApp.sort.field];
      let bVal = b[ClientesApp.sort.field];

      // Manejar valores nulos o indefinidos
      if (aVal === null || aVal === undefined) aVal = "";
      if (bVal === null || bVal === undefined) bVal = "";

      // Convertir a números si es ID
      if (ClientesApp.sort.field === 'idCliente') {
        aVal = parseInt(aVal) || 0;
        bVal = parseInt(bVal) || 0;
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (ClientesApp.sort.direction === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  // Actualizar totales de paginación
  ClientesApp.pagination.totalItems = filtered.length;
  ClientesApp.pagination.totalPages = Math.ceil(filtered.length / ClientesApp.pagination.itemsPerPage);

  return filtered;
}

function getPaginatedData(data) {
  const startIndex = (ClientesApp.pagination.currentPage - 1) * ClientesApp.pagination.itemsPerPage;
  const endIndex = startIndex + ClientesApp.pagination.itemsPerPage;
  return data.slice(startIndex, endIndex);
}

// Funciones de ordenamiento
function sortClientes(field) {
  if (ClientesApp.sort.field === field) {
    ClientesApp.sort.direction = ClientesApp.sort.direction === "asc" ? "desc" : "asc";
  } else {
    ClientesApp.sort.field = field;
    ClientesApp.sort.direction = "asc";
  }

  ClientesApp.pagination.currentPage = 1;
  renderClientesTable();
  updatePagination();
  updateSortIcons(field, ClientesApp.sort.direction);
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
  const itemsInfo = document.getElementById("clientesItemsInfo");
  if (!itemsInfo) return;

  const startIndex = (ClientesApp.pagination.currentPage - 1) * ClientesApp.pagination.itemsPerPage;
  const endIndex = Math.min(startIndex + ClientesApp.pagination.itemsPerPage, ClientesApp.pagination.totalItems);

  if (ClientesApp.pagination.totalItems === 0) {
    itemsInfo.textContent = "No hay clientes para mostrar";
  } else {
    itemsInfo.textContent = `Mostrando ${startIndex + 1} a ${endIndex} de ${ClientesApp.pagination.totalItems} clientes`;
  }
}

function updatePaginationButtons() {
  const prevBtn = document.getElementById("clientesPrevBtn");
  const nextBtn = document.getElementById("clientesNextBtn");

  if (prevBtn) {
    prevBtn.disabled = ClientesApp.pagination.currentPage === 1;
  }

  if (nextBtn) {
    nextBtn.disabled = ClientesApp.pagination.currentPage === ClientesApp.pagination.totalPages || ClientesApp.pagination.totalPages === 0;
  }
}

function renderPageNumbers() {
  const pageNumbersContainer = document.getElementById("pageNumbers");
  if (!pageNumbersContainer) return;

  pageNumbersContainer.innerHTML = "";

  const totalPages = ClientesApp.pagination.totalPages;
  const currentPage = ClientesApp.pagination.currentPage;

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
  button.className = `page-number ${pageNumber === ClientesApp.pagination.currentPage ? 'active' : ''}`;
  button.textContent = pageNumber;
  button.addEventListener("click", () => {
    ClientesApp.pagination.currentPage = pageNumber;
    renderClientesTable();
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

function exportClientesData() {
  const filteredData = getFilteredClientesData();

  // Crear CSV
  const headers = ["ID", "Nombre", "Email", "Teléfono", "Estado", "Fecha Registro"];
  const csvContent = [
    headers.join(","),
    ...filteredData.map(cliente => [
      cliente.idCliente,
      `"${cliente.nombre}"`,
      `"${cliente.email}"`,
      `"${cliente.telefono}"`,
      `"${cliente.estado}"`,
      `"${cliente.fechaRegistro}"`
    ].join(","))
  ].join("\n");

  // Descargar archivo
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `clientes_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Utilidades
function scrollToTop() {
  document.querySelector(".table-wrapper").scrollTop = 0;
}