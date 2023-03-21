package com.inxelo.flightsapp.repository;

import com.inxelo.flightsapp.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlightRepository extends JpaRepository<Flight, Integer> {


}
