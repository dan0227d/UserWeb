package com.example.demo.dao.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.UserDao;
import com.example.demo.mapper.UserMyBatisMapper;
import com.example.demo.model.User;

@Repository("UserDaoMyBatis")
public class UserDaoMyBatisImpl implements UserDao{
	
	private final UserMyBatisMapper userMyBatisMapper;
	
	UserDaoMyBatisImpl(UserMyBatisMapper userMyBatisMapper){
		this.userMyBatisMapper = userMyBatisMapper;		
	}

	@Override
	public List<User> findAll() {
		return userMyBatisMapper.findAll();
	}

	@Override
	public Optional<User> findByUsername(String username) {
		System.out.println("----------------"+userMyBatisMapper.findByUsername(username));
		return userMyBatisMapper.findByUsername(username);
	}

	@Override
	public boolean existsByUsername(String username) {
		return userMyBatisMapper.existsByUsername(username);
	}

	@Override
	public User save(User user) {
		userMyBatisMapper.save(user);
		return user;
	}

	@Override
	public Optional<User> findById(Integer id) {
		return userMyBatisMapper.findById(id);
	}

	@Override
	public List<User> searchByUsername(String username, Integer page, Integer size) {
		page=page*size;
		return userMyBatisMapper.searchByUsername(username, page, size);
	}

	@Override
	public long countByUsername(String username) {
		return userMyBatisMapper.countByUsername(username);
	}

	@Override
	public void delete(User user) {
		userMyBatisMapper.delete(user);
		
	}

}
