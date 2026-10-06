package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{

	Optional<User> findByUsername(String username);
	boolean existsByUsername(String username);
	List<User> findByUsernameContaining(String username, Pageable pageable);
	long countByUsernameContaining(String username);
	
}
