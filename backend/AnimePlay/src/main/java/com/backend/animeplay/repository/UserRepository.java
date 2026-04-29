package com.backend.animeplay.repository;

import com.backend.animeplay.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsernameAndIdNot(String username, String id);

    boolean existsByEmailAndIdNot(String email, String id);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}
