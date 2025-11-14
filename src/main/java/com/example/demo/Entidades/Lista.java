package com.example.demo.Entidades;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Lista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // RELACIONAMENTOS DE LISTA

    // lista(n)-(1)areaTrabalho
    // area de trabalho é dona da relação
    @ManyToOne
    @JoinColumn(name = "listas")
    private AreaTrabalho areaMae;

    // lista(1)-(n)tarefa
    // lista é dona da relação
    @OneToMany(mappedBy="listaOrigem")
    private Set<Tarefa> tarefas = new HashSet<>();
    
}
