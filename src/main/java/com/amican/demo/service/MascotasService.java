package com.amican.demo.service;


import com.amican.demo.dto.MascotaDto;
import com.amican.demo.mapper.MascotaMapper;
import com.amican.demo.model.Mascotas;
import com.amican.demo.repository.MascotasRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class MascotasService implements IMascotasService {

    private final MascotasRepository mascotasRepository;
    private final MascotaMapper mascotaMapper;

    @Override
    public List<MascotaDto> getAllMascotas() {
        return mascotasRepository.findAll()
                .stream()
                .map(mascotaMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<MascotaDto> getMascotaById(Long id) {
        return mascotasRepository.findById(id)
                .map(mascotaMapper::toDto);
    }

    public MascotaDto saveMascota(MascotaDto mascotaDto) {
        try {
            // Validaciones adicionales
            if (mascotaDto.getNombreMascotas() == null || mascotaDto.getNombreMascotas().trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre de la mascota es requerido");
            }

            if (mascotaDto.getRaza() == null || mascotaDto.getRaza().trim().isEmpty()) {
                throw new IllegalArgumentException("La raza de la mascota es requerida");
            }

            if (mascotaDto.getTamanios() == null) {
                throw new IllegalArgumentException("El tamaño de la mascota es requerido");
            }

            Mascotas mascota = mascotaMapper.toEntity(mascotaDto);
            Mascotas savedMascota = mascotasRepository.save(mascota);
            return mascotaMapper.toDto(savedMascota);

        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw e;
            }
            throw new RuntimeException("Error al guardar la mascota: " + e.getMessage(), e);
        }
    }

    @Override
    public MascotaDto updateMascota(Long id, MascotaDto mascotaDto) {
        try {
            Optional<Mascotas> existingMascota = mascotasRepository.findById(id);
            if (existingMascota.isEmpty()) {
                throw new IllegalArgumentException("Mascota no encontrada con ID: " + id);
            }

            // Validaciones
            if (mascotaDto.getNombreMascotas() == null || mascotaDto.getNombreMascotas().trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre de la mascota es requerido");
            }

            if (mascotaDto.getRaza() == null || mascotaDto.getRaza().trim().isEmpty()) {
                throw new IllegalArgumentException("La raza de la mascota es requerida");
            }

            if (mascotaDto.getTamanios() == null) {
                throw new IllegalArgumentException("El tamaño de la mascota es requerido");
            }

            Mascotas mascotaToUpdate = existingMascota.get();

            // Actualizar campos básicos
            mascotaToUpdate.setNombreMascotas(mascotaDto.getNombreMascotas());
            mascotaToUpdate.setRaza(mascotaDto.getRaza());
            mascotaToUpdate.setTamanios(mascotaDto.getTamanios());

            // Actualizar relaciones si están presentes en el DTO
            if (mascotaDto.getDueniosList() != null) {
                mascotaToUpdate.setDueniosList(mascotaDto.getDueniosList());
            }
            if (mascotaDto.getTurnosMascotas() != null) {
                mascotaToUpdate.setTurnosMascotas(mascotaDto.getTurnosMascotas());
            }
            if (mascotaDto.getServiciosList() != null) {
                mascotaToUpdate.setServiciosList(mascotaDto.getServiciosList());
            }

            Mascotas updatedMascota = mascotasRepository.save(mascotaToUpdate);
            return mascotaMapper.toDto(updatedMascota);

        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw e; // Relanzar excepciones de validación
            }
            throw new RuntimeException("Error al actualizar la mascota: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteMascota(Long id) {
        try {
            if (!mascotasRepository.existsById(id)) {
                throw new IllegalArgumentException("Mascota no encontrada con ID: " + id);
            }
            mascotasRepository.deleteById(id);
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw e;
            }
            throw new RuntimeException("Error al eliminar la mascota: " + e.getMessage(), e);
        }
    }

    @Override
    public List<MascotaDto> searchMascotas(String keyword) {
        return mascotasRepository.findByNombreMascotasContainingIgnoreCase(keyword)
                .stream()
                .map(mascotaMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MascotaDto> getMascotasByDuenio(Long duenioId) {
        return mascotasRepository.findByDuenioId(duenioId)
                .stream()
                .map(mascotaMapper::toDto)
                .collect(Collectors.toList());
    }






}
