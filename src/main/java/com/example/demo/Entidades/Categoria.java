package com.example.demo.Entidades;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Categoria {
    // Campos de Categoria

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String cor;

    // Relacionamentos de Categoria
    // categoria(n)-(n)tarefa
    @ManyToMany(mappedBy = "categorias")
    private Set<Tarefa> tarefas = new HashSet<>();
}
