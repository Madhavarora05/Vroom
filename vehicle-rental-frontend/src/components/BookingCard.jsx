import React from "react";

const BookingCard = ({ booking }) => {
  const { carUnit, startDateTime, endDateTime, rentalType } = booking;
  const start = new Date(startDateTime).toLocaleString();
  const end = new Date(endDateTime).toLocaleString();

  return (
    <div className="p-4 border rounded-xl shadow-md bg-white my-2">
      <h2 className="text-xl font-semibold">{carUnit.model.name}</h2>
      <p><strong>Car Number:</strong> {carUnit.carNumber}</p>
      <p><strong>Rental Type:</strong> {rentalType}</p>
      <p><strong>From:</strong> {start}</p>
      <p><strong>To:</strong> {end}</p>
    </div>
  );
};

export default BookingCard;
