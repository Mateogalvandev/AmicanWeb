package com.amican.demo.service;

import com.amican.demo.dto.TurnoDto;
import com.amican.demo.mapper.TurnoMapper;
import com.amican.demo.model.Duenios;
import com.amican.demo.model.Mascotas;
import com.amican.demo.model.Turnos;
import com.amican.demo.model.enums.Estados;
import com.amican.demo.repository.DueniosRepository;
import com.amican.demo.repository.MascotasRepository;
import com.amican.demo.repository.TurnosRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TurnosService implements ITurnosService {

    private final MascotasRepository mascotasRepository;
    private final DueniosRepository dueniosRepository;
    private final TurnosRepository turnosRepository;
    private final TurnoMapper turnoMapper;

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
    public Turnos save(TurnoDto turnoDto) {
        Turnos turnos = turnoMapper.toEntity(turnoDto);

        // Inicializar las listas para evitar NullPointerException
        if (turnos.getDueniosList() == null) {
            turnos.setDueniosList(new ArrayList<>());
        }
        if (turnos.getMascotasList() == null) {
            turnos.setMascotasList(new ArrayList<>());
        }

        // Manejar dueño - PRIMERO guardar el turno sin relaciones
        Turnos savedTurno = turnosRepository.save(turnos); // ← Guardar primero el turno

        // Luego manejar las relaciones
        if (turnoDto.getDuenioId() != null) {
            Duenios duenio = dueniosRepository.findById(turnoDto.getDuenioId())
                    .orElseThrow(() -> new RuntimeException("Dueño no encontrado"));

            // Agregar a ambas partes de la relación
            savedTurno.getDueniosList().add(duenio);
            if (duenio.getTurnosDuenios() == null) {
                duenio.setTurnosDuenios(new ArrayList<>());
            }
            duenio.getTurnosDuenios().add(savedTurno);

            // Guardar el dueño actualizado
            dueniosRepository.save(duenio);
        }

        // Manejar mascotas
        if (turnoDto.getMascotaIds() != null && !turnoDto.getMascotaIds().isEmpty()) {
            List<Mascotas> mascotas = mascotasRepository.findAllById(turnoDto.getMascotaIds());

            for (Mascotas mascota : mascotas) {
                savedTurno.getMascotasList().add(mascota);
                if (mascota.getTurnosMascotas() == null) {
                    mascota.setTurnosMascotas(new ArrayList<>());
                }
                mascota.getTurnosMascotas().add(savedTurno);

                // Guardar cada mascota actualizada
                mascotasRepository.save(mascota);
            }
        }

        // Finalmente guardar el turno con las relaciones
        return turnosRepository.save(savedTurno);
    }

    @Override

    @Transactional
    public void deleteById(Long id) {
        turnosRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Turnos updateTurno(Long id, TurnoDto turnoDto) {
        Turnos existingTurno = turnosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));

        // Limpiar relaciones existentes
        existingTurno.getDueniosList().clear();
        existingTurno.getMascotasList().clear();

        // Actualizar campos básicos
        existingTurno.setFecha(turnoDto.getFecha());
        existingTurno.setEstados(turnoDto.getEstados());

        // Manejar nuevas relaciones (similar a tu método save)
        // ...

        return turnosRepository.save(existingTurno);
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
