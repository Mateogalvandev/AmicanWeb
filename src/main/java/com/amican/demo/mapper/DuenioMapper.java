package com.amican.demo.mapper;

import com.amican.demo.dto.DueniosDto;
import com.amican.demo.dto.MascotaDto;
import com.amican.demo.model.Duenios;
import com.amican.demo.model.Mascotas;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class DuenioMapper {

    public DueniosDto toDto(Duenios duenio) {
        return DueniosDto.builder()
                .idDuenio(duenio.getIdDuenio())
                .nombreDuenio(duenio.getNombreDuenio())
                .apellido(duenio.getApellido())
                .celular(duenio.getCelular())
                .dni(duenio.getDni())
                .mascotasList(duenio.getMascotasList() != null ?
                        duenio.getMascotasList().stream()
                                .map(mascota -> MascotaDto.builder()
                                        .idMascotas(mascota.getIdMascotas())
                                        .nombreMascotas(mascota.getNombreMascotas())
                                        .raza(mascota.getRaza())
                                        // otros campos necesarios
                                        .build())
                                .collect(Collectors.toList()) : null)
                // turnosDuenios puede omitirse si no es necesario
                .build();
    }

    public Duenios toEntity(DueniosDto dueniosDto) {
        return Duenios.builder()
                .idDuenio(dueniosDto.getIdDuenio()) // ← Importantísimo agregar el ID!
                .nombreDuenio(dueniosDto.getNombreDuenio())
                .apellido(dueniosDto.getApellido())
                .celular(dueniosDto.getCelular())
                .dni(dueniosDto.getDni())
                // NO asignar relaciones aquí - se manejan en el servicio
                // .mascotasList(dueniosDto.getMascotasList()) ← ESTO CAUSA ERROR
                // .turnosDuenios(dueniosDto.getTurnosDuenios()) ← ESTO CAUSA ERROR
                .build();
    }

    public void updateMascotaFromDto(DueniosDto dueniosDto, Duenios duenios) {
        if (dueniosDto.getNombreDuenio() != null) {
            duenios.setNombreDuenio(dueniosDto.getNombreDuenio());
        }
        if (dueniosDto.getApellido() != null) {
            duenios.setApellido(dueniosDto.getApellido());
        }
        if (dueniosDto.getDni() != null) {
            duenios.setDni(dueniosDto.getDni());
        }
        if (dueniosDto.getCelular() != null) {
            duenios.setCelular(dueniosDto.getCelular());
        }
    }
}
