// Estado global de la aplicación de mascotas
const MascotasApp = {
    sidebarCollapsed: false,
    userDropdownOpen: false,
    mascotasData: [],
    pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0
    },
    searchFilter: "",
    sort: {
        field: null,
        direction: "asc"
    }
};

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    initializeMascotasApp();
});

function initializeMascotasApp() {
    extractMascotasDataFromDOM();
    setupEventListeners();
    updateStats();
    updatePagination();
    renderMascotasTable();
}

function extractMascotasDataFromDOM() {
    const rows = document.querySelectorAll('#mascotasTableBody tr');
    MascotasApp.mascotasData = [];

    rows.forEach(row => {
        if (row.cells.length <= 1) return; // Saltar filas vacías

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
    // Sidebar
    const toggleBtn = document.getElementById("toggleSidebar");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleSidebar);
    }

    // Móviles
    const mobileToggle = document.getElementById("mobileToggle");
    const overlay = document.getElementById("overlay");
    const sidebar = document.getElementById("sidebar");

    if (mobileToggle) {
        mobileToggle.addEventListener("click", () => {
            sidebar.classList.toggle("show");
            overlay.classList.toggle("active");
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => {
            sidebar.classList.remove("show");
            overlay.classList.remove("active");
        });
    }

    // Dropdowns
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
    if (userMenuBtn) {
        userMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleUserDropdown();
        });
    }

    document.addEventListener("click", () => {
        if (MascotasApp.userDropdownOpen) {
            closeUserDropdown();
        }
    });

    // Búsqueda
    const searchInput = document.getElementById("mascotasSearch");
    if (searchInput) {
        searchInput.addEventListener("input", function() {
            MascotasApp.searchFilter = this.value.toLowerCase();
            MascotasApp.pagination.currentPage = 1;
            renderMascotasTable();
            updatePagination();
        });
    }

    // Items por página
    const itemsPerPageSelect = document.getElementById("itemsPerPage");
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener("change", function() {
            MascotasApp.pagination.itemsPerPage = parseInt(this.value);
            MascotasApp.pagination.currentPage = 1;
            renderMascotasTable();
            updatePagination();
        });
    }

    // Botones de acción
    setupActionListeners();
    setupPaginationListeners();
    setupSortListeners();

    window.addEventListener('resize', handleResize);
}

function handleResize() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (window.innerWidth > 768) {
        sidebar.classList.remove('show');
        overlay.classList.remove('active');
    }
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
        exportBtn.addEventListener("click", exportMascotasData);
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
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (MascotasApp.pagination.currentPage < MascotasApp.pagination.totalPages) {
                MascotasApp.pagination.currentPage++;
                renderMascotasTable();
                updatePagination();
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

// Funciones de UI
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    MascotasApp.sidebarCollapsed = !MascotasApp.sidebarCollapsed;
    sidebar.classList.toggle("collapsed");
}

function toggleNavDropdown(navGroup) {
    const isActive = navGroup.classList.contains("active");

    document.querySelectorAll(".nav-group").forEach(group => {
        if (group !== navGroup) {
            group.classList.remove("active");
            const dropdown = group.querySelector(".nav-dropdown");
            const arrow = group.querySelector(".dropdown-arrow");
            if (dropdown) dropdown.classList.remove("show");
            if (arrow) arrow.classList.remove("rotated");
        }
    });

    if (!isActive) {
        navGroup.classList.add("active");
        const dropdown = navGroup.querySelector(".nav-dropdown");
        const arrow = navGroup.querySelector(".dropdown-arrow");
        if (dropdown) dropdown.classList.add("show");
        if (arrow) arrow.classList.add("rotated");
    } else {
        navGroup.classList.remove("active");
        const dropdown = navGroup.querySelector(".nav-dropdown");
        const arrow = navGroup.querySelector(".dropdown-arrow");
        if (dropdown) dropdown.classList.remove("show");
        if (arrow) arrow.classList.remove("rotated");
    }
}

function toggleUserDropdown() {
    const dropdown = document.getElementById("userDropdown");
    MascotasApp.userDropdownOpen = !MascotasApp.userDropdownOpen;
    dropdown.classList.toggle("show");
}

function closeUserDropdown() {
    const dropdown = document.getElementById("userDropdown");
    dropdown.classList.remove("show");
    MascotasApp.userDropdownOpen = false;
}

