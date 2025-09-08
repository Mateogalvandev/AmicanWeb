    package com.amican.demo.controller;

    import com.amican.demo.dto.MascotaDto;
    import com.amican.demo.model.Duenios;
    import com.amican.demo.model.enums.Tamanios;
    import com.amican.demo.service.DueniosService;
    import com.amican.demo.service.MascotasService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.stereotype.Controller;
    import org.springframework.ui.Model;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.servlet.mvc.support.RedirectAttributes;

    import java.util.Arrays;
    import java.util.List;
    import java.util.Optional;
    import java.util.stream.Collectors;

    @Controller
    @RequestMapping("/mascotas")
    @RequiredArgsConstructor
    public class MascotaController {

        private final MascotasService mascotaService;
        private final DueniosService dueniosService;

        @GetMapping("/ver")
        public String mostrarMascotas(Model model) {
            List<MascotaDto> mascotas = mascotaService.getAllMascotas();
            mascotas.forEach(mascota -> {
                if (mascota.getDueniosList() != null) {
                    mascota.getDueniosList().size(); // Esto fuerza la carga de la relación
                }
            });
            model.addAttribute("MascotaTabla", mascotas);
            return "verMascota";
        }
        @GetMapping("/crear")
        public String mostrarFormularioNuevo(Model model) {
            System.out.println("Mostrando formulario para nueva mascota");
            model.addAttribute("mascotaDto", new MascotaDto());
            model.addAttribute("tamanios", Arrays.asList(Tamanios.values()));
            model.addAttribute("pageTitle", "Nueva Mascota");
            return "crearMascota";
        }

        @PostMapping("/crear")
        public String guardarMascota(@ModelAttribute("mascotaDto") MascotaDto mascotaDto,
                                     RedirectAttributes redirectAttributes,
                                     Model model) {

            System.out.println("Procesando guardado para mascota: " + mascotaDto.getNombreMascotas());

            try {
                MascotaDto savedMascota = mascotaService.saveMascota(mascotaDto);

                System.out.println("Mascota guardada exitosamente: " + savedMascota.getNombreMascotas());

                // Agregar mensaje de éxito para mostrar después de la redirección
                redirectAttributes.addFlashAttribute("successMessage",
                        "¡Mascota guardada exitosamente!");

                return "redirect:/mascotas/ver";


            } catch (IllegalArgumentException e) {
                System.out.println("Error al guardar mascota: " + e.getMessage());

                // Agregar error al modelo para mostrar en el formulario
                model.addAttribute("errorMessage", e.getMessage());
                model.addAttribute("mascotaDto", mascotaDto); // Mantener datos ingresados
                model.addAttribute("tamanios", Arrays.asList(Tamanios.values()));
                model.addAttribute("pageTitle", "Nueva Mascota");

                return "redirect:/mascotas/ver";

            } catch (Exception e) {
                System.out.println("Error inesperado durante el guardado: " + e.getMessage());

                model.addAttribute("errorMessage",
                        "Error inesperado. Por favor, intenta nuevamente.");
                model.addAttribute("mascotaDto", mascotaDto);
                model.addAttribute("tamanios", Arrays.asList(Tamanios.values()));
                model.addAttribute("pageTitle", "Nueva Mascota");

                return "crearMascotas";
            }
        }

        @GetMapping("/editar/{id}")
        public String mostrarFormularioEdicion(@PathVariable Long id, Model model) {
            Optional<MascotaDto> mascotaOpt = mascotaService.getMascotaById(id);

            if (mascotaOpt.isEmpty()) {
                return "redirect:/mascotas/ver";
            }

            MascotaDto mascota = mascotaOpt.get();
            List<Duenios> todosLosDuenios = dueniosService.getAllDuenios();

            // Extraer los IDs de los dueños actuales para el formulario
            if (mascota.getDueniosList() != null) {
                List<Long> dueniosIdsActuales = mascota.getDueniosList().stream()
                        .map(Duenios::getIdDuenio)
                        .collect(Collectors.toList());
                mascota.setDueniosIds(dueniosIdsActuales);
            }

            model.addAttribute("mascota", mascota);
            model.addAttribute("todosLosDuenios", todosLosDuenios);
            model.addAttribute("tamanios", Tamanios.values());

            return "editarMascota";
        }

        @PostMapping("/editar/{id}")
        public String actualizarMascota(@PathVariable Long id,
                                        @ModelAttribute MascotaDto mascotaDto,
                                        RedirectAttributes redirectAttributes) {

            try {
                mascotaService.updateMascota(id, mascotaDto);
                redirectAttributes.addFlashAttribute("success", "Mascota actualizada correctamente");
            } catch (Exception e) {
                redirectAttributes.addFlashAttribute("error", "Error al actualizar mascota: " + e.getMessage());
            }

            return "redirect:/mascotas/ver";
        }

        @GetMapping("/eliminar/{id}")
        public String eliminarDuenio(@PathVariable Long id, RedirectAttributes redirectAttributes) {
            try {
                mascotaService.deleteMascota(id);
                redirectAttributes.addFlashAttribute("success", "Mascota eliminado correctamente");
            } catch (Exception e) {
                redirectAttributes.addFlashAttribute("error", "Error al eliminar Mascota: " + e.getMessage());
            }
            return "redirect:/mascotas/ver";
        }




    }
