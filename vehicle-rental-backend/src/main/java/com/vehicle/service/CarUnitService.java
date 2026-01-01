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

    public List<CarUnit> getAllCarUnits() {
        return carUnitRepository.findAll();
    }

    public List<CarUnit> getAvailableUnits() {
        return carUnitRepository.findByAvailableTrue();
    }

    public List<CarUnit> getUnitsByModel(CarModel model) {
        return carUnitRepository.findByCarModel(model);
    }

    public List<CarUnit> getUnitsByModelId(Long modelId) {
        return carUnitRepository.findByCarModelId(modelId);
    }

    public List<CarUnit> getAvailableUnitsByModelId(Long modelId) {
        return carUnitRepository.findByCarModelIdAndAvailableTrue(modelId);
    }

    public List<CarUnit> getAvailableUnitsByModelIdExcluding(Long modelId, List<Long> excludedIds) {
        return carUnitRepository.findByCarModelIdAndIdNotInAndAvailableTrue(modelId, excludedIds);
    }

    public CarUnit addCarUnit(CarUnit unit) {
        // Set available to true by default for new units
        unit.setAvailable(true);
        return carUnitRepository.save(unit);
    }

    public CarUnit updateCarUnit(CarUnit unit) {
        if (carUnitRepository.existsById(unit.getId())) {
            return carUnitRepository.save(unit);
        } else {
            throw new RuntimeException("Car unit not found with id: " + unit.getId());
        }
    }

    public void deleteCarUnit(Long id) {
        if (carUnitRepository.existsById(id)) {
            carUnitRepository.deleteById(id);
        } else {
            throw new RuntimeException("Car unit not found with id: " + id);
        }
    }

    public CarUnit updateAvailability(Long id, boolean available) {
        Optional<CarUnit> unitOpt = carUnitRepository.findById(id);
        if (unitOpt.isPresent()) {
            CarUnit unit = unitOpt.get();
            unit.setAvailable(available);
            return carUnitRepository.save(unit);
        } else {
            throw new RuntimeException("Car unit not found with id: " + id);
        }
    }

    public void markUnavailable(CarUnit unit) {
        unit.setAvailable(false);
        carUnitRepository.save(unit);
    }

    public void markAvailable(CarUnit unit) {
        unit.setAvailable(true);
        carUnitRepository.save(unit);
    }

    public Optional<CarUnit> getById(Long id) {
        return carUnitRepository.findById(id);
    }
}