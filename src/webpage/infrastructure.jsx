import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import url from "../config";

const Infrastructure = () => {
  const [formData, setFormData] = useState({
    core_cable: '',
    line_nutral: '',
    line_earth: '',
    earth_nutral: '',
    panel_battery_voltage: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      });
  };

  const handleSubmit = async () => {
      try {
          const response = await fetch(`${url}submit_infrastructure`, { // Corrected the endpoint
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
          });

          const result = await response.json();
          if (response.ok) {
              alert(result.message);
          } else {
              alert(result.error);
          }
      } catch (error) {
          console.error('Error:', error);
          alert('Failed to submit data.');
      }
  };

  const handleSave = async (e) => {
      e.preventDefault();
      await handleSubmit();  // Just save the data
  };

  const handleSaveAndNext = async (e) => {
      e.preventDefault();
      await handleSubmit();  // Save the data
      navigate('/dashboard/finalstatus');  // Redirect to the next page after saving
  };

  return (
    <div className="container">
      <div className="row col-lg-12">
        {/* Left aligned inputs */}
        <div className="col-lg-6">
          <div className="border border-secondary p-3 rounded">
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label htmlFor="core_cable" className="form-label">Core Cable:</label>
                <input type="text" className="form-control" id="core_cable" placeholder="Enter Core Cable" name="core_cable" value={formData.core_cable} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label htmlFor="line_nutral" className="form-label">Line-Nutral:</label>
                <input type="text" className="form-control" id="line_nutral" placeholder="Enter Line-Nutral" name="line_nutral" value={formData.line_nutral} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label htmlFor="line_earth" className="form-label">Line-Earth:</label>
                <input type="text" className="form-control" id="line_earth" placeholder="Enter Line-Earth" name="line_earth" value={formData.line_earth} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label htmlFor="earth_nutral" className="form-label">Earth-Nutral:</label>
                <input type="text" className="form-control" id="earth_nutral" placeholder="Enter Earth-Nutral" name="earth_nutral" value={formData.earth_nutral} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label htmlFor="panel_battery_voltage" className="form-label">Panel Battery Voltage:</label>
                <input type="number" className="form-control" id="panel_battery_voltage" placeholder="Enter Panel Battery Voltage" name="panel_battery_voltage" value={formData.panel_battery_voltage} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <button type="button" className="btn btn-success me-2" id="save_id" onClick={handleSave}>Save</button>
                <button type="button" className="btn btn-success" id="save_next_id" onClick={handleSaveAndNext}>Save & Next</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;
