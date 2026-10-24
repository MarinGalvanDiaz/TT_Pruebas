package com.liberate.auth.dto.request;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.liberate.auth.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @JsonAlias({"name", "fullName"})
    @NotBlank(message = "El nombre es requerido")
    @Size(min = 2, max = 150, message = "El nombre debe tener entre 2 y 150 caracteres")
    private String nombre;

    @NotBlank(message = "El correo electrónico es requerido")
    @Email(message = "Formato de correo electrónico inválido")
    private String email;

    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 6, max = 100, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    @NotNull(message = "El rol es requerido")
    private UserRole role = UserRole.ADOLESCENTES;

    @JsonAlias({"age"})
    private Integer edad;

    public RegisterRequest() {}

    public RegisterRequest(String nombre, String email, String password, UserRole role) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.role = role != null ? role : UserRole.ADOLESCENTES;
    }

    public RegisterRequest(String nombre, String email, String password, UserRole role, Integer edad) {
        this(nombre, email, password, role);
        this.edad = edad;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public Integer getAge() {
        return edad;
    }

    public void setAge(Integer age) {
        this.edad = age;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getName() {
        return nombre;
    }

    public void setName(String name) {
        this.nombre = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
