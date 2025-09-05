package com.amican.demo.dto;

import com.amican.demo.model.Mascotas;
import com.amican.demo.model.Turnos;
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
    private String nombreDuenio;
    private String apellido;
    private String celular;
    private String dni;

    private List<Mascotas> mascotasList;

    private List<Turnos> turnosDuenios;
}
