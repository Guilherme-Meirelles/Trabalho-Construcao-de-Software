package com.example.demo.Entidades;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Lista {

    /*
     * id : Long
     * titulo : String
     * descricao : String
     * REL: areaMae : AreaTrabalho
     * REL: tarefas : Set<Tarefa>
     */

    // CAMPOS DE LISTA

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private String descricao;

    // RELACIONAMENTOS DE LISTA

    // lista(n)-(1)areaTrabalho
    // area de trabalho é dona da relação
    @ManyToOne
    @JoinColumn(name = "listas")
    private AreaTrabalho areaMae;

    // lista(1)-(n)tarefa
    // lista é dona da relação
    @OneToMany(mappedBy="listaOrigem", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Tarefa> tarefas = new HashSet<>();
    
    // GETTERS E SETTERS
    // id
    public Long getId() { return id; }
    // titulo
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    // descricao
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    // areaMae
    public AreaTrabalho getAreaMae() { return areaMae; }
    // tarefas
    public Set<Tarefa> getTarefas() { return tarefas; }
}
