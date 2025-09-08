package com.amican.demo.mapper;

import com.amican.demo.dto.TurnoDto;
import com.amican.demo.model.Turnos;
import org.springframework.stereotype.Component;

@Component
public class TurnoMapper {

    public TurnoDto toDto(Turnos turnos) {
        return TurnoDto.builder()
                .idTurnos(turnos.getIdTurnos())
                .fecha(turnos.getFecha())
                .estados(turnos.getEstados())

                // Nuevos campos simplificados
                .duenioId(turnos.getDueniosList() != null && !turnos.getDueniosList().isEmpty() ?
                        turnos.getDueniosList().get(0).getIdDuenio() : null)

                .mascotaIds(turnos.getMascotasList() != null ?
                        turnos.getMascotasList().stream()
                                .map(mascota -> mascota.getIdMascotas())
                                .collect(java.util.stream.Collectors.toList()) : null)

                .build();

        // NOTA: Removimos los campos dueniosList y mascotasList del DTO
        // ya que ahora solo usamos IDs para el formulario
    }

    public Turnos toEntity(TurnoDto turnoDto) {
        return Turnos.builder()
                .idTurnos(turnoDto.getIdTurnos())
                .fecha(turnoDto.getFecha())
                .estados(turnoDto.getEstados())
                // Las listas de dueños y mascotas se manejarán en el servicio
                .dueniosList(new java.util.ArrayList<>()) // Inicializar lista vacía
                .mascotasList(new java.util.ArrayList<>()) // Inicializar lista vacía
                .build();
    }
}