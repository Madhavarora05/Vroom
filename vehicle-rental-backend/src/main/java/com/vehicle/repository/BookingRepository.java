package com.vehicle.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vehicle.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.carUnit.id = :carUnitId " +
            "AND ((b.startDate BETWEEN :startDate AND :endDate) " +
            "OR (b.endDate BETWEEN :startDate AND :endDate) " +
            "OR (b.startDate <= :startDate AND b.endDate >= :endDate))")
    List<Booking> findConflictingBookings(@Param("carUnitId") Long carUnitId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("endDate") LocalDate endDate);

    @Query("SELECT b FROM Booking b JOIN FETCH b.carUnit cu JOIN FETCH cu.carModel cm " +
           "JOIN FETCH b.user u WHERE cm.sellerId = :sellerId ORDER BY b.createdAt DESC")
    List<Booking> findBySellerIdWithDetails(@Param("sellerId") Long sellerId);
}
