import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import url from "../config";

const SenserStatus = () => {
    const [formData, setFormData] = useState({
        ups_id: '',
        ntwoway_id: '',
        stwoway_id: '',
        smokes_id: '',
        panic_id: '',
        pir_id: '',
        senser_id: '',
        siren_status: '',
        relays_id: '',
        videocal_id: ''
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
            const response = await fetch(`${url}submit_senser_status`, {
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
        navigate('/dashboard/routerinfo');  // Redirect to the next page after saving
    };

    return (
        <div className="container">
            <div className="row col-lg-12">
                {/* Left aligned inputs */}
                <div className="col-lg-6">
                    <div className="border border-secondary p-3 rounded">
                        <div className="mb-3">
                            <label htmlFor="ups_id" className="form-label">Mains / UPS:</label>
                            <input type="text" className="form-control" id="ups_id" name="ups_id" value={formData.ups_id} onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="ntwoway_id" className="form-label">Normal Two Way Status:</label>
                            <input type="text" className="form-control" id="ntwoway_id" name="ntwoway_id" value={formData.ntwoway_id} onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="stwoway_id" className="form-label">Sim base Two way</label>
                            <input type="text" className="form-control" id="stwoway_id" name="stwoway_id" value={formData.stwoway_id} onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="smokes_id" className="form-label">Smoke Status</label>
                            <input type="text" className="form-control" id="smokes_id" name="smokes_id" value={formData.smokes_id} onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="panic_id" className="form-label">Panic</label>
                            <input type="text" className="form-control" id="panic_id" name="panic_id" value={formData.panic_id} onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="pir_id" className="form-label">PIR</label>
                            <input type="text" className="form-control" id="pir_id" name="pir_id" value={formData.pir_id} onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="senser_id" className="form-label">Senser Status</label>
                            <input type="text" className="form-control" id="senser_id" name="senser_id" value={formData.senser_id} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Right aligned inputs */}
                <div className="col-lg-6">
                    <div className="border border-secondary p-3 rounded">
                        <div className="mb-3">
                            <label htmlFor="siren_status" className="form-label">Siren working</label>
                            <input type="text" className="form-control" id="siren_status" name="siren_status" value={formData.siren_status} onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="relays_id" className="form-label">Relay status</label>
                            <input type="text" className="form-control" id="relays_id" name="relays_id" value={formData.relays_id} onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="videocal_id" className="form-label">Video Call</label>
                            <input type="text" className="form-control" id="videocal_id" name="videocal_id" value={formData.videocal_id} onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <button type="button" className="btn btn-success me-2" onClick={handleSave}>Save</button>
                            <button type="button" className="btn btn-success" onClick={handleSaveAndNext}>Save & Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SenserStatus;
