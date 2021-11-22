package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.CarInsurance;

public interface InsuranceRepository extends JpaRepository<CarInsurance, Long> {

	List<CarInsurance> findByTypeAndCarId(String type, Long carId);
	
	List<CarInsurance> findByCarId(Long carId);
	
}
