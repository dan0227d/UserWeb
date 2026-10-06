package com.example.demo.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.UserContent;

@Repository
public interface UserContentRepository extends JpaRepository<UserContent, Integer>{

	Optional<UserContent> findByUser_Id(Integer id);
	
	void deleteByUser_Id(Integer userid);
	
	
}
