package com.vehicle.controller;

import com.vehicle.model.CarModel;
import com.vehicle.model.CarUnit;
import com.vehicle.model.User;
import com.vehicle.repository.BookingRepository;
import com.vehicle.repository.CarModelRepository;
import com.vehicle.repository.CarUnitRepository;
import com.vehicle.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private CarModelRepository carModelRepository;
    
    @Autowired
    private CarUnitRepository carUnitRepository;
    
    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            // Don't expose password in response
            savedUser.setPassword(null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("user", savedUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User loginData, HttpSession session) {
        try {
            Optional<User> userOpt = userService.authenticateUser(loginData.getEmail(), loginData.getPassword());
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                // Don't expose password
                user.setPassword(null);
                
                // Store user in session
                session.setAttribute("user", user);
                session.setAttribute("userId", user.getId());
                session.setAttribute("userEmail", user.getEmail());
                
                Map<String, Object> response = new HashMap<>();
                response.put("user", user);
                response.put("message", "Login successful");
                response.put("sessionId", session.getId());
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid credentials");
                return ResponseEntity.status(401).body(errorResponse);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        try {
            // Invalidate the session
            session.invalidate();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Logged out successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Logout failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(HttpSession session) {
        User user = (User) session.getAttribute("user");
        
        if (user == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Not authenticated");
            return ResponseEntity.status(401).body(errorResponse);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id, HttpSession session) {
        // Check if user is authenticated
        Long sessionUserId = (Long) session.getAttribute("userId");
        if (sessionUserId == null) {
            return ResponseEntity.status(401).build();
        }
        
        return userService.getUserById(id)
                .map(user -> {
                    user.setPassword(null); // Don't expose password
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Get all car models (protected route)
    @GetMapping("/car-models")
    public ResponseEntity<List<CarModel>> getAllCarModels(HttpSession session) {
        // Check authentication
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).build();
        }
        
        return ResponseEntity.ok(carModelRepository.findAll());
    }

    // ✅ Get available car units for a model between two times (protected route)
    @GetMapping("/available-units")
    public ResponseEntity<List<CarUnit>> getAvailableUnits(
            @RequestParam Long modelId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end,
            HttpSession session
    ) {
        // Check authentication
        if (session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).build();
        }
        
        List<Long> bookedUnitIds = bookingRepository.findBookedUnitIdsBetween(start, end);
        List<CarUnit> availableUnits;
        
        if (bookedUnitIds.isEmpty()) {
            availableUnits = carUnitRepository.findByCarModelIdAndAvailableTrue(modelId);
        } else {
            availableUnits = carUnitRepository.findByCarModelIdAndIdNotInAndAvailableTrue(modelId, bookedUnitIds);
        }
        
        return ResponseEntity.ok(availableUnits);
    }
}