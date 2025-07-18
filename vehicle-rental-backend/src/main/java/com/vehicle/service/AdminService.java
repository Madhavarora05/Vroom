package com.vehicle.service;

import com.vehicle.model.CarModel;
import com.vehicle.model.CarUnit;
import com.vehicle.repository.CarModelRepository;
import com.vehicle.repository.CarUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private CarModelRepository carModelRepository;

    @Autowired
    private CarUnitRepository carUnitRepository;

    // 1. Add a new CarModel
    public CarModel addCarModel(CarModel model) {
        return carModelRepository.save(model);
    }

    // 2. Add a new CarUnit to an existing model
    public CarUnit addCarUnit(Long carModelId, String numberPlate) {
        CarModel model = carModelRepository.findById(carModelId)
            .orElseThrow(() -> new RuntimeException("Car model not found"));

        CarUnit unit = new CarUnit();
        unit.setCarModel(model);
        unit.setNumberPlate(numberPlate);
        unit.setAvailable(true);

        return carUnitRepository.save(unit);
    }

    // 3. Get all CarUnits
    public List<CarUnit> getAllCarUnits() {
        return carUnitRepository.findAll();
    }

    // 4. Toggle availability
    public CarUnit updateAvailability(Long unitId, boolean available) {
        CarUnit unit = carUnitRepository.findById(unitId)
            .orElseThrow(() -> new RuntimeException("Car unit not found"));

        unit.setAvailable(available);
        return carUnitRepository.save(unit);
    }

    // 5. Delete a CarUnit
    public void deleteCarUnit(Long unitId) {
        carUnitRepository.deleteById(unitId);
    }
}
