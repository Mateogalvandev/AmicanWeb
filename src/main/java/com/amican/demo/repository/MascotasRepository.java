package com.amican.demo.repository;

import com.amican.demo.model.Mascotas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface MascotasRepository extends JpaRepository<Mascotas, Long> {

    List<Mascotas> findByNombreMascotasContainingIgnoreCase(String nombre);

    Optional<Mascotas> findByNombreMascotas(String nombre);

    List<Mascotas> findByRazaContainingIgnoreCase(String raza);

    @Query("SELECT m FROM Mascotas m JOIN m.dueniosList d WHERE d.idDuenio = :duenioId")
    List<Mascotas> findByDuenioId(@Param("duenioId") Long duenioId);

    List<Mascotas> findByActivoTrue();


}
