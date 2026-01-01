import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, User, LogOut, Home, Info, Phone, Calendar, Search } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#1f2937' }} variant="dark" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <Car className="me-2" size={28} />
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Vroom</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <Home size={18} className="me-1" />
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="d-flex align-items-center">
              <Info size={18} className="me-1" />
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="d-flex align-items-center">
              <Phone size={18} className="me-1" />
              Contact
            </Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/vehicles" className="d-flex align-items-center">
                  <Search size={18} className="me-1" />
                  Vehicles
                </Nav.Link>
                <Nav.Link as={Link} to="/bookings" className="d-flex align-items-center">
                  <Calendar size={18} className="me-1" />
                  My Bookings
                </Nav.Link>
                {user?.role === 'seller' && (
                  <Nav.Link as={Link} to="/seller/dashboard" className="d-flex align-items-center">
                    <Car size={18} className="me-1" />
                    Seller Dashboard
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <div className="d-flex align-items-center">
                <span className="text-light me-3 d-flex align-items-center">
                  <User size={18} className="me-1" />
                  Welcome, {user?.name}
                </span>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleLogout}
                  className="d-flex align-items-center"
                >
                  <LogOut size={16} className="me-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-light" 
                  size="sm" 
                  className="me-2"
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  size="sm"
                >
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;