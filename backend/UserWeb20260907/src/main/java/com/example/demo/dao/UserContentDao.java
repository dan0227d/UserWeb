package com.example.demo.dao;

import java.util.Optional;

import com.example.demo.model.UserContent;

public interface UserContentDao {

	Optional<UserContent> findByUser_Id(Integer id);
	UserContent save(UserContent userContent);
	UserContent update(UserContent userContent);
	void deleteByUser_Id(Integer userid);
}
