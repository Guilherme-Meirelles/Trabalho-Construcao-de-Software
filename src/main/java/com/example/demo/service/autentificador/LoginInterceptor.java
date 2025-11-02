package com.example.demo.service.autentificador;

import com.example.demo.service.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        // Verifica se há cookie de usuário
        String usuarioId = CookieService.getCookie(request, "usuarioId");


        if (usuarioId != null) {
            return true; // ✅ Usuário autenticado, pode prosseguir
        }

        // ❌ Não autenticado, redireciona para login
        response.sendRedirect("/login");
        return false;
    }
}
