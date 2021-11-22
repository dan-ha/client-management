package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Client;


public interface ClientRepository extends JpaRepository<Client, Long>{

	public List<Client> findAllByOrderByLastName();
	
}
