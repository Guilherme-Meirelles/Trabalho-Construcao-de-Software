package com.example.demo.Controles;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.example.demo.ConsultasBD.AreaTrabalhoRepository;
import com.example.demo.ConsultasBD.ListaRepository;

@Controller
public class ListaController {

    @Autowired
    private AreaTrabalhoRepository areaRepo;

    @Autowired
    private ListaRepository listaRepo;
    
    
}
