package com.vehicle.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vehicle.model.Booking;
import com.vehicle.model.CarModel;
import com.vehicle.model.CarUnit;
import com.vehicle.repository.BookingRepository;
import com.vehicle.repository.CarModelRepository;
import com.vehicle.repository.CarUnitRepository;

@Service
public class SellerService {
    
    @Autowired
    private CarModelRepository carModelRepository;
    
    @Autowired
    private CarUnitRepository carUnitRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    public List<CarModel> getSellerVehicles(Long sellerId) {
        return carModelRepository.findBySellerId(sellerId);
    }
    
    public List<Booking> getSellerBookings(Long sellerId) {
        return bookingRepository.findBySellerIdWithDetails(sellerId);
    }
    
    public CarModel addVehicle(CarModel carModel, Long sellerId) {
        carModel.setSellerId(sellerId);
        return carModelRepository.save(carModel);
    }
    
    public CarUnit addVehicleUnit(Long carModelId, String numberPlate, Long sellerId) {
        // Verify the car model belongs to the seller
        Optional<CarModel> carModel = carModelRepository.findById(carModelId);
        if (carModel.isEmpty() || !carModel.get().getSellerId().equals(sellerId)) {
            throw new RuntimeException("Vehicle model not found or access denied");
        }
        
        // Check if number plate already exists
        if (carUnitRepository.findByNumberPlate(numberPlate).isPresent()) {
            throw new RuntimeException("Vehicle with this number plate already exists");
        }
        
        CarUnit unit = new CarUnit();
        unit.setNumberPlate(numberPlate.toUpperCase());
        unit.setAvailable(true);
        unit.setCarModel(carModel.get());
        
        return carUnitRepository.save(unit);
    }
}