package com.vehicle.controller;

import com.vehicle.model.CarModel;
import com.vehicle.model.CarUnit;
import com.vehicle.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // 1. Add a new CarModel
    @PostMapping("/car-models")
    public CarModel addCarModel(@RequestBody CarModel model) {
        return adminService.addCarModel(model);
    }

    // 2. Add a new CarUnit to a model
    @PostMapping("/car-units")
    public CarUnit addCarUnit(@RequestParam Long carModelId, @RequestParam String numberPlate) {
        return adminService.addCarUnit(carModelId, numberPlate);
    }

    // 3. Get all CarUnits
    @GetMapping("/car-units")
    public List<CarUnit> getAllCarUnits() {
        return adminService.getAllCarUnits();
    }

    // 4. Toggle availability of a unit
    @PutMapping("/car-units/{id}/availability")
    public CarUnit updateAvailability(@PathVariable Long id, @RequestParam boolean available) {
        return adminService.updateAvailability(id, available);
    }

    // 5. Delete a CarUnit
    @DeleteMapping("/car-units/{id}")
    public String deleteCarUnit(@PathVariable Long id) {
        adminService.deleteCarUnit(id);
        return "Car unit deleted successfully.";
    }
}
