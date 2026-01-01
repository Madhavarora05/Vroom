package com.vehicle.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "car_models")
public class CarModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type; // e.g., Sedan, SUV, Bike
    private String imageUrl;
    private double perDayRate; // Only daily rate now
    
    @jakarta.persistence.Column(name = "per_hour_rate", nullable = true, columnDefinition = "DOUBLE DEFAULT 0.0")
    private Double perHourRate = 0.0; // Default value to handle existing DB column
    
    private Long sellerId; // ID of the seller who owns this vehicle model

    @OneToMany(mappedBy = "carModel", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CarUnit> carUnits = new ArrayList<>();

    // Constructors
    public CarModel() {}

    public CarModel(String name, String type, String imageUrl, double perDayRate) {
        this.name = name;
        this.type = type;
        this.imageUrl = imageUrl;
        this.perDayRate = perDayRate;
    }

    // Getters and Setters
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

    public double getPerDayRate() {
        return perDayRate;
    }

    public void setPerDayRate(double perDayRate) {
        this.perDayRate = perDayRate;
    }

    public Double getPerHourRate() {
        return perHourRate;
    }

    public void setPerHourRate(Double perHourRate) {
        this.perHourRate = perHourRate;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public List<CarUnit> getCarUnits() {
        return carUnits;
    }

    public void setCarUnits(List<CarUnit> carUnits) {
        this.carUnits = carUnits;
    }
}
