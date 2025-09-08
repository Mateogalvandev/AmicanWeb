package com.amican.demo.dto;

import com.amican.demo.model.enums.Estados;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TurnoDto {
    private Long idTurnos;
    private Long duenioId; // Para el nuevo flujo
    private List<Long> mascotaIds; // Para el nuevo flujo
    private LocalDateTime fecha;
    private Estados estados;
}