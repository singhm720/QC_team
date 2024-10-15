import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import url from "../config";


const FinalStatus = () => {
  const [formData, setFormData] = useState({
    remark: '',
    status: '',
    final_status: '',
    assigned_to: '',
    today: '',
    rectify: '',
    month: '',
    quarterly_status: '',
    police_station_no: '',
    fire_station_no: '',
    faulty: '',
    action_taken: ''
  });
  const recordId = localStorage.getItem('recordId');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${url}update-final-status/${recordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Final status data saved successfully!');
        localStorage.clear();
      } else {
        alert('Failed to save final status data.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the final status data.');
    }
  };

  return (
    <div className="container">
      <div className="row col-lg-12">
        {/* Left aligned inputs */}
        <div className="col-lg-6">
          <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="remark_id" className="form-label">Remark:</label>
              <input type="text" className="form-control" id="remark_id" placeholder="Enter Remark" name="remark" value={formData.remark} onChange={handleChange} autocomplete="off"/>
            </div>

            <div className="mb-3">
              <label htmlFor="status_id" className="form-label">Status:</label>
              <input type="text" className="form-control" id="status_id" placeholder="Enter Status" name="status" value={formData.status} onChange={handleChange} autocomplete="off"/>
            </div>

            <div className="mb-3">
              <label htmlFor="fstatus_id" className="form-label">Final Status:</label>
              <input type="text" className="form-control" id="fstatus_id" placeholder="Enter Final Status" name="final_status" value={formData.final_status} onChange={handleChange} autocomplete="off"/>
            </div>

            <div className="mb-3">
              <label htmlFor="assignto_id" className="form-label">Assigned To:</label>
              <input type="text" className="form-control" id="assignto_id" placeholder="Enter Assigned To" name="assigned_to" value={formData.assigned_to} onChange={handleChange} autocomplete="off"/>
            </div>

            <div className="mb-3">
              <label htmlFor="today_id" className="form-label">Today:</label>
              <input type="date" className="form-control" id="today_id" name="today" value={formData.today} onChange={handleChange} autocomplete="off"/>
            </div>

            <div className="mb-3">
              <label htmlFor="rectify_id" className="form-label">Rectify:</label>
              <input type="text" className="form-control" id="rectify_id" placeholder="Enter Rectify" name="rectify" value={formData.rectify} onChange={handleChange} autocomplete="off"/>
            </div>

          </div>
        </div>

        {/* Right aligned inputs */}
        <div className="col-lg-6">
          <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="month_id" className="form-label">Month:</label>
              <input type="text" className="form-control" id="month_id" placeholder="Enter Month" name="month" value={formData.month} onChange={handleChange} autocomplete="off"/>
            </div>

            <div className="mb-3">
              <label htmlFor="quartly_id" className="form-label">Quarterly Status:</label>
              <input type="text" className="form-control" id="quartly_id" placeholder="Enter Quarterly Status" name="quarterly_status" value={formData.quarterly_status} onChange={handleChange} autocomplete="off"/>
            </div>

            <div className="mb-3">
              <label htmlFor="polist_id" className="form-label">Police Station No:</label>
              <input type="text" className="form-control" id="polist_id" placeholder="Enter Police Station No" name="police_station_no" value={formData.police_station_no} onChange={handleChange} autocomplete="off"/>
            </div>

            <div className="mb-3">
              <label htmlFor="firest_id" className="form-label">Fire Station No:</label>
              <input type="text" className="form-control" id="firest_id" placeholder="Enter Fire Station No" name="fire_station_no" value={formData.fire_station_no} onChange={handleChange} autocomplete="off"/>
            </div>

            <div className="mb-3">
              <label htmlFor="faulty_id" className="form-label">Faulty:</label>
              <input type="text" className="form-control" id="faulty_id" placeholder="Enter Faulty" name="faulty" value={formData.faulty} onChange={handleChange} autocomplete="off"/>
            </div>

            <div className="mb-3">
              <label htmlFor="actiontk_id" className="form-label">Action Taken:</label>
              <input type="text" className="form-control" id="actiontk_id" placeholder="Enter Action Taken" name="action_taken" value={formData.action_taken} onChange={handleChange} autocomplete="off"/>
            </div>

            <div className="mb-3">
              <button type="button" className="btn btn-success me-2" id="save_id" onClick={handleSave}>Save</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalStatus;
