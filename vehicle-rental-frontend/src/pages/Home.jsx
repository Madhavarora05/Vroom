import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import axios from "axios";

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [searchData, setSearchData] = useState({
    location: '',
    tripStart: '',
    tripEnd: '',
    deliveryPickup: false
  });
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // Popular Indian cities with pin codes for demonstration
  const popularCities = [
    { name: "Mumbai", pincode: "400001" },
    { name: "Delhi", pincode: "110001" },
    { name: "Bangalore", pincode: "560001" },
    { name: "Hyderabad", pincode: "500001" },
    { name: "Chennai", pincode: "600001" },
    { name: "Kolkata", pincode: "700001" },
    { name: "Pune", pincode: "411001" },
    { name: "Ahmedabad", pincode: "380001" }
  ];

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const res = await axiosInstance.get("/api/users/car-models");
        setFeaturedCars(res.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching featured cars:", err);
      }
    };

    fetchFeaturedCars();

    // Set default dates (today and day after tomorrow)
    const today = new Date();
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    
    setSearchData(prev => ({
      ...prev,
      tripStart: today.toISOString().slice(0, 16),
      tripEnd: dayAfterTomorrow.toISOString().slice(0, 16)
    }));
  }, []);

  // Function to fetch location data from RapidAPI
  const fetchLocationData = async (pincode) => {
    try {
      const response = await axios.get(
        `https://get-city-and-state-for-india-pin-codes.p.rapidapi.com/items/${pincode}`,
        {
          headers: {
            'x-rapidapi-host': 'get-city-and-state-for-india-pin-codes.p.rapidapi.com',
            'x-rapidapi-key': 'f43a289ffemsh21c5e4ca064b8edp15bcd6jsnae8f60322769'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  };

  // Handle location input change
  const handleLocationChange = async (e) => {
    const value = e.target.value;
    setSearchData(prev => ({ ...prev, location: value }));

    if (value.length > 2) {
      setIsSearchingLocation(true);
      setShowSuggestions(true);

      // Filter popular cities based on input
      const filteredCities = popularCities.filter(city =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );

      // If input is a pincode (6 digits), fetch from API
      if (/^\d{6}$/.test(value)) {
        const locationData = await fetchLocationData(value);
        if (locationData && locationData.city && locationData.state) {
          const apiSuggestion = {
            name: `${locationData.city}, ${locationData.state}`,
            pincode: value,
            isFromAPI: true
          };
          setLocationSuggestions([apiSuggestion, ...filteredCities]);
        } else {
          setLocationSuggestions(filteredCities);
        }
      } else {
        setLocationSuggestions(filteredCities);
      }

      setIsSearchingLocation(false);
    } else {
      setShowSuggestions(false);
      setLocationSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setSearchData(prev => ({ ...prev, location: suggestion.name }));
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  const handleSearchChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'location') {
      handleLocationChange(e);
      return;
    }

    setSearchData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to vehicles page with search parameters
    const searchParams = new URLSearchParams({
      location: searchData.location,
      startDate: searchData.tripStart,
      endDate: searchData.tripEnd,
      delivery: searchData.deliveryPickup
    });
    window.location.href = `/vehicles?${searchParams.toString()}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="position-relative d-flex align-items-center"
        style={{
          height: '100vh',
          backgroundImage: 'url(https://keraladayz.com/wp-content/uploads/2021/12/Car-Rental-2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden'
        }}
      >
        {/* Overlay for better text readability */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            zIndex: 1
          }}
        />
        
        <Container fluid className="h-100 position-relative" style={{ zIndex: 2 }}>
          <Row className="h-100 align-items-center">
            <Col md={6}>
              {/* Empty space for the left side */}
            </Col>
            
            <Col md={6} className="pe-5">
              {/* Search Box */}
              <Card 
                className="shadow-lg border-0"
                style={{ 
                  borderRadius: '15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <h5 className="fw-bold mb-1" style={{ color: '#1f2937' }}>
                      Looking for Best Car Rentals?
                    </h5>
                    <h4 className="fw-bold mb-3" style={{ color: '#10b981' }}>
                      Book Self-Drive Cars in <span style={{ color: '#1f2937' }}>Your City</span>
                    </h4>
                  </div>

                  <Form onSubmit={handleSearch}>
                    {/* Location */}
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label className="fw-semibold" style={{ color: '#374151' }}>
                        Location
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        placeholder="Enter city name or pincode"
                        value={searchData.location}
                        onChange={handleSearchChange}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#10b981';
                          if (locationSuggestions.length > 0) {
                            setShowSuggestions(true);
                          }
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          // Delay hiding suggestions to allow click
                          setTimeout(() => setShowSuggestions(false), 200);
                        }}
                        required
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #d1d5db',
                          padding: '12px'
                        }}
                      />
                      
                      {/* Location Suggestions */}
                      {showSuggestions && locationSuggestions.length > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            backgroundColor: 'white',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            maxHeight: '200px',
                            overflowY: 'auto'
                          }}
                        >
                          <ListGroup variant="flush">
                            {locationSuggestions.map((suggestion, index) => (
                              <ListGroup.Item
                                key={index}
                                action
                                onClick={() => handleSuggestionSelect(suggestion)}
                                style={{
                                  cursor: 'pointer',
                                  border: 'none',
                                  padding: '12px 16px'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = '#f3f4f6';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = 'transparent';
                                }}
                              >
                                <div>
                                  <strong>{suggestion.name}</strong>
                                  {suggestion.isFromAPI && (
                                    <small className="text-muted d-block">
                                      Pincode: {suggestion.pincode}
                                    </small>
                                  )}
                                </div>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </div>
                      )}
                      
                      {isSearchingLocation && (
                        <small className="text-muted">Searching locations...</small>
                      )}
                    </Form.Group>

                    {/* Trip Dates */}
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold" style={{ color: '#374151' }}>
                            Trip Starts
                          </Form.Label>
                          <Form.Control
                            type="datetime-local"
                            name="tripStart"
                            value={searchData.tripStart}
                            onChange={handleSearchChange}
                            required
                            style={{
                              borderRadius: '8px',
                              border: '2px solid #d1d5db',
                              padding: '12px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#10b981'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold" style={{ color: '#374151' }}>
                            Trip Ends
                          </Form.Label>
                          <Form.Control
                            type="datetime-local"
                            name="tripEnd"
                            value={searchData.tripEnd}
                            onChange={handleSearchChange}
                            required
                            style={{
                              borderRadius: '8px',
                              border: '2px solid #d1d5db',
                              padding: '12px'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#10b981'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Delivery Option */}
                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        name="deliveryPickup"
                        checked={searchData.deliveryPickup}
                        onChange={handleSearchChange}
                        label={
                          <span style={{ color: '#374151' }}>
                            Delivery & Pick-up, from anywhere
                          </span>
                        }
                        style={{ color: '#374151' }}
                      />
                    </Form.Group>

                    {/* Search Button */}
                    <Button
                      type="submit"
                      className="w-100 fw-bold py-3 border-0"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '10px',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      SEARCH
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={10} xl={8}>
              <h2 className="display-4 fw-bold text-dark mb-4">
                Find the Best <span style={{ color: '#10b981' }}>Car For You</span>
              </h2>
              
              <p className="lead text-muted lh-lg">
                Experience the freedom of self-drive car rentals with our premium fleet. 
                Whether you need a car for a day trip, weekend getaway, or extended journey, 
                we have the perfect vehicle for every occasion. Book now and drive your way 
                to adventure with confidence and convenience.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Cars Section */}
      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col>
              <h2 className="text-center fw-bold mb-4">Featured Vehicles</h2>
              <p className="text-center text-muted mb-5">Discover our premium fleet of vehicles</p>
            </Col>
          </Row>
          
          <Row>
            {featuredCars.length > 0 ? (
              featuredCars.map((car) => (
                <Col md={4} key={car.id} className="mb-4">
                  <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '12px' }}>
                    <Card.Img 
                      variant="top" 
                      src={car.imageUrl || "https://via.placeholder.com/300x200?text=Car+Image"} 
                      style={{ 
                        height: "200px", 
                        objectFit: "cover",
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px'
                      }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title style={{ color: '#1f2937' }}>{car.name || "Car Model"}</Card.Title>
                      <Card.Text className="text-muted">{car.type || "Vehicle Type"}</Card.Text>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between mb-3">
                          <span className="fw-bold" style={{ color: '#10b981' }}>
                            ₹{car.perDayRate}/day
                          </span>
                        </div>
                        <Link 
                          to="/vehicles" 
                          className="btn w-100 fw-semibold"
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                        >
                          View All Vehicles
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <p className="text-center text-muted">Loading featured vehicles...</p>
              </Col>
            )}
          </Row>
          
          <Row className="mt-4">
            <Col className="text-center">
              <Link 
                to="/vehicles" 
                className="btn btn-lg fw-semibold px-5 py-3"
                style={{
                  borderColor: '#10b981',
                  color: '#10b981',
                  borderRadius: '10px',
                  borderWidth: '2px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#10b981';
                }}
              >
                Browse All Vehicles
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;