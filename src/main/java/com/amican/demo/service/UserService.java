package com.amican.demo.service;

import com.amican.demo.dto.UserDto;
import com.amican.demo.model.User;
import com.amican.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * {@inheritDoc}
     * Guarda un nuevo usuario desde un DTO usando Builder pattern.
     */
    @Override
    public UserDto save(UserDto userDto) {
        User user = new User();
        log.info("Guardando nuevo usuario: {}", userDto.getUsername());

        validateUserDto(userDto);
        validateUniqueUsername(userDto.getUsername());

        user = convertToEntity(userDto);
        user.setFecha(LocalDate.now());
        User savedUser = userRepository.save(user);

        return convertToDto(savedUser);
    }

    /**
     * {@inheritDoc}
     * Actualiza un usuario existente usando lambda para mapeo de campos.
     */
    @Override
    public UserDto update(Long id, UserDto userDto) {
        log.info("Actualizando usuario con ID: {}", id);

        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));

        // Usar lambda para aplicar updates solo a campos no nulos
        User updatedUser = updateEntityFromDto(existingUser, userDto);
        User savedUser = userRepository.save(updatedUser);

        return convertToDto(savedUser);
    }

    /**
     * {@inheritDoc}
     * Busca por ID y convierte a DTO usando Optional.map()
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<UserDto> findById(Long id) {
        log.debug("Buscando usuario por ID: {}", id);

        return userRepository.findById(id)
                .map(this::convertToDto);
    }

    /**
     * {@inheritDoc}
     * Obtiene todos los usuarios y convierte a DTO usando Stream API.
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserDto> findAll() {
        log.debug("Obteniendo todos los usuarios");

        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void deleteById(Long id) {
        log.info("Eliminando usuario con ID: {}", id);

        userRepository.findById(id)
                .ifPresentOrElse(
                        user -> userRepository.deleteById(id),
                        () -> { throw new IllegalArgumentException("Usuario no encontrado con ID: " + id); }
                );
    }

    /**
     * {@inheritDoc}
     * Busca por username y convierte a DTO.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<UserDto> findByUsername(String username) {
        log.debug("Buscando usuario por username: {}", username);

        return userRepository.findByUsername(username)
                .map(this::convertToDto);
    }


    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }



    /**
     * {@inheritDoc}
     * Busca por nombre y convierte resultados a DTO usando Stream.
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserDto> findByNombre(String nombre) {
        log.debug("Buscando usuarios por nombre: {}", nombre);

        return userRepository.findByNombre(nombre).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     * Busca por nombre y apellido, convierte a DTO.
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserDto> findByNombreAndApellido(String nombre, String apellido) {
        log.debug("Buscando usuarios por nombre: {} y apellido: {}", nombre, apellido);

        return userRepository.findByNombreAndApellido(nombre, apellido).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     * Deshabilita usuario usando método funcional.
     */
    @Override
    public UserDto disableUser(Long id) {
        log.info("Deshabilitando usuario con ID: {}", id);

        return userRepository.findById(id)
                .map(user -> {
                    User disabledUser = User.builder()
                            .idUser(user.getIdUser())
                            .nombre(user.getNombre())
                            .apellido(user.getApellido())
                            .username(user.getUsername())
                            .password(user.getPassword())
                            .fecha(user.getFecha())
                            .enabled(false)
                            .roles(user.getRoles())
                            .build();

                    return convertToDto(userRepository.save(disabledUser));
                })
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
    }

    /**
     * {@inheritDoc}
     * Habilita usuario usando expresión lambda.
     */
    @Override
    public UserDto enableUser(Long id) {
        log.info("Habilitando usuario con ID: {}", id);

        return userRepository.findById(id)
                .map(user -> {
                    User enabledUser = User.builder()
                            .idUser(user.getIdUser())
                            .nombre(user.getNombre())
                            .apellido(user.getApellido())
                            .username(user.getUsername())
                            .password(user.getPassword())
                            .fecha(user.getFecha())
                            .enabled(true)
                            .roles(user.getRoles())
                            .build();

                    return convertToDto(userRepository.save(enabledUser));
                })
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
    }

    /**
     * {@inheritDoc}
     * Cambia contraseña usando approach funcional.
     */
    @Override
    public UserDto changePassword(Long id, String newPassword) {
        log.info("Cambiando contraseña para usuario ID: {}", id);

        return userRepository.findById(id)
                .map(user -> {
                    User updatedUser = User.builder()
                            .idUser(user.getIdUser())
                            .nombre(user.getNombre())
                            .apellido(user.getApellido())
                            .username(user.getUsername())
                            .password(passwordEncoder.encode(newPassword))
                            .fecha(user.getFecha())
                            .enabled(user.getEnabled())
                            .roles(user.getRoles())
                            .build();

                    return convertToDto(userRepository.save(updatedUser));
                })
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
    }

    /**
     * {@inheritDoc}
     * Convierte Entity a DTO usando Builder pattern.
     */
    @Override
    public UserDto convertToDto(User user) {
        return UserDto.builder()
                .nombre(user.getNombre())
                .apellido(user.getApellido())
                .username(user.getUsername())
                .password("") // No exponer la contraseña en el DTO
                .fecha(user.getFecha())
                .build();
    }

    /**
     * {@inheritDoc}
     * Convierte DTO a Entity encriptando la contraseña.
     */
    @Override
    public User convertToEntity(UserDto userDto) {
        return User.builder()
                .nombre(userDto.getNombre())
                .apellido(userDto.getApellido())
                .username(userDto.getUsername())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .fecha(userDto.getFecha())
                .enabled(true) // Por defecto habilitado
                .build();
    }

    /**
     * Actualiza una entidad User desde un DTO usando approach funcional.
     * Solo actualiza campos no nulos del DTO.
     */
    private User updateEntityFromDto(User existingUser, UserDto userDto) {
        return User.builder()
                .idUser(existingUser.getIdUser())
                .nombre(Optional.ofNullable(userDto.getNombre()).orElse(existingUser.getNombre()))
                .apellido(Optional.ofNullable(userDto.getApellido()).orElse(existingUser.getApellido()))
                .username(existingUser.getUsername()) // username no cambiable
                .password(Optional.ofNullable(userDto.getPassword())
                        .map(passwordEncoder::encode)
                        .orElse(existingUser.getPassword()))
                .fecha(Optional.ofNullable(userDto.getFecha()).orElse(existingUser.getFecha()))
                .enabled(existingUser.getEnabled())
                .roles(existingUser.getRoles())
                .build();
    }

    /**
     * Valida el DTO del usuario usando stream de validaciones.
     */
    private void validateUserDto(UserDto userDto) {
        if (userDto == null) {
            throw new IllegalArgumentException("UserDto no puede ser nulo");
        }

        // Lista de validaciones con mensajes de error
        List<String> errors = List.of(
                        validateField(userDto.getNombre(), "Nombre"),
                        validateField(userDto.getApellido(), "Apellido"),
                        validateField(userDto.getUsername(), "Username"),
                        validateField(userDto.getPassword(), "Password")
                ).stream()
                .filter(error -> !error.isEmpty())
                .collect(Collectors.toList());

        if (!errors.isEmpty()) {
            throw new IllegalArgumentException(String.join(", ", errors));
        }
    }

    /**
     * Valida un campo individual retornando mensaje de error si es inválido.
     */
    private String validateField(Object field, String fieldName) {
        if (field == null) {
            return fieldName + " es obligatorio";
        }
        if (field instanceof String && ((String) field).trim().isEmpty()) {
            return fieldName + " no puede estar vacío";
        }
        return "";
    }

    /**
     * Valida que el username sea único.
     */
    private void validateUniqueUsername(String username) {
        userRepository.findByUsername(username)
                .ifPresent(user -> {
                    throw new IllegalArgumentException("Username ya existe: " + username);
                });
    }

    /**
     * Método adicional: Buscar usuarios habilitados usando Stream.
     */
    @Transactional(readOnly = true)
    public List<UserDto> findEnabledUsers() {
        return userRepository.findAll().stream()
                .filter(User::getEnabled)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Método adicional: Buscar usuarios deshabilitados usando Stream.
     */
    @Transactional(readOnly = true)
    public List<UserDto> findDisabledUsers() {
        return userRepository.findAll().stream()
                .filter(user -> !user.getEnabled())
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Método adicional: Contar usuarios por estado usando Stream.
     */
    @Transactional(readOnly = true)
    public long countByStatus(boolean enabled) {
        return userRepository.findAll().stream()
                .filter(user -> user.getEnabled() == enabled)
                .count();
    }
}
