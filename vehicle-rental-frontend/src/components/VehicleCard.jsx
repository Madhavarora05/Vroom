// src/components/VehicleCard.js
import React, { useState } from "react";
import axiosWithAuth from "../api/axiosWithAuth";

const VehicleCard = ({ model }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailableUnits = async () => {
    if (!start || !end) return alert("Please select both date and time.");
    try {
      setLoading(true);
      const res = await axiosWithAuth.get("/api/users/available-units", {
        params: {
          modelId: model.id,
          startDateTime: start,
          endDateTime: end,
        },
      });
      setUnits(res.data);
    } catch (err) {
      console.error("Error fetching units:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (unitId) => {
    const userId = localStorage.getItem("userId");
    const rentalType = "HOURLY"; // or "DAILY" — you can make this dynamic later
    try {
      const res = await axiosWithAuth.post("/api/bookings", null, {
        params: {
          userId,
          carUnitId: unitId,
          startDateTime: start,
          endDateTime: end,
          rentalType,
        },
      });
      alert("Booking successful!");
    } catch (err) {
      alert("Booking failed");
      console.error("Booking error:", err);
    }
  };

  return (
    <div className="border rounded p-4 shadow-md bg-white">
      <h3 className="text-xl font-semibold mb-2">{model.name}</h3>
      <p><strong>Brand:</strong> {model.brand}</p>
      <p><strong>Transmission:</strong> {model.transmission}</p>
      <p><strong>Fuel Type:</strong> {model.fuelType}</p>
      <p><strong>Seats:</strong> {model.seatCount}</p>

      <div className="mt-3 space-y-2">
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={fetchAvailableUnits}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          {loading ? "Checking..." : "View Available Units"}
        </button>
      </div>

      {units.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold">Available Units:</h4>
          <ul className="list-disc pl-5">
            {units.map((unit) => (
              <li key={unit.id} className="my-2">
                {unit.carNumber}{" "}
                <button
                  onClick={() => handleBook(unit.id)}
                  className="ml-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                >
                  Book Now
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VehicleCard;
