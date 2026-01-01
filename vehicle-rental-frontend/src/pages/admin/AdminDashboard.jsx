import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Nav, Button, Badge, Alert, Spinner, Form } from "react-bootstrap";
import {
  Users,
  UserCheck,
  Car,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  LogOut,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Configure axios to include credentials
axios.defaults.withCredentials = true;

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("pending-sellers");
  const [pendingSellers, setPendingSellers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeSellers, setActiveSellers] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carUnits, setCarUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  
  // New state variables for enhanced car management
  const [showCarModelForm, setShowCarModelForm] = useState(false);
  const [showCarUnitForm, setShowCarUnitForm] = useState(false);
  const [selectedCarModel, setSelectedCarModel] = useState(null);
  const [carModelForm, setCarModelForm] = useState({
    id: null,
    name: "",
    type: "",
    imageUrl: "",
    perDayRate: 0
  });
  const [carUnitForm, setCarUnitForm] = useState({
    id: null,
    numberPlate: "",
    available: true,
    carModelId: null
  });

  const navigate = useNavigate();

  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case "pending-sellers":
          const pendingResponse = await axios.get("http://localhost:8080/api/admin/pending-sellers");
          setPendingSellers(Array.isArray(pendingResponse.data) ? pendingResponse.data : []);
          break;
        case "all-users":
          const usersResponse = await axios.get("http://localhost:8080/api/admin/users");
          setAllUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
          break;
        case "active-sellers":
          const activeResponse = await axios.get("http://localhost:8080/api/admin/active-sellers");
          setActiveSellers(Array.isArray(activeResponse.data) ? activeResponse.data : []);
          break;
        case "car-management":
          const [modelsResponse, unitsResponse] = await Promise.all([
            axios.get("http://localhost:8080/api/admin/car-models"),
            axios.get("http://localhost:8080/api/admin/car-units")
          ]);
          setCarModels(Array.isArray(modelsResponse.data) ? modelsResponse.data : []);
          setCarUnits(Array.isArray(unitsResponse.data) ? unitsResponse.data : []);
          break;
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setMessage("Access denied. Admin privileges required.");
        setMessageType("danger");
        setTimeout(() => navigate("/admin/login"), 2000);
      } else {
        setMessage("Failed to fetch data: " + (error.response?.data?.message || error.message));
        setMessageType("danger");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveSeller = async (userId) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/approve-seller/${userId}`);
      setMessage("Seller approved successfully!");
      setMessageType("success");
      fetchData(); // Refresh data
    } catch (error) {
      setMessage("Failed to approve seller: " + (error.response?.data?.message || error.message));
      setMessageType("danger");
    }
  };

  const handleRejectSeller = async (userId) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/reject-seller/${userId}`);
      setMessage("Seller rejected successfully!");
      setMessageType("success");
      fetchData(); // Refresh data
    } catch (error) {
      setMessage("Failed to reject seller: " + (error.response?.data?.message || error.message));
      setMessageType("danger");
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/toggle-user-status/${userId}`);
      setMessage("User status updated successfully!");
      setMessageType("success");
      fetchData(); // Refresh data
    } catch (error) {
      setMessage("Failed to update user status: " + (error.response?.data?.message || error.message));
      setMessageType("danger");
    }
  };

  // Enhanced car management functions
  const handleAddCarModel = async (e) => {
    e.preventDefault();
    try {
      if (carModelForm.id) {
        await axios.put(`http://localhost:8080/api/admin/car-models/${carModelForm.id}`, carModelForm);
      } else {
        await axios.post("http://localhost:8080/api/admin/car-models", carModelForm);
      }
      setMessage("Car model saved successfully!");
      setMessageType("success");
      fetchData(); // Refresh data
      resetCarModelForm();
      setShowCarModelForm(false);
    } catch (error) {
      setMessage("Failed to save car model: " + (error.response?.data?.message || error.message));
      setMessageType("danger");
    }
  };

  const handleAddCarUnit = async (e) => {
    e.preventDefault();
    try {
      const unitData = {
        ...carUnitForm,
        carModel: { id: carUnitForm.carModelId }
      };
      
      if (carUnitForm.id) {
        await axios.put(`http://localhost:8080/api/admin/car-units/${carUnitForm.id}`, unitData);
      } else {
        await axios.post("http://localhost:8080/api/admin/car-units", unitData);
      }
      setMessage("Car unit saved successfully!");
      setMessageType("success");
      fetchData(); // Refresh data
      resetCarUnitForm();
      setShowCarUnitForm(false);
    } catch (error) {
      setMessage("Failed to save car unit: " + (error.response?.data?.message || error.message));
      setMessageType("danger");
    }
  };

  const handleDeleteCarModel = async (id) => {
    if (window.confirm("Are you sure you want to delete this car model?")) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/car-models/${id}`);
        setMessage("Car model deleted successfully!");
        setMessageType("success");
        fetchData();
      } catch (error) {
        setMessage("Failed to delete car model: " + (error.response?.data?.message || error.message));
        setMessageType("danger");
      }
    }
  };

  const handleDeleteCarUnit = async (id) => {
    if (window.confirm("Are you sure you want to delete this car unit?")) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/car-units/${id}`);
        setMessage("Car unit deleted successfully!");
        setMessageType("success");
        fetchData();
      } catch (error) {
        setMessage("Failed to delete car unit: " + (error.response?.data?.message || error.message));
        setMessageType("danger");
      }
    }
  };

  const handleToggleUnitAvailability = async (unitId, available) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/car-units/${unitId}/availability?available=${available}`);
      setMessage("Unit availability updated successfully!");
      setMessageType("success");
      fetchData();
    } catch (error) {
      setMessage("Failed to update unit availability: " + (error.response?.data?.message || error.message));
      setMessageType("danger");
    }
  };

  const handleEditCarModel = (model) => {
    setCarModelForm({
      id: model.id,
      name: model.name,
      type: model.type,
      imageUrl: model.imageUrl || "",

      perDayRate: model.perDayRate || 0
    });
    setShowCarModelForm(true);
  };

  const handleEditCarUnit = (unit) => {
    setCarUnitForm({
      id: unit.id,
      numberPlate: unit.numberPlate,
      available: unit.available,
      carModelId: unit.carModel?.id || null
    });
    setShowCarUnitForm(true);
  };

  const resetCarModelForm = () => {
    setCarModelForm({
      id: null,
      name: "",
      type: "",
      imageUrl: "",
      perDayRate: 0
    });
  };

  const resetCarUnitForm = () => {
    setCarUnitForm({
      id: null,
      numberPlate: "",
      available: true,
      carModelId: null
    });
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/users/logout");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/admin/login");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge bg="success">Active</Badge>;
      case "pending":
        return <Badge bg="warning">Pending</Badge>;
      case "suspended":
        return <Badge bg="danger">Suspended</Badge>;
      case "rejected":
        return <Badge bg="secondary">Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge bg="primary">Admin</Badge>;
      case "seller":
        return <Badge bg="info">Seller</Badge>;
      case "user":
        return <Badge bg="secondary">User</Badge>;
      default:
        return <Badge bg="secondary">{role}</Badge>;
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div
        className="py-3 mb-4"
        style={{ background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)' }}
      >
        <Container>
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center text-white">
                <Shield size={32} className="me-3" />
                <div>
                  <h3 className="mb-0 fw-bold">Admin Dashboard</h3>
                  <small className="opacity-75">Vehicle Rental Management System</small>
                </div>
              </div>
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-light"
                onClick={handleLogout}
                className="d-flex align-items-center"
              >
                <LogOut size={18} className="me-2" />
                Logout
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Alert Message */}
        {message && (
          <Alert
            variant={messageType}
            className="mb-4"
            onClose={() => setMessage("")}
            dismissible
          >
            {message}
          </Alert>
        )}

        <Row>
          {/* Sidebar Navigation */}
          <Col md={3} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "pending-sellers"}
                      onClick={() => setActiveTab("pending-sellers")}
                      className="d-flex align-items-center py-3 px-4 border-0"
                    >
                      <Clock size={18} className="me-3" />
                      Pending Sellers
                      {pendingSellers.length > 0 && (
                        <Badge bg="warning" className="ms-auto">
                          {pendingSellers.length}
                        </Badge>
                      )}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "all-users"}
                      onClick={() => setActiveTab("all-users")}
                      className="d-flex align-items-center py-3 px-4 border-0"
                    >
                      <Users size={18} className="me-3" />
                      All Users
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "active-sellers"}
                      onClick={() => setActiveTab("active-sellers")}
                      className="d-flex align-items-center py-3 px-4 border-0"
                    >
                      <UserCheck size={18} className="me-3" />
                      Active Sellers
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "car-management"}
                      onClick={() => setActiveTab("car-management")}
                      className="d-flex align-items-center py-3 px-4 border-0"
                    >
                      <Car size={18} className="me-3" />
                      Car Management
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col md={9}>
            {isLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                {/* Pending Sellers Tab */}
                {activeTab === "pending-sellers" && (
                  <Card className="shadow-sm">
                    <Card.Header className="bg-warning bg-opacity-10 border-warning">
                      <h5 className="mb-0 d-flex align-items-center">
                        <Clock size={20} className="me-2" />
                        Pending Seller Approvals ({pendingSellers.length})
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                      {pendingSellers.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <Clock size={48} className="mb-3 opacity-50" />
                          <p>No pending seller requests</p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead className="bg-light">
                              <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>License</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pendingSellers.map((seller) => (
                                <tr key={seller.id}>
                                  <td className="fw-semibold">{seller.name}</td>
                                  <td>{seller.email}</td>
                                  <td>{seller.phone}</td>
                                  <td>{seller.drivingLicense}</td>
                                  <td>{getStatusBadge(seller.status)}</td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="success"
                                        onClick={() => handleApproveSeller(seller.id)}
                                        className="d-flex align-items-center"
                                      >
                                        <CheckCircle size={14} className="me-1" />
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleRejectSeller(seller.id)}
                                        className="d-flex align-items-center"
                                      >
                                        <XCircle size={14} className="me-1" />
                                        Reject
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                )}

                {/* All Users Tab */}
                {activeTab === "all-users" && (
                  <Card className="shadow-sm">
                    <Card.Header className="bg-primary bg-opacity-10 border-primary">
                      <h5 className="mb-0 d-flex align-items-center">
                        <Users size={20} className="me-2" />
                        All Users ({allUsers.length})
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="bg-light">
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Role</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allUsers.map((user) => (
                              <tr key={user.id}>
                                <td className="fw-semibold">{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td>{getStatusBadge(user.status)}</td>
                                <td>
                                  {user.role !== 'admin' && (
                                    <Button
                                      size="sm"
                                      variant={user.status === 'active' ? 'warning' : 'success'}
                                      onClick={() => handleToggleUserStatus(user.id)}
                                      className="d-flex align-items-center"
                                    >
                                      {user.status === 'active' ? (
                                        <>
                                          <ToggleLeft size={14} className="me-1" />
                                          Suspend
                                        </>
                                      ) : (
                                        <>
                                          <ToggleRight size={14} className="me-1" />
                                          Activate
                                        </>
                                      )}
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* Active Sellers Tab */}
                {activeTab === "active-sellers" && (
                  <Card className="shadow-sm">
                    <Card.Header className="bg-success bg-opacity-10 border-success">
                      <h5 className="mb-0 d-flex align-items-center">
                        <UserCheck size={20} className="me-2" />
                        Active Sellers ({activeSellers.length})
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                      {activeSellers.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <UserCheck size={48} className="mb-3 opacity-50" />
                          <p>No active sellers</p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead className="bg-light">
                              <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>License</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeSellers.map((seller) => (
                                <tr key={seller.id}>
                                  <td className="fw-semibold">{seller.name}</td>
                                  <td>{seller.email}</td>
                                  <td>{seller.phone}</td>
                                  <td>{seller.drivingLicense}</td>
                                  <td>{getStatusBadge(seller.status)}</td>
                                  <td>
                                    <Button
                                      size="sm"
                                      variant="warning"
                                      onClick={() => handleToggleUserStatus(seller.id)}
                                      className="d-flex align-items-center"
                                    >
                                      <ToggleLeft size={14} className="me-1" />
                                      Suspend
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                )}

                {/* Enhanced Car Management Tab */}
                {activeTab === "car-management" && (
                  <div>
                    <Row>
                      {/* Car Models Section */}
                      <Col md={6} className="mb-4">
                        <Card className="shadow-sm">
                          <Card.Header className="bg-info bg-opacity-10 border-info d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 d-flex align-items-center">
                              <Car size={18} className="me-2" />
                              Car Models ({carModels.length})
                            </h6>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => {
                                resetCarModelForm();
                                setShowCarModelForm(true);
                              }}
                            >
                              Add Model
                            </Button>
                          </Card.Header>
                          <Card.Body>
                            {carModels.length === 0 ? (
                              <div className="text-center py-3 text-muted">
                                <Car size={32} className="mb-2 opacity-50" />
                                <p className="mb-0">No car models</p>
                              </div>
                            ) : (
                              <div className="list-group list-group-flush">
                                {carModels.map((model) => (
                                  <div key={model.id} className="list-group-item border-0 px-0">
                                    <div className="d-flex justify-content-between align-items-start">
                                      <div className="flex-grow-1">
                                        <h6 className="mb-1">{model.name}</h6>
                                        <small className="text-muted d-block">Type: {model.type}</small>
                                        <small className="text-muted">
                                          ₹{model.perDayRate}/day
                                        </small>
                                      </div>
                                      <div className="d-flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="outline-primary"
                                          onClick={() => handleEditCarModel(model)}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline-danger"
                                          onClick={() => handleDeleteCarModel(model.id)}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>

                      {/* Car Units Section */}
                      <Col md={6} className="mb-4">
                        <Card className="shadow-sm">
                          <Card.Header className="bg-secondary bg-opacity-10 border-secondary d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 d-flex align-items-center">
                              <Settings size={18} className="me-2" />
                              Car Units ({carUnits.length})
                            </h6>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => {
                                resetCarUnitForm();
                                setShowCarUnitForm(true);
                              }}
                            >
                              Add Unit
                            </Button>
                          </Card.Header>
                          <Card.Body>
                            {carUnits.length === 0 ? (
                              <div className="text-center py-3 text-muted">
                                <Settings size={32} className="mb-2 opacity-50" />
                                <p className="mb-0">No car units</p>
                              </div>
                            ) : (
                              <div className="list-group list-group-flush">
                                {carUnits.map((unit) => (
                                  <div key={unit.id} className="list-group-item border-0 px-0">
                                    <div className="d-flex justify-content-between align-items-start">
                                      <div className="flex-grow-1">
                                        <h6 className="mb-1">{unit.numberPlate}</h6>
                                        <small className="text-muted d-block">
                                          {unit.carModel?.name || 'Unknown Model'}
                                        </small>
                                        <Badge bg={unit.available ? "success" : "danger"}>
                                          {unit.available ? "Available" : "Unavailable"}
                                        </Badge>
                                      </div>
                                      <div className="d-flex gap-1">
                                        <Button
                                          size="sm"
                                          variant={unit.available ? "warning" : "success"}
                                          onClick={() => handleToggleUnitAvailability(unit.id, !unit.available)}
                                        >
                                          {unit.available ? "Disable" : "Enable"}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline-primary"
                                          onClick={() => handleEditCarUnit(unit)}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline-danger"
                                          onClick={() => handleDeleteCarUnit(unit.id)}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {/* Car Model Form Modal */}
                    {showCarModelForm && (
                      <div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">
                                {carModelForm.id ? 'Edit Car Model' : 'Add New Car Model'}
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => {
                                  setShowCarModelForm(false);
                                  resetCarModelForm();
                                }}
                              ></button>
                            </div>
                            <Form onSubmit={handleAddCarModel}>
                              <div className="modal-body">
                                <Form.Group className="mb-3">
                                  <Form.Label>Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={carModelForm.name}
                                    onChange={(e) => setCarModelForm({...carModelForm, name: e.target.value})}
                                    required
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>Type</Form.Label>
                                  <Form.Select
                                    value={carModelForm.type}
                                    onChange={(e) => setCarModelForm({...carModelForm, type: e.target.value})}
                                    required
                                  >
                                    <option value="">Select Type</option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Hatchback">Hatchback</option>
                                    <option value="Bike">Bike</option>
                                    <option value="Scooter">Scooter</option>
                                  </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>Image URL</Form.Label>
                                  <Form.Control
                                    type="url"
                                    value={carModelForm.imageUrl}
                                    onChange={(e) => setCarModelForm({...carModelForm, imageUrl: e.target.value})}
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>Per Day Rate (₹)</Form.Label>
                                  <Form.Control
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={carModelForm.perDayRate}
                                    onChange={(e) => setCarModelForm({...carModelForm, perDayRate: parseFloat(e.target.value) || 0})}
                                    required
                                  />
                                </Form.Group>
                              </div>
                              <div className="modal-footer">
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    setShowCarModelForm(false);
                                    resetCarModelForm();
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                  {carModelForm.id ? 'Update' : 'Create'}
                                </Button>
                              </div>
                            </Form>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Car Unit Form Modal */}
                    {showCarUnitForm && (
                      <div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">
                                {carUnitForm.id ? 'Edit Car Unit' : 'Add New Car Unit'}
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => {
                                  setShowCarUnitForm(false);
                                  resetCarUnitForm();
                                }}
                              ></button>
                            </div>
                            <Form onSubmit={handleAddCarUnit}>
                              <div className="modal-body">
                                <Form.Group className="mb-3">
                                  <Form.Label>Car Model</Form.Label>
                                  <Form.Select
                                    value={carUnitForm.carModelId || ""}
                                    onChange={(e) => setCarUnitForm({...carUnitForm, carModelId: parseInt(e.target.value)})}
                                    required
                                  >
                                    <option value="">Select Car Model</option>
                                    {carModels.map((model) => (
                                      <option key={model.id} value={model.id}>
                                        {model.name} ({model.type})
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Label>Number Plate</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={carUnitForm.numberPlate}
                                    onChange={(e) => setCarUnitForm({...carUnitForm, numberPlate: e.target.value})}
                                    placeholder="e.g., PB05AB1234"
                                    required
                                  />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                  <Form.Check
                                    type="checkbox"
                                    label="Available"
                                    checked={carUnitForm.available}
                                    onChange={(e) => setCarUnitForm({...carUnitForm, available: e.target.checked})}
                                  />
                                </Form.Group>
                              </div>
                              <div className="modal-footer">
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    setShowCarUnitForm(false);
                                    resetCarUnitForm();
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                  {carUnitForm.id ? 'Update' : 'Create'}
                                </Button>
                              </div>
                            </Form>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboard;