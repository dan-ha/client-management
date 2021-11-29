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
@RequestMapping("/api/v1/")
public class VehicleController {
	
	@Autowired
	private VehicleRepository vehicleRepository;
	
	@Autowired
	private InsuranceRepository insuranceRepository;
	
	@GetMapping("/vehicles")
	public List<Vehicle> getVehicles(@RequestParam(required=false) Long ownerId) {
		if(ownerId != null) {
			return vehicleRepository.findByOwnerId(ownerId);
		} else {
			return vehicleRepository.findAll();
		}
	}
	
	@PostMapping("/vehicles")
	public Vehicle createCar(@RequestBody Vehicle car) {
		return vehicleRepository.save(car);
	}
	
	@GetMapping("/vehicles/{id}")
	public ResponseEntity<Vehicle> getCarById(@PathVariable Long id) {
		Vehicle car = vehicleRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Car does not exist with id: " + id));
		return ResponseEntity.ok(car);
	}
	
	@PutMapping("/vehicles/{id}")
	public ResponseEntity<Vehicle> updateCar(@PathVariable Long id, @RequestBody Vehicle carDetails) {
		Vehicle car = vehicleRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Car does not exist with id: " + id));
		car.setBrand(carDetails.getBrand());
		car.setModel(carDetails.getModel());
		car.setLicensePlateNumber(carDetails.getLicensePlateNumber());
		car.setWeight(carDetails.getWeight());
		car.setColor(carDetails.getColor());
		car.setFuel(carDetails.getFuel());
		car.setDateMade(carDetails.getDateMade());
		car.setTechnicalCardNo(carDetails.getTechnicalCardNo());
		car.setVolume(carDetails.getVolume());
		car.setPower(carDetails.getPower());
		car.setType(carDetails.getType());
		car.setGearBox(carDetails.getGearBox());
		car.setVin(carDetails.getVin());
		car.setNotes(carDetails.getNotes());
		Vehicle updatedCar = vehicleRepository.save(car);
		return ResponseEntity.ok(updatedCar);
	}
	
	@DeleteMapping("/vehicles/{id}")
	public ResponseEntity<String> deleteVehicle(@PathVariable Long id) {
		List<VehicleInsurance> insurances = insuranceRepository.findByVehicleId(id);
		for(VehicleInsurance i : insurances) {
			insuranceRepository.delete(i);
		}
		vehicleRepository.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
