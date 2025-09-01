package com.amican.demo.service;

import com.amican.demo.dto.UserDto;
import com.amican.demo.model.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    UserDto save(UserDto userDto);
    UserDto update(Long id, UserDto userDto);
    Optional<UserDto> findById(Long id);
    List<UserDto> findAll();
    void deleteById(Long id);

    // Métodos específicos
    Optional<UserDto> findByUsername(String username);
    boolean existsByUsername(String username);
    List<UserDto> findByNombre(String nombre);
    List<UserDto> findByNombreAndApellido(String nombre, String apellido);
    UserDto disableUser(Long id);
    UserDto enableUser(Long id);
    UserDto changePassword(Long id, String newPassword);

    // Métodos de conversión
    UserDto convertToDto(User user);
    User convertToEntity(UserDto userDto);
}
