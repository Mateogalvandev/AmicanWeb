package com.amican.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

    /**
     * Muestra la página de login.
     *
     * @return Nombre de la plantilla Thymeleaf (login.html)
     *
     * GET /login → muestra el formulario de login
     */
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    /**
     * Muestra el dashboard después del login exitoso.
     *
     * @return Nombre de la plantilla Thymeleaf (dashboard.html)
     *
     * Protegido por Spring Security → requiere autenticación
     */
    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    /**
     * Muestra la página de acceso denegado.
     *
     * @return Nombre de la plantilla Thymeleaf (access-denied.html)
     *
     * Se muestra cuando un usuario autenticado intenta acceder a un recurso sin permisos
     */
    @GetMapping("/access-denied")
    public String accessDenied() {
        return "access-denied";
    }
}
