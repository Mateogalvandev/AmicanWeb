package com.amican.demo.service;

import com.amican.demo.dto.DueniosDto;
import com.amican.demo.mapper.DuenioMapper;
import com.amican.demo.model.Duenios;
import com.amican.demo.model.Mascotas;
import com.amican.demo.repository.DueniosRepository;
import com.amican.demo.repository.MascotasRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DueniosService implements IDuenioService{

    private final MascotasRepository mascotasRepository;
    private final DueniosRepository dueniosRepository;
    private final DuenioMapper dueniosDuenioMapper;


    public List<Duenios> getDueniosByIds(List<Long> ids) {
        return dueniosRepository.findAllById(ids);
    }

    @Override
    public List<DueniosDto> getAllDueniosDto() {
        return dueniosRepository.findAll()
                .stream()
                .map(dueniosDuenioMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Duenios> getAllDuenios() {
        return dueniosRepository.findAll();
    }

    @Override
    public Optional<DueniosDto> getDuenioById(Long id) {
        return dueniosRepository.findById(id)
                .map(dueniosDuenioMapper::toDto);
    }

    @Override
    public DueniosDto saveDuenio(DueniosDto duenioDto) {
        Duenios duenio = dueniosDuenioMapper.toEntity(duenioDto);
        Duenios savedDuenio = dueniosRepository.save(duenio);
        return dueniosDuenioMapper.toDto(savedDuenio);
    }

    @Override
    @Transactional
    public DueniosDto updateDuenio(Long id, DueniosDto duenioDto) {
        try {
            Optional<Duenios> existingDuenio = dueniosRepository.findById(id);
            if (existingDuenio.isEmpty()) {
                throw new IllegalArgumentException("Dueño no encontrado con ID: " + id);
            }

            // Validaciones
            if (duenioDto.getNombreDuenio() == null || duenioDto.getNombreDuenio().trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre del dueño es requerido");
            }

            if (duenioDto.getApellido() == null || duenioDto.getApellido().trim().isEmpty()) {
                throw new IllegalArgumentException("El apellido del dueño es requerido");
            }

            if (duenioDto.getCelular() == null || duenioDto.getCelular().trim().isEmpty()) {
                throw new IllegalArgumentException("El celular del dueño es requerido");
            }

            if (duenioDto.getDni() == null || duenioDto.getDni().trim().isEmpty()) {
                throw new IllegalArgumentException("El DNI del dueño es requerido");
            }

            Duenios duenioToUpdate = existingDuenio.get();

            // Usar el método de actualización del mapper si existe, sino actualizar campos manualmente
            if (dueniosDuenioMapper != null) {
                // Si tienes un método updateDuenioFromDto en el mapper
                dueniosDuenioMapper.updateMascotaFromDto(duenioDto, duenioToUpdate);
            } else {
                // Actualizar campos manualmente
                duenioToUpdate.setNombreDuenio(duenioDto.getNombreDuenio());
                duenioToUpdate.setApellido(duenioDto.getApellido());
                duenioToUpdate.setCelular(duenioDto.getCelular());
                duenioToUpdate.setDni(duenioDto.getDni());
            }

            Duenios updatedDuenio = dueniosRepository.save(duenioToUpdate);
            return dueniosDuenioMapper.toDto(updatedDuenio);

        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw e;
            }
            throw new RuntimeException("Error al actualizar el dueño: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteDuenio(Long id) {
        dueniosRepository.deleteById(id);
    }

    @Override
    public List<DueniosDto> searchDuenios(String keyword) {
        return dueniosRepository.findByNombreDuenioContainingIgnoreCaseOrApellidoContainingIgnoreCase(
                        keyword, keyword)
                .stream()
                .map(dueniosDuenioMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Duenios> findAllConMascotas() {
        return dueniosRepository.findAllConMascotas();
    }

    @Transactional
    public void agregarMascotaADuenio(Long duenioId, Long mascotaId) {
        Duenios duenio = dueniosRepository.findById(duenioId)
                .orElseThrow(() -> new RuntimeException("Dueño no encontrado"));
        Mascotas mascota = mascotasRepository.findById(mascotaId)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));

        duenio.getMascotasList().add(mascota);
        mascota.getDueniosList().add(duenio);

        dueniosRepository.save(duenio);
        mascotasRepository.save(mascota);
    }

}
