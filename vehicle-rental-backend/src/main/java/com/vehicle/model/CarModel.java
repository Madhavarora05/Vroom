package com.vehicle.model;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "car_models")
public class CarModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type; // e.g., Sedan, SUV, Bike
    private String imageUrl;
    private double perHourRate;
    private double perDayRate;

    @OneToMany(mappedBy = "carModel", cascade = CascadeType.ALL)
    private List<CarUnit> carUnits = new ArrayList<>();


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getPerHourRate() {
        return perHourRate;
    }

    public void setPerHourRate(double perHourRate) {
        this.perHourRate = perHourRate;
    }

    public double getPerDayRate() {
        return perDayRate;
    }

    public void setPerDayRate(double perDayRate) {
        this.perDayRate = perDayRate;
    }

    public List<CarUnit> getCarUnits() {
        return carUnits;
    }

    public void setCarUnits(List<CarUnit> carUnits) {
        this.carUnits = carUnits;
    }
}
