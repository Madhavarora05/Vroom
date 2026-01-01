package com.vehicle.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.vehicle.model.Booking;
import com.vehicle.model.CarModel;
import com.vehicle.model.CarUnit;
import com.vehicle.model.User;
import com.vehicle.service.AdminService;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private AdminService adminService;

    // Check if user is admin (middleware-like function)
    private boolean isAdmin(HttpSession session) {
        User user = (User) session.getAttribute("user");
        return user != null && "admin".equals(user.getRole());
    }

    // ===== USER MANAGEMENT ENDPOINTS =====
    
    // Get all pending sellers for approval
    @GetMapping("/pending-sellers")
    public ResponseEntity<List<User>> getPendingSellers(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        List<User> pendingSellers = adminService.getPendingSellers();
        // Remove passwords from response
        pendingSellers.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(pendingSellers);
    }
    
    // Get all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        List<User> users = adminService.getAllUsers();
        // Remove passwords from response
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(users);
    }
    
    // Get all active sellers
    @GetMapping("/active-sellers")
    public ResponseEntity<List<User>> getActiveSellers(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        List<User> activeSellers = adminService.getActiveSellers();
        // Remove passwords from response
        activeSellers.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(activeSellers);
    }
    
    // Approve seller account
    @PutMapping("/approve-seller/{userId}")
    public ResponseEntity<Map<String, Object>> approveSeller(@PathVariable Long userId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            User approvedUser = adminService.approveSeller(userId);
            approvedUser.setPassword(null); // Don't expose password
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Seller approved successfully");
            response.put("user", approvedUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to approve seller: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Reject seller account
    @PutMapping("/reject-seller/{userId}")
    public ResponseEntity<Map<String, Object>> rejectSeller(@PathVariable Long userId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            User rejectedUser = adminService.rejectSeller(userId);
            rejectedUser.setPassword(null); // Don't expose password
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Seller rejected successfully");
            response.put("user", rejectedUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to reject seller: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // Toggle user status (suspend/activate)
    @PutMapping("/toggle-user-status/{userId}")
    public ResponseEntity<Map<String, Object>> toggleUserStatus(@PathVariable Long userId, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            User updatedUser = adminService.toggleUserStatus(userId);
            updatedUser.setPassword(null); // Don't expose password
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User status updated successfully");
            response.put("user", updatedUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to update user status: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // ===== CAR MODEL MANAGEMENT ENDPOINTS =====
    
    // Get all car models
        @GetMapping("/car-models")
    public ResponseEntity<List<CarModel>> getAllCarModels(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        List<CarModel> carModels = adminService.getAllCarModels();
        return ResponseEntity.ok(carModels);
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        List<Booking> bookings = adminService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    // Get car model by ID
    @GetMapping("/car-models/{id}")
    public ResponseEntity<CarModel> getCarModelById(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            CarModel model = adminService.getCarModelById(id);
            return ResponseEntity.ok(model);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Add a new CarModel
    @PostMapping("/car-models")
    public ResponseEntity<?> addCarModel(@RequestBody CarModel model, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        
        try {
            System.out.println("Received car model: " + model.getName() + ", Type: " + model.getType() + ", Rate: " + model.getPerDayRate());
            CarModel savedModel = adminService.addCarModel(model);
            return ResponseEntity.ok(savedModel);
        } catch (Exception e) {
            System.err.println("Error adding car model: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    // Update car model
    @PutMapping("/car-models/{id}")
    public ResponseEntity<CarModel> updateCarModel(@PathVariable Long id, @RequestBody CarModel model, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            model.setId(id);
            CarModel updatedModel = adminService.updateCarModel(model);
            return ResponseEntity.ok(updatedModel);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    // Delete car model
    @DeleteMapping("/car-models/{id}")
    public ResponseEntity<Map<String, String>> deleteCarModel(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            adminService.deleteCarModel(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Car model deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to delete car model: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // ===== CAR UNIT MANAGEMENT ENDPOINTS =====
    
    // Get all CarUnits
    @GetMapping("/car-units")
    public ResponseEntity<List<CarUnit>> getAllCarUnits(HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(adminService.getAllCarUnits());
    }
    
    // Get car unit by ID
    @GetMapping("/car-units/{id}")
    public ResponseEntity<CarUnit> getCarUnitById(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            CarUnit unit = adminService.getCarUnitById(id);
            return ResponseEntity.ok(unit);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Add a new CarUnit
    @PostMapping("/car-units")
    public ResponseEntity<CarUnit> addCarUnit(@RequestBody CarUnit unit, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            CarUnit savedUnit = adminService.addCarUnit(unit);
            return ResponseEntity.ok(savedUnit);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    // Update car unit
    @PutMapping("/car-units/{id}")
    public ResponseEntity<CarUnit> updateCarUnit(@PathVariable Long id, @RequestBody CarUnit unit, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            unit.setId(id);
            CarUnit updatedUnit = adminService.updateCarUnit(unit);
            return ResponseEntity.ok(updatedUnit);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    // Toggle availability of a unit
    @PutMapping("/car-units/{id}/availability")
    public ResponseEntity<CarUnit> updateAvailability(@PathVariable Long id, @RequestParam boolean available, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            CarUnit updatedUnit = adminService.updateAvailability(id, available);
            return ResponseEntity.ok(updatedUnit);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    // Delete a CarUnit
    @DeleteMapping("/car-units/{id}")
    public ResponseEntity<Map<String, String>> deleteCarUnit(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            adminService.deleteCarUnit(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Car unit deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Failed to delete car unit: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // ===== PUBLIC ENDPOINTS (No Authentication Required) =====
    
    // Get all car models for public viewing
    @GetMapping("/public/car-models")
    public ResponseEntity<List<CarModel>> getPublicCarModels() {
        try {
            List<CarModel> carModels = adminService.getAllCarModels();
            return ResponseEntity.ok(carModels);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}