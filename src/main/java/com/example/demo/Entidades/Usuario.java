package com.example.demo.Entidades;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;
    private String dataNascimento;

    // Áreas que o usuário criou
    @OneToMany(mappedBy = "dono")
    private Set<AreaTrabalho> areasCriadas = new HashSet<>();

    // Participações do usuário em áreas
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Set<ParticipacaoArea> participacoes = new HashSet<>();

    // getters e setters básicos
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public String getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(String dataNascimento) { this.dataNascimento = dataNascimento; }

    public Set<AreaTrabalho> getAreasCriadas() { return areasCriadas; }
    public Set<ParticipacaoArea> getParticipacoes() { return participacoes; }
}