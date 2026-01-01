package com.vehicle.dto;

import java.time.LocalDate;

public class BookingRequest {
    private Long userId;
    private Long carUnitId;
    private LocalDate startDate;
    private LocalDate endDate;

    // Default constructor
    public BookingRequest() {}

    // Constructor with parameters
    public BookingRequest(Long userId, Long carUnitId, LocalDate startDate, LocalDate endDate) {
        this.userId = userId;
        this.carUnitId = carUnitId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCarUnitId() {
        return carUnitId;
    }

    public void setCarUnitId(Long carUnitId) {
        this.carUnitId = carUnitId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
