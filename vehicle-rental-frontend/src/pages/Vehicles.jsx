import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Form, InputGroup } from "react-bootstrap";
import { Search, Car, Filter } from "lucide-react";
import axiosInstance from "../api/axiosConfig";
import VehicleCard from "../components/VehicleCard";

const Vehicles = () => {
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/users/car-models");
        console.log("Fetched models:", res.data);
        const modelsArray = Array.isArray(res.data) ? res.data : [];
        setModels(modelsArray);
        setFilteredModels(modelsArray);
      } catch (err) {
        console.error("Error fetching car models:", err);
        setError('Failed to load vehicles. Please try again later.');
        setModels([]);
        setFilteredModels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    let filtered = models;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(model => model.type === selectedType);
    }

    setFilteredModels(filtered);
  }, [models, searchTerm, selectedType]);

  const vehicleTypes = [...new Set(models.map(model => model.type))];

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading vehicles...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <div className="d-flex align-items-center mb-4">
            <Car className="me-2" size={32} color="#10b981" />
            <h2 className="mb-0" style={{ color: '#1f2937' }}>Available Vehicles</h2>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Search and Filter */}
          <Row className="mb-4">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search vehicles by name or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          {filteredModels.length === 0 ? (
            <div className="text-center py-5">
              <Car size={64} color="#9ca3af" className="mb-3" />
              <h4 style={{ color: '#6b7280' }}>
                {models.length === 0 ? 'No vehicles available' : 'No vehicles match your search'}
              </h4>
              <p style={{ color: '#9ca3af' }}>
                {models.length === 0 
                  ? 'Please check back later for available vehicles.' 
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4" style={{ color: '#6b7280' }}>
                Showing {filteredModels.length} of {models.length} vehicles
              </p>
              <Row>
                {filteredModels.map((model) => (
                  <Col key={model.id} lg={4} md={6} className="mb-4">
                    <VehicleCard model={model} />
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Vehicles;
