package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Car;
import com.example.demo.model.CarInsurance;
import com.example.demo.repository.CarRepository;
import com.example.demo.repository.InsuranceRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class InsuranceController {

	@Autowired
	private InsuranceRepository insuranceRepository;
	
	@GetMapping("/insurances")
	public List<CarInsurance> getInsurances(
			@RequestParam(required=false) String type,
			@RequestParam(required=false) Long carId) {
		if(carId != null) {
			return insuranceRepository.findByTypeAndCarId(type, carId);
		} else {
			return insuranceRepository.findAll();
		}
	}
	
	@PostMapping("/insurances")
	public CarInsurance createCarInsurance(@RequestBody CarInsurance carInsurance) {
		System.out.println("ID:" + carInsurance.getCar().getId());
		CarInsurance newCarInsurance = insuranceRepository.save(carInsurance);
		return newCarInsurance;
	}
	
	@PutMapping("/insurances/{id}")
	public ResponseEntity<CarInsurance> updateCarInsurance(@PathVariable Long id, @RequestBody CarInsurance carInsuranceDetails) {
		CarInsurance carInsurance = insuranceRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Car insurance does not exist with id: " + id));
		carInsurance.setCompanyName(carInsuranceDetails.getCompanyName());
		carInsurance.setProposalNumber(carInsuranceDetails.getProposalNumber());
		carInsurance.setContractNumber(carInsuranceDetails.getContractNumber());
		carInsurance.setValidFrom(carInsuranceDetails.getValidFrom());
		carInsurance.setValidUntil(carInsuranceDetails.getValidUntil());
		carInsurance.setVehicleValue(carInsuranceDetails.getVehicleValue());
		carInsurance.setDistanceDriven(carInsuranceDetails.getDistanceDriven());
		carInsurance.setPrice(carInsuranceDetails.getPrice());
		carInsurance.setInterval(carInsuranceDetails.getInterval());	
		carInsurance.setNotes(carInsuranceDetails.getNotes());
		CarInsurance updatedCarInsurance = insuranceRepository.save(carInsurance);
		return ResponseEntity.ok(updatedCarInsurance);
	}
	
}
