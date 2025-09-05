package com.amican.demo.controller;

import com.amican.demo.model.Turnos;
import com.amican.demo.model.enums.Estados;
import com.amican.demo.service.ITurnosService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/turnos")
@RequiredArgsConstructor
public class TurnosController {

    private final ITurnosService turnosService;

    @GetMapping
    public String listarTurnos(Model model) {
        List<Turnos> turnos = turnosService.findAll();
        model.addAttribute("turnos", turnos);
        model.addAttribute("estados", Estados.values());
        return "turnos/listar";
    }

    @GetMapping("/crear")
    public String mostrarFormularioCrear(Model model) {
        model.addAttribute("turno", new Turnos());
        model.addAttribute("estados", Estados.values());
        return "crearAgenda";
    }

    @PostMapping("/crear")
    public String crearTurno(@ModelAttribute Turnos turno, RedirectAttributes redirectAttributes) {
        try {
            turnosService.save(turno);
            redirectAttributes.addFlashAttribute("success", "Turno creado exitosamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al crear el turno: " + e.getMessage());
        }
        return "redirect:/verAgenda";
    }



}
