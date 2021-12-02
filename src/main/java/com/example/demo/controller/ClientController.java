package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Client;
import com.example.demo.model.ClientGroup;
import com.example.demo.repository.ClientGroupRepository;
import com.example.demo.repository.ClientRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/")
public class ClientController {

	@Autowired
	private ClientRepository clientRepository;
	
	@Autowired
	private ClientGroupRepository clientGroupRepository;
	
	private final Logger LOGGER = LoggerFactory.getLogger(ClientController.class); 
	
	@GetMapping("/clients")
	public List<Client> getAllClients() {
		return clientRepository.findAllByOrderByLastNameAsc();
	}
	
	@GetMapping("/clients/noGroup")
	public List<Client> getClientsWithoutGroup() {
		return clientRepository.findByGroupIdIsNullOrderByLastNameAsc();
	}
	
	@PostMapping("/clients")
	public Client createClient(@RequestBody Client client) {
		return clientRepository.save(client);
	}
	
	@GetMapping("/clients/{id}")
	public ResponseEntity<Client> getClientById(@PathVariable Long id) {
		Client client = clientRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Client not exist with id: " + id));
		return ResponseEntity.ok(client);
	}
	
	@PutMapping("/clients/{id}")
	public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client clientDetails) {
		Client client = clientRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Client does not exist with id: " + id));
		client.setTitle(clientDetails.getTitle());
		client.setFirstName(clientDetails.getFirstName());
		client.setLastName(clientDetails.getLastName());
		client.setIdentificationNumber(clientDetails.getIdentificationNumber());
		client.setIdentificationCardNumber(clientDetails.getIdentificationCardNumber());
		client.setIdentificationCardExpDate(clientDetails.getIdentificationCardExpDate());
		client.setPhoneNumber(clientDetails.getPhoneNumber());
		client.setEmailAddress(clientDetails.getEmailAddress());
		client.setPermanentResidenceAddress(clientDetails.getPermanentResidenceAddress());
		client.setCorrespondenceAddress(clientDetails.getCorrespondenceAddress());
		client.setCasualAddress(clientDetails.getCasualAddress());
		Client updatedClient = clientRepository.save(client);
		return ResponseEntity.ok(updatedClient);
	}
	
	// CLIENT GROUPS
	@GetMapping("/clientGroups")
	public List<ClientGroup> getClientGroups() {
		return clientGroupRepository.findAll();
	}
	
	@Transactional
	@PostMapping("/clientGroups")
	public ClientGroup createClientGroup(@RequestBody ClientGroup clientGroup) {
		ClientGroup newClientGroup = clientGroupRepository.save(clientGroup);
		for(Client client : clientGroup.getClients()) {
			Client c = clientRepository.getById(client.getId());
			c.setGroupId(newClientGroup.getId());
		}
		return newClientGroup;
	}
	
	@Transactional
	@DeleteMapping("/clientGroups/{id}")
	public ResponseEntity<String> deleteClientGroup(@PathVariable Long id) {
		ClientGroup clientGroup = clientGroupRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Client group does not exist with id: " + id));
		for(Client client : clientGroup.getClients()) {
			client.setGroupId(null);
		}
		clientGroupRepository.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
