package com.inxelo.flightsapp.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
public class Flight {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private int IDFlight;

   @Column(name = "FlightNumber")
   private String FlightNumber;

   @Column(name = "DepartureTime")
   private LocalDateTime DepartureTime;

   @Column(name = "ArrivalTime")
   private LocalDateTime ArrivalTime;

   @Column(name = "AircraftType")
   private String AircraftType;

   @Column(name = "AircraftRegistration")
   private String AircraftRegistration;

   public int getIDFlight() {
      return IDFlight;
   }

   public void setIDFlight(int IDFlight) {
      this.IDFlight = IDFlight;
   }

   public String getFlightNumber() {
      return FlightNumber;
   }

   public void setFlightNumber(String flightNumber) {
      FlightNumber = flightNumber;
   }

   public LocalDateTime getDepartureTime() {
      return DepartureTime;
   }

   public void setDepartureTime(LocalDateTime departureTime) {
      DepartureTime = departureTime;
   }

   public LocalDateTime getArrivalTime() {
      return ArrivalTime;
   }

   public void setArrivalTime(LocalDateTime arrivalTime) {
      ArrivalTime = arrivalTime;
   }

   public String getAircraftType() {
      return AircraftType;
   }

   public void setAircraftType(String aircraftType) {
      AircraftType = aircraftType;
   }

   public String getAircraftRegistration() {
      return AircraftRegistration;
   }

   public void setAircraftRegistration(String aircraftRegistration) {
      AircraftRegistration = aircraftRegistration;
   }
}
