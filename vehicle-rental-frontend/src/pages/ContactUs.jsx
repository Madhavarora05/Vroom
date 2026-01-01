import React, { useState } from 'react';
import './styles/ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for your message! We will get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 2000);
  };

  return (
    <div className="contact-us">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>We're here to help with all your vehicle rental needs</p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Phone Support</h3>
              <p>Speak directly with our customer service team</p>
              <div className="contact-details">
                <p><strong>India:</strong> +91 1800-VROOM-24</p>
                <p><strong>International:</strong> +1-800-VROOM-24</p>
                <p className="hours">Available 24/7</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">✉️</div>
              <h3>Email Support</h3>
              <p>Send us your questions and we'll respond quickly</p>
              <div className="contact-details">
                <p><strong>General:</strong> info@vroom.com</p>
                <p><strong>Support:</strong> support@vroom.com</p>
                <p><strong>Business:</strong> business@vroom.com</p>
                <p className="hours">Response within 24 hours</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">💬</div>
              <h3>Live Chat</h3>
              <p>Get instant help from our support team</p>
              <div className="contact-details">
                <p>Available on our website and mobile app</p>
                <p className="hours">Mon-Sun: 6:00 AM - 11:00 PM IST</p>
                <button className="chat-btn">Start Live Chat</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-content-grid">
            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inquiryType">Inquiry Type</label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="booking">Booking Support</option>
                      <option value="technical">Technical Issue</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="complaint">Complaint</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {submitMessage && (
                  <div className="success-message">{submitMessage}</div>
                )}
              </form>
            </div>

            {/* Office Locations */}
            <div className="office-locations">
              <h2>Our Offices</h2>
              
              <div className="office-card">
                <h3>🏢 Headquarters - Mumbai</h3>
                <div className="office-details">
                  <p>Vroom Technologies Pvt. Ltd.</p>
                  <p>Level 15, One World Center</p>
                  <p>Tower 2B, Jupiter Mill Compound</p>
                  <p>841, Senapati Bapat Marg</p>
                  <p>Elphinstone Road, Mumbai - 400013</p>
                  <p><strong>Phone:</strong> +91 22 6666 7777</p>
                </div>
              </div>

              <div className="office-card">
                <h3>🏢 Technology Hub - Bangalore</h3>
                <div className="office-details">
                  <p>Vroom Tech Center</p>
                  <p>Embassy Tech Village</p>
                  <p>Outer Ring Road, Devarabisanahalli</p>
                  <p>Bangalore - 560103</p>
                  <p><strong>Phone:</strong> +91 80 4444 5555</p>
                </div>
              </div>

              <div className="office-card">
                <h3>🏢 Regional Office - Delhi</h3>
                <div className="office-details">
                  <p>Vroom North Region</p>
                  <p>DLF Cyber City, Building 10</p>
                  <p>DLF Phase II</p>
                  <p>Gurugram, Haryana - 122002</p>
                  <p><strong>Phone:</strong> +91 124 3333 4444</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How can I modify or cancel my booking?</h3>
              <p>You can modify or cancel your booking through your Vroom account or by contacting our customer support team. Cancellation policies vary by rental partner.</p>
            </div>
            <div className="faq-item">
              <h3>What documents do I need to rent a car?</h3>
              <p>You'll need a valid driver's license, a credit card in the primary driver's name, and a government-issued ID. International renters may need an International Driving Permit.</p>
            </div>
            <div className="faq-item">
              <h3>Is there a minimum age requirement?</h3>
              <p>The minimum age is typically 21 years, though this may vary by location and car category. Drivers under 25 may incur additional fees.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer 24/7 roadside assistance?</h3>
              <p>Yes, we provide 24/7 roadside assistance for all our rental vehicles. Contact details are provided with your rental agreement.</p>
            </div>
            <div className="faq-item">
              <h3>Can I add additional drivers?</h3>
              <p>Yes, you can add additional drivers to your rental. Additional fees may apply, and all drivers must meet the same requirements as the primary renter.</p>
            </div>
            <div className="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>We accept major credit cards (Visa, MasterCard, American Express), debit cards, and digital payment methods like UPI and digital wallets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="emergency-section">
        <div className="container">
          <div className="emergency-card">
            <h2>🚨 Emergency Assistance</h2>
            <p>If you're experiencing an emergency during your rental, contact us immediately:</p>
            <div className="emergency-contacts">
              <div className="emergency-contact">
                <strong>24/7 Emergency Hotline:</strong>
                <span>+91 1800-EMERGENCY</span>
              </div>
              <div className="emergency-contact">
                <strong>Roadside Assistance:</strong>
                <span>+91 1800-ROADHELP</span>
              </div>
              <div className="emergency-contact">
                <strong>WhatsApp Support:</strong>
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="social-section">
        <div className="container">
          <h2>Connect With Us</h2>
          <p>Follow us on social media for updates, travel tips, and special offers</p>
          <div className="social-links">
            <a href="#" className="social-link facebook">📘 Facebook</a>
            <a href="#" className="social-link twitter">🐦 Twitter</a>
            <a href="#" className="social-link instagram">📷 Instagram</a>
            <a href="#" className="social-link linkedin">💼 LinkedIn</a>
            <a href="#" className="social-link youtube">📺 YouTube</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;