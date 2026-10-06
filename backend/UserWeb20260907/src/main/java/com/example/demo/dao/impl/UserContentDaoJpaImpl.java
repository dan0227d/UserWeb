package com.example.demo.dao.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.demo.dao.UserContentDao;
import com.example.demo.model.UserContent;
import com.example.demo.repository.UserContentRepository;

@Repository("UserContentDaoJpa")
public class UserContentDaoJpaImpl implements UserContentDao{
	
	@Autowired
	private UserContentRepository userContentRepository;

	@Override
	public Optional<UserContent> findByUser_Id(Integer id) {
		return userContentRepository.findByUser_Id(id);
	}

	@Override
	public UserContent save(UserContent usercontent) {
		return userContentRepository.save(usercontent);
	}

	@Override
	public UserContent update(UserContent usercontent) {
		return userContentRepository.save(usercontent);
	}

	@Override
	public void deleteByUser_Id(Integer userid) {
		userContentRepository.deleteByUser_Id(userid);
		
	}


}
