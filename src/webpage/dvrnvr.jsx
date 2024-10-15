import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import url from "../config";

const DVRNVR = () => {
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

    const navigate = useNavigate();
    const recordId = localStorage.getItem('recordId');
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
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
                    {/* Left aligned inputs */}
                    <div className="col-lg-6">
                        <div className="border border-secondary p-3 rounded">
                            <div className="mb-3">
                                <label htmlFor="dvr_make" className="form-label">DVR Make:</label>
                                <input type="text" className="form-control" id="dvr_make" name="dvr_make" value={formData.dvr_make} onChange={handleChange} autocomplete="off"/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="standalone" className="form-label">Standalone:</label>
                                <input type="text" className="form-control" id="standalone" name="standalone" value={formData.standalone} onChange={handleChange} autocomplete="off"/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="login_status" className="form-label">Login Status:</label>
                                <input type="text" className="form-control" id="login_status" name="login_status" value={formData.login_status} onChange={handleChange} autocomplete="off"/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="dashboard_status" className="form-label">Dashboard Status:</label>
                                <input type="text" className="form-control" id="dashboard_status" name="dashboard_status" value={formData.dashboard_status} onChange={handleChange} autocomplete="off"/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="ntp_setting" className="form-label">NTP Setting:</label>
                                <input type="text" className="form-control" id="ntp_setting" name="ntp_setting" value={formData.ntp_setting} onChange={handleChange} autocomplete="off"/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="camera_count" className="form-label">Camera Count:</label>
                                <input type="text" className="form-control" id="camera_count" name="camera_count" value={formData.camera_count} onChange={handleChange} autocomplete="off"/>
                            </div>
                        </div>
                    </div>

                    {/* Right aligned inputs */}
                    <div className="col-lg-6">
                        <div className="border border-secondary p-3 rounded">
                            <div className="mb-3">
                                <label htmlFor="hdd_recording_end" className="form-label">HDD Recording Start:</label>
                                <input type="text" className="form-control" id="hdd_recording_end" name="hdd_recording_end" value={formData.hdd_recording_end} onChange={handleChange} autocomplete="off"/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="hdd_recording" className="form-label">HDD Recording End:</label>
                                <input type="text" className="form-control" id="hdd_recording" name="hdd_recording" value={formData.hdd_recording} onChange={handleChange} autocomplete="off"/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="hdd_capacity" className="form-label">HDD Capacity:</label>
                                <input type="text" className="form-control" id="hdd_capacity" name="hdd_capacity" value={formData.hdd_capacity} onChange={handleChange} autocomplete="off"/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="sd_recording" className="form-label">SD Recording:</label>
                                <input type="text" className="form-control" id="sd_recording" name="sd_recording" value={formData.sd_recording} onChange={handleChange} autocomplete="off"/>
                            </div>

                            {/* <div className="mb-3">
                                <label htmlFor="hdd_recording_start" className="form-label">HDD Recording Start:</label>
                                <input type="text" className="form-control" id="hdd_recording_start" name="hdd_recording_start" value={formData.hdd_recording_start} onChange={handleChange} />
                            </div> */}

                            {/* <div className="mb-3">
                                <label htmlFor="atm_id" className="form-label">ATM ID:</label>
                                <input type="text" className="form-control" id="atm_id" name="atm_id" value={formData.atm_id} onChange={handleChange} />
                            </div> */}

                            <div className="mb-3">
                                <label htmlFor="hdd_serial_number" className="form-label">HDD Serial Number:</label>
                                <input type="text" className="form-control" id="hdd_serial_number" name="hdd_serial_number" value={formData.hdd_serial_number} onChange={handleChange} autocomplete="off"/>
                            </div>

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
