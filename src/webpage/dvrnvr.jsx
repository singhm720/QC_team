import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import url from "../config";

const DVRNVR = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        dvr_make: '',
        standalone: '',
        login_status: '',
        dashboard_status: '',
        ntp_setting: '',
        camera_count: '',
        hdd_recording_start: '',
        hdd_recording_end: '',
        hdd_capacity: '',
        sd_recording: '',
        hdd_serial_number: ''
    });
    
    const [errors, setErrors] = useState({}); // State to hold validation errors

    const recordId = localStorage.getItem('recordId');

    useEffect(() => {
        const storedData = sessionStorage.getItem('panelClientData');
        if (storedData) {
            const parsedData = JSON.parse(storedData).data[0];
            setFormData({
                ...formData,
                dvr_make: parsedData.dvr_type || ''
            });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Function to validate all fields
    const validateForm = () => {
        const newErrors = {};

        Object.keys(formData).forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = `${field.replace(/_/g, " ")} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            alert("Please fill in all required fields.");
            return;
        }
        
        try {
            const response = await fetch(`${url}update-dvr/${recordId}`, {
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
        await handleSubmit();  // Just save the data
    };

    const handleSaveAndNext = async (e) => {
        e.preventDefault();
        await handleSubmit();  // Save the data
        navigate('/dashboard/senserstatus');  // Redirect to the next page after saving
    };

    return (
        <div className="container">
            <form>
                <div className="row col-lg-12">
                    <div className="col-lg-6">
                        <div className="border border-secondary p-3 rounded">
                            {Object.keys(formData).slice(0, 6).map((field, index) => (
                                <div key={index} className="mb-3">
                                    <label htmlFor={field} className="form-label">
                                        {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id={field}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                    {errors[field] && <small className="text-danger">{errors[field]}</small>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="border border-secondary p-3 rounded">
                            {Object.keys(formData).slice(6).map((field, index) => (
                                <div key={index} className="mb-3">
                                    <label htmlFor={field} className="form-label">
                                        {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id={field}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                    {errors[field] && <small className="text-danger">{errors[field]}</small>}
                                </div>
                            ))}
                            <div className="mb-3">
                                <button type="button" className="btn btn-success me-2" onClick={handleSave}>Save</button>
                                <button type="button" className="btn btn-success" onClick={handleSaveAndNext}>Save & Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DVRNVR;
