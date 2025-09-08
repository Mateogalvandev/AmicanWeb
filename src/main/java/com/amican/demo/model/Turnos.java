package com.amican.demo.model;

import com.amican.demo.model.enums.Estados;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Turnos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTurnos;
    @ManyToMany(mappedBy = "turnosDuenios")
    private List<Duenios> dueniosList;
    @ManyToMany(mappedBy = "turnosMascotas")
    private List<Mascotas> mascotasList;
    private LocalDateTime fecha;
    private Estados estados;
}
