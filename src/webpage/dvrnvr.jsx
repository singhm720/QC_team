import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import url from "../config";
import { BsCalendar2DateFill } from 'react-icons/bs';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

const DVRNVR = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        dvr_make: '',
        standalone: '',
        login_status: '',
        dashboard_status: '',
        ntp_setting: '',
        sd_recording: '',
        hdd_recording_start: '',
        hdd_recording_end: '',
        camera_count: '',
        hdd_capacity: '',
        hdd_serial_number: '',
    });

    const [errors, setErrors] = useState({});
    const [comments, setComments] = useState({});
    
    const recordId = localStorage.getItem('recordId');

    useEffect(() => {
        const storedData = sessionStorage.getItem('panelClientData');
        if (storedData) {
            const parsedData = JSON.parse(storedData).data[0];
            setFormData((prev) => ({
                ...prev,
                dvr_make: parsedData.dvr_type || ''
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (value === 'No') {
            setComments((prev) => ({ ...prev, [name]: '' }));
        } else {
            setComments((prev) => {
                const { [name]: removed, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleCommentChange = (e, field) => {
        const { value } = e.target;
        setComments((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        const fieldsWithComments = [
            { field: 'standalone', commentField: 'standaloneComment' },
            { field: 'login_status', commentField: 'loginComment' },
            { field: 'dashboard_status', commentField: 'dashboardComment' },
            { field: 'ntp_setting', commentField: 'ntpComment' }
        ];

        Object.keys(formData).forEach((field) => {
            if (!formData[field] && field !== 'hdd_recording_start' && field !== 'hdd_recording_end') {
                newErrors[field] = `${field.replace(/_/g, " ")} is required`;
            }
        });

        fieldsWithComments.forEach(({ field, commentField }) => {
            if (formData[field] === 'No' && !comments[commentField]) {
                newErrors[commentField] = `Comment is required for ${field.replace(/_/g, " ")} when "No" is selected`;
            }
        });

        if (!formData.hdd_recording_start) newErrors.hdd_recording_start = "HDD recording start date is required";
        if (!formData.hdd_recording_end) newErrors.hdd_recording_end = "HDD recording end date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDateChange = (field, date) => {
        setFormData((prev) => ({ ...prev, [field]: date }));
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            alert("Please fill in all required fields.");
            return;
        }

        const dataToSubmit = { 
            ...formData, 
            comments,
            hdd_recording_start: formData.hdd_recording_start ? format(formData.hdd_recording_start, 'dd/MM/yyyy') : '',
            hdd_recording_end: formData.hdd_recording_end ? format(formData.hdd_recording_end, 'dd/MM/yyyy') : ''
        };

        Object.keys(dataToSubmit).forEach((field) => {
            if (dataToSubmit[field] === "No" && comments[`${field}Comment`]) {
                dataToSubmit[field] = comments[`${field}Comment`];
            }
        });

        try {
            const response = await fetch(`${url}update-dvr/${recordId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit)
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
        await handleSubmit();
    };

    const handleSaveAndNext = async (e) => {
        e.preventDefault();
        await handleSubmit();
        navigate('/dashboard/senserstatus');
    };

    return (
        <div className="container">
            <form>
                <div className="row col-lg-12">
                    <div className="col-lg-6">
                        <div className="border border-secondary p-3 rounded">
                            <div className="mb-3">
                                <label htmlFor="dvr_make" className="form-label">DVR Make:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="dvr_make"
                                    name="dvr_make"
                                    value={formData.dvr_make}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                                {errors.dvr_make && <small className="text-danger">{errors.dvr_make}</small>}
                            </div>

                            {["standalone", "login_status", "dashboard_status", "ntp_setting", "sd_recording"].map((field) => (
                                <div key={field} className="mb-3">
                                    <label htmlFor={field} className="form-label">
                                        {field.charAt(0).toUpperCase() + field.slice(1).toLowerCase().replace(/_/g, " ")}:
                                    </label>
                                    <select
                                        className="form-select"
                                        id={field}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select...</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        <option value="N/A">N/A</option>
                                    </select>
                                    {errors[field] && <small className="text-danger">{errors[field]}</small>}
                                    {formData[field] === 'No' && (
                                        <input
                                            type="text"
                                            className="form-control mt-2"
                                            placeholder="Comment"
                                            value={comments[`${field}Comment`] || ''}
                                            onChange={(e) => handleCommentChange(e, `${field}Comment`)}
                                            autoComplete="off"
                                        />
                                    )}
                                    {errors[`${field}Comment`] && <small className="text-danger">{errors[`${field}Comment`]}</small>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="border border-secondary p-3 rounded">
                            <div className="mb-3">
                                <label htmlFor="hdd_recording_start" className="form-label">HDD Recording Start:</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <BsCalendar2DateFill />
                                    </span>
                                    <DatePicker
                                        className="form-control"
                                        placeholderText="Select start date"
                                        selected={formData.hdd_recording_start}
                                        onChange={(date) => handleDateChange("hdd_recording_start", date)}
                                        dateFormat="dd/MM/yyyy" 
                                    />
                                </div>
                                {errors.hdd_recording_start && <small className="text-danger">{errors.hdd_recording_start}</small>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="hdd_recording_end" className="form-label">HDD Recording End:</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <BsCalendar2DateFill />
                                    </span>
                                    <DatePicker
                                        className="form-control"
                                        placeholderText="Select end date"
                                        selected={formData.hdd_recording_end}
                                        onChange={(date) => handleDateChange("hdd_recording_end", date)}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                {errors.hdd_recording_end && <small className="text-danger">{errors.hdd_recording_end}</small>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="camera_count" className="form-label">Camera Count:</label>
                                <select
                                    className="form-select"
                                    id="camera_count"
                                    name="camera_count"
                                    value={formData.camera_count}
                                    onChange={handleChange}
                                >
                                    <option value="">Select...</option>
                                    {[...Array(16).keys()].map(i => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                                {errors.camera_count && <small className="text-danger">{errors.camera_count}</small>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="hdd_capacity" className="form-label">HDD Capacity:</label>
                                <select
                                    className="form-select"
                                    id="hdd_capacity"
                                    name="hdd_capacity"
                                    value={formData.hdd_capacity}
                                    onChange={handleChange}
                                >
                                    <option value="">Select...</option>
                                    <option value="1TB">1TB</option>
                                    <option value="2TB">2TB</option>
                                    <option value="4TB">4TB</option>
                                </select>
                                {errors.hdd_capacity && <small className="text-danger">{errors.hdd_capacity}</small>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="hdd_serial_number" className="form-label">HDD Serial Number:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="hdd_serial_number"
                                    name="hdd_serial_number"
                                    value={formData.hdd_serial_number}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                                {errors.hdd_serial_number && <small className="text-danger">{errors.hdd_serial_number}</small>}
                            </div>

                            <div className="mt-4">
                                <button type="submit" className="btn btn-primary me-2" onClick={handleSave}>Save</button>
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
