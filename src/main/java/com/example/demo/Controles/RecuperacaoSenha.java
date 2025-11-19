package com.example.demo.Controles;

import com.example.demo.ConsultasBD.UsuarioRepository;
import com.example.demo.Serviços.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RecuperacaoSenha {

    @Autowired
    private UsuarioRepository ur;

    @GetMapping("/recuperarSenhaEmail")
    public String recuperarSenhaEmail() {


        return "recuperarSenhaEmail"; // Retorna a view, não redirect
    }

}
