package com.amican.demo.repository;

import com.amican.demo.model.Duenios;
import com.amican.demo.model.Turnos;
import com.amican.demo.model.enums.Estados;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface TurnosRepository extends JpaRepository<Turnos, Long> {
    List<Turnos> findByEstados(Estados estado);
    List<Turnos> findByFechaBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT t FROM Turnos t JOIN t.dueniosList d WHERE d.id = :duenioId")
    List<Turnos> findByDueniosListId(@Param("duenioId") Long duenioId);

    @Query("SELECT t FROM Turnos t JOIN t.mascotasList m WHERE m.id = :mascotaId")
    List<Turnos> findByMascotasListId(@Param("mascotaId") Long mascotaId);


}
