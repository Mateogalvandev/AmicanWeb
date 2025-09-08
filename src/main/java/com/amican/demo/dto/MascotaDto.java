    package com.amican.demo.dto;

    import com.amican.demo.model.Duenios;
    import com.amican.demo.model.Servicios;
    import com.amican.demo.model.Turnos;
    import com.amican.demo.model.enums.Tamanios;
    import jakarta.persistence.JoinColumn;
    import jakarta.persistence.JoinTable;
    import jakarta.persistence.ManyToMany;
    import jakarta.persistence.OneToMany;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.util.List;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public class MascotaDto {
        private Long idMascotas;
        private String nombreMascotas;
        private String raza;
        private Tamanios tamanios;
        private List<Duenios> dueniosList;
        private List<Long> dueniosIds;
        private List<Turnos> turnosMascotas;
        private List<Servicios> serviciosList;

    }
