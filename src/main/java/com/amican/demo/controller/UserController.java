package com.amican.demo.controller;

import com.amican.demo.dto.UserDto;
import com.amican.demo.repository.UserRepository;
import com.amican.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/register")
    public String mostrarRegistroUsuario(Model model){
        System.out.println("Mostrando formulario de registro");
        // Agregar un UserDto vacío al modelo para el formulario
        model.addAttribute("userDto", new UserDto());
        model.addAttribute("pageTitle", "Registro de Usuario");

        return "register";
    }

    @PostMapping("/register")
    public String RegistroUsuario(@ModelAttribute("userDto") UserDto userDto,
                                  RedirectAttributes redirectAttributes,
                                  Model model){


        System.out.println("Procesando registro para usuario: " + userDto.getUsername());

        try {
            // Validar y guardar el usuario
            UserDto savedUser = userService.save(userDto);

            System.out.println("Usuario registrado exitosamente: " + savedUser.getUsername());

            // Agregar mensaje de éxito para mostrar después de la redirección
            redirectAttributes.addFlashAttribute("successMessage",
                    "¡Registro exitoso! Ahora puedes iniciar sesión.");

            return "redirect:/login";

        } catch (IllegalArgumentException e) {
            System.out.println("Error en registro: {}" + e.getMessage());

            // Agregar error al modelo para mostrar en el formulario
            model.addAttribute("errorMessage", e.getMessage());
            model.addAttribute("userDto", userDto); // Mantener datos ingresados
            model.addAttribute("pageTitle", "Registro de Usuario");

            return "register";

        } catch (Exception e) {
            System.out.println("Error inesperado durante el registro: " + e.getMessage());

            model.addAttribute("errorMessage",
                    "Error inesperado. Por favor, intenta nuevamente.");
            model.addAttribute("userDto", userDto);
            model.addAttribute("pageTitle", "Registro de Usuario");

            return "register";
        }



    }

    @PostMapping("/login")
    public String loginRedireccion(){
        return "index";
    }
}
