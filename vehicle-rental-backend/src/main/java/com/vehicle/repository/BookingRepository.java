package com.vehicle.repository;

import com.vehicle.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    // Detect overlapping bookings by same user
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.status = 'BOOKED' " +
           "AND ((b.startDateTime < :end) AND (b.endDateTime > :start))")
    List<Booking> findConflictingBookings(Long userId, LocalDateTime start, LocalDateTime end);

    // Find all unit IDs that are booked during this time (for all users)
    @Query("SELECT b.carUnit.id FROM Booking b WHERE " +
           "(b.startDateTime < :end AND b.endDateTime > :start) AND b.status = 'BOOKED'")
    List<Long> findBookedUnitIdsBetween(LocalDateTime start, LocalDateTime end);
}