// Funciones de tabla
 // Funciones de tabla
 function renderMascotasTable() {
     const tbody = document.getElementById("mascotasTableBody");
     if (!tbody) return;

     const filteredData = getFilteredMascotasData();
     const paginatedData = getPaginatedData(filteredData);

     tbody.innerHTML = "";

     if (paginatedData.length === 0) {
         tbody.innerHTML = `
             <tr>
                 <td colspan="6" style="text-align: center; padding: 2rem; color: #6b7280;">
                     <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                     <div>${MascotasApp.searchFilter ? 'No se encontraron mascotas' : 'No hay mascotas registradas'}</div>
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
                 <button class="btn-action btn-edit" onclick="window.location.href='/mascotas/editar/${mascota.idMascotas}'">
                     <i class="fas fa-edit"></i>
                 </button>
                 </button>
                             <button class="btn btn-delete" onclick="if(confirm('¿Estás seguro de eliminar esta Mascota?')) window.location.href='/mascotas/eliminar/${mascota.idMascotas}'">
                               <i class="fas fa-trash"></i>
                             </button>
             </td>
         `;
         tbody.appendChild(row);
     });
 }

function getFilteredMascotasData() {
    let filtered = MascotasApp.mascotasData.filter(mascota =>
        !MascotasApp.searchFilter ||
        mascota.nombreMascota.toLowerCase().includes(MascotasApp.searchFilter) ||
        mascota.raza.toLowerCase().includes(MascotasApp.searchFilter) ||
        mascota.tamanios.toLowerCase().includes(MascotasApp.searchFilter) ||
        mascota.duenios.toLowerCase().includes(MascotasApp.searchFilter) ||
        mascota.idMascotas.toString().includes(MascotasApp.searchFilter)
    );

    MascotasApp.pagination.totalItems = filtered.length;
    MascotasApp.pagination.totalPages = Math.ceil(filtered.length / MascotasApp.pagination.itemsPerPage);

    return filtered;
}

function getPaginatedData(data) {
    const start = (MascotasApp.pagination.currentPage - 1) * MascotasApp.pagination.itemsPerPage;
    return data.slice(start, start + MascotasApp.pagination.itemsPerPage);
}

function sortMascotas(field) {
    if (MascotasApp.sort.field === field) {
        MascotasApp.sort.direction = MascotasApp.sort.direction === "asc" ? "desc" : "asc";
    } else {
        MascotasApp.sort.field = field;
        MascotasApp.sort.direction = "asc";
    }

    MascotasApp.mascotasData.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        return MascotasApp.sort.direction === "asc" ?
            (aVal > bVal ? 1 : -1) :
            (aVal < bVal ? 1 : -1);
    });

    MascotasApp.pagination.currentPage = 1;
    renderMascotasTable();
    updatePagination();
}

// Estadísticas
function updateStats() {
    const total = MascotasApp.mascotasData.length;
    const pequenas = MascotasApp.mascotasData.filter(m => m.tamanios && m.tamanios.toLowerCase().includes("peque")).length;
    const medianas = MascotasApp.mascotasData.filter(m => m.tamanios && m.tamanios.toLowerCase().includes("median")).length;
    const grandes = MascotasApp.mascotasData.filter(m => m.tamanios && m.tamanios.toLowerCase().includes("grande")).length;

    document.getElementById("totalMascotas").textContent = total;
    document.getElementById("mascotasPequenas").textContent = pequenas;
    document.getElementById("mascotasMedianas").textContent = medianas;
    document.getElementById("mascotasGrandes").textContent = grandes;
}

// Paginación
function updatePagination() {
    updatePaginationInfo();
    updatePaginationButtons();
}

function updatePaginationInfo() {
    const info = document.getElementById("mascotasItemsInfo");
    if (!info) return;

    const start = (MascotasApp.pagination.currentPage - 1) * MascotasApp.pagination.itemsPerPage + 1;
    const end = Math.min(start + MascotasApp.pagination.itemsPerPage - 1, MascotasApp.pagination.totalItems);

    info.textContent = `Mostrando ${start} a ${end} de ${MascotasApp.pagination.totalItems} mascotas`;
}

function updatePaginationButtons() {
    const prevBtn = document.getElementById("mascotasPrevBtn");
    const nextBtn = document.getElementById("mascotasNextBtn");

    if (prevBtn) prevBtn.disabled = MascotasApp.pagination.currentPage === 1;
    if (nextBtn) nextBtn.disabled = MascotasApp.pagination.currentPage === MascotasApp.pagination.totalPages;
}

function exportMascotasData() {
    const csv = MascotasApp.mascotasData.map(m =>
        `${m.idMascotas},${m.nombreMascota},${m.raza},${m.tamanios},${m.duenios}`
    ).join('\n');

    const blob = new Blob(['ID,Nombre,Raza,Tamaño,Dueño\n' + csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mascotas.csv';
    link.click();
}