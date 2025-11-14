package com.example.demo.Entidades;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class AreaTrabalho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // Dono da área (criador)
    @ManyToOne
    @JoinColumn(name = "dono_id")
    private Usuario dono;

    // Participantes com permissões
    @OneToMany(mappedBy = "area", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ParticipacaoArea> participacoes = new HashSet<>();

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Usuario getDono() { return dono; }
    public void setDono(Usuario dono) { this.dono = dono; }
    public Set<ParticipacaoArea> getParticipacoes() { return participacoes; }
}