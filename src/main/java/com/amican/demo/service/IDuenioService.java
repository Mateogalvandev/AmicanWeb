package com.amican.demo.service;

import com.amican.demo.dto.DueniosDto;
import com.amican.demo.model.Duenios;

import java.util.List;
import java.util.Optional;

public interface IDuenioService {



    List<DueniosDto> getAllDueniosDto();

    List<Duenios> getAllDuenios();

    Optional<DueniosDto> getDuenioById(Long id);

    DueniosDto saveDuenio(DueniosDto duenioDto);

    DueniosDto updateDuenio(Long id, DueniosDto duenioDto);

    void deleteDuenio(Long id);

    List<DueniosDto> searchDuenios(String keyword);

    public List<Duenios> findAllConMascotas();
}
