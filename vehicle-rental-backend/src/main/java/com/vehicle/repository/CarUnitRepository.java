package com.vehicle.repository;

import com.vehicle.model.CarUnit;
import com.vehicle.model.CarModel;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CarUnitRepository extends JpaRepository<CarUnit, Long> {
    List<CarUnit> findByAvailableTrue();
    List<CarUnit> findByCarModel(CarModel carModel);
    List<CarUnit> findByCarModelIdAndAvailableTrue(Long modelId);
    List<CarUnit> findByCarModelIdAndIdNotInAndAvailableTrue(Long modelId, List<Long> excludedIds);
}
