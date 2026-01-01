package com.vehicle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vehicle.model.CarModel;

public interface CarModelRepository extends JpaRepository<CarModel, Long> {
    
    List<CarModel> findByType(String type);
    
    List<CarModel> findByPerDayRateBetween(double minRate, double maxRate);
    
    List<CarModel> findByTypeAndPerDayRateBetween(String type, double minRate, double maxRate);
    
    List<CarModel> findBySellerId(Long sellerId);
}