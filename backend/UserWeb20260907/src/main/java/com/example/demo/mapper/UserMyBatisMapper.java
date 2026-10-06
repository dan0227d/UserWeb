package com.example.demo.mapper;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.model.User;

@Mapper
public interface UserMyBatisMapper {

	List<User> findAll();
	Optional<User> findByUsername(String username);
	boolean existsByUsername(String username);
	int save(User user);
	Optional<User> findById(Integer id);
	List<User> searchByUsername(String username, Integer page, Integer size);
	long countByUsername(String username);
	void delete(User user);
}
