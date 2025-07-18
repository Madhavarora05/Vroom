import React, { useEffect, useState } from "react";
import axiosWithAuth from "../api/axiosWithAuth";
import BookingCard from "../components/BookingCard";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const userId = 1; // 🔁 Replace with logged-in user ID when login is implemented

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosWithAuth.get(`/api/bookings/user/${userId}`);
        setBookings(res.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))
      )}
    </div>
  );
};

export default MyBookings;
