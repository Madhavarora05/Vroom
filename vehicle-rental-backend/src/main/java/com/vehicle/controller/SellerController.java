package com.vehicle.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vehicle.model.Booking;
import com.vehicle.model.CarModel;
import com.vehicle.model.CarUnit;
import com.vehicle.model.User;
import com.vehicle.service.SellerService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/seller")
@CrossOrigin(origins = "http://localhost:3000")
public class SellerController {
    
    @Autowired
    private SellerService sellerService;
    
    @GetMapping("/my-vehicles")
    public ResponseEntity<?> getSellerVehicles(HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null || !"seller".equals(user.getRole())) {
                return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
            }
            
            List<CarModel> vehicles = sellerService.getSellerVehicles(user.getId());
            return ResponseEntity.ok(vehicles);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/my-bookings")
    public ResponseEntity<?> getSellerBookings(HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null || !"seller".equals(user.getRole())) {
                return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
            }
            
            List<Booking> bookings = sellerService.getSellerBookings(user.getId());
            return ResponseEntity.ok(bookings);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/vehicles")
    public ResponseEntity<?> addVehicle(@RequestBody CarModel carModel, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null || !"seller".equals(user.getRole())) {
                return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
            }
            
            System.out.println("Seller adding vehicle: " + carModel.getName() + ", Type: " + carModel.getType() + ", Rate: " + carModel.getPerDayRate());
            CarModel savedVehicle = sellerService.addVehicle(carModel, user.getId());
            return ResponseEntity.ok(savedVehicle);
        } catch (RuntimeException e) {
            System.err.println("Error adding vehicle: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    @PostMapping("/vehicles/units")
    public ResponseEntity<?> addVehicleUnit(@RequestBody Map<String, Object> unitData, HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null || !"seller".equals(user.getRole())) {
                return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
            }
            
            Long carModelId = Long.valueOf(unitData.get("carModelId").toString());
            String numberPlate = (String) unitData.get("numberPlate");
            
            CarUnit savedUnit = sellerService.addVehicleUnit(carModelId, numberPlate, user.getId());
            return ResponseEntity.ok(savedUnit);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}