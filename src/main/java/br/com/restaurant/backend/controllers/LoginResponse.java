package br.com.restaurant.backend.controllers;

import br.com.restaurant.backend.entities.enums.UserRole;

public class LoginResponse {
    private String id;
    private String email;
    private String name;
    private String cpf;
    private UserRole role;

    // Construtor com todos os argumentos
    public LoginResponse(String id, String email, String name, String cpf, UserRole role) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.cpf = cpf;
        this.role = role;
    }

    // Construtor padrão
    public LoginResponse() {
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getCpf() {
        return cpf;
    }

    public UserRole getRole() {
        return role;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}