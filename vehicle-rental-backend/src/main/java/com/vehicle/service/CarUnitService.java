package com.vehicle.service;

import com.vehicle.model.CarModel;
import com.vehicle.model.CarUnit;
import com.vehicle.repository.CarUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarUnitService {

    @Autowired
    private CarUnitRepository carUnitRepository;

    public List<CarUnit> getAvailableUnits() {
        return carUnitRepository.findByAvailableTrue();
    }

    public List<CarUnit> getUnitsByModel(CarModel model) {
        return carUnitRepository.findByCarModel(model);
    }

    public List<CarUnit> getAvailableUnitsByModelId(Long modelId) {
        return carUnitRepository.findByCarModelIdAndAvailableTrue(modelId);
    }

    public List<CarUnit> getAvailableUnitsByModelIdExcluding(Long modelId, List<Long> excludedIds) {
        return carUnitRepository.findByCarModelIdAndIdNotInAndAvailableTrue(modelId, excludedIds);
    }

    public CarUnit addCarUnit(CarUnit unit) {
        return carUnitRepository.save(unit);
    }

    public void markUnavailable(CarUnit unit) {
        unit.setAvailable(false);
        carUnitRepository.save(unit);
    }

    public Optional<CarUnit> getById(Long id) {
        return carUnitRepository.findById(id);
    }
}
