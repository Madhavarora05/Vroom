// src/pages/Vehicles.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import VehicleCard from "../components/VehicleCard";

const Vehicles = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await axiosInstance.get("/api/users/car-models");
        setModels(res.data);
      } catch (err) {
        console.error("Error fetching car models:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Vehicles</h2>
      {loading ? (
        <p>Loading...</p>
      ) : models.length === 0 ? (
        <p>No vehicle models found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((model) => (
            <VehicleCard key={model.id} model={model} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Vehicles;
