package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Car;

public interface CarRepository extends JpaRepository<Car, Long> {

	List<Car> findByOwnerId(Long userId);
}