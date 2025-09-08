// Estado global de la aplicación
function viewTurno(id) {
    console.log("Viendo turno con ID:", id);
    window.location.href = `/turnos/ver/${id}`;
}

function editTurno(id) {
    console.log("Editando turno con ID:", id);
    window.location.href = `/turnos/editar/${id}`;
}

function confirmDelete(id) {
    console.log("Confirmando eliminación del turno:", id);
    TurnosApp.currentDeleteId = id;

    const modal = document.getElementById("confirmModal");
    if (modal) {
        modal.classList.add("show");
        modal.style.display = "block";
    }
}

function executeDelete() {
    if (TurnosApp.currentDeleteId) {
        console.log("Eliminando turno:", TurnosApp.currentDeleteId);
        window.location.href = `/turnos/borrar/${TurnosApp.currentDeleteId}`;
    }
    closeModal();
}

function closeModal() {
    const modal = document.getElementById("confirmModal");
    if (modal) {
        modal.classList.remove("show");
        modal.style.display = "none";
    }
}

const TurnosApp = {
    sidebarCollapsed: false,
    userDropdownOpen: false,
    turnosData: [],
    pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0
    },
    searchFilter: "",
    fechaFilter: "",
    estadoFilter: "",
    clienteFilter: "",
    sort: {
        field: null,
        direction: "asc"
    },
    currentDeleteId: null,
    currentViewId: null
};

// Inicialización
document.addEventListener("DOMContentLoaded", function() {
    initializeApp();
});

function initializeApp() {
    extractTurnosDataFromDOM();
    setupEventListeners();
    updateStats();
    updatePagination();
    renderTurnosTable();
}

function extractTurnosDataFromDOM() {
    const rows = document.querySelectorAll('#turnosTableBody tr');
    TurnosApp.turnosData = [];

    // Saltar la fila de "no hay datos"
    if (rows.length === 1 && rows[0].cells.length === 1) return;

    rows.forEach(row => {
        if (row.cells.length <= 1) return;

        const turno = {
            idTurnos: parseInt(row.cells[0].textContent),
            fecha: row.cells[1].querySelector('.fecha').textContent + ' ' + row.cells[1].querySelector('.hora').textContent,
            cliente: row.cells[2].textContent,
            mascota: row.cells[3].textContent,
            estado: row.cells[4].textContent.trim(),
            rawElement: row
        };

        TurnosApp.turnosData.push(turno);
    });

    TurnosApp.pagination.totalItems = TurnosApp.turnosData.length;
    TurnosApp.pagination.totalPages = Math.ceil(TurnosApp.turnosData.length / TurnosApp.pagination.itemsPerPage);
}

