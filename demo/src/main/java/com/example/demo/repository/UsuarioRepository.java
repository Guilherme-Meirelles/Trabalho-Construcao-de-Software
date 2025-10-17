package com.example.demo.repository;
import com.example.demo.Modelos.Usuario;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.web.bind.annotation.*;
public interface UsuarioRepository extends CrudRepository<Usuario, String> {

    Usuario findById(Long id);

    @Query(value = "select * from ToDaily_db.usuario where email = :email and senha = :senha", nativeQuery = true)
    public Usuario login(String email, String senha);
}
