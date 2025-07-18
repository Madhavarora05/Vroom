package com.vehicle.service;

import com.vehicle.model.CarModel;
import com.vehicle.repository.CarModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarModelService {

    @Autowired
    private CarModelRepository carModelRepository;

    public List<CarModel> getAllCarModels() {
        return carModelRepository.findAll();
    }

    public CarModel addCarModel(CarModel model) {
        return carModelRepository.save(model);
    }

    public void deleteCarModel(Long id) {
        carModelRepository.deleteById(id);
    }
}
