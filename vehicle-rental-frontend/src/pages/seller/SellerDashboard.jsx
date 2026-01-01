import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, Alert, Tabs, Tab } from 'react-bootstrap';
import { Plus, Car, Calendar, DollarSign, Eye, Edit, Trash } from 'lucide-react';
import axiosInstance from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('vehicles');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: '',
    perDayRate: '',
    imageUrl: ''
  });
  const [newUnit, setNewUnit] = useState({
    carModelId: '',
    numberPlate: ''
  });

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      // Fetch seller's vehicles and bookings
      const [vehiclesRes, bookingsRes] = await Promise.all([
        axiosInstance.get('/api/seller/my-vehicles'),
        axiosInstance.get('/api/seller/my-bookings')
      ]);
      
      setVehicles(vehiclesRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error('Error fetching seller data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/seller/vehicles', {
        ...newVehicle,
        perDayRate: parseFloat(newVehicle.perDayRate)
      });
      
      setShowAddVehicleModal(false);
      setNewVehicle({ name: '', type: '', perDayRate: '', imageUrl: '' });
      fetchSellerData();
      alert('Vehicle added successfully!');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle');
    }
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/seller/vehicles/units', newUnit);
      
      setShowAddUnitModal(false);
      setNewUnit({ carModelId: '', numberPlate: '' });
      fetchSellerData();
      alert('Unit added successfully!');
    } catch (error) {
      console.error('Error adding unit:', error);
      alert('Failed to add unit');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateEarnings = () => {
    return bookings
      .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
      .reduce((total, booking) => total + (booking.totalAmount || 0), 0);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0" style={{ color: '#1f2937' }}>
            Seller Dashboard
          </h2>
          <p className="text-muted">Welcome back, {user?.name}!</p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <Car size={32} color="#10b981" className="mb-2" />
              <h4 className="mb-1">{vehicles.length}</h4>
              <small className="text-muted">Vehicle Models</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <Calendar size={32} color="#3b82f6" className="mb-2" />
              <h4 className="mb-1">{bookings.length}</h4>
              <small className="text-muted">Total Bookings</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <DollarSign size={32} color="#f59e0b" className="mb-2" />
              <h4 className="mb-1">₹{calculateEarnings().toFixed(2)}</h4>
              <small className="text-muted">Total Earnings</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <Eye size={32} color="#8b5cf6" className="mb-2" />
              <h4 className="mb-1">{bookings.filter(b => b.status === 'pending').length}</h4>
              <small className="text-muted">Pending Bookings</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="vehicles" title="My Vehicles">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Vehicle Models</h5>
            <div>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={() => setShowAddUnitModal(true)}
              >
                <Plus size={16} className="me-1" />
                Add Unit
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setShowAddVehicleModal(true)}
              >
                <Plus size={16} className="me-1" />
                Add Vehicle Model
              </Button>
            </div>
          </div>

          {vehicles.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <Car size={64} color="#9ca3af" className="mb-3" />
                <h5 className="text-muted">No vehicles added yet</h5>
                <p className="text-muted">Start by adding your first vehicle model</p>
                <Button variant="primary" onClick={() => setShowAddVehicleModal(true)}>
                  Add Vehicle Model
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {vehicles.map((vehicle) => (
                <Col md={6} lg={4} key={vehicle.id} className="mb-3">
                  <Card className="h-100 shadow-sm">
                    {vehicle.imageUrl && (
                      <div style={{ height: '180px', overflow: 'hidden' }}>
                        <Card.Img 
                          variant="top" 
                          src={vehicle.imageUrl} 
                          style={{ height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/400x180/e5e7eb/6b7280?text=Car+Image";
                          }}
                        />
                      </div>
                    )}
                    <Card.Body>
                      <Card.Title className="h6">{vehicle.name}</Card.Title>
                      <Card.Text>
                        <small className="text-muted">
                          <Badge bg="light" text="dark" className="me-2">{vehicle.type}</Badge>
                          <strong className="text-success">₹{vehicle.perDayRate}/day</strong>
                        </small>
                      </Card.Text>
                      <small className="text-muted">
                        Units: {vehicle.carUnits ? vehicle.carUnits.length : 0}
                      </small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>

        <Tab eventKey="bookings" title="Bookings">
          <h5 className="mb-3">My Vehicle Bookings</h5>
          
          {bookings.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <Calendar size={64} color="#9ca3af" className="mb-3" />
                <h5 className="text-muted">No bookings yet</h5>
                <p className="text-muted">Bookings for your vehicles will appear here</p>
              </Card.Body>
            </Card>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Vehicle</th>
                    <th>Customer</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>
                        <div>
                          <strong>{booking.carUnit?.carModel?.name}</strong>
                          <br />
                          <small className="text-muted">{booking.carUnit?.numberPlate}</small>
                        </div>
                      </td>
                      <td>{booking.user?.name}</td>
                      <td>
                        <small>
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </small>
                      </td>
                      <td>
                        <strong className="text-success">₹{booking.totalAmount}</strong>
                      </td>
                      <td>
                        <Badge bg={getStatusColor(booking.status)}>
                          {booking.status || 'Pending'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Tab>
      </Tabs>

      {/* Add Vehicle Modal */}
      <Modal show={showAddVehicleModal} onHide={() => setShowAddVehicleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Vehicle Model</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddVehicle}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Name</Form.Label>
              <Form.Control
                type="text"
                value={newVehicle.name}
                onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
                required
                placeholder="e.g., Maruti Swift"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Select
                value={newVehicle.type}
                onChange={(e) => setNewVehicle({...newVehicle, type: e.target.value})}
                required
              >
                <option value="">Select Type</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="MPV">MPV</option>
                <option value="Convertible">Convertible</option>
                <option value="Coupe">Coupe</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Per Day Rate (₹)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={newVehicle.perDayRate}
                onChange={(e) => setNewVehicle({...newVehicle, perDayRate: e.target.value})}
                required
                placeholder="e.g., 2500"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                value={newVehicle.imageUrl}
                onChange={(e) => setNewVehicle({...newVehicle, imageUrl: e.target.value})}
                placeholder="https://example.com/car-image.jpg"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddVehicleModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Vehicle
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add Unit Modal */}
      <Modal show={showAddUnitModal} onHide={() => setShowAddUnitModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Vehicle Unit</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddUnit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Select Vehicle Model</Form.Label>
              <Form.Select
                value={newUnit.carModelId}
                onChange={(e) => setNewUnit({...newUnit, carModelId: e.target.value})}
                required
              >
                <option value="">Select Vehicle Model</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} - {vehicle.type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Number Plate</Form.Label>
              <Form.Control
                type="text"
                value={newUnit.numberPlate}
                onChange={(e) => setNewUnit({...newUnit, numberPlate: e.target.value})}
                required
                placeholder="e.g., MH01AB1234"
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddUnitModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Unit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default SellerDashboard;