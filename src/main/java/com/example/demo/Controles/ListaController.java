package com.example.demo.Controles;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import javax.smartcardio.ResponseAPDU;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.ConsultasBD.AreaTrabalhoRepository;
import com.example.demo.ConsultasBD.ListaRepository;
import com.example.demo.Entidades.AreaTrabalho;
import com.example.demo.Entidades.Lista;
import com.example.demo.Entidades.Tarefa;

import jakarta.servlet.http.HttpServletResponse;

@Controller
public class ListaController {

    @Autowired
    private AreaTrabalhoRepository areaRepo;

    @Autowired
    private ListaRepository listaRepo;
    
    /**
     * Método requisitado por "criarNovaLista"
     * Cria uma lista e a persiste no banco de dados. Preciso adicionar o nome
     * a descrição, a area de trabalho e inicializar a lista de tarefas
     * @param model
     * @param response
     * @return
     */
    @PostMapping("areasTrabalho/{nome}/{id}/novaLista")
    public ResponseEntity<Lista> novaLista(@PathVariable Long id, @RequestBody Lista lista, Model model,  HttpServletResponse response) {
        // recuperamos a area de trabalho pelo id
        AreaTrabalho area = areaRepo.findAreaById(id);

        lista.setAreaMae(area);
        lista.setTarefas(new HashSet<>());

        Lista salva = listaRepo.save(lista);

        model.addAttribute("listas", area.getListas());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }
    
}
