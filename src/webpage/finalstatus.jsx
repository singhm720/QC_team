import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import url from "../config";
import { useNavigate } from 'react-router-dom';
import { BsCalendar2DateFill } from "react-icons/bs";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
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
  
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const mode = new URLSearchParams(location.search).get('mode'); // check mode (new or edit)
  const recordId = localStorage.getItem('recordId');
  
  useEffect(() => {
    if (mode === "edit" && recordId) {
      fetchDataForEdit(recordId);  // Fetch data for editing if mode is 'edit'
  }
  }, [mode, recordId]);

  const fetchDataForEdit = async (id) => {
    try {
        const response = await fetch(`${url}getbyidppminfo/${id}`);
        const data = await response.json();
        if (response.ok) {
            setFormData({
              remark: data.remark,
              status: data.status,
              final_status: data.final_status,
              assigned_to: data.assigned_to,
              today: data.today,
              rectify: data.rectify,
              month: data.month,
              quarterly_status: data.quarterly_status,
              police_station_no: data.police_station_no,
              fire_station_no: data.fire_station_no,
              faulty: data.faulty,
              action_taken: data.action_taken
            });
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        alert('Error fetching data for edit:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value
    }));
  };
  const handleDateChange = (field, date) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : ""; // Extract only 'YYYY-MM-DD'
    setFormData((prev) => ({ ...prev, [field]: formattedDate }));
};
  const validateForm = () => {
    const newErrors = {};
    if (!formData.remark) newErrors.remark = 'Remark is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.final_status) newErrors.final_status = 'Final Status is required';
    if (!formData.assigned_to) newErrors.assigned_to = 'Assigned To is required';
    if (!formData.today) newErrors.today = 'Today date is required';
    if (!formData.rectify) newErrors.rectify = 'Rectify is required';
    if (!formData.month) newErrors.month = 'Month is required';
    if (!formData.quarterly_status) newErrors.quarterly_status = 'Quarterly Status is required';
    if (!formData.police_station_no) newErrors.police_station_no = 'Police Station No is required';
    if (!formData.fire_station_no) newErrors.fire_station_no = 'Fire Station No is required';
    if (!formData.faulty) newErrors.faulty = 'Faulty is required';
    if (!formData.action_taken) newErrors.action_taken = 'Action Taken is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    console.log(JSON.stringify(formData));
    try {
      const response = await fetch(`${url}update-final-status/${recordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Final status data saved successfully!');
        localStorage.clear();
        navigate('/dashboard');
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
        <div className="col-lg-6">
          <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="remark_id" className="form-label">Remark:</label>
              <input type="text" className="form-control" id="remark_id" placeholder="Enter Remark" name="remark" value={formData.remark} onChange={handleChange} autoComplete="off"/>
              {errors.remark && <div className="text-danger">{errors.remark}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="status_id" className="form-label">Status</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="status"
                id="status_id"
                value={[
                  { value: 'Ok', label: 'Ok' },
                  { value: 'Not OK', label: 'Not OK' },
                ].find(option => option.value === formData.status)} // Preselect based on fetched data
                onChange={(selectedOption) => handleChange({ target: { name: 'status', value: selectedOption?.value } })}
                options={[
                  { value: 'Ok', label: 'Ok' },
                  { value: 'Not OK', label: 'Not OK' },
                ]}
                isClearable={true}
                isSearchable={false}
                required
              />
              {errors.status && <p className="text-danger">{errors.status}</p>}
            </div>



            <div className="mb-3">
              <label htmlFor="fstatus_id" className="form-label">Final Status:</label>
              <input type="text" className="form-control" id="fstatus_id" placeholder="Enter Final Status" name="final_status" value={formData.final_status} onChange={handleChange} autoComplete="off"/>
              {errors.final_status && <div className="text-danger">{errors.final_status}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="assignto_id" className="form-label">Assigned To:</label>
              <input type="text" className="form-control" id="assignto_id" placeholder="Enter Assigned To" name="assigned_to" value={formData.assigned_to} onChange={handleChange} autoComplete="off"/>
              {errors.assigned_to && <div className="text-danger">{errors.assigned_to}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="today_id" className="form-label">
                Today:
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <BsCalendar2DateFill />
                </span>
                <DatePicker
                  className="form-control"
                  placeholderText="Select Date"
                  selected={formData.today ? new Date(formData.today) : null}
                  // selected={formData.today}
                  onChange={(date) => handleDateChange("today", date)}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              {errors.today && (
                <small className="text-danger">{errors.today}</small>
              )}
            </div>


            <div className="mb-3">
              <label htmlFor="rectify_id" className="form-label">Rectify:</label>
              <input type="text" className="form-control" id="rectify_id" placeholder="Enter Rectify" name="rectify" value={formData.rectify} onChange={handleChange} autoComplete="off"/>
              {errors.rectify && <div className="text-danger">{errors.rectify}</div>}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="month_id" className="form-label">Month:</label>
              <input type="text" className="form-control" id="month_id" placeholder="Enter Month" name="month" value={formData.month} onChange={handleChange} autoComplete="off"/>
              {errors.month && <div className="text-danger">{errors.month}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="quartly_id" className="form-label">Quarterly Status:</label>
              <input type="text" className="form-control" id="quartly_id" placeholder="Enter Quarterly Status" name="quarterly_status" value={formData.quarterly_status} onChange={handleChange} autoComplete="off"/>
              {errors.quarterly_status && <div className="text-danger">{errors.quarterly_status}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="polist_id" className="form-label">Police Station No:</label>
              <input type="text" className="form-control" id="polist_id" placeholder="Enter Police Station No" name="police_station_no" value={formData.police_station_no} onChange={handleChange} autoComplete="off"/>
              {errors.police_station_no && <div className="text-danger">{errors.police_station_no}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="firest_id" className="form-label">Fire Station No:</label>
              <input type="text" className="form-control" id="firest_id" placeholder="Enter Fire Station No" name="fire_station_no" value={formData.fire_station_no} onChange={handleChange} autoComplete="off"/>
              {errors.fire_station_no && <div className="text-danger">{errors.fire_station_no}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="faulty_id" className="form-label">Faulty:</label>
              <input type="text" className="form-control" id="faulty_id" placeholder="Enter Faulty" name="faulty" value={formData.faulty} onChange={handleChange} autoComplete="off"/>
              {errors.faulty && <div className="text-danger">{errors.faulty}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="actiontk_id" className="form-label">Action Taken:</label>
              <input type="text" className="form-control" id="actiontk_id" placeholder="Enter Action Taken" name="action_taken" value={formData.action_taken} onChange={handleChange} autoComplete="off"/>
              {errors.action_taken && <div className="text-danger">{errors.action_taken}</div>}
            </div>

            <div className="mb-3">
                  {mode === 'edit' ? (
                    <>
                    <button type="button" className="btn btn-success" onClick={handleSave}>
                      Update
                    </button>
                    <p className="text-danger">
                     Note:- You wont be able to Edit the data once you click on Update
                  </p>
                  </>
                  ) : (
                    // Show Save and Save & Next buttons when not in edit mode
                    <>
                    <button type="button" className="btn btn-success me-2" onClick={handleSave}>
                      Save
                    </button>
                      </>
                  )}
                </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalStatus;
