import React from 'react';
import './styles/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>To empower people to discover the freedom and joy of travel</h1>
          <p className="hero-subtitle">
            Vroom seeks to be the world's most reliable vehicle rental platform through creating 
            a seamless rental experience by making the booking process clear, effortless, and enjoyable.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>50+</h3>
              <p>cities</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>locations</p>
            </div>
            <div className="stat-item">
              <h3>100+</h3>
              <p>partners</p>
            </div>
            <div className="stat-item">
              <h3>10K+</h3>
              <p>happy customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="story-section">
        <div className="container">
          <h2>Vroom: Your Premier Vehicle Rental Platform</h2>
          <div className="story-content">
            <p>
              Founded in 2024, Vroom has quickly established itself as a trusted name in the vehicle rental industry. 
              Our platform connects travelers with a diverse fleet of vehicles, from economy cars to luxury SUVs, 
              ensuring every journey is perfectly matched with the right vehicle.
            </p>
            <p>
              We work with both renowned international rental companies and trusted local partners to offer 
              competitive rates and exceptional service. Our commitment to transparency means all fees are 
              clearly displayed upfront - no hidden surprises at pickup.
            </p>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="focus-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="focus-grid">
            <div className="focus-item">
              <div className="focus-icon">🎯</div>
              <h3>Customer Satisfaction</h3>
              <p>Your experience is our priority. We ensure every rental exceeds expectations.</p>
            </div>
            <div className="focus-item">
              <div className="focus-icon">⭐</div>
              <h3>Quality Fleet</h3>
              <p>Well-maintained vehicles from trusted partners for your safety and comfort.</p>
            </div>
            <div className="focus-item">
              <div className="focus-icon">💚</div>
              <h3>Environmental Responsibility</h3>
              <p>Promoting eco-friendly travel with hybrid and electric vehicle options.</p>
            </div>
            <div className="focus-item">
              <div className="focus-icon">🔒</div>
              <h3>Trust & Transparency</h3>
              <p>Clear pricing, reliable service, and secure booking process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="reviews-section">
        <div className="container">
          <h2>Customer Recommended</h2>
          <p>We highly value reviews from our customers. They help us make our service even better.</p>
          <div className="reviews-grid">
            <div className="review-card">
              <div className="rating">★★★★★</div>
              <p>"Seamless booking experience and excellent customer service. Highly recommended!"</p>
              <span>- Sarah M.</span>
            </div>
            <div className="review-card">
              <div className="rating">★★★★★</div>
              <p>"Great selection of vehicles and transparent pricing. Will definitely use again."</p>
              <span>- John D.</span>
            </div>
            <div className="review-card">
              <div className="rating">★★★★★</div>
              <p>"Professional service and well-maintained cars. Perfect for our family vacation."</p>
              <span>- Maria L.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="team-section">
        <div className="container">
          <h2>Our Leadership Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">👨‍💼</div>
              <h3>Madhav Sharma</h3>
              <p className="title">CEO & Founder</p>
              <p>Visionary leader with 10+ years in the travel and technology industry, passionate about revolutionizing vehicle rentals.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">👩‍💼</div>
              <h3>Priya Patel</h3>
              <p className="title">CTO</p>
              <p>Tech expert leading our platform development with expertise in scalable systems and user experience design.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">👨‍💼</div>
              <h3>Rahul Kumar</h3>
              <p className="title">Head of Operations</p>
              <p>Operations specialist ensuring seamless service delivery and partner relationship management across all locations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="timeline-section">
        <div className="container">
          <h2>Our Journey</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">2024</div>
              <div className="timeline-content">
                <h3>January</h3>
                <p>Vroom is founded with a vision to simplify vehicle rentals</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2024</div>
              <div className="timeline-content">
                <h3>March</h3>
                <p>Platform launches with 50+ vehicles across 10 cities</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2024</div>
              <div className="timeline-content">
                <h3>June</h3>
                <p>Reached 1,000+ successful bookings milestone</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2024</div>
              <div className="timeline-content">
                <h3>December</h3>
                <p>Expanded to 50+ cities with 500+ vehicles in our network</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>What We Value</h2>
          <p>These values guide us in creating an exceptional rental experience for every customer.</p>
          <div className="values-grid">
            <div className="value-item">Innovation</div>
            <div className="value-item">Reliability</div>
            <div className="value-item">Customer Focus</div>
            <div className="value-item">Transparency</div>
            <div className="value-item">Sustainability</div>
            <div className="value-item">Excellence</div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of satisfied customers who trust Vroom for their travel needs.</p>
          <div className="cta-buttons">
            <button className="btn-primary">Book Now</button>
            <button className="btn-secondary">Contact Us</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;