import React, { useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import url from "../config";
import { decode as base64Decode } from 'base-64';

const Infrastructure = () => {
  const [formData, setFormData] = useState({
    core_cable: '',
    line_nutral: '',
    line_earth: '',
    earth_nutral: '',
    panel_battery_voltage: ''
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const mode = new URLSearchParams(location.search).get('mode'); // check mode (new or edit)
  const recordId = localStorage.getItem('recordId');
  
  useEffect(() => {
    if (mode === "edit" && recordId) {
      fetchDataForEdit(recordId);  // Fetch data for editing if mode is 'edit'
    }
    const mode1 = new URLSearchParams(location.search).get('mode');
    const encryptedId = new URLSearchParams(location.search).get('id');
      if (encryptedId) {
        const ids = base64Decode(encryptedId); // Decrypt the ID
        if (mode1 === "editnew") {
          fetchDataForEdit(ids);
        }
      }
  }, [mode, recordId]);
  
  const fetchDataForEdit = async (id) => {
    try {
        const response = await fetch(`${url}getbyidppminfo/${id}`);
        const data = await response.json();
        if (response.ok) {
            setFormData({
              core_cable: data.core_cable,
              line_nutral: data.line_nutral,
              line_earth: data.line_earth,
              earth_nutral: data.earth_nutral,
              panel_battery_voltage: data.panel_battery_voltage,
            });
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Error fetching data for edit:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.core_cable) newErrors.core_cable = 'Core Cable is required';
    if (!formData.line_nutral) newErrors.line_nutral = 'Line-Nutral is required';
    if (!formData.line_earth) newErrors.line_earth = 'Line-Earth is required';
    if (!formData.earth_nutral) newErrors.earth_nutral = 'Earth-Nutral is required';
    if (!formData.panel_battery_voltage) newErrors.panel_battery_voltage = 'Panel Battery Voltage is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${url}update-infra/${recordId}`, {
        method: 'PUT',
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
    if (validateForm()) {
      await handleSubmit();
    }
  };

  const handleSaveAndNext = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await handleSubmit();
      const mode = new URLSearchParams(location.search).get('mode');
          const id = new URLSearchParams(location.search).get('id');
          if (mode === 'editnew') {
            navigate(`/dashboard/finalstatus?mode=editnew&id=${id}`);
          }
          else {
            navigate("/dashboard/finalstatus");
          }
    }
  };

  return (
    <div className="container">
      <div className="row col-lg-12">
        <div className="col-lg-6">
          <div className="border border-secondary p-3 rounded">
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label htmlFor="core_cable" className="form-label">Core Cable:</label>
                <input
                  type="text"
                  className="form-control"
                  id="core_cable"
                  placeholder="Enter Core Cable"
                  name="core_cable"
                  value={formData.core_cable}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.core_cable && <div className="text-danger">{errors.core_cable}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="line_nutral" className="form-label">Line-Nutral:</label>
                <input
                  type="text"
                  className="form-control"
                  id="line_nutral"
                  placeholder="Enter Line-Nutral"
                  name="line_nutral"
                  value={formData.line_nutral}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.line_nutral && <div className="text-danger">{errors.line_nutral}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="line_earth" className="form-label">Line-Earth:</label>
                <input
                  type="text"
                  className="form-control"
                  id="line_earth"
                  placeholder="Enter Line-Earth"
                  name="line_earth"
                  value={formData.line_earth}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.line_earth && <div className="text-danger">{errors.line_earth}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="earth_nutral" className="form-label">Earth-Nutral:</label>
                <input
                  type="text"
                  className="form-control"
                  id="earth_nutral"
                  placeholder="Enter Earth-Nutral"
                  name="earth_nutral"
                  value={formData.earth_nutral}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.earth_nutral && <div className="text-danger">{errors.earth_nutral}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="panel_battery_voltage" className="form-label">Panel Battery Voltage:</label>
                <input
                  type="text"
                  className="form-control"
                  id="panel_battery_voltage"
                  placeholder="Enter Panel Battery Voltage"
                  name="panel_battery_voltage"
                  value={formData.panel_battery_voltage}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.panel_battery_voltage && <div className="text-danger">{errors.panel_battery_voltage}</div>}
              </div>

              <div className="mb-3">
                  {mode === 'edit' ? (
                    // Show Update button when in edit mode
                    <button type="button" className="btn btn-success" onClick={handleSave}>
                      Update
                    </button>
                  ) : (
                    // Show Save and Save & Next buttons when not in edit mode
                    <>
                    <button type="button" className="btn btn-success me-2" onClick={handleSave}>
                      Save
                    </button>
                    <button type="button" className="btn btn-success" onClick={handleSaveAndNext}>
                      Save & Next
                    </button>
                      </>
                  )}
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;
