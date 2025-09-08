package com.amican.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DueniosDto {
    private Long idDuenio; // ← Faltaba el ID!
    private String nombreDuenio;
    private String apellido;
    private String celular;
    private String dni;

    // Usar DTOs en lugar de entidades para evitar problemas
    private List<MascotaDto> mascotasList;
    private List<TurnoDto> turnosDuenios;
}