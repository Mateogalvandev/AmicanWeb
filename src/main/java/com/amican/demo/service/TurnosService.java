package com.amican.demo.service;

import com.amican.demo.model.Turnos;
import com.amican.demo.model.enums.Estados;
import com.amican.demo.repository.TurnosRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TurnosService implements ITurnosService {

    private final TurnosRepository turnosRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Turnos> findAll() {
        return turnosRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Turnos> findById(Long id) {
        return turnosRepository.findById(id);
    }

    @Override
    @Transactional
    public Turnos save(Turnos turnos) {
        return turnosRepository.save(turnos);
    }

    @Override

    @Transactional
    public void deleteById(Long id) {
        turnosRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Turnos> findByFechaBetween(LocalDateTime start, LocalDateTime end) {
        return turnosRepository.findByFechaBetween(start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Turnos> findByEstado(Estados estado) {
        return turnosRepository.findByEstados(estado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Turnos> findByDuenioId(Long duenioId) {
        return turnosRepository.findByDueniosListId(duenioId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Turnos> findByMascotaId(Long mascotaId) {
        return turnosRepository.findByMascotasListId(mascotaId);
    }
}
