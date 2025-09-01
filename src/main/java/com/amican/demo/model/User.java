package com.amican.demo.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Collection;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUser;
    @Column(nullable = false)
    private String nombre;
    @Column(nullable = false)
    private String apellido;
    @Column(unique = true, nullable = false)
    private String username;
    @Column(nullable = false)
    private String password;
    private LocalDate fecha;

    /**
     * Roles asociados al usuario.
     *
     * @ManyToMany: Relación muchos-a-mundos con la entidad Role
     * @JoinTable: Configura la tabla de unión para la relación
     * - name: Nombre de la tabla intermedia
     * - joinColumns: Columna que referencia a User
     * - inverseJoinColumns: Columna que referencia a Role
     *
     * FetchType.EAGER: Los roles se cargan inmediatamente con el usuario
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Collection<Role> roles;

    private Boolean enabled = true;
}
