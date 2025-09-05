package com.amican.demo.service;

import com.amican.demo.model.Turnos;
import com.amican.demo.model.enums.Estados;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ITurnosService {

    List<Turnos> findAll();

    Optional<Turnos> findById(Long id);

    Turnos save(Turnos turnos);

    void deleteById(Long id);

    List<Turnos> findByFechaBetween(LocalDateTime start, LocalDateTime end);

    List<Turnos> findByEstado(Estados estado);

    List<Turnos> findByDuenioId(Long duenioId);

    List<Turnos> findByMascotaId(Long mascotaId);

}
