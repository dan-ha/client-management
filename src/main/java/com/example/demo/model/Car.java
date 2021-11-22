package com.example.demo.model;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "cars")
public class Car {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "brand")
	private String brand;
	
	@Column(name = "model")
	private String model;
	
	@Column(name = "license_plate_number")
	private String licensePlateNumber;
	
	@Column(name = "weight")
	private Integer weight;
	
	@Column(name = "color")
	private String color;

	@Column(name = "fuel")
	private String fuel;
	
	@Column(name = "date_made")
	private Date dateMade;
	
	@Column(name = "technical_card_no")
	private String technicalCardNo;
	
	@Column(name = "volume")
	private Float volume;
	
	@Column(name = "power")
	private Integer power;
	
	@Column(name = "type")
	private String type;
	
	@Column(name = "gear_box")
	private String gearBox;
	
	@Column(name = "vin")
	private String vin;
	
	@Column(name = "notes")
	private String notes;
	
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "owner_id", referencedColumnName="id")
	private Client owner;
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "car")
    private List<CarInsurance> insurances;
	
	public Car() {
		
	}
	
	public Car(String brand, String model) {
		this.brand = brand;
		this.model = model;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public String getLicensePlateNumber() {
		return licensePlateNumber;
	}

	public void setLicensePlateNumber(String licensePlateNumber) {
		this.licensePlateNumber = licensePlateNumber;
	}
	
	public Integer getWeight() {
		return weight;
	}

	public void setWeight(Integer weight) {
		this.weight = weight;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getFuel() {
		return fuel;
	}

	public void setFuel(String fuel) {
		this.fuel = fuel;
	}
	
	public Date getDateMade() {
		return dateMade;
	}

	public void setDateMade(Date dateMade) {
		this.dateMade = dateMade;
	}

	public String getTechnicalCardNo() {
		return technicalCardNo;
	}

	public void setTechnicalCardNo(String technicalCardNo) {
		this.technicalCardNo = technicalCardNo;
	}

	public Float getVolume() {
		return volume;
	}

	public void setVolume(Float volume) {
		this.volume = volume;
	}

	public Integer getPower() {
		return power;
	}

	public void setPower(Integer power) {
		this.power = power;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getGearBox() {
		return gearBox;
	}

	public void setGearBox(String gearBox) {
		this.gearBox = gearBox;
	}
	
	public String getVin() {
		return vin;
	}

	public void setVin(String vin) {
		this.vin = vin;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Client getOwner() {
		return owner;
	}

	public void setOwner(Client owner) {
		this.owner = owner;
	}

	public List<CarInsurance> getInsurances() {
		return insurances;
	}

	public void setInsurances(List<CarInsurance> insurances) {
		this.insurances = insurances;
	}
	
}
