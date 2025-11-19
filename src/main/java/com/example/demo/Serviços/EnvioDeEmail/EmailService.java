package com.example.demo.Serviços.EnvioDeEmail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.IOException;
import java.nio.charset.StandardCharsets;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void enviarEmail(@RequestBody EmailDto emailDto) {

        try{
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("noreply@gmail.com");
            helper.setSubject("Dev Bueno");
            helper.setTo(emailDto.email());

            String template = carregaTemplateEmail();

            template = template.replace("#nome", emailDto.nome());
            helper.setText(template);
            javaMailSender.send(message);
        }catch (Exception e){
            System.out.println("Erro ao enviar email");
        }
    }

    public String carregaTemplateEmail() throws IOException, MessagingException {

        ClassPathResource resource = new ClassPathResource("templates/email_template.html");
        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

    }
}
