package com.example.demo.model;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name="car_insurances")
public class CarInsurance {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name="type")
	private String type;
	
	@Column(name="company_name")
	private String companyName;
	
	@Column(name="proposal_number")
	private String proposalNumber;
	
	@Column(name="contract_number")
	private String contractNumber;
	
	@Column(name="valid_from")
	private Date validFrom;
	
	@Column(name="valid_until")
	private Date validUntil;
	
	@Column(name="vehicle_value")
	private Float vehicleValue;
	
	@Column(name="distance_driven")
	private Float distanceDriven;
	
	@Column(name="price")
	private Float price;
	
	@Column(name="interval2")
	private String interval;
	
	@Column(name="notes")
	private String notes;
	
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "car_id", referencedColumnName="id")
    private Car car; 
	
	public CarInsurance() {
	} 
	
	public CarInsurance(String companyName, String proposalNumber, String contractNumber) {
		this.companyName = companyName;
		this.proposalNumber = proposalNumber;
		this.contractNumber = contractNumber;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getProposalNumber() {
		return proposalNumber;
	}

	public void setProposalNumber(String proposalNumber) {
		this.proposalNumber = proposalNumber;
	}

	public String getContractNumber() {
		return contractNumber;
	}

	public void setContractNumber(String contractNumber) {
		this.contractNumber = contractNumber;
	}

	public Date getValidFrom() {
		return validFrom;
	}

	public void setValidFrom(Date validFrom) {
		this.validFrom = validFrom;
	}

	public Date getValidUntil() {
		return validUntil;
	}

	public void setValidUntil(Date validUntil) {
		this.validUntil = validUntil;
	}

	public Float getVehicleValue() {
		return vehicleValue;
	}

	public void setVehicleValue(Float vehicleValue) {
		this.vehicleValue = vehicleValue;
	}

	public Float getDistanceDriven() {
		return distanceDriven;
	}

	public void setDistanceDriven(Float distanceDriven) {
		this.distanceDriven = distanceDriven;
	}

	public Float getPrice() {
		return price;
	}

	public void setPrice(Float price) {
		this.price = price;
	}

	public String getInterval() {
		return interval;
	}

	public void setInterval(String interval) {
		this.interval = interval;
	}
	
	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Car getCar() {
		return car;
	}

	public void setCar(Car car) {
		this.car = car;
	}
	
}
