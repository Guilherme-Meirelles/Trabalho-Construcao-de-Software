package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @GetMapping("/users")
    public List<User> getUsers() {
        List<User> users = new ArrayList<>();
        users.add(new User(1L, "João Silva", "joao@email.com"));
        users.add(new User(2L, "Maria Santos", "maria@email.com"));
        users.add(new User(3L, "Pedro Oliveira", "pedro@email.com"));
        return users;
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        user.setId(System.currentTimeMillis());
        return user;
    }
}

class User {
    private Long id;
    private String name;
    private String email;

    public User() {}

    public User(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}