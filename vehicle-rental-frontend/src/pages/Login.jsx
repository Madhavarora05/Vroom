import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { Eye, EyeOff, Lock, Mail, Key } from "lucide-react";

// Configure axios to include credentials (cookies) in requests
axios.defaults.withCredentials = true;

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      login(response.data.user);
      setMessage("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      if (message.toLowerCase().includes("not found") || message.toLowerCase().includes("invalid")) {
        setMessage("User not found. Please check your credentials or register.");
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
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '50%'
                    }}
                  >
                    <Lock className="text-white" size={28} />
                  </div>
                  <h2 className="fw-bold mb-2" style={{ color: '#1f2937' }}>Welcome Back!</h2>
                  <p style={{ color: '#6b7280' }}>Sign in to your account</p>
                </div>

                {/* Alert Message */}
                {message && (
                  <Alert 
                    variant={message.includes("successful") ? "success" : "danger"}
                    className="mb-4"
                    style={{ 
                      borderRadius: '10px',
                      backgroundColor: message.includes("successful") ? '#ecfdf5' : '#fef2f2',
                      borderColor: message.includes("successful") ? '#10b981' : '#ef4444',
                      color: message.includes("successful") ? '#065f46' : '#dc2626'
                    }}
                  >
                    {message}
                  </Alert>
                )}

                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: '#374151' }}>Email Address</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="ps-5"
                        style={{ 
                          borderRadius: '10px',
                          border: '2px solid #d1d5db',
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#10b981'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                      />
                      <Mail 
                        className="position-absolute"
                        size={20}
                        style={{ 
                          left: '12px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          color: '#6b7280'
                        }}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold" style={{ color: '#374151' }}>Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="ps-5 pe-5"
                        style={{ 
                          borderRadius: '10px',
                          border: '2px solid #d1d5db',
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          backgroundColor: 'white'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#10b981'}
                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                      />
                      <Key 
                        className="position-absolute"
                        size={20}
                        style={{ 
                          left: '12px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          color: '#6b7280'
                        }}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="btn p-0 position-absolute border-0 bg-transparent"
                        style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                      >
                        {showPassword ? (
                          <EyeOff style={{ color: '#6b7280' }} size={20} />
                        ) : (
                          <Eye style={{ color: '#6b7280' }} size={20} />
                        )}
                      </button>
                    </div>
                  </Form.Group>

                  {/* Forgot Password Link */}
                  <div className="text-end mb-4">
                    <Link 
                      to="/forgot-password" 
                      className="text-decoration-none fw-semibold"
                      style={{ color: '#10b981' }}
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-100 fw-bold py-3 border-0"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '10px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
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
                      "Sign In"
                    )}
                  </Button>
                </Form>

                {/* Register Link */}
                <div className="text-center mt-4">
                  <span style={{ color: '#6b7280' }}>New user? </span>
                  <Link 
                    to="/register" 
                    className="text-decoration-none fw-bold"
                    style={{ color: '#10b981' }}
                  >
                    Register here
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;