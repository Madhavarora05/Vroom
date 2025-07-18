package com.vehicle.controller;

import com.vehicle.model.CarModel;
import com.vehicle.model.CarUnit;
import com.vehicle.model.User;
import com.vehicle.repository.BookingRepository;
import com.vehicle.repository.CarModelRepository;
import com.vehicle.repository.CarUnitRepository;
import com.vehicle.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
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
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ Get all car models
    @GetMapping("/car-models")
    public List<CarModel> getAllCarModels() {
        return carModelRepository.findAll();
    }

    // ✅ Get available car units for a model between two times
    @GetMapping("/available-units")
    public List<CarUnit> getAvailableUnits(
            @RequestParam Long modelId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end
    ) {
        List<Long> bookedUnitIds = bookingRepository.findBookedUnitIdsBetween(start, end);
        if (bookedUnitIds.isEmpty()) {
            return carUnitRepository.findByCarModelIdAndAvailableTrue(modelId);
        } else {
            return carUnitRepository.findByCarModelIdAndIdNotInAndAvailableTrue(modelId, bookedUnitIds);
        }
    }
}
