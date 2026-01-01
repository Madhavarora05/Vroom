package com.vehicle.service;

import com.vehicle.model.CarModel;
import com.vehicle.repository.CarModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarModelService {

    @Autowired
    private CarModelRepository carModelRepository;

    public List<CarModel> getAllCarModels() {
        return carModelRepository.findAll();
    }

    public CarModel getCarModelById(Long id) {
        Optional<CarModel> model = carModelRepository.findById(id);
        if (model.isPresent()) {
            return model.get();
        } else {
            throw new RuntimeException("Car model not found with id: " + id);
        }
    }

    public CarModel addCarModel(CarModel model) {
        return carModelRepository.save(model);
    }

    public CarModel updateCarModel(CarModel model) {
        if (carModelRepository.existsById(model.getId())) {
            return carModelRepository.save(model);
        } else {
            throw new RuntimeException("Car model not found with id: " + model.getId());
        }
    }

    public void deleteCarModel(Long id) {
        if (carModelRepository.existsById(id)) {
            carModelRepository.deleteById(id);
        } else {
            throw new RuntimeException("Car model not found with id: " + id);
        }
    }

    public List<CarModel> getCarModelsByType(String type) {
        return carModelRepository.findByType(type);
    }
}