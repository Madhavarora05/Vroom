package com.vehicle.controller;

import com.vehicle.model.Booking;
import com.vehicle.model.CarUnit;
import com.vehicle.model.User;
import com.vehicle.service.BookingService;
import com.vehicle.service.CarUnitService;
import com.vehicle.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private CarUnitService carUnitService;

    @Autowired
    private UserService userService;

    // ✅ Create a booking
    @PostMapping
    public Booking createBooking(@RequestParam Long userId,
                                 @RequestParam Long carUnitId,
                                 @RequestParam String startDateTime,
                                 @RequestParam String endDateTime,
                                 @RequestParam String rentalType) {
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CarUnit unit = carUnitService.getById(carUnitId)
                .orElseThrow(() -> new RuntimeException("Car unit not found"));

        LocalDateTime start = LocalDateTime.parse(startDateTime);
        LocalDateTime end = LocalDateTime.parse(endDateTime);

        return bookingService.createBooking(user, unit, start, end, rentalType);
    }

    // ✅ Get all bookings for a user
    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        return bookingService.getUserBookings(userId);
    }
    @PutMapping("/{bookingId}/return")
    public Booking returnBooking(@PathVariable Long bookingId) {
        return bookingService.returnBooking(bookingId, LocalDateTime.now());
    }
}
