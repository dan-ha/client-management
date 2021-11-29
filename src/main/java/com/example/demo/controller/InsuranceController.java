package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Vehicle;
import com.example.demo.model.VehicleInsurance;
import com.example.demo.repository.VehicleRepository;
import com.example.demo.repository.InsuranceRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class InsuranceController {

	@Autowired
	private InsuranceRepository insuranceRepository;
	
	@GetMapping("/insurances")
	public List<VehicleInsurance> getInsurances(
			@RequestParam(required=false) String type,
			@RequestParam(required=false) Long vehicleId) {
		if(vehicleId != null) {
			return insuranceRepository.findByTypeAndVehicleId(type, vehicleId);
		} else {
			return insuranceRepository.findAll();
		}
	}
	
	@PostMapping("/insurances")
	public VehicleInsurance createVehicleInsurance(@RequestBody VehicleInsurance vehicleInsurance) {
		VehicleInsurance newVehicleInsurance = insuranceRepository.save(vehicleInsurance);
		return newVehicleInsurance;
	}
	
	@PutMapping("/insurances/{id}")
	public ResponseEntity<VehicleInsurance> updateVehicleInsurance(@PathVariable Long id, @RequestBody VehicleInsurance vehicleInsuranceDetails) {
		VehicleInsurance vehicleInsurance = insuranceRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Vehicle insurance does not exist with id: " + id));
		vehicleInsurance.setCompanyName(vehicleInsuranceDetails.getCompanyName());
		vehicleInsurance.setProposalNumber(vehicleInsuranceDetails.getProposalNumber());
		vehicleInsurance.setContractNumber(vehicleInsuranceDetails.getContractNumber());
		vehicleInsurance.setValidFrom(vehicleInsuranceDetails.getValidFrom());
		vehicleInsurance.setValidUntil(vehicleInsuranceDetails.getValidUntil());
		vehicleInsurance.setVehicleValue(vehicleInsuranceDetails.getVehicleValue());
		vehicleInsurance.setValueCoverage(vehicleInsuranceDetails.getValueCoverage());
		vehicleInsurance.setDistanceDriven(vehicleInsuranceDetails.getDistanceDriven());
		vehicleInsurance.setPrice(vehicleInsuranceDetails.getPrice());
		vehicleInsurance.setInterval(vehicleInsuranceDetails.getInterval());	
		vehicleInsurance.setNotes(vehicleInsuranceDetails.getNotes());
		VehicleInsurance updatedVehicleInsurance = insuranceRepository.save(vehicleInsurance);
		return ResponseEntity.ok(updatedVehicleInsurance);
	}
	
	@DeleteMapping("/insurances/{id}")
	public ResponseEntity<String> deleteInsurance(@PathVariable Long id) {
		insuranceRepository.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
