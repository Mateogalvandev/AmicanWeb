package com.amican.demo.service;

import com.amican.demo.model.Role;
import com.amican.demo.model.User;
import com.amican.demo.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param userRepository Repositorio de usuarios inyectado
     */
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Carga los detalles del usuario por nombre de usuario.
     *
     * @param username Nombre de usuario a buscar
     * @return UserDetails con la información del usuario
     * @throws UsernameNotFoundException Si el usuario no existe
     *
     * Este método es llamado por Spring Security durante el proceso de autenticación.
     */
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Buscar el usuario en la base de datos
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // Construir y retornar UserDetails de Spring Security
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword()) // Contraseña ya encriptada
                .authorities(mapRolesToAuthorities(user.getRoles())) // Convertir roles a authorities
                .accountExpired(false)     // Cuenta no expirada
                .accountLocked(false)      // Cuenta no bloqueada
                .credentialsExpired(false) // Credenciales no expiradas
                .disabled(!user.getEnabled()) // Cuenta deshabilitada si user.enabled = false
                .build();
    }

    /**
     * Convierte una colección de Roles a una colección de GrantedAuthority.
     *
     * @param roles Colección de roles del usuario
     * @return Colección de GrantedAuthority
     *
     * Spring Security espera authorities con el prefijo "ROLE_"
     */
    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());
    }

}
