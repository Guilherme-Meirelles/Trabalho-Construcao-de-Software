package com.example.demo.controle;

import com.example.demo.Modelos.Usuario;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.service.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@Controller
public class loginControle {

    @Autowired
    private UsuarioRepository ur;

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/cadastro")
    public String cadastro() {
        return "cadastro";
    }

    @GetMapping("/menuPrincipal")
    public String menuPrincipal(Model model, HttpServletRequest request) throws UnsupportedEncodingException {
        model.addAttribute("nome", CookieService.getCookie(request, "nomeUsuario"));
        model.addAttribute("email", CookieService.getCookie(request, "emailUsuario"));
        return "redirect:/menuPrincipal";
    }

    @PostMapping("/cadastro")
    public String cadastroUsuario(@ModelAttribute Usuario usuario, BindingResult result, Model model) {

        if (result.hasErrors()) {
            model.addAttribute("mensagem", "Erro ao cadastrar!");
            return "redirect:/cadastro";
        }

        if (usuario.getSenha().length() < 8) {
            model.addAttribute("mensagem", "A senha deve ter pelo menos 8 caracteres!");
            return "cadastro";
        }
        if (!usuario.getDataNascimento().matches("^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$")) {
            model.addAttribute("mensagem", "Data de nascimento inválida! Use DD/MM/AAAA.");
            return "cadastro";
        }


        ur.save(usuario); // ✅ salva no banco
        model.addAttribute("mensagem", "Usuário cadastrado com sucesso!");
        return "login"; // redireciona para tela de login
    }

    @PostMapping("/login")
    public String loginUsuario(Usuario usuario, Model model, HttpServletResponse response) throws UnsupportedEncodingException {

        Usuario usuarioLogado = this.ur.login(usuario.getEmail(), usuario.getSenha());
        if (usuarioLogado != null) {
            CookieService.setCookie(response, "usuarioId", String.valueOf(usuarioLogado.getId()), 10000);
            CookieService.setCookie(response, "nomeUsuario", usuarioLogado.getNome(), 10000);
            CookieService.setCookie(response, "emailUsuario", usuarioLogado.getEmail(), 10000);
            return "menuPrincipal";

        }


        model.addAttribute("erro", "Usario Invalido");
        return "login";
    }
}

