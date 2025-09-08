    package com.amican.demo.model;

    import com.amican.demo.model.enums.Tamanios;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.util.List;


    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @Entity
    public class Mascotas {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long idMascotas;
        private String nombreMascotas;
        private String raza;
        private Tamanios tamanios;
        @ManyToMany(mappedBy = "mascotasList")
        private List<Duenios> dueniosList;
        @ManyToMany
        @JoinTable(
                name = "turnos_mascotas",
                joinColumns = @JoinColumn(name = "turno_id"),
                inverseJoinColumns = @JoinColumn(name = "mascotas_id")
        )
        private List<Turnos> turnosMascotas;
        @OneToMany(mappedBy = "mascotas")
        private List<Servicios> serviciosList;

        private boolean activo = true;

    }
