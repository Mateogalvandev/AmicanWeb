package com.amican.demo.mapper;

import com.amican.demo.dto.DueniosDto;
import com.amican.demo.model.Duenios;
import org.springframework.stereotype.Component;

@Component
public class DuenioMapper {

    public DueniosDto toDto(Duenios duenios) {
        return DueniosDto.builder()
                .nombreDuenio(duenios.getNombreDuenio())
                .apellido(duenios.getApellido())
                .celular(duenios.getCelular())
                .dni(duenios.getDni())
                .mascotasList(duenios.getMascotasList())
                .turnosDuenios(duenios.getTurnosDuenios())
                .build();
    }

    public Duenios toEntity(DueniosDto dueniosDto) {
        return Duenios.builder()
                .nombreDuenio(dueniosDto.getNombreDuenio())
                .apellido(dueniosDto.getApellido())
                .celular(dueniosDto.getCelular())
                .dni(dueniosDto.getDni())
                .mascotasList(dueniosDto.getMascotasList())
                .turnosDuenios(dueniosDto.getTurnosDuenios())
                .build();
    }
}
