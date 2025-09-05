package com.amican.demo.service;

import com.amican.demo.dto.DueniosDto;

import java.util.List;
import java.util.Optional;

public interface IDuenioService {

    List<DueniosDto> getAllDuenios();

    Optional<DueniosDto> getDuenioById(Long id);

    DueniosDto saveDuenio(DueniosDto duenioDto);

    DueniosDto updateDuenio(Long id, DueniosDto duenioDto);

    void deleteDuenio(Long id);

    List<DueniosDto> searchDuenios(String keyword);
}
