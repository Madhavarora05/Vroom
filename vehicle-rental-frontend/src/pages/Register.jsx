import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { Eye, EyeOff, User, Mail, Key, CreditCard, UserCheck, Store, Phone } from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    phone: "",
    accountType: "user",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("danger");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Password confirmation check
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType("danger");
      setIsLoading(false);
      return;
    }

    // Password strength check
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long!");
      setMessageType("danger");
      setIsLoading(false);
      return;
    }

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        drivingLicense: formData.licenseNumber,
        role: formData.accountType,
        status: formData.accountType === 'seller' ? 'pending' : 'active'
      };

      const res = await axios.post("http://localhost:8080/api/users/register", registrationData);

      if (formData.accountType === 'seller') {
        setMessage("Seller account created successfully! Your account is pending admin approval. You will be notified later.");
      } else {
        setMessage("User registered successfully! You can now log in.");
      }

      setMessageType("success");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        licenseNumber: "",
        accountType: "user",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      setMessage("Registration failed. " + (err.response?.data?.message || err.message));
      setMessageType("danger");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          <Col md={8} lg={6} xl={5}>
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
                    <UserCheck className="text-white" size={28} />
                  </div>
                  <h2 className="fw-bold mb-2" style={{ color: '#1f2937' }}>Create Account</h2>
                  <p style={{ color: '#6b7280' }}>Join us today! It's quick and easy.</p>
                </div>

                {/* Alert Message */}
                {message && (
                  <Alert
                    variant={messageType}
                    className="mb-4"
                    style={{ 
                      borderRadius: '10px',
                      backgroundColor: messageType === "success" ? '#ecfdf5' : '#fef2f2',
                      borderColor: messageType === "success" ? '#10b981' : '#ef4444',
                      color: messageType === "success" ? '#065f46' : '#dc2626'
                    }}
                  >
                    {message}
                  </Alert>
                )}

                {/* Registration Form */}
                <Form onSubmit={handleSubmit}>
                  {/* Account Type Selection */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: '#374151' }}>Account Type</Form.Label>
                    <div className="d-flex gap-3">
                      <Form.Check
                        type="radio"
                        id="user"
                        name="accountType"
                        value="user"
                        checked={formData.accountType === 'user'}
                        onChange={handleChange}
                        label={
                          <div className="d-flex align-items-center">
                            <User size={18} className="me-2" style={{ color: '#10b981' }} />
                            <span style={{ color: '#374151' }}>User (Rent Cars)</span>
                          </div>
                        }
                        className="flex-fill"
                      />
                      <Form.Check
                        type="radio"
                        id="seller"
                        name="accountType"
                        value="seller"
                        checked={formData.accountType === 'seller'}
                        onChange={handleChange}
                        label={
                          <div className="d-flex align-items-center">
                            <Store size={18} className="me-2" style={{ color: '#10b981' }} />
                            <span style={{ color: '#374151' }}>Renter (List Cars)</span>
                          </div>
                        }
                        className="flex-fill"
                      />
                    </div>
                    {formData.accountType === 'seller' && (
                      <Form.Text style={{ color: '#6b7280' }}>
                        Seller accounts require admin approval before activation.
                      </Form.Text>
                    )}
                  </Form.Group>

                  {/* Full Name */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: '#374151' }}>Full Name</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
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
                      <User
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

                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: '#374151' }}>Email Address</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
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

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: '#374151' }}>Phone Number</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
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
                      <Phone 
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

                  {/* License Number */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: '#374151' }}>Driving License Number</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        name="licenseNumber"
                        placeholder="Enter your license number"
                        value={formData.licenseNumber}
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
                      <CreditCard
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

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ color: '#374151' }}>Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a password"
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

                  {/* Confirm Password */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold" style={{ color: '#374151' }}>Confirm Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
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
                        onClick={toggleConfirmPasswordVisibility}
                        className="btn p-0 position-absolute border-0 bg-transparent"
                        style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff style={{ color: '#6b7280' }} size={20} />
                        ) : (
                          <Eye style={{ color: '#6b7280' }} size={20} />
                        )}
                      </button>
                    </div>
                  </Form.Group>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-100 fw-bold py-3 border-0 mb-3"
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
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </Form>

                {/* Login Link */}
                <div className="text-center">
                  <span style={{ color: '#6b7280' }}>Already have an account? </span>
                  <Link
                    to="/login"
                    className="text-decoration-none fw-bold"
                    style={{ color: '#10b981' }}
                  >
                    Sign in here
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

export default Register;