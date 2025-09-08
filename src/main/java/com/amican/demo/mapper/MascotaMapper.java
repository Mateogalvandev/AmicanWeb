
package com.amican.demo.mapper;

import com.amican.demo.dto.MascotaDto;
import com.amican.demo.model.Mascotas;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class MascotaMapper {

    public MascotaDto toDto(Mascotas mascotas) {
        return MascotaDto.builder()
                .idMascotas(mascotas.getIdMascotas())
                .nombreMascotas(mascotas.getNombreMascotas())
                .raza(mascotas.getRaza())
                .tamanios(mascotas.getTamanios())
                .dueniosList(mascotas.getDueniosList())
                .turnosMascotas(mascotas.getTurnosMascotas())
                .serviciosList(mascotas.getServiciosList())
                .build();
    }

    public Mascotas toEntity(MascotaDto mascotaDto) {
        return Mascotas.builder()
                .idMascotas(mascotaDto.getIdMascotas())
                .nombreMascotas(mascotaDto.getNombreMascotas())
                .raza(mascotaDto.getRaza())
                .tamanios(mascotaDto.getTamanios())
                // Los dueños se asignan manualmente en el service, no aquí
                .dueniosList(null) // O mantener la lista existente si es una actualización
                .turnosMascotas(mascotaDto.getTurnosMascotas())
                .serviciosList(mascotaDto.getServiciosList())
                .build();
    }

    // Método adicional para actualizar una entidad existente
    public void updateMascotaFromDto(MascotaDto mascotaDto, Mascotas mascota) {
        if (mascotaDto.getNombreMascotas() != null) {
            mascota.setNombreMascotas(mascotaDto.getNombreMascotas());
        }
        if (mascotaDto.getRaza() != null) {
            mascota.setRaza(mascotaDto.getRaza());
        }
        if (mascotaDto.getTamanios() != null) {
            mascota.setTamanios(mascotaDto.getTamanios());
        }
        // Los dueños se manejan manualmente en el service
        // Los turnos y servicios también se manejan manualmente si es necesario
    }
}