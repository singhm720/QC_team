import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate if you're using react-router
import 'bootstrap/dist/css/bootstrap.min.css';
import url from "../config";

const RouterInfo = () => {
  const [formData, setFormData] = useState({
    router_id: '',
    ping_break_after_reset: '',
    router_signal: '',
    router_sim: '',
    smoke_status: '',
    antenna_location: '',
    antenna_type: '',
    cabling: '',
    router_serial_number: '',
    sim_number: ''
  });

  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to submit data
  const submitData = async (redirect = false) => {
    try {
      const response = await fetch(`${url}submit_router_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Use formData directly
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Success message
        if (redirect) {
          navigate('/dashboard/infrastructure'); // Redirect if Save & Next is clicked
        }
      } else {
        alert(`Error: ${data.error}`); // Show error
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting the form.');
    }
  };

  // Function for Save button
  const handleSave = async (e) => {
    e.preventDefault();
    await submitData(); // Save data but don't redirect
  };

  // Function for Save & Next button
  const handleSaveAndNext = async (e) => {
    e.preventDefault();
    await submitData(true); // Save data and redirect to next page
  };

  return (
    <div className="container">
      <div className="row col-lg-12">
        {/* Left aligned inputs */}
        <div className="col-lg-6">
          <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="router_id" className="form-label">Router ID:</label>
              <input type="text" className="form-control" id="router_id" placeholder="Enter Router ID" name="router_id" value={formData.router_id} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="ping_break_after_reset" className="form-label">Ping Break After Reset:</label>
              <input type="text" className="form-control" id="ping_break_after_reset" placeholder="Enter Ping Break After Reset" name="ping_break_after_reset" value={formData.ping_break_after_reset} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="router_signal" className="form-label">Router Signal:</label>
              <input type="text" className="form-control" id="router_signal" placeholder="Enter Router Signal" name="router_signal" value={formData.router_signal} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="router_sim" className="form-label">Router SIM:</label>
              <input type="text" className="form-control" id="router_sim" placeholder="Enter Router SIM" name="router_sim" value={formData.router_sim} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="smoke_status" className="form-label">Smoke Status:</label>
              <input type="text" className="form-control" id="smoke_status" placeholder="Enter Smoke Status" name="smoke_status" value={formData.smoke_status} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="antenna_location" className="form-label">Antenna Location:</label>
              <input type="text" className="form-control" id="antenna_location" placeholder="Enter Antenna Location" name="antenna_location" value={formData.antenna_location} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Right aligned inputs */}
        <div className="col-lg-6">
          <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="antenna_type" className="form-label">Antenna Type:</label>
              <input type="text" className="form-control" id="antenna_type" placeholder="Enter Antenna Type" name="antenna_type" value={formData.antenna_type} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="cabling" className="form-label">Cabling:</label>
              <input type="text" className="form-control" id="cabling" placeholder="Enter Cabling" name="cabling" value={formData.cabling} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="router_serial_number" className="form-label">Router Serial Number:</label>
              <input type="text" className="form-control" id="router_serial_number" placeholder="Enter Router Serial Number" name="router_serial_number" value={formData.router_serial_number} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="sim_number" className="form-label">SIM Number:</label>
              <input type="text" className="form-control" id="sim_number" placeholder="Enter SIM Number" name="sim_number" value={formData.sim_number} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <button type="button" className="btn btn-success me-2" id="save_id" onClick={handleSave}>Save</button>
              <button type="button" className="btn btn-success" id="sane_id" onClick={handleSaveAndNext}>Save & Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouterInfo;
