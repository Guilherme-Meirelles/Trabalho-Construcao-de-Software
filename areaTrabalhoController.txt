package com.example.demo.Controles;

import com.example.demo.ConsultasBD.AreaTrabalhoRepository;
import com.example.demo.ConsultasBD.UsuarioRepository;
import com.example.demo.Entidades.AreaTrabalho;
import com.example.demo.Entidades.Usuario;
import com.example.demo.Serviços.CookieService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.demo.Entidades.ParticipacaoArea;
import com.example.demo.Entidades.PermissaoArea;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class AreaTrabalhoController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AreaTrabalhoRepository areaTrabalhoRepository;

    @GetMapping("/areasTrabalho")
    public String areasTrabalho(Model model, HttpServletRequest request) {

        String usuarioId = CookieService.getCookie(request, "usuarioId");

        if (usuarioId == null) {
            return "redirect:/login";
        }

        Usuario usuario = usuarioRepository.findById(Long.parseLong(usuarioId)).orElse(null);

        if (usuario == null) {
            return "redirect:/login";
        }

        model.addAttribute("usuarioId", usuarioId);
        model.addAttribute("nome", usuario.getNome());
        model.addAttribute("email", usuario.getEmail());

        List<AreaTrabalho> areas = areaTrabalhoRepository.findByDono(usuario);

        model.addAttribute("usuario", usuario);
        model.addAttribute("areas", areas);

        return "areasTrabalho";
    }

    @GetMapping("/areasTrabalho/{name}")
    public String areasTrabalhoId(Model model, HttpServletRequest request) {

        String usuarioId = CookieService.getCookie(request, "usuarioId");

        if (usuarioId == null) {
            return "redirect:/login";
        }

        Usuario usuario = usuarioRepository.findById(Long.parseLong(usuarioId)).orElse(null);

        if (usuario == null) {
            return "redirect:/login";
        }

        model.addAttribute("nome", usuario.getNome());
        model.addAttribute("email", usuario.getEmail());

        return "menuPrincipal";
    }

    @PostMapping("/areasTrabalho/criar")
    @ResponseBody
    public String criarArea(@RequestParam String nome, HttpServletRequest request) {

        String usuarioId = CookieService.getCookie(request, "usuarioId");
        if (usuarioId == null) {
            return "NOT_LOGGED";
        }

        Usuario usuario = usuarioRepository.findById(Long.parseLong(usuarioId)).orElse(null);
        if (usuario == null) {
            return "USER_NOT_FOUND";
        }

        AreaTrabalho area = new AreaTrabalho();
        area.setNome(nome);
        area.setDono(usuario);

        areaTrabalhoRepository.save(area);

        ParticipacaoArea participacao = new ParticipacaoArea();
        participacao.setArea(area);
        participacao.setUsuario(usuario);
        participacao.setPermissao(PermissaoArea.ADMIN);

        area.getParticipacoes().add(participacao); // adiciona na coleção da área
        areaTrabalhoRepository.save(area);

        return area.getId().toString(); // o JS recebe esse ID e adiciona no HTML
    }

    @PutMapping("/areasTrabalho/{id}/renomear")
    public ResponseEntity<String> renomearArea(@PathVariable Long id,
                                            @RequestBody(required = false) String body,
                                            HttpServletRequest request) {

        String novoNome = request.getParameter("nome");
        if (novoNome == null || novoNome.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("INVALID_NAME");
        }

        String usuarioId = CookieService.getCookie(request, "usuarioId");
        if (usuarioId == null) return ResponseEntity.status(403).body("NOT_LOGGED");

        Usuario usuario = usuarioRepository.findById(Long.parseLong(usuarioId)).orElse(null);
        if (usuario == null) return ResponseEntity.status(403).body("NOT_LOGGED");

        AreaTrabalho area = areaTrabalhoRepository.findById(id).orElse(null);
        if (area == null) return ResponseEntity.status(404).body("NOT_FOUND");

        if (!area.getDono().getId().equals(usuario.getId())) {
            return ResponseEntity.status(403).body("NOT_OWNER");
        }

        area.setNome(novoNome);
        areaTrabalhoRepository.save(area);
        return ResponseEntity.ok("OK");
    }

    @DeleteMapping("/areasTrabalho/excluir")
    public ResponseEntity<?> excluirAreas(@RequestBody Map<String, List<Long>> body, HttpServletRequest request) {
        String usuarioId = CookieService.getCookie(request, "usuarioId");
        if (usuarioId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Usuario usuario = usuarioRepository.findById(Long.parseLong(usuarioId)).orElse(null);
        if (usuario == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<Long> ids = body.get("ids");
        for (Long id : ids) {
            AreaTrabalho area = areaTrabalhoRepository.findById(id).orElse(null);
            if (area != null && area.getDono().getId().equals(usuario.getId())) {
                areaTrabalhoRepository.delete(area);
            }
        }
        return ResponseEntity.ok().body(Map.of("status", "success"));
    }

    @PostMapping("/areasTrabalho/compartilhar")
    @ResponseBody
    public ResponseEntity<?> compartilharArea(@RequestBody Map<String, String> body, HttpServletRequest request) {

        String usuarioId = CookieService.getCookie(request, "usuarioId");
        if (usuarioId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "Usuário não logado"));

        Usuario usuario = usuarioRepository.findById(Long.parseLong(usuarioId)).orElse(null);
        if (usuario == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "Usuário não encontrado"));

        String areaIdStr = body.get("areaId");
        String metodo = body.get("metodo");

        if (areaIdStr == null || metodo == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Dados incompletos"));
        }

        Long areaId = Long.parseLong(areaIdStr);
        AreaTrabalho area = areaTrabalhoRepository.findById(areaId).orElse(null);

        if (area == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Área não encontrada"));
        }

        // Cria participação do usuário nessa área
        
        //ParticipacaoArea participacao = new ParticipacaoArea();
        //participacao.setArea(area);
        //participacao.setUsuario(usuario);
        //participacao.setPermissao(PermissaoArea.OBSERVADOR); // ou ADMIN se quiser dar controle

        //area.getParticipacoes().add(participacao);
        //areaTrabalhoRepository.save(area);

        return ResponseEntity.ok(Map.of("success", true, "message", "Área compartilhada com sucesso!"));
    }

    @GetMapping("/areasTrabalho/gerar-link/{id}")
    @ResponseBody
    public ResponseEntity<?> gerarLink(@PathVariable Long id, HttpServletRequest request) {

        String usuarioId = CookieService.getCookie(request, "usuarioId");
        if (usuarioId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "Usuário não logado"));

        Usuario usuario = usuarioRepository.findById(Long.parseLong(usuarioId)).orElse(null);
        if (usuario == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "Usuário não encontrado"));

        AreaTrabalho area = areaTrabalhoRepository.findById(id).orElse(null);
        if (area == null) return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Área não encontrada"));

        // Gera token único para compartilhamento
        String token = java.util.UUID.randomUUID().toString().substring(0, 8);

        String link = "https://todaily.app/shared/" + token;

        return ResponseEntity.ok(Map.of("success", true, "link", link));
    }

    @GetMapping("/areasTrabalho/{id}/membros")
    @ResponseBody
    public ResponseEntity<?> listarMembros(@PathVariable Long id, HttpServletRequest request) {
        String usuarioId = CookieService.getCookie(request, "usuarioId");
        if (usuarioId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("NOT_LOGGED");

        Usuario usuario = usuarioRepository.findById(Long.parseLong(usuarioId)).orElse(null);
        if (usuario == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("USER_NOT_FOUND");

        AreaTrabalho area = areaTrabalhoRepository.findById(id).orElse(null);
        if (area == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("AREA_NOT_FOUND");

        // Verifica se o usuário tem participação na área
        boolean temAcesso = area.getParticipacoes().stream()
                .anyMatch(p -> p.getUsuario().getId().equals(usuario.getId()));
        if (!temAcesso) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("NO_ACCESS");

        // Mapeia membros para JSON
        List<Map<String, Object>> membros = area.getParticipacoes().stream()
            .map(p -> {
                Map<String, Object> mapa = new HashMap<>();
                mapa.put("id", p.getUsuario().getId());
                mapa.put("nome", p.getUsuario().getNome());
                mapa.put("email", p.getUsuario().getEmail());
                mapa.put("permissao", p.getPermissao() == PermissaoArea.ADMIN ? "editar" : "visualizar");
                return mapa;
            })
            .collect(Collectors.toList());


        return ResponseEntity.ok(membros);
    }

}