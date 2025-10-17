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

        // rota atual
        String uri = request.getRequestURI();

        // se for login, cadastro, logout ou estático → libera
        if (uri.equals("/login") || uri.equals("/cadastro") || uri.equals("/logout") ||
                uri.startsWith("/css") || uri.startsWith("/js") || uri.startsWith("/img")) {
            return true;
        }

        // se o usuário tiver cookie, deixa passar
        if (CookieService.getCookie(request, "usuarioId") != null) {
            return true;
        }

        // senão, redireciona
        response.sendRedirect("/login");
        return false;
    }

}
