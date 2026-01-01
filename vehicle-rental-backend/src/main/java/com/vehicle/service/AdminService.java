package com.vehicle.service;

import com.vehicle.model.Booking;
import com.vehicle.model.CarModel;
import com.vehicle.model.CarUnit;
import com.vehicle.model.User;
import com.vehicle.repository.BookingRepository;
import com.vehicle.repository.CarModelRepository;
import com.vehicle.repository.CarUnitRepository;
import com.vehicle.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    
    @Autowired
    private CarModelRepository carModelRepository;
    
    @Autowired
    private CarUnitRepository carUnitRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookingRepository bookingRepository;

    // ===== USER MANAGEMENT =====
    
    // Get all pending sellers
    public List<User> getPendingSellers() {
        return userRepository.findByRoleAndStatus("seller", "pending");
    }
    
    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Get all active sellers
    public List<User> getActiveSellers() {
        return userRepository.findByRoleAndStatus("seller", "active");
    }
    
    // Approve seller account
    public User approveSeller(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if ("seller".equals(user.getRole()) && "pending".equals(user.getStatus())) {
                user.setStatus("active");
                return userRepository.save(user);
            } else {
                throw new RuntimeException("User is not a pending seller");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }
    
    // Reject seller account
    public User rejectSeller(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if ("seller".equals(user.getRole()) && "pending".equals(user.getStatus())) {
                user.setStatus("rejected");
                return userRepository.save(user);
            } else {
                throw new RuntimeException("User is not a pending seller");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }
    
    // Suspend/Activate user
    public User toggleUserStatus(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if ("active".equals(user.getStatus())) {
                user.setStatus("suspended");
            } else if ("suspended".equals(user.getStatus())) {
                user.setStatus("active");
            }
            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    // ===== CAR MODEL MANAGEMENT =====
    
    // Get all CarModels
    public List<CarModel> getAllCarModels() {
        return carModelRepository.findAll();
    }
    
    // Get car model by ID
    public CarModel getCarModelById(Long id) {
        return carModelRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Car model not found with id: " + id));
    }
    
    // Add a new CarModel
    public CarModel addCarModel(CarModel model) {
        // If no sellerId is provided, set it to null (admin-added cars)
        if (model.getSellerId() == null) {
            model.setSellerId(null);
        }
        return carModelRepository.save(model);
    }
    
    // Update car model
    public CarModel updateCarModel(CarModel model) {
        if (!carModelRepository.existsById(model.getId())) {
            throw new RuntimeException("Car model not found with id: " + model.getId());
        }
        return carModelRepository.save(model);
    }
    
    // Delete car model
    public void deleteCarModel(Long id) {
        if (!carModelRepository.existsById(id)) {
            throw new RuntimeException("Car model not found with id: " + id);
        }
        // Check if there are any car units using this model
        List<CarUnit> unitsUsingModel = carUnitRepository.findByCarModelId(id);
        if (!unitsUsingModel.isEmpty()) {
            throw new RuntimeException("Cannot delete car model. There are " + unitsUsingModel.size() + " car units using this model.");
        }
        carModelRepository.deleteById(id);
    }

    // ===== CAR UNIT MANAGEMENT =====
    
    // Get all CarUnits
    public List<CarUnit> getAllCarUnits() {
        return carUnitRepository.findAll();
    }
    
    // Get car unit by ID
    public CarUnit getCarUnitById(Long id) {
        return carUnitRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Car unit not found with id: " + id));
    }
    
    // Add a new CarUnit
    public CarUnit addCarUnit(CarUnit unit) {
        // Set available to true by default for new units
        if (unit.getId() == null) {
            unit.setAvailable(true);
        }
        
        // Validate that the car model exists
        if (unit.getCarModel() != null && unit.getCarModel().getId() != null) {
            CarModel carModel = carModelRepository.findById(unit.getCarModel().getId())
                .orElseThrow(() -> new RuntimeException("Car model not found with id: " + unit.getCarModel().getId()));
            unit.setCarModel(carModel);
        } else {
            throw new RuntimeException("Car model is required");
        }
        
        return carUnitRepository.save(unit);
    }
    
    // Update car unit
    public CarUnit updateCarUnit(CarUnit unit) {
        if (!carUnitRepository.existsById(unit.getId())) {
            throw new RuntimeException("Car unit not found with id: " + unit.getId());
        }
        
        // Validate that the car model exists
        if (unit.getCarModel() != null && unit.getCarModel().getId() != null) {
            CarModel carModel = carModelRepository.findById(unit.getCarModel().getId())
                .orElseThrow(() -> new RuntimeException("Car model not found with id: " + unit.getCarModel().getId()));
            unit.setCarModel(carModel);
        }
        
        return carUnitRepository.save(unit);
    }
    
    // Toggle availability
    public CarUnit updateAvailability(Long unitId, boolean available) {
        CarUnit unit = carUnitRepository.findById(unitId)
            .orElseThrow(() -> new RuntimeException("Car unit not found"));
        unit.setAvailable(available);
        return carUnitRepository.save(unit);
    }
    
    // Delete a CarUnit
    public void deleteCarUnit(Long unitId) {
        if (!carUnitRepository.existsById(unitId)) {
            throw new RuntimeException("Car unit not found with id: " + unitId);
        }
        carUnitRepository.deleteById(unitId);
    }
    
    // ===== BOOKING MANAGEMENT =====
    
    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}