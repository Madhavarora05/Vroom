package com.vehicle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vehicle.model.CarModel;
import com.vehicle.model.CarUnit;

@Repository
public interface CarUnitRepository extends JpaRepository<CarUnit, Long> {
    
    List<CarUnit> findByAvailableTrue();
    
    List<CarUnit> findByCarModel(CarModel carModel);
    
    List<CarUnit> findByCarModelId(Long carModelId);
    
    List<CarUnit> findByCarModelIdAndAvailableTrue(Long carModelId);
    
    List<CarUnit> findByCarModelIdAndIdNotInAndAvailableTrue(Long carModelId, List<Long> excludedIds);
    
    List<CarUnit> findByNumberPlateContainingIgnoreCase(String numberPlate);
    
    boolean existsByNumberPlate(String numberPlate);

    List<CarUnit> findByCarModelIdAndAvailable(Long carModelId, boolean available);
    
    java.util.Optional<CarUnit> findByNumberPlate(String numberPlate);
}