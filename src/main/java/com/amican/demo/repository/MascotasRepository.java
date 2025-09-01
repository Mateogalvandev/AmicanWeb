package com.amican.demo.repository;

import com.amican.demo.model.Mascotas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface MascotasRepository extends JpaRepository<Mascotas, Long> {
}
