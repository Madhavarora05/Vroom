package com.vehicle.service;

import com.vehicle.model.Booking;
import com.vehicle.model.CarUnit;
import com.vehicle.model.User;
import com.vehicle.repository.BookingRepository;
import com.vehicle.repository.CarUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarUnitRepository carUnitRepository;

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public boolean hasConflict(Long userId, LocalDateTime start, LocalDateTime end) {
        return !bookingRepository.findConflictingBookings(userId, start, end).isEmpty();
    }
    
    private double calculateRentalAmount(LocalDateTime start, LocalDateTime end, String rentalType, double perHourRate, double perDayRate) {
        long minutes = java.time.Duration.between(start, end).toMinutes();

        if (rentalType.equalsIgnoreCase("HOURLY")) {
            double hours = Math.ceil(minutes / 60.0); // round up to next hour
            return hours * perHourRate;
        } else if (rentalType.equalsIgnoreCase("DAILY")) {
            double days = Math.ceil(minutes / (24 * 60.0)); // round up to next day
            return days * perDayRate;
        } else {
            throw new IllegalArgumentException("Invalid rental type: " + rentalType);
        }
    }


    public Booking createBooking(User user, CarUnit unit, LocalDateTime start, LocalDateTime end, String rentalType) {
        if (hasConflict(user.getId(), start, end)) {
            throw new RuntimeException("You already have a booking during this time.");
        }

        unit.setAvailable(false); // mark the unit unavailable
        carUnitRepository.save(unit);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setCarUnit(unit);
        booking.setStartDateTime(start);
        booking.setEndDateTime(end);
        booking.setRentalType(rentalType.toUpperCase());
        booking.setStatus("BOOKED");

        // ✅ Calculate rental amount
        double rentalAmount = calculateRentalAmount(start, end, rentalType, unit.getCarModel().getPerHourRate(), unit.getCarModel().getPerDayRate());
        booking.setTotalAmount(rentalAmount);

        return bookingRepository.save(booking);
    }
    
    public Booking returnBooking(Long bookingId, LocalDateTime actualReturnTime) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getStatus().equals("BOOKED")) {
            throw new RuntimeException("Booking is not active");
        }

        booking.setActualReturnTime(actualReturnTime);
        double fine = calculateFine(booking, actualReturnTime);
        booking.setFine(fine);

        booking.setTotalAmount(booking.getTotalAmount() + fine);
        booking.setStatus("COMPLETED");

        // Mark the car available again
        CarUnit unit = booking.getCarUnit();
        unit.setAvailable(true);
        carUnitRepository.save(unit);

        return bookingRepository.save(booking);
    }
    
    private double calculateFine(Booking booking, LocalDateTime actualReturn) {
        LocalDateTime expected = booking.getEndDateTime();
        long delayMinutes = java.time.Duration.between(expected, actualReturn).toMinutes();

        if (delayMinutes <= 0) return 0; // Returned on time

        String rentalType = booking.getRentalType();
        double hourlyRate = booking.getCarUnit().getCarModel().getPerHourRate();

        if (rentalType.equalsIgnoreCase("HOURLY")) {
            if (delayMinutes <= 30) return 0;
            double halfHours = Math.ceil((delayMinutes - 30) / 30.0);
            return halfHours * hourlyRate; // Per half-hour fine
        } else if (rentalType.equalsIgnoreCase("DAILY")) {
            if (delayMinutes <= 120) return 0;
            double extraHours = Math.ceil((delayMinutes - 120) / 60.0);
            return extraHours * hourlyRate;
        } else {
            throw new IllegalArgumentException("Invalid rental type for fine: " + rentalType);
        }
    }



}
