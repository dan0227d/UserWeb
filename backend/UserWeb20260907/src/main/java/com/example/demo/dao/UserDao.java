package com.example.demo.dao;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.User;

public interface UserDao {

	List<User> findAll();
	
	Optional<User> findById(Integer id);

	Optional<User> findByUsername(String username);

	boolean existsByUsername(String username);

	User save(User user);
	
	List<User> searchByUsername(String username, Integer page, Integer size);
	
	long countByUsername(String username);
	
	void delete(User user);

}
