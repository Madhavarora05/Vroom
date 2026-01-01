import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig';

const VehicleCard = ({ model }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const calculateCost = () => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays * model.perDayRate;
  };

  const fetchAvailableUnits = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/users/available-units', {
        params: {
          carModelId: model.id,
          startDate: startDate,
          endDate: endDate
        },
        withCredentials: true
      });
      setUnits(response.data);
    } catch (error) {
      console.error('Error fetching available units:', error);
      if (error.response?.status === 403) {
        alert('Please login to check availability');
      } else {
        alert('Error checking availability');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (unitId) => {
    try {
      const response = await axiosInstance.post('/api/users/book', {
        carUnitId: unitId,
        startDate: startDate,
        endDate: endDate
      }, {
        withCredentials: true
      });
      
      alert('Booking successful!');
      setUnits([]);
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Error booking vehicle:', error);
      if (error.response?.status === 403) {
        alert('Please login to make a booking');
      } else {
        alert(error.response?.data?.message || 'Error creating booking');
      }
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden', transition: 'all 0.3s ease' }}
         onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
         onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      {/* Car Image */}
      {model.imageUrl && (
        <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
          <img
            src={model.imageUrl}
            alt={model.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x200/e5e7eb/6b7280?text=Car+Image";
            }}
          />
        </div>
      )}

      {/* Car Details */}
      <div className="card-body">
        <h5 className="card-title fw-bold mb-2" style={{ color: '#1f2937', fontSize: '1.25rem' }}>{model.name}</h5>
        <p className="card-text mb-2" style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          <span className="fw-semibold">Type:</span> <span className="badge bg-light text-dark ms-1">{model.type}</span>
        </p>
        
        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <div className="h5 fw-bold mb-0" style={{ color: '#10b981' }}>
            ₹{model.perDayRate}/day
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-4">
          <div className="row">
            <div className="col-6">
              <label className="form-label small fw-semibold" style={{ color: '#374151' }}>
                Start Date:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={today}
                className="form-control form-control-sm"
              />
            </div>
            
            <div className="col-6">
              <label className="form-label small fw-semibold" style={{ color: '#374151' }}>
                End Date:
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || today}
                className="form-control form-control-sm"
              />
            </div>
          </div>
      </div>

        {/* Cost Estimation */}
        {startDate && endDate && (
          <div className="alert alert-success py-2 mb-3" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <small style={{ color: '#15803d' }}>
              <strong>Total Cost: </strong>
              ₹{calculateCost().toFixed(2)} ({Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days)
            </small>
          </div>
        )}

        {/* Check Availability Button */}
        <button
          onClick={fetchAvailableUnits}
          disabled={loading || !startDate || !endDate}
          className={`btn w-100 fw-semibold ${
            loading || !startDate || !endDate ? 'btn-secondary' : 'btn-success'
          }`}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Checking...
            </>
          ) : (
            "Check Availability"
          )}
        </button>

        {/* Available Units */}
        {units.length > 0 && (
          <div className="mt-3 p-3 rounded" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <h6 className="fw-semibold mb-3" style={{ color: '#15803d' }}>
              Available Units ({units.length}):
            </h6>
            <div className="d-grid gap-2">
              {units.map((unit) => (
                <div key={unit.id} className="d-flex justify-content-between align-items-center bg-white p-2 rounded border">
                  <span className="fw-medium" style={{ color: '#374151', fontSize: '0.9rem' }}>
                    {unit.numberPlate}
                  </span>
                  <button
                    onClick={() => handleBook(unit.id)}
                    className="btn btn-success btn-sm"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Units Available Message */}
        {units.length === 0 && startDate && endDate && !loading && (
          <div className="mt-3 alert alert-danger py-2" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
            <small style={{ color: '#dc2626' }}>
              No units available for the selected dates.
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;