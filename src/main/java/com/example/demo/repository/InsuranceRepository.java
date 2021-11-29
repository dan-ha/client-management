package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.VehicleInsurance;

public interface InsuranceRepository extends JpaRepository<VehicleInsurance, Long> {

	List<VehicleInsurance> findByTypeAndVehicleId(String type, Long vehicleId);
	
	List<VehicleInsurance> findByVehicleId(Long vehicleId);
	
}