function setupEventListeners() {
    // Toggle del SIDEBAR (solo desktop)
    const toggleBtn = document.getElementById("toggleSidebar");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", function() {
            // Solo funciona en desktop
            if (window.innerWidth > 768) {
                toggleSidebar();
            }
        });
    }

    // Toggle del HEADER (solo móviles)
    const mobileToggle = document.getElementById("mobileToggle");
    const overlay = document.getElementById("overlay");
    const sidebar = document.getElementById("sidebar");

    if (mobileToggle) {
        mobileToggle.addEventListener("click", function() {
            sidebar.classList.add("show");
            overlay.classList.add("active");
        });
    }

    if (overlay) {
        overlay.addEventListener("click", function() {
            sidebar.classList.remove("show");
            overlay.classList.remove("active");
        });
    }

    // Navigation dropdowns
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
        userMenuBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            toggleUserDropdown();
        });
    }

    document.addEventListener("click", function() {
        if (TurnosApp.userDropdownOpen) {
            closeUserDropdown();
        }
    });

    // Search functionality
    const searchInput = document.getElementById("turnosSearch");
    if (searchInput) {
        searchInput.addEventListener("input", function() {
            TurnosApp.searchFilter = this.value.toLowerCase();
            TurnosApp.pagination.currentPage = 1;
            renderTurnosTable();
            updatePagination();
        });
    }

    // Filters
    const fechaFilter = document.getElementById("fechaFilter");
    const estadoFilter = document.getElementById("estadoFilter");
    const clienteFilter = document.getElementById("clienteFilter");
    const applyFilters = document.getElementById("applyFilters");
    const clearFilters = document.getElementById("clearFilters");

    if (fechaFilter) {
        fechaFilter.addEventListener("change", function() {
            TurnosApp.fechaFilter = this.value;
        });
    }

    if (estadoFilter) {
        estadoFilter.addEventListener("change", function() {
            TurnosApp.estadoFilter = this.value;
        });
    }

    if (clienteFilter) {
        clienteFilter.addEventListener("input", function() {
            TurnosApp.clienteFilter = this.value.toLowerCase();
        });
    }

    if (applyFilters) {
        applyFilters.addEventListener("click", function() {
            TurnosApp.pagination.currentPage = 1;
            renderTurnosTable();
            updatePagination();
        });
    }

    if (clearFilters) {
        clearFilters.addEventListener("click", function() {
            TurnosApp.fechaFilter = "";
            TurnosApp.estadoFilter = "";
            TurnosApp.clienteFilter = "";

            if (fechaFilter) fechaFilter.value = "";
            if (estadoFilter) estadoFilter.value = "";
            if (clienteFilter) clienteFilter.value = "";

            TurnosApp.pagination.currentPage = 1;
            renderTurnosTable();
            updatePagination();
        });
    }

    // Items per page
    const itemsPerPageSelect = document.getElementById("itemsPerPage");
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener("change", function() {
            TurnosApp.pagination.itemsPerPage = parseInt(this.value);
            TurnosApp.pagination.currentPage = 1;
            renderTurnosTable();
            updatePagination();
        });
    }

    // Pagination buttons
    const prevBtn = document.getElementById("turnosPrevBtn");
    const nextBtn = document.getElementById("turnosNextBtn");

    if (prevBtn) {
        prevBtn.addEventListener("click", function() {
            if (TurnosApp.pagination.currentPage > 1) {
                TurnosApp.pagination.currentPage--;
                renderTurnosTable();
                updatePagination();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function() {
            if (TurnosApp.pagination.currentPage < TurnosApp.pagination.totalPages) {
                TurnosApp.pagination.currentPage++;
                renderTurnosTable();
                updatePagination();
            }
        });
    }

    // Sortable headers
    const sortHeaders = document.querySelectorAll(".sortable");
    sortHeaders.forEach(header => {
        header.addEventListener("click", function() {
            const field = this.dataset.sort;
            sortTurnos(field);
        });
    });

    // Action buttons
    const newTurnoBtn = document.getElementById("newTurnoBtn");
    const exportBtn = document.getElementById("exportBtn");

    if (newTurnoBtn) {
        newTurnoBtn.addEventListener("click", function() {
            window.location.href = "/turnos/crear";
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener("click", exportTurnosData);
    }

    // Modal functionality
    setupModalListeners();

    // Window resize
    window.addEventListener("resize", handleResize);
}

function handleResize() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if (window.innerWidth > 768) {
        sidebar.classList.remove("show");
        overlay.classList.remove("active");
    }
}

function setupModalListeners() {
    const confirmModal = document.getElementById("confirmModal");
    const closeBtns = document.querySelectorAll(".modal-close");
    const cancelBtn = document.getElementById("cancelDelete");
    const confirmBtn = document.getElementById("confirmDelete");

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            confirmModal.classList.remove("show");
        });
    });

    if (cancelBtn) {
        cancelBtn.addEventListener("click", function() {
            confirmModal.classList.remove("show");
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener("click", function() {
            if (TurnosApp.currentDeleteId) {
                window.location.href = `/turnos/borrar/${TurnosApp.currentDeleteId}`;
            }
        });
    }

    // Close modal when clicking outside
    confirmModal.addEventListener("click", function(e) {
        if (e.target === confirmModal) {
            confirmModal.classList.remove("show");
        }
    });
}

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    TurnosApp.sidebarCollapsed = !TurnosApp.sidebarCollapsed;

    if (TurnosApp.sidebarCollapsed) {
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
    TurnosApp.userDropdownOpen = !TurnosApp.userDropdownOpen;

    if (TurnosApp.userDropdownOpen) {
        dropdown.classList.add("show");
    } else {
        dropdown.classList.remove("show");
    }
}

function closeUserDropdown() {
    const dropdown = document.getElementById("userDropdown");
    dropdown.classList.remove("show");
    TurnosApp.userDropdownOpen = false;
}

function renderTurnosTable() {
    const tbody = document.getElementById("turnosTableBody");
    if (!tbody) return;

    const filteredData = getFilteredTurnosData();
    const paginatedData = getPaginatedData(filteredData);

    tbody.innerHTML = "";

    if (paginatedData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="no-data">
                    <i class="fas fa-calendar-times"></i>
                    <p>${TurnosApp.searchFilter || TurnosApp.fechaFilter || TurnosApp.estadoFilter || TurnosApp.clienteFilter
                        ? 'No se encontraron turnos con los filtros aplicados'
                        : 'No hay turnos registrados'}</p>
                    ${!TurnosApp.searchFilter && !TurnosApp.fechaFilter && !TurnosApp.estadoFilter && !TurnosApp.clienteFilter ?
                        '<a href="/turnos/crear" class="btn-primary">Crear primer turno</a>' : ''}
                </td>
            </tr>
        `;
        return;
    }

    // Usar los elementos originales para mantener la información de Thymeleaf
    paginatedData.forEach(turno => {
        tbody.appendChild(turno.rawElement.cloneNode(true));
    });
}

function getFilteredTurnosData() {
    let filtered = [...TurnosApp.turnosData];

    // Aplicar filtro de búsqueda general
    if (TurnosApp.searchFilter) {
        filtered = filtered.filter(turno =>
            (turno.cliente && turno.cliente.toLowerCase().includes(TurnosApp.searchFilter)) ||
            (turno.mascota && turno.mascota.toLowerCase().includes(TurnosApp.searchFilter)) ||
            (turno.fecha && turno.fecha.toLowerCase().includes(TurnosApp.searchFilter)) ||
            (turno.idTurnos && turno.idTurnos.toString().includes(TurnosApp.searchFilter))
        );
    }

    // Aplicar filtro de fecha
    if (TurnosApp.fechaFilter) {
        filtered = filtered.filter(turno => {
            const turnoDate = turno.fecha.split(' ')[0]; // Obtener solo la fecha
            return turnoDate === TurnosApp.fechaFilter;
        });
    }

    // Aplicar filtro de estado
    if (TurnosApp.estadoFilter) {
        filtered = filtered.filter(turno => {
            const estadoMap = {
                'CONFIRMADO': 'Confirmado',
                'PENDIENTE': 'Pendiente',
                'CANCELADO': 'Cancelado',
                'COMPLETADO': 'Completado'
            };
            return turno.estado === estadoMap[TurnosApp.estadoFilter];
        });
    }

    // Aplicar filtro de cliente
    if (TurnosApp.clienteFilter) {
        filtered = filtered.filter(turno =>
            turno.cliente && turno.cliente.toLowerCase().includes(TurnosApp.clienteFilter)
        );
    }

    // Aplicar ordenamiento
    if (TurnosApp.sort.field) {
        filtered.sort((a, b) => {
            let aVal = a[TurnosApp.sort.field];
            let bVal = b[TurnosApp.sort.field];

            if (aVal === null || aVal === undefined) aVal = "";
            if (bVal === null || bVal === undefined) bVal = "";

            if (TurnosApp.sort.field === 'idTurnos') {
                aVal = parseInt(aVal) || 0;
                bVal = parseInt(bVal) || 0;
            } else if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (TurnosApp.sort.direction === "asc") {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }

    TurnosApp.pagination.totalItems = filtered.length;
    TurnosApp.pagination.totalPages = Math.ceil(filtered.length / TurnosApp.pagination.itemsPerPage);

    return filtered;
}

function getPaginatedData(data) {
    const startIndex = (TurnosApp.pagination.currentPage - 1) * TurnosApp.pagination.itemsPerPage;
    const endIndex = startIndex + TurnosApp.pagination.itemsPerPage;
    return data.slice(startIndex, endIndex);
}

function sortTurnos(field) {
    if (TurnosApp.sort.field === field) {
        TurnosApp.sort.direction = TurnosApp.sort.direction === "asc" ? "desc" : "asc";
    } else {
        TurnosApp.sort.field = field;
        TurnosApp.sort.direction = "asc";
    }

    TurnosApp.pagination.currentPage = 1;
    renderTurnosTable();
    updatePagination();
    updateSortIcons(field, TurnosApp.sort.direction);
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

function updateStats() {
    const total = TurnosApp.turnosData.length;
    const confirmados = TurnosApp.turnosData.filter(t => t.estado === 'Confirmado').length;
    const pendientes = TurnosApp.turnosData.filter(t => t.estado === 'Pendiente').length;
    const cancelados = TurnosApp.turnosData.filter(t => t.estado === 'Cancelado').length;

    document.getElementById("totalTurnos").textContent = total;
    document.getElementById("turnosConfirmados").textContent = confirmados;
    document.getElementById("turnosPendientes").textContent = pendientes;
    document.getElementById("turnosCancelados").textContent = cancelados;
}

function updatePagination() {
    updatePaginationInfo();
    updatePaginationButtons();
}

function updatePaginationInfo() {
    const info = document.getElementById("turnosItemsInfo");
    if (!info) return;

    const startIndex = (TurnosApp.pagination.currentPage - 1) * TurnosApp.pagination.itemsPerPage;
    const endIndex = Math.min(startIndex + TurnosApp.pagination.itemsPerPage, TurnosApp.pagination.totalItems);

    if (TurnosApp.pagination.totalItems === 0) {
        info.textContent = "No hay turnos para mostrar";
    } else {
        info.textContent = `Mostrando ${startIndex + 1} a ${endIndex} de ${TurnosApp.pagination.totalItems} turnos`;
    }
}

function updatePaginationButtons() {
    const prevBtn = document.getElementById("turnosPrevBtn");
    const nextBtn = document.getElementById("turnosNextBtn");

    if (prevBtn) {
        prevBtn.disabled = TurnosApp.pagination.currentPage === 1;
    }

    if (nextBtn) {
        nextBtn.disabled = TurnosApp.pagination.currentPage === TurnosApp.pagination.totalPages || TurnosApp.pagination.totalPages === 0;
    }
}

function exportTurnosData() {
    const filteredData = getFilteredTurnosData();

    const headers = ["ID", "Fecha", "Hora", "Cliente", "Mascota", "Estado"];
    const csvContent = [
        headers.join(","),
        ...filteredData.map(turno => {
            const [fecha, hora] = turno.fecha.split(' ');
            return [
                turno.idTurnos,
                `"${fecha}"`,
                `"${hora}"`,
                `"${turno.cliente}"`,
                `"${turno.mascota}"`,
                `"${turno.estado}"`
            ].join(",");
        })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `turnos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function confirmDelete(id) {
    TurnosApp.currentDeleteId = id;
    const modal = document.getElementById("confirmModal");
    modal.classList.add("show");
}

// Make functions available globally for onclick attributes
window.viewTurno = viewTurno;
window.editTurno = editTurno;
window.confirmDelete = confirmDelete;
window.executeDelete = executeDelete;
window.closeModal = closeModal;
};

