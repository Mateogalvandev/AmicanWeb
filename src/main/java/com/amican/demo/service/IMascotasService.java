package com.amican.demo.service;

import com.amican.demo.dto.MascotaDto;

import java.util.List;
import java.util.Optional;

public interface IMascotasService {

    List<MascotaDto> getAllMascotas();

    Optional<MascotaDto> getMascotaById(Long id);

    MascotaDto saveMascota(MascotaDto mascotaDto);

    MascotaDto updateMascota(Long id, MascotaDto mascotaDto);

    boolean deleteMascota(Long id);

    List<MascotaDto> searchMascotas(String keyword);

    List<MascotaDto> getMascotasByDuenio(Long duenioId);

    public boolean desactivarMascota(Long id);
}
