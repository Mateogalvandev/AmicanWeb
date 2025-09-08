package com.amican.demo.service;


import com.amican.demo.dto.MascotaDto;
import com.amican.demo.mapper.MascotaMapper;
import com.amican.demo.model.Duenios;
import com.amican.demo.model.Mascotas;
import com.amican.demo.repository.DueniosRepository;
import com.amican.demo.repository.MascotasRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class MascotasService implements IMascotasService {

    private final DueniosRepository dueniosRepository;
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

    @Override
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


            // Manejar asignación de dueños si se proporcionan IDs
            if (mascotaDto.getDueniosIds() != null && !mascotaDto.getDueniosIds().isEmpty()) {
                List<Duenios> duenios = dueniosRepository.findAllById(mascotaDto.getDueniosIds());

                // Establecer relación en AMBOS lados
                mascota.setDueniosList(duenios);

                // Actualizar el lado inverso (dueños) - ¡ESTO ES LO QUE FALTA!
                for (Duenios duenio : duenios) {
                    if (duenio.getMascotasList() == null) {
                        duenio.setMascotasList(new ArrayList<>());
                    }
                    // Agregar la mascota a la lista del dueño
                    duenio.getMascotasList().add(mascota);
                }

                // Guardar también los dueños actualizados
                dueniosRepository.saveAll(duenios);
            }

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
    @Transactional
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

            // Usar el método de actualización del mapper si existe, sino actualizar campos manualmente
            if (mascotaMapper != null) {
                // Si tienes un método updateMascotaFromDto en el mapper
                mascotaMapper.updateMascotaFromDto(mascotaDto, mascotaToUpdate);
            } else {
                // Actualizar campos manualmente
                mascotaToUpdate.setNombreMascotas(mascotaDto.getNombreMascotas());
                mascotaToUpdate.setRaza(mascotaDto.getRaza());
                mascotaToUpdate.setTamanios(mascotaDto.getTamanios());
                // Agrega aquí otros campos que necesites actualizar
            }

            // Actualizar dueños si se proporcionan IDs
            if (mascotaDto.getDueniosIds() != null) {
                // 1. Primero, remover esta mascota de los dueños anteriores
                List<Duenios> dueniosAnteriores = mascotaToUpdate.getDueniosList();
                if (dueniosAnteriores != null) {
                    for (Duenios duenio : dueniosAnteriores) {
                        duenio.getMascotasList().remove(mascotaToUpdate);
                    }
                    dueniosRepository.saveAll(dueniosAnteriores);
                }

                // 2. Agregar a los nuevos dueños
                List<Duenios> nuevosDuenios = dueniosRepository.findAllById(mascotaDto.getDueniosIds());
                mascotaToUpdate.setDueniosList(nuevosDuenios);

                // 3. Actualizar el lado inverso
                for (Duenios duenio : nuevosDuenios) {
                    if (duenio.getMascotasList() == null) {
                        duenio.setMascotasList(new ArrayList<>());
                    }
                    if (!duenio.getMascotasList().contains(mascotaToUpdate)) {
                        duenio.getMascotasList().add(mascotaToUpdate);
                    }
                }
                dueniosRepository.saveAll(nuevosDuenios);
            }

            Mascotas updatedMascota = mascotasRepository.save(mascotaToUpdate);
            return mascotaMapper.toDto(updatedMascota);

        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw e;
            }
            throw new RuntimeException("Error al actualizar la mascota: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean deleteMascota(Long id) {
        Optional<Mascotas> mascotaOpt = mascotasRepository.findById(id);
        if (mascotaOpt.isEmpty()) {
            throw new IllegalArgumentException("Mascota no encontrada con ID: " + id);
        }

        Mascotas mascota = mascotaOpt.get();

        // Primero, eliminar las relaciones con los dueños
        if (mascota.getDueniosList() != null) {
            for (Duenios duenio : mascota.getDueniosList()) {
                if (duenio.getMascotasList() != null) {
                    duenio.getMascotasList().remove(mascota);
                }
            }
            dueniosRepository.saveAll(mascota.getDueniosList());
            mascota.setDueniosList(new ArrayList<>());
        }

        // Luego eliminar la mascota
        mascotasRepository.delete(mascota);
        return true;
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

    private void sincronizarRelacionDuenios(Mascotas mascota, List<Long> nuevosDueniosIds) {
        if (nuevosDueniosIds == null) {
            return;
        }

        // Remover de dueños anteriores
        List<Duenios> dueniosAnteriores = mascota.getDueniosList();
        if (dueniosAnteriores != null) {
            for (Duenios duenio : dueniosAnteriores) {
                if (duenio.getMascotasList() != null) {
                    duenio.getMascotasList().remove(mascota);
                }
            }
            dueniosRepository.saveAll(dueniosAnteriores);
        }

        // Agregar a nuevos dueños
        List<Duenios> nuevosDuenios = dueniosRepository.findAllById(nuevosDueniosIds);
        mascota.setDueniosList(nuevosDuenios);

        for (Duenios duenio : nuevosDuenios) {
            if (duenio.getMascotasList() == null) {
                duenio.setMascotasList(new ArrayList<>());
            }
            if (!duenio.getMascotasList().contains(mascota)) {
                duenio.getMascotasList().add(mascota);
            }
        }

        dueniosRepository.saveAll(nuevosDuenios);
    }


    @Override
    public boolean desactivarMascota(Long id) {
        Optional<Mascotas> mascotaOpt = mascotasRepository.findById(id);
        if (mascotaOpt.isEmpty()) {
            throw new IllegalArgumentException("Mascota no encontrada con ID: " + id);
        }
        Mascotas mascota = mascotaOpt.get();
        mascota.setActivo(false);
        mascotasRepository.save(mascota);
        return true;
    }






}
