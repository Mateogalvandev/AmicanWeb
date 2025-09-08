package com.amican.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    /**
     * Configura la cadena de filtros de seguridad HTTP.
     *
     * @param http Objeto HttpSecurity para configurar las reglas de seguridad
     * @return SecurityFilterChain configurado
     * @throws Exception Si ocurre un error en la configuración
     *
     * Flujo de configuración:
     * 1. Autorización de requests: Define qué URLs están protegidas y qué roles requieren
     * 2. Configuración de form login: Personaliza la página de login y redirecciones
     * 3. Configuración de logout: Define el comportamiento al cerrar sesión
     * 4. Manejo de excepciones: Configura la página de acceso denegado
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Configuración de autorización de requests
                .authorizeHttpRequests(authz -> authz
                        // URLs públicas (acceso sin autenticación)
                        .requestMatchers( "/register", "/turnos/**","/duenios/**","/mascotas/**", "/css/**", "/js/**", "/images/**").permitAll()
                        // URLs de admin requieren rol ADMIN
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // URLs de usuario requieren rol USER o ADMIN
                        .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                        // Todas las demás requests requieren autenticación
                        .anyRequest().authenticated()
                )
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/mascotas/desactivar/**")
                )
                // Configuración del formulario de login
                .formLogin(form -> form
                        .loginPage("/login")              // Página personalizada de login
                        .defaultSuccessUrl("/", true) // URL de redirección después de login exitoso
                        .permitAll()                      // Permite acceso a todos a la página de login
                )
                // Configuración de logout
                .logout(logout -> logout
                        .logoutUrl("/logout")             // URL para cerrar sesión
                        .logoutSuccessUrl("/login?logout") // URL después de logout exitoso
                        .permitAll()                      // Permite acceso a todos al logout
                )
                // Manejo de excepciones de acceso
                .exceptionHandling(exceptions -> exceptions
                        .accessDeniedPage("/access-denied") // Página para acceso denegado
                );

        return http.build();
    }

    /**
     * Provee el encoder de contraseñas BCrypt.
     *
     * @return Instancia de BCryptPasswordEncoder
     *
     * Características de BCrypt:
     * - Algoritmo de hashing seguro para contraseñas
     * - Incluye salt automáticamente
     * - Resistente a ataques de fuerza bruta
     * - Strength 10 (valor por defecto) = 2^10 iteraciones
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
