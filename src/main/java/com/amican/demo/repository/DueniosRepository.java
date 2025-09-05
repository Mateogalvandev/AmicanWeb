package com.amican.demo.repository;

import com.amican.demo.model.Duenios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DueniosRepository extends JpaRepository<Duenios, Long> {

    List<Duenios> findByNombreDuenioContainingIgnoreCaseOrApellidoContainingIgnoreCase(String keyword, String keyword1);
}
