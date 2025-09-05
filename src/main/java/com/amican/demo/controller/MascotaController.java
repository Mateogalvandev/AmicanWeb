package com.amican.demo.controller;

import com.amican.demo.dto.MascotaDto;
import com.amican.demo.model.enums.Tamanios;
import com.amican.demo.service.MascotasService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Arrays;
import java.util.Optional;

@Controller
@RequestMapping("/mascotas")
@RequiredArgsConstructor
public class MascotaController {

    private final MascotasService mascotaService;

    @GetMapping("/ver")
    public String mostrarMascotas(Model model){
        model.addAttribute("MascotaTabla", mascotaService.getAllMascotas());
        return "verMascota";
    }
    @GetMapping
    public String listarMascotas(Model model) {
        try {
            model.addAttribute("mascotas", mascotaService.getAllMascotas());
            return "mascotas/listar";
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Error al cargar la lista de mascotas: " + e.getMessage());
            return "mascotas/listar";
        }
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


}
