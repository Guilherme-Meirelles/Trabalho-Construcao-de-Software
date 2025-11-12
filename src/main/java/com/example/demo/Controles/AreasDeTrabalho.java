package com.example.demo.Controles;

import com.example.demo.Serviços.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AreasDeTrabalho {

    @GetMapping("/areasTrabalho")
    public String areasTrabalho(Model model, HttpServletRequest request) {

        String nome = CookieService.getCookie(request, "nomeUsuario");
        String email = CookieService.getCookie(request, "emailUsuario");
        String dataNascimento = CookieService.getCookie(request, "dataNascimento");

        // Segurança: se não houver cookies, redireciona
        if (nome == null || email == null) {
            return "redirect:/login";
        }

        model.addAttribute("nome", nome);
        model.addAttribute("email", email);
        model.addAttribute("dataNascimento", dataNascimento);
        return "areasTrabalho";
    }
}
