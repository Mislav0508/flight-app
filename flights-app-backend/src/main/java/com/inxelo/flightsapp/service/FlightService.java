package com.inxelo.flightsapp.service;

import com.inxelo.flightsapp.model.Flight;
import com.inxelo.flightsapp.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightService {

   @Autowired
   private FlightRepository flightRepository;

   public List<Flight> getAllFlights() {
      return flightRepository.findAll();
   }

   public Flight getFlightById(int id) {
      return flightRepository.findById(id).orElse(null);
   }

   public Flight createFlight(Flight flight) {
      return flightRepository.save(flight);
   }

   public Flight updateFlight(Flight flight) {
      return flightRepository.save(flight);
   }

   public void deleteFlight(int id) {
      flightRepository.deleteById(id);
   }
}
