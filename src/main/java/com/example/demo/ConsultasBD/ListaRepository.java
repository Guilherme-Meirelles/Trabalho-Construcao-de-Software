package com.example.demo.ConsultasBD;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.Entidades.Lista;
import com.example.demo.Entidades.AreaTrabalho;

public interface ListaRepository extends JpaRepository<Lista, Long> {
    Lista findListaById(Long id);
    Lista findListaByAreaMae(AreaTrabalho areaMae);
}
