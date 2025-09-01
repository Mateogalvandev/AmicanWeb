package com.amican.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Duenios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDuenio;
    private String nombreDuenio;
    private String apellido;
    private String celular;
    private String dni;
    @ManyToMany
    @JoinTable(
            name = "duenios_mascotas",
            joinColumns = @JoinColumn(name = "duenio_id"),
            inverseJoinColumns = @JoinColumn(name = "mascota_id")
    )
    private List<Mascotas> mascotasList;
    @ManyToMany
    @JoinTable(
            name = "turnos_duenios",
            joinColumns = @JoinColumn(name = "turno_id"),
            inverseJoinColumns = @JoinColumn(name = "duenio_id")
    )
    private List<Turnos> turnosDuenios;
}
