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
import com.example.demo.model.Car;
import com.example.demo.model.CarInsurance;
import com.example.demo.repository.CarRepository;
import com.example.demo.repository.InsuranceRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/")
public class CarController {
	
	@Autowired
	private CarRepository carRepository;
	
	@Autowired
	private InsuranceRepository insuranceRepository;
	
	@GetMapping("/cars")
	public List<Car> getCars(@RequestParam(required=false) Long ownerId) {
		if(ownerId != null) {
			return carRepository.findByOwnerId(ownerId);
		} else {
			return carRepository.findAll();
		}
	}
	
	@PostMapping("/cars")
	public Car createCar(@RequestBody Car car) {
		return carRepository.save(car);
	}
	
	@GetMapping("/cars/{id}")
	public ResponseEntity<Car> getCarById(@PathVariable Long id) {
		Car car = carRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Car does not exist with id: " + id));
		return ResponseEntity.ok(car);
	}
	
	@PutMapping("/cars/{id}")
	public ResponseEntity<Car> updateCar(@PathVariable Long id, @RequestBody Car carDetails) {
		Car car = carRepository.findById(id)
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
		Car updatedCar = carRepository.save(car);
		return ResponseEntity.ok(updatedCar);
	}
	
	@DeleteMapping("/cars/{id}")
	public ResponseEntity<String> deleteCar(@PathVariable Long id) {
		List<CarInsurance> insurances = insuranceRepository.findByCarId(id);
		for(CarInsurance i : insurances) {
			insuranceRepository.delete(i);
		}
		carRepository.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
