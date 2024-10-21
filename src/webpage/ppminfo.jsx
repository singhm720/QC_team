import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import url from "../config";
import Select from "react-select";

const Ppminfo = () => {
    const today = new Date().toISOString().split('T')[0];
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
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

    const [clientNames, setClientNames] = useState([]); // State for storing client names
    const [panelIDs, setPanelIDs] = useState([]); // State for storing panel IDs
    const [setamvals, setsetamvals] = useState([]);

    // Fetch all client names on component mount
    useEffect(() => {
        const fetchClientNames = async () => {
            try {
                const response = await fetch(`${url}api/client_name`);
                const data = await response.json();
                if (response.ok) {
                    setClientNames(data.client_names.map(name => ({ value: name, label: name })));
                } else {
                    alert(`Error: ${data.error}`);
                }
            } catch (error) {
                console.error('Error fetching client names:', error);
            }
        };
        fetchClientNames();
        getareamanager();
    }, []);

    // Function to fetch panel IDs based on selected client name
    const fetchPanelIDs = async (clientName) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${url}api/get_panel_id/${clientName}`);
            const data = await response.json();
            if (response.ok) {
                setPanelIDs(data.panel_ids.map(id => ({ value: id, label: id })));
            } else {
                setPanelIDs([]);
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error fetching panel IDs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e, actionMeta) => {
        debugger;
        const { name, value } = e.target || actionMeta;

        if (name === "client_id") {
            setFormData(prevState => ({
                ...prevState,
                client_id: value ? value.value : '',
                panel_id: '', // Reset panel_id when client_id changes
                merg_id: '',  // Reset merg_id when client_id changes
                address_pincode: '', // Clear address_pincode field
                atm_id: '' // Clear atm_id field
            }));

            fetchPanelIDs(value.value); // Fetch panel IDs for the selected client name
        } else if (name === "panel_id") {
            setFormData(prevState => ({
                ...prevState,
                panel_id: value ? value.value : ''
            }));

            fetchPanelAndClientData(formData.client_id, value.value).then(() => {
                populateFields(value.value, formData.client_id);
            }); // Fetch and store panel and client data
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    // Function to get data of am fields
    const getareamanager = async () => {
        try {
            const response = await fetch(`${url}api/get_area_manager`);
            const data = await response.json();
            
            if (response.ok) {
                // Accessing the "Area Manager" key from the data
                setsetamvals(data["Area Manager"].map(name => ({ value: name, label: name })));
            } else {
                setsetamvals([]);
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.log('Error in Fetching Area Manager:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    
    // Function to populate fields based on session storage
    const populateFields = (panel_id, client_id) => {
        const storedData = sessionStorage.getItem('panelClientData');
        if (storedData) {
            const parsedData = JSON.parse(storedData).data[0];
            // Update the address_pincode field from sessionStorage data
            if (parsedData.pincode) {
                setFormData(prevState => ({
                    ...prevState,
                    address_pincode: parsedData.pincode,
                    atm_id: parsedData.atm_1_id
                }));
            }
            if (panel_id && client_id) {
                setFormData(prevState => ({
                    ...prevState,
                    merg_id: `${panel_id}_${client_id}`
                }));
            }
        }
    }

    // Function to fetch panel and client data based on panel_id and client_id
    const fetchPanelAndClientData = async (clientId, panelId) => {
        try {
            const response = await fetch(`${url}get_panelandclient_data?panel_id=${panelId}&client_name=${encodeURIComponent(clientId)}`);
            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem('panelClientData', JSON.stringify(data));
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error fetching panel and client data:', error);
        }
    };

    // Function to submit data
    const submitData = async (redirect = false) => {
        try {
            const response = await fetch(`${url}create-entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, checking_date: date }),
            });

            const data = await response.json();
            if (response.ok) {
                const createdId = data.id;
                localStorage.setItem('recordId', createdId);
                alert(data.message);
                if (redirect) {
                    navigate('/dashboard/dvrnvr');
                }
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting the form.');
        }
    };

    // Function for Save button
    const handleSave = async (e) => {
        e.preventDefault();
        await submitData();
    };

    // Function for Save & Next button
    const handleSaveAndNext = async (e) => {
        e.preventDefault();
        await submitData(true);
    };

    return (
        <div className="container">
            <form>
                <div className="row col-lg-12">
                    <div className="col-lg-6">
                        <div className="border border-secondary p-3 rounded">
                            <div className="mb-3">
                                <label htmlFor="client_id" className="form-label">Client</label>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="client_id"
                                    id="client_id"
                                    value={clientNames.find(c => c.value === formData.client_id)}
                                    onChange={(value) => handleChange({ target: { name: 'client_id', value } })}
                                    options={clientNames}
                                    isClearable={isClearable}
                                    isSearchable={isSearchable}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="panel_id" className="form-label">Panel ID:</label>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isClearable={isClearable}
                                    isSearchable={isSearchable}
                                    isLoading={isLoading}
                                    name="panel_id"
                                    id="panel_id"
                                    value={panelIDs.find(p => p.value === formData.panel_id)}
                                    onChange={(value) => handleChange({ target: { name: 'panel_id', value } })}
                                    options={panelIDs}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="merg_id" className="form-label">Merg</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="merg_id"
                                    placeholder="Merg"
                                    name="merg_id"
                                    value={formData.merg_id}
                                    onChange={handleChange}
                                    required
                                    autoComplete="off"
                                />
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
                                <input
                                    type="text"
                                    className="form-control"
                                    id="secv_id"
                                    placeholder="Enter second visit date"
                                    name="secv_id"
                                    value={formData.secv_id}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="qcass_id" className="form-label">QC Assigned</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="qcass_id"
                                    placeholder="Enter QC Name"
                                    name="qcass_id"
                                    value={formData.qcass_id}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="border border-secondary p-3 rounded">
                        <div className="mb-3">
                            <label className="form-label">AM</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                id="am"
                                name="am"
                                value={setamvals.find(c => c.value === formData.am_name) || null}  // Added a fallback for null
                                options={setamvals}
                                onChange={(value) => handleChange({ target: { name: 'am_name', value: value.value } })}  // Corrected value assignment
                                isClearable={isClearable}
                                isSearchable={isSearchable}
                                required
                            />
                        </div>

                            <div className="mb-3">
                                <label htmlFor="engineer_name" className="form-label">Engineer Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="engineer_name"
                                    placeholder="Enter Engineer Name"
                                    name="engineer_name"
                                    value={formData.engineer_name}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="e_code" className="form-label">E-Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="e_code"
                                    placeholder="Enter Employee Code"
                                    name="e_code"
                                    value={formData.e_code}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="engineer_mobile" className="form-label">Engineer Mobile Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="engineer_mobile"
                                    placeholder="Enter Number"
                                    name="engineer_mobile"
                                    value={formData.engineer_mobile}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address_pincode" className="form-label">Address Pincode</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address_pincode"
                                    placeholder="Enter Pincode"
                                    name="address_pincode"
                                    value={formData.address_pincode}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="atm_id" className="form-label">ATM ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="atm_id"
                                    placeholder="Enter ATM ID"
                                    name="atm_id"
                                    value={formData.atm_id}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
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
