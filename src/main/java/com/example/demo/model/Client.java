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

@Entity
@Table(name = "clients")
public class Client {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@Column(name = "title")
	private String title;
	
	@Column(name = "first_name")
	private String firstName;
	
	@Column(name = "last_name")
	private String lastName;
	
	@Column(name = "identification_number")
	private String identificationNumber;
	
	@Column(name = "identification_card_number")
	private String identificationCardNumber;
	
	@Column(name = "identification_card_exp_date")
	private Date identificationCardExpDate;
	
	@Column(name = "phone_number")
	private String phoneNumber;
	
	@Column(name = "email_address")
	private String emailAddress;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "permanent_residence_id", referencedColumnName="id")
	private Address permanentResidenceAddress;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "correspondence_address_id", referencedColumnName="id")
	private Address correspondenceAddress;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "casual_address_id", referencedColumnName="id")
	private Address casualAddress;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "owner")
	private List<Vehicle> vehicles;
	
	@OneToOne(optional=false)
	@JoinColumn(name = "group_id", referencedColumnName="id", insertable=false, updatable=false)
	private ClientGroup clientGroup;

	@Column(name = "group_id")
	private Long groupId;
	
	public Client() {
		
	}
	
	public Client(String title, String firstName, String lastName, String emailAddress) {
		super();
		this.title = title;
		this.firstName = firstName;
		this.lastName = lastName;
		this.emailAddress = emailAddress;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getIdentificationNumber() {
		return identificationNumber;
	}

	public void setIdentificationNumber(String identificationNumber) {
		this.identificationNumber = identificationNumber;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public Address getPermanentResidenceAddress() {
		return permanentResidenceAddress;
	}

	public void setPermanentResidenceAddress(Address permanentResidenceAddress) {
		this.permanentResidenceAddress = permanentResidenceAddress;
	}

	public Address getCorrespondenceAddress() {
		return correspondenceAddress;
	}

	public void setCorrespondenceAddress(Address correspondenceAddress) {
		this.correspondenceAddress = correspondenceAddress;
	}

	public Address getCasualAddress() {
		return casualAddress;
	}

	public void setCasualAddress(Address casualAddress) {
		this.casualAddress = casualAddress;
	}

	public String getIdentificationCardNumber() {
		return identificationCardNumber;
	}

	public void setIdentificationCardNumber(String identificationCardNumber) {
		this.identificationCardNumber = identificationCardNumber;
	}

	public Date getIdentificationCardExpDate() {
		return identificationCardExpDate;
	}

	public void setIdentificationCardExpDate(Date identificationCardExpDate) {
		this.identificationCardExpDate = identificationCardExpDate;
	}

	public List<Vehicle> getVehicles() {
		return vehicles;
	}

	public void setVehicles(List<Vehicle> vehicles) {
		this.vehicles = vehicles;
	}

	public Long getGroupId() {
		return groupId;
	}

	public void setGroupId(Long groupId) {
		this.groupId = groupId;
	}
	
	public String getGroupName() {
		return clientGroup == null ? null : clientGroup.getName();
	}
}
