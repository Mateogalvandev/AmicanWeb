package com.amican.demo.repository;

import com.amican.demo.model.Turnos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TurnosRepository extends JpaRepository<Turnos, Long> {
}
