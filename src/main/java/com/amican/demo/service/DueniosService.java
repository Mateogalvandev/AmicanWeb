package com.amican.demo.service;

import com.amican.demo.dto.DueniosDto;
import com.amican.demo.mapper.DuenioMapper;
import com.amican.demo.model.Duenios;
import com.amican.demo.repository.DueniosRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DueniosService implements IDuenioService{

    private final DueniosRepository dueniosRepository;
    private final DuenioMapper dueniosDuenioMapper;


    @Override
    public List<DueniosDto> getAllDuenios() {
        return dueniosRepository.findAll()
                .stream()
                .map(dueniosDuenioMapper::toDto)
                .collect(Collectors.toList());
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
    public DueniosDto updateDuenio(Long id, DueniosDto duenioDto) {
        Optional<Duenios> existingDuenio = dueniosRepository.findById(id);
        if (existingDuenio.isPresent()) {
            Duenios duenioToUpdate = existingDuenio.get();

            // Actualizar campos básicos
            duenioToUpdate.setNombreDuenio(duenioDto.getNombreDuenio());
            duenioToUpdate.setApellido(duenioDto.getApellido());
            duenioToUpdate.setCelular(duenioDto.getCelular());
            duenioToUpdate.setDni(duenioDto.getDni());

            // Actualizar relaciones si están presentes en el DTO
            if (duenioDto.getMascotasList() != null) {
                duenioToUpdate.setMascotasList(duenioDto.getMascotasList());
            }
            if (duenioDto.getTurnosDuenios() != null) {
                duenioToUpdate.setTurnosDuenios(duenioDto.getTurnosDuenios());
            }

            Duenios updatedDuenio = dueniosRepository.save(duenioToUpdate);
            return dueniosDuenioMapper.toDto(updatedDuenio);
        }
        throw new RuntimeException("Dueño no encontrado con ID: " + id);
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
}
