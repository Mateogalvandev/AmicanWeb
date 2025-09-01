package com.amican.demo.repository;

import com.amican.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Busca un usuario por su nombre de usuario.
     *
     * @param username Nombre de usuario a buscar
     * @return Optional con el usuario encontrado o vacío
     */
    Optional<User> findByUsername(String username);

    /**
     * Verifica si existe un usuario con el nombre de usuario dado.
     *
     * @param username Nombre de usuario a verificar
     * @return true si existe, false si no
     */
    boolean existsByUsername(String username);

    Optional<User> findByNombre(String nombre);

    Optional<User> findByNombreAndApellido(String nombre, String apellido);
}
