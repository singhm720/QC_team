import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import url from "../config";
const Ppminfo = () => {
    const today = new Date().toISOString().split('T')[0];
    const navigate = useNavigate();

    const [date, setDate] = useState(today);
    const [formData, setFormData] = useState({
        panel_id: '',
        client_id: '',
        merg_id: '',
        checking_date: today,
        secv_id: '',
        qcass_id: '',
        am: 'M',
        engineer_name: '',
        e_code: '',
        engineer_mobile: '',
        address_pincode: '',
        atm_id: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to submit data
    const submitData = async (redirect = false) => {
        try {
          const response = await fetch(`${url}create-entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, checking_date: date }), // Include the selected date
            });

            const data = await response.json();
            if (response.ok) {
                const createdId = data.id;
                localStorage.setItem('recordId', createdId);
                alert(data.message); // Success message
                if (redirect) {
                    navigate('/dashboard/dvrnvr'); // Redirect if Save & Next is clicked
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
            <form>
                <div className="row col-lg-12">
                    {/* Left aligned buttons */}
                    <div className="col-lg-6">
                        <div className="border border-secondary p-3 rounded">
                            <div className="mb-3">
                                <label htmlFor="panel_id" className="form-label">Panel ID:</label>
                                <input type="text" className="form-control" id="panel_id" placeholder="Enter Panel ID" name="panel_id" value={formData.panel_id} onChange={handleChange} required autocomplete="off"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="client_id" className="form-label">Client</label>
                                <input type="text" className="form-control" id="client_id" placeholder="Enter Client" name="client_id" value={formData.client_id} onChange={handleChange} required autoComplete="off"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="merg_id" className="form-label">Merg</label>
                                <input type="text" className="form-control" id="merg_id" placeholder="Merg" name="merg_id" value={formData.merg_id} onChange={handleChange} required autocomplete="off"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="checkingDate" className="form-label">Checking Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    id="checkingDate" 
                                    name="checkingDate"
                                    value={date} 
                                    onChange={(e) => { setDate(e.target.value); handleChange(e); }} 
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="secv_id" className="form-label">Second Visit</label>
                                <input type="text" className="form-control" id="secv_id" placeholder="Enter second visit date" name="secv_id" value={formData.secv_id} onChange={handleChange} autocomplete="off"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="qcass_id" className="form-label">QC Assigned</label>
                                <input type="text" className="form-control" id="qcass_id" placeholder="Enter QC Name." name="qcass_id" value={formData.qcass_id} onChange={handleChange} autocomplete="off"/>
                            </div>
                            {/* <div className="mb-3">
                                <label htmlFor="dvrs_id" className="form-label">DVR Serial Number</label>
                                <input type="text" className="form-control" id="dvrs_id" placeholder="Enter DVR S/N No." name="dvrs_id" value={formData.dvrs_id} onChange={handleChange} autocomplete="off"/>
                            </div> */}
                        </div>
                    </div>

                    {/* Right aligned buttons */}
                    <div className="col-lg-6">
                        <div className="border border-secondary p-3 rounded">
                            <div className="mb-3">
                                <label className="form-label">AM</label>
                                <select className="form-select" id="am" name="am" value={formData.am} onChange={handleChange}>
                                    <option value="M">AM-1</option>
                                    <option value="F">AM-2</option>
                                    <option value="O">AM-3</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="engineer_name" className="form-label">Engineer Name</label>
                                <input type="text" className="form-control" id="engineer_name" placeholder="Enter Engineer Name" name="engineer_name" value={formData.engineer_name} onChange={handleChange} autocomplete="off"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="e_code" className="form-label">E-Code</label>
                                <input type="text" className="form-control" id="e_code" placeholder="Enter Employee Code" name="e_code" value={formData.e_code} onChange={handleChange} autocomplete="off"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="engineer_mobile" className="form-label">Engineer Mobile Number</label>
                                <input type="text" className="form-control" id="engineer_mobile" placeholder="Enter Number" name="engineer_mobile" value={formData.engineer_mobile} onChange={handleChange} autocomplete="off"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address_pincode" className="form-label">Address Pincode</label>
                                <input type="text" className="form-control" id="address_pincode" placeholder="Enter Pincode" name="address_pincode" value={formData.address_pincode} onChange={handleChange} autocomplete="off"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="atm_id" className="form-label">ATM ID</label>
                                <input type="text" className="form-control" id="atm_id" placeholder="Enter ATM ID" name="atm_id" value={formData.atm_id} onChange={handleChange} autocomplete="off"/>
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

export default Ppminfo;
