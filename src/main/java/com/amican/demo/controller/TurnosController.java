    package com.amican.demo.controller;
    
    import com.amican.demo.dto.DueniosDto;
    import com.amican.demo.dto.MascotaDto;
    import com.amican.demo.dto.TurnoDto;
    import com.amican.demo.model.Duenios;
    import com.amican.demo.model.Mascotas;
    import com.amican.demo.model.Turnos;
    import com.amican.demo.model.enums.Estados;
    import com.amican.demo.service.DueniosService;
    import com.amican.demo.service.ITurnosService;
    import com.amican.demo.service.MascotasService;
    import com.amican.demo.service.TurnosService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.stereotype.Controller;
    import org.springframework.ui.Model;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.servlet.mvc.support.RedirectAttributes;

    import java.util.ArrayList;
    import java.util.List;
    import java.util.Optional;
    
    @Controller
    @RequestMapping("/turnos")
    @RequiredArgsConstructor
    public class TurnosController {
    
        private final DueniosService dueniosService;
        private final TurnosService turnosService;
        private final MascotasService mascotasService;

        @GetMapping("/ver")
        public String mostrarTurnos(Model model) {
            try {
                List<Turnos> turnos = turnosService.findAll();
                model.addAttribute("turnos", turnos);
                return "verTurnos";
            } catch (Exception e) {
                model.addAttribute("error", "Error al cargar los turnos: " + e.getMessage());
                return "verTurnos";
            }
        }

        // 1. MOSTRAR FORMULARIO DE SELECCIÓN DE DUEÑO (VISTA ACTUAL)
        @GetMapping("/crear")
        public String mostrarFormularioDuenio(Model model) {
            List<DueniosDto> duenios = dueniosService.getAllDueniosDto();
            model.addAttribute("duenios", duenios);
            model.addAttribute("turnoDto", new TurnoDto());
            return "crearAgenda";
        }
    
        // 2. PROCESAR SELECCIÓN DE DUEÑO (REDIRIGIR A MASCOTAS)
        @PostMapping("/seleccionar-duenio")
        public String seleccionarDuenio(@RequestParam("duenioId") Long duenioId, RedirectAttributes redirectAttributes) {
            try {
                Optional<DueniosDto> duenio = dueniosService.getDuenioById(duenioId);

                if (duenio.isPresent()) {
                    return "redirect:/turnos/crear/" + duenioId;
                } else {
                    redirectAttributes.addFlashAttribute("error", "Dueño no encontrado");
                    return "redirect:/turnos/crear";
                }

            } catch (Exception e) {
                redirectAttributes.addFlashAttribute("error", "Error al buscar el dueño: " + e.getMessage());
                return "redirect:/turnos/crear";
            }
        }
    
        // 3. MOSTRAR FORMULARIO DE MASCOTAS DEL DUEÑO (NUEVA VISTA)
        @GetMapping("/crear/{duenioId}")
        public String mostrarFormularioMascotas(
                @PathVariable Long duenioId,
                Model model,
                RedirectAttributes redirectAttributes) {
    
            try {
                Optional<DueniosDto> duenio = dueniosService.getDuenioById(duenioId);
    
                if (duenio.isEmpty()) {
                    redirectAttributes.addFlashAttribute("error", "Dueño no encontrado");
                    return "redirect:/turnos/crear";
                }
    
                // Obtener mascotas del dueño usando el servicio que ya tienes
                List<MascotaDto> mascotas = mascotasService.getMascotasByDuenio(duenioId);
    
                model.addAttribute("duenio", duenio.get());
                model.addAttribute("mascotas", mascotas);
                model.addAttribute("turnoDto", new TurnoDto());
    
                return "seleccionar-mascotas";
    
            } catch (Exception e) {
                redirectAttributes.addFlashAttribute("error", "Error al cargar el formulario: " + e.getMessage());
                return "redirect:/turnos/crear";
            }
        }
    
        // 4. CREAR TURNO FINAL (CON MASCOTAS)
        @PostMapping("/crear")
        public String crearTurno(
                @ModelAttribute TurnoDto turnoDto,
                @RequestParam Long duenioId, // ← Añadir esto
                @RequestParam List<Long> mascotaIds,
                RedirectAttributes redirectAttributes) {

            try {
                // Asignar ambos IDs al DTO
                turnoDto.setDuenioId(duenioId);
                turnoDto.setMascotaIds(mascotaIds);
                turnoDto.setEstados(Estados.COMPLETADO);

                turnosService.save(turnoDto);
                redirectAttributes.addFlashAttribute("success", "Turno creado exitosamente");
                return "redirect:/turnos/ver";

            } catch (Exception e) {
                redirectAttributes.addFlashAttribute("error", "Error al crear el turno: " + e.getMessage());
                return "redirect:/turnos/crear/" + duenioId;
            }
        }

        @GetMapping("/editar/{id}")
        public String mostrarFormularioEdicion(@PathVariable Long id,
                                               @RequestParam(value = "duenioId", required = false) Long duenioIdParam,
                                               Model model) {
            try {
                Optional<Turnos> turnoOpt = turnosService.findById(id);
                if (turnoOpt.isEmpty()) {
                    return "redirect:/turnos/ver";
                }

                Turnos turno = turnoOpt.get();
                List<Duenios> duenios = dueniosService.getAllDuenios();

                // Determinar el dueño a mostrar (el existente o el parámetro)
                Long duenioId = turno.getDueniosList().isEmpty() ? null :
                        turno.getDueniosList().get(0).getIdDuenio();

                if (duenioIdParam != null) {
                    duenioId = duenioIdParam;
                }

                // Obtener mascotas filtradas por dueño si hay uno seleccionado
                List<MascotaDto> mascotas;
                if (duenioId != null) {
                    mascotas = mascotasService.getMascotasByDuenio(duenioId);
                } else {
                    mascotas = mascotasService.getAllMascotas();
                }

                // Convertir a DTO
                TurnoDto turnoDto = new TurnoDto();
                turnoDto.setIdTurnos(turno.getIdTurnos());
                turnoDto.setFecha(turno.getFecha());
                turnoDto.setEstados(turno.getEstados());
                turnoDto.setDuenioId(duenioId);

                if (!turno.getMascotasList().isEmpty()) {
                    List<Long> mascotaIds = turno.getMascotasList().stream()
                            .map(Mascotas::getIdMascotas)
                            .toList();
                    turnoDto.setMascotaIds(mascotaIds);
                }

                model.addAttribute("turnoDto", turnoDto);
                model.addAttribute("duenios", duenios);
                model.addAttribute("mascotas", mascotas);
                model.addAttribute("estados", Estados.values());

                return "editarTurno";
            } catch (Exception e) {
                return "redirect:/turnos/ver?error=Error al cargar el turno: " + e.getMessage();
            }
        }

        @PostMapping("/editar/{id}")
        public String actualizarTurno(@PathVariable Long id,
                                      @ModelAttribute TurnoDto turnoDto,
                                      @RequestParam("duenioId") Long duenioId, // ← Cambiar a RequestParam
                                      @RequestParam(value = "mascotaIds", required = false) List<Long> mascotaIds, // ← Cambiar a RequestParam
                                      RedirectAttributes redirectAttributes) {
            try {
                // Asignar los IDs al DTO
                turnoDto.setDuenioId(duenioId);
                turnoDto.setMascotaIds(mascotaIds != null ? mascotaIds : new ArrayList<>());

                turnosService.save(turnoDto);
                redirectAttributes.addFlashAttribute("success", "Turno actualizado correctamente");
                return "redirect:/turnos/ver";
            } catch (Exception e) {
                redirectAttributes.addFlashAttribute("error", "Error al actualizar el turno: " + e.getMessage());
                return "redirect:/turnos/editar/" + id;
            }
        }

        @GetMapping("/borrar/{id}")
        public String eliminarTurno(@PathVariable Long id, RedirectAttributes redirectAttributes) {
            try {
                turnosService.deleteById(id);
                redirectAttributes.addFlashAttribute("success", "Turno eliminado correctamente");
            } catch (Exception e) {
                redirectAttributes.addFlashAttribute("error", "Error al eliminar el turno: " + e.getMessage());
            }
            return "redirect:/turnos/ver";
        }
    
    }
