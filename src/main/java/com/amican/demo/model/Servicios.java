package com.amican.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Servicios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idServicio;
    private String nombreServicio;
    private String descripcionServicio;
    @ManyToOne
    @JoinColumn(name = "Mascotas_id")
    private Mascotas mascotas;
    private Double costoServicio;
    private Double costoServicioS;
    private Double costoServicioL;
    private Double costoServicioXL;
}
