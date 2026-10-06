package com.example.demo.mapper;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.model.UserContent;

@Mapper
public interface UserContentMyBatisMapper {

	Optional<UserContent> findByUserId(Integer id);
	int save(UserContent userContent);
	int update(UserContent userContent);
	void deleteByUserId(Integer id);
}
