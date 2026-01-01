import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { Shield, Mail, Key, Eye, EyeOff } from "lucide-react";

// Configure axios to include credentials (cookies) in requests
axios.defaults.withCredentials = true;

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8080/api/users/login", formData);
      
      // Check if the logged-in user is an admin
      if (response.data.user.role !== 'admin') {
        setMessage("Access denied. Admin privileges required.");
        setIsLoading(false);
        return;
      }

      setMessage("Admin login successful!");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      if (message.toLowerCase().includes("not found") || message.toLowerCase().includes("invalid")) {
        setMessage("Invalid credentials. Please check your email and password.");
      } else {
        setMessage("Login failed. " + message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center"
      style={{
        background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
              <Card.Body className="p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div 
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
                      borderRadius: '50%'
                    }}
                  >
                    <Shield className="text-white" size={28} />
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Admin Portal</h2>
                  <p className="text-muted">Secure admin access</p>
                </div>

                {/* Alert Message */}
                {message && (
                  <Alert 
                    variant={message.includes("successful") ? "success" : "danger"}
                    className="mb-4"
                    style={{ borderRadius: '10px' }}
                  >
                    {message}
                  </Alert>
                )}

                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-dark">Admin Email</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter admin email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="ps-5"
                        style={{ 
                          borderRadius: '10px',
                          border: '2px solid #e9ecef',
                          paddingTop: '12px',
                          paddingBottom: '12px'
                        }}
                      />
                      <Mail 
                        className="position-absolute text-muted"
                        size={20}
                        style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark">Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter admin password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="ps-5 pe-5"
                        style={{ 
                          borderRadius: '10px',
                          border: '2px solid #e9ecef',
                          paddingTop: '12px',
                          paddingBottom: '12px'
                        }}
                      />
                      <Key 
                        className="position-absolute text-muted"
                        size={20}
                        style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="btn p-0 position-absolute border-0 bg-transparent"
                        style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                      >
                        {showPassword ? (
                          <EyeOff className="text-muted" size={20} />
                        ) : (
                          <Eye className="text-muted" size={20} />
                        )}
                      </button>
                    </div>
                  </Form.Group>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-100 fw-bold py-3 border-0"
                    style={{
                      background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
                      borderRadius: '10px',
                      fontSize: '16px'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        Signing In...
                      </>
                    ) : (
                      "Access Admin Panel"
                    )}
                  </Button>
                </Form>

                {/* Security Notice */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    <Shield size={14} className="me-1" />
                    Authorized personnel only
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminLogin;