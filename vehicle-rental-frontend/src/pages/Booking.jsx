import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { Calendar, Car, MapPin, Clock, DollarSign, User } from 'lucide-react';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/users/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      case 'completed':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading your bookings...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <div className="d-flex align-items-center mb-4">
            <Calendar className="me-2" size={32} color="#10b981" />
            <h2 className="mb-0" style={{ color: '#1f2937' }}>My Bookings</h2>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {bookings.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <Car size={64} color="#9ca3af" className="mb-3" />
                <h4 style={{ color: '#6b7280' }}>No bookings found</h4>
                <p style={{ color: '#9ca3af' }}>
                  You haven't made any bookings yet. Start by browsing our available vehicles.
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {bookings.map((booking) => (
                <Col md={6} lg={4} key={booking.id} className="mb-4">
                  <Card className="h-100 shadow-sm border-0" style={{ borderLeft: '4px solid #10b981' }}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title mb-0" style={{ color: '#1f2937' }}>
                          {booking.carUnit?.carModel?.name || 'Vehicle'}
                        </h5>
                        <Badge bg={getStatusColor(booking.status)}>
                          {booking.status || 'Pending'}
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <Car size={16} className="me-2" color="#6b7280" />
                          <small style={{ color: '#6b7280' }}>
                            {booking.carUnit?.carModel?.type || 'N/A'} • {booking.carUnit?.numberPlate || 'N/A'}
                          </small>
                        </div>
                        
                        <div className="d-flex align-items-center mb-2">
                          <Calendar size={16} className="me-2" color="#6b7280" />
                          <small style={{ color: '#6b7280' }}>
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </small>
                        </div>

                        <div className="d-flex align-items-center mb-2">
                          <Clock size={16} className="me-2" color="#6b7280" />
                          <small style={{ color: '#6b7280' }}>
                            {calculateDays(booking.startDate, booking.endDate)} day(s)
                          </small>
                        </div>

                        <div className="d-flex align-items-center">
                          <DollarSign size={16} className="me-2" color="#10b981" />
                          <small style={{ color: '#10b981', fontWeight: 'bold' }}>
                            ₹{booking.totalAmount || 'N/A'}
                          </small>
                        </div>
                      </div>

                      <div className="border-top pt-3">
                        <small style={{ color: '#9ca3af' }}>
                          Booking ID: #{booking.id}
                        </small>
                        <br />
                        <small style={{ color: '#9ca3af' }}>
                          Created: {booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyBookings;
