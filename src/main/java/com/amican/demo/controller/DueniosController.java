package com.amican.demo.controller;

import com.amican.demo.dto.DueniosDto;
import com.amican.demo.dto.MascotaDto;
import com.amican.demo.service.DueniosService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

@Controller
@RequestMapping("/duenios")
@RequiredArgsConstructor
public class DueniosController {

    private final DueniosService dueniosService;

    @GetMapping("/ver")
    public String listarDuenios(Model model) {
        model.addAttribute("duenios", dueniosService.getAllDuenios());
        return "verDuenio";
    }

    @GetMapping("/crear")
    public String mostrarFormularioNuevo(Model model) {
        model.addAttribute("duenioDto", new DueniosDto());
        model.addAttribute("titulo", "Nuevo Dueño");
        return "crearDuenio";
    }



    @PostMapping("/crear")
    public String crearDuenio(@ModelAttribute DueniosDto duenioDto,
                              RedirectAttributes redirectAttributes) {
        try {
            DueniosDto savedDuenio = dueniosService.saveDuenio(duenioDto);
            redirectAttributes.addFlashAttribute("success", "Dueño creado correctamente");
            return "redirect:/duenios/ver";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al crear dueño: " + e.getMessage());
            return "redirect:/duenios/crear";
        }
    }

    @GetMapping("/editar/{id}")
    public String mostrarFormularioEditar(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        Optional<DueniosDto> duenioDto = dueniosService.getDuenioById(id);
        if (duenioDto.isPresent()) {
            model.addAttribute("duenioDto", duenioDto.get());
            model.addAttribute("titulo", "Editar Dueño");
            return "editarDuenio"; // Cambiado de "duenios/formulario" a "crearDuenio"
        } else {
            redirectAttributes.addFlashAttribute("error", "Dueño no encontrado");
            return "redirect:/duenios/ver"; // Cambiado de "/duenios" a "/duenios/ver"
        }
    }

    @PostMapping("/editar/{id}")
    public String actualizarDuenio(@PathVariable Long id,
                                   @ModelAttribute DueniosDto duenioDto,
                                   RedirectAttributes redirectAttributes) {

        try {
            dueniosService.updateDuenio(id, duenioDto);
            redirectAttributes.addFlashAttribute("success", "Dueño actualizado correctamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar dueño: " + e.getMessage());
        }

        return "redirect:/duenios/ver";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminarDuenio(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            dueniosService.deleteDuenio(id);
            redirectAttributes.addFlashAttribute("success", "Dueño eliminado correctamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar dueño: " + e.getMessage());
        }
        return "redirect:/duenios/ver";
    }

    @GetMapping("/buscar")
    public String buscarDuenios(@RequestParam String keyword, Model model) {
        model.addAttribute("duenios", dueniosService.searchDuenios(keyword));
        model.addAttribute("keyword", keyword);
        return "duenios/listar";
    }

    @GetMapping("/detalles/{id}")
    public String verDetalles(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        Optional<DueniosDto> duenioDto = dueniosService.getDuenioById(id);
        if (duenioDto.isPresent()) {
            model.addAttribute("duenio", duenioDto.get());
            return "duenios/detalles";
        } else {
            redirectAttributes.addFlashAttribute("error", "Dueño no encontrado");
            return "redirect:/duenios";
        }
    }
}
