package com.inxelo.flightsapp.controller;

import com.inxelo.flightsapp.model.Flight;
import com.inxelo.flightsapp.service.FlightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:3000")
public class FlightController {

   @Autowired
   private FlightService flightService;

   @GetMapping
   public List<Flight> getAllFlights() {
      return flightService.getAllFlights();
   }

   @GetMapping("/{id}")
   public Flight getFlightById(@PathVariable int id) {
      return flightService.getFlightById(id);
   }

   @PostMapping
   public Flight createFlight(@RequestBody Flight flight) {
      return flightService.createFlight(flight);
   }

   @PutMapping("/{id}")
   public Flight updateFlight(@PathVariable int id, @RequestBody Flight flight) {
      flight.setIDFlight(id);
      return flightService.updateFlight(flight);
   }

   @DeleteMapping("/{id}")
   public void deleteFlight(@PathVariable int id) {
      flightService.deleteFlight(id);
   }
}
