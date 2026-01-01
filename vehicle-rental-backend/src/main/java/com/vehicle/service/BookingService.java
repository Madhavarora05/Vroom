package com.vehicle.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vehicle.dto.BookingRequest;
import com.vehicle.model.Booking;
import com.vehicle.model.CarUnit;
import com.vehicle.model.User;
import com.vehicle.repository.BookingRepository;
import com.vehicle.repository.CarUnitRepository;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private CarUnitRepository carUnitRepository;
    
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
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
    
    private boolean isUnitAvailable(Long carUnitId, LocalDate startDate, LocalDate endDate) {
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
            carUnitId, startDate, endDate
        );
        return conflictingBookings.isEmpty();
    }
    
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    
    public void cancelBooking(Long bookingId, Long userId) {
        Booking booking = getBookingById(bookingId);
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }
        bookingRepository.delete(booking);
    }
}
