import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container, Row, Col, Form, Button, Card, Alert, Spinner
} from "react-bootstrap";
import { Mail, Key } from "lucide-react";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email step, 2: New password step
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("danger");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8080/api/users/check-email", {
        email: formData.email
      });

      if (response.data.exists) {
        setStep(2);
        setMessage("Email verified! Please enter your new password.");
        setMessageType("success");
      } else {
        setMessage("No account found with this email address.");
        setMessageType("danger");
      }
    } catch (err) {
      setMessage("Error verifying email. Please try again.");
      setMessageType("danger");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType("danger");
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long!");
      setMessageType("danger");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/users/reset-password", {
        email: formData.email,
        newPassword: formData.newPassword,
      });

      setMessage("Password reset successful! You can now log in.");
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setMessage("Failed to reset password. Please try again.");
      setMessageType("danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%'
                    }}
                  >
                    <Key className="text-white" size={28} />
                  </div>
                  <h2 className="fw-bold text-dark mb-2">
                    {step === 1 ? "Forgot Password?" : "Reset Password"}
                  </h2>
                  <p className="text-muted">
                    {step === 1 
                      ? "Enter your email address to reset your password." 
                      : "Enter your new password below."}
                  </p>
                </div>

                {/* Alert Message */}
                {message && (
                  <Alert 
                    variant={messageType}
                    className="mb-4"
                    style={{ borderRadius: '10px' }}
                  >
                    {message}
                  </Alert>
                )}

                {/* Step 1: Enter Email */}
                {step === 1 && (
                  <Form onSubmit={handleEmailSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-dark">Email Address</Form.Label>
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

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-100 fw-bold py-3 border-0 mb-3"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px',
                        fontSize: '16px'
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Email"
                      )}
                    </Button>
                  </Form>
                )}

                {/* Step 2: Enter New Password */}
                {step === 2 && (
                  <Form onSubmit={handlePasswordSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-dark">New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        style={{ 
                          borderRadius: '10px',
                          border: '2px solid #e9ecef',
                          paddingTop: '12px',
                          paddingBottom: '12px'
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-dark">Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        style={{ 
                          borderRadius: '10px',
                          border: '2px solid #e9ecef',
                          paddingTop: '12px',
                          paddingBottom: '12px'
                        }}
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-100 fw-bold py-3 border-0"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '10px',
                        fontSize: '16px'
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                          Resetting...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </Form>
                )}

                {/* Back to login */}
                <div className="text-center mt-4">
                  <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#667eea' }}>
                    Back to Login
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

export default ForgotPassword;
