package com.amican.demo.mapper;

import com.amican.demo.dto.MascotaDto;
import com.amican.demo.model.Mascotas;
import org.springframework.stereotype.Component;

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
                .dueniosList(mascotaDto.getDueniosList())
                .turnosMascotas(mascotaDto.getTurnosMascotas())
                .serviciosList(mascotaDto.getServiciosList())
                .build();
    }

}
