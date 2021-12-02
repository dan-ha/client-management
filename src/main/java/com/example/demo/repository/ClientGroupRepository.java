package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.ClientGroup;

public interface ClientGroupRepository extends JpaRepository<ClientGroup, Long>{
	
}
