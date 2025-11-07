package com.example.demo.Controles;

import com.example.demo.ConsultasBD.UsuarioRepository;
import com.example.demo.Entidades.Usuario;
import com.example.demo.Serviços.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;

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

    @PostMapping("/logout")
    public String exclusaoDeConta(HttpServletRequest request, HttpServletResponse response, Model model) {

        // 1️⃣  Recupera o ID do cookie
        String usuarioId = CookieService.getCookie(request, "usuarioId");

        if (usuarioId != null) {
            // 2️⃣  Busca o usuário no banco
            Usuario usuario = this.ur.findById(Long.parseLong(usuarioId));

            if (usuario != null) {
                // 3️⃣  Deleta o usuário
                this.ur.delete(usuario);

                // 4️⃣  Remove cookies
                CookieService.deleteCookie(response, "usuarioId");
                CookieService.deleteCookie(response, "nomeUsuario");
                CookieService.deleteCookie(response, "emailUsuario");

                model.addAttribute("confirmacao", "Usuário removido com sucesso!");
            } else {
                model.addAttribute("erro", "Usuário não encontrado.");
            }
        } else {
            model.addAttribute("erro", "Nenhum usuário logado.");
        }

        // 5️⃣  Redireciona
        return "redirect:/login";
    }


}
