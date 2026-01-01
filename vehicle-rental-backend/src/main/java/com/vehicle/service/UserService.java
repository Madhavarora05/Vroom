package com.vehicle.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.vehicle.dto.BookingRequest;
import com.vehicle.model.Booking;
import com.vehicle.model.CarModel;
import com.vehicle.model.CarUnit;
import com.vehicle.model.User;
import com.vehicle.repository.BookingRepository;
import com.vehicle.repository.CarModelRepository;
import com.vehicle.repository.CarUnitRepository;
import com.vehicle.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CarModelRepository carModelRepository;

    @Autowired
    private CarUnitRepository carUnitRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    public Optional<User> authenticateUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return user;
        }
        throw new RuntimeException("Invalid credentials");
    }

    public List<CarModel> getAllCarModels() {
        return carModelRepository.findAll();
    }

    public List<CarUnit> getAvailableUnits(Long carModelId, LocalDate startDate, LocalDate endDate) {
        List<CarUnit> allUnits = carUnitRepository.findByCarModelIdAndAvailable(carModelId, true);
        
        return allUnits.stream()
            .filter(unit -> isUnitAvailable(unit.getId(), startDate, endDate))
            .collect(Collectors.toList());
    }

    private boolean isUnitAvailable(Long carUnitId, LocalDate startDate, LocalDate endDate) {
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
            carUnitId, startDate, endDate
        );
        return conflictingBookings.isEmpty();
    }

    public Booking createBooking(User user, BookingRequest request) {
        CarUnit carUnit = carUnitRepository.findById(request.getCarUnitId())
            .orElseThrow(() -> new RuntimeException("Car unit not found"));

        if (!isUnitAvailable(request.getCarUnitId(), request.getStartDate(), request.getEndDate())) {
            throw new RuntimeException("Car unit is not available for the selected dates");
        }

        // Calculate total cost (daily rate * number of days)
        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (days <= 0) {
            days = 1; // Minimum 1 day
        }
        double totalCost = carUnit.getCarModel().getPerDayRate() * days;

        Booking booking = new Booking(user, carUnit, request.getStartDate(), request.getEndDate(), totalCost);
        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
