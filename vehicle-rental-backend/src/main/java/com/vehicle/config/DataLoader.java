package com.vehicle.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.vehicle.model.CarModel;
import com.vehicle.model.CarUnit;
import com.vehicle.model.User;
import com.vehicle.repository.CarModelRepository;
import com.vehicle.repository.CarUnitRepository;
import com.vehicle.service.UserService;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private CarModelRepository carModelRepository;

    @Autowired
    private CarUnitRepository carUnitRepository;

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // Load sample data only if database is empty
        loadSampleData();
    }

    private void loadSampleData() {
        // Check if data already exists
        if (carModelRepository.count() > 0 || userService.getUserByEmail("admin@vroom.com").isPresent()) {
            return;
        }

        // Create sample car models
        CarModel model1 = new CarModel("Maruti Suzuki Swift", "Hatchback", 
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/130591_176.jpg?isig=0&q=80", 1800.0);
        CarModel model2 = new CarModel("Hyundai Creta", "SUV", 
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/106815_176.jpg?isig=0&q=80", 3500.0);
        CarModel model3 = new CarModel("Honda City", "Sedan", 
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287_176.jpg?isig=0&q=80", 2800.0);
        CarModel model4 = new CarModel("Mahindra Thar", "SUV", 
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/40087_176.jpg?isig=0&q=80", 4200.0);
        CarModel model5 = new CarModel("Toyota Innova Crysta", "MPV", 
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/17233_176.jpg?isig=0&q=80", 4800.0);
        CarModel model6 = new CarModel("Maruti Suzuki Baleno", "Hatchback", 
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/102663_176.jpg?isig=0&q=80", 2200.0);
        CarModel model7 = new CarModel("Kia Seltos", "SUV", 
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/115025_176.jpg?isig=0&q=80", 3800.0);
        CarModel model8 = new CarModel("Honda Amaze", "Sedan", 
            "https://imgd.aeplcdn.com/664x374/n/cw/ec/116777_176.jpg?isig=0&q=80", 2400.0);

        // Save car models
        carModelRepository.save(model1);
        carModelRepository.save(model2);
        carModelRepository.save(model3);
        carModelRepository.save(model4);
        carModelRepository.save(model5);
        carModelRepository.save(model6);
        carModelRepository.save(model7);
        carModelRepository.save(model8);

        // Create sample car units
        createCarUnit("MH01AB1234", true, model1);
        createCarUnit("MH01AB1235", true, model1);
        createCarUnit("MH01AB1236", true, model1);

        createCarUnit("MH02CD2234", true, model2);
        createCarUnit("MH02CD2235", true, model2);

        createCarUnit("MH03EF3234", true, model3);
        createCarUnit("MH03EF3235", true, model3);
        createCarUnit("MH03EF3236", true, model3);

        createCarUnit("MH04GH4234", true, model4);
        createCarUnit("MH04GH4235", true, model4);

        createCarUnit("MH05IJ5234", true, model5);
        createCarUnit("MH05IJ5235", true, model5);

        createCarUnit("MH06KL6234", true, model6);
        createCarUnit("MH06KL6235", true, model6);
        createCarUnit("MH06KL6236", true, model6);

        createCarUnit("MH07MN7234", true, model7);
        createCarUnit("MH07MN7235", true, model7);

        createCarUnit("MH08OP8234", true, model8);
        createCarUnit("MH08OP8235", true, model8);

        // Create a sample admin user
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@vroom.com");
        admin.setPassword("admin123");
        admin.setRole("admin");
        admin.setStatus("active");
        admin.setPhone("9999999999");
        userService.registerUser(admin);

        // Create a sample regular user
        User user = new User();
        user.setName("John Doe");
        user.setEmail("john@example.com");
        user.setPassword("password123");
        user.setRole("user");
        user.setStatus("active");
        user.setPhone("9876543210");
        user.setDrivingLicense("DL1234567890");
        userService.registerUser(user);
        
        // Create a sample seller user
        User seller = new User();
        seller.setName("Jane Smith");
        seller.setEmail("seller@example.com");
        seller.setPassword("seller123");
        seller.setRole("seller");
        seller.setStatus("active");
        seller.setPhone("9876543211");
        seller.setDrivingLicense("DL1234567891");
        userService.registerUser(seller);
        
        // Update car models to have seller IDs
        updateCarModelsWithSeller(seller.getId());

        System.out.println("Sample data loaded successfully!");
    }

    private void createCarUnit(String numberPlate, boolean available, CarModel carModel) {
        CarUnit unit = new CarUnit();
        unit.setNumberPlate(numberPlate);
        unit.setAvailable(available);
        unit.setCarModel(carModel);
        carUnitRepository.save(unit);
    }
    
    private void updateCarModelsWithSeller(Long sellerId) {
        // Update all existing car models to belong to the seller
        List<CarModel> allModels = carModelRepository.findAll();
        for (CarModel model : allModels) {
            model.setSellerId(sellerId);
            carModelRepository.save(model);
        }
    }
}