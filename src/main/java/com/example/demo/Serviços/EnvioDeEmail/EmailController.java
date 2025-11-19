package com.example.demo.Serviços.EnvioDeEmail;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final StandardServletMultipartResolver standardServletMultipartResolver;
    private EmailService emailService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void enviarEmail(@RequestBody EmailDto emailDto) {
        emailService.enviarEmail(emailDto);
    }


}
