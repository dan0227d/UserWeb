package com.example.demo.dao.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.UserDao;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@Repository("UserDaoJpa")
public class UserDaoJpaImpl implements UserDao{

	@Autowired
	private UserRepository userRepository;
	
	public List<User> getAll(){
		return userRepository.findAll();
	}
	
	public User getByName(String username){
		return userRepository.findByUsername(username).orElse(null);
	}
	
	public User login(String username, String password) {

	    User user = userRepository
	            .findByUsername(username)
	            .orElse(null);
	    if (user == null) {
	        return null;
	    }
	    if (!password.equals(user.getPassword())) {
	        return null;
	    }
	    return user;
	}
	
	public User register(User user) {
		//System.out.println("----------register------");
	    if (userRepository.existsByUsername(user.getUsername())) {
	        return null;
	    }
	    
	    return userRepository.save(user);
	}

	@Override
	public List<User> findAll() {
		return userRepository.findAll();
	}

	@Override
	public Optional<User> findByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	@Override
	public boolean existsByUsername(String username) {
		return userRepository.existsByUsername(username);
	}

	@Override
	public User save(User user) {
		return userRepository.save(user);
	}

	@Override
	public Optional<User> findById(Integer id) {
		return userRepository.findById(id);
	}

	@Override
	public List<User> searchByUsername(String username, Integer page, Integer size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
		return userRepository.findByUsernameContaining(username, pageable);
	}

	@Override
	public long countByUsername(String username) {
		return userRepository.countByUsernameContaining(username);
	}

	@Override
	public void delete(User user) {
		userRepository.delete(user);
		
	}
	
}
