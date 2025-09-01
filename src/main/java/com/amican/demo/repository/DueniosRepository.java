package com.amican.demo.repository;

import com.amican.demo.model.Duenios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DueniosRepository extends JpaRepository<Duenios, Long> {
}
