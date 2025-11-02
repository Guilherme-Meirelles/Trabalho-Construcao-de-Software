package com.example.demo.Controles;

import com.example.demo.ConsultasBD.UsuarioRepository;
import com.example.demo.Serviços.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MenuPrincipalControle {

    @Autowired
    private UsuarioRepository ur;

    @GetMapping("/menuPrincipal")
    public String menuPrincipal(Model model, HttpServletRequest request) {
        String nome = CookieService.getCookie(request, "nomeUsuario");
        String email = CookieService.getCookie(request, "emailUsuario");

        // Segurança: se não houver cookies, redireciona
        if (nome == null || email == null) {
            return "redirect:/login";
        }

        model.addAttribute("nome", nome);
        model.addAttribute("email", email);
        return "menuPrincipal"; // Retorna a view, não redirect
    }

}
