import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import url from "../config";
import Select from "react-select";
import { BsCalendar2DateFill } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Ppminfo = () => {
    const navigate = useNavigate();
    const location = useLocation(); // to get query params like mode and id
    const [isLoading, setIsLoading] = useState(false);
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [date, setDate] = useState();
    
    const [formData, setFormData] = useState({
        panel_id: '',
        client_id: '',
        merg_id: '',
        checking_date: '',
        secv_id: '',
        qcass_id: '',
        am_name: '',
        engineer_name: '',
        e_code: '',
        engineer_mobile: '',
        address_pincode: '',
        atm_id: '',
        email_id: sessionStorage.getItem('email_id') || '',
    });

    const [errors, setErrors] = useState({});
    const [clientNames, setClientNames] = useState([]);
    const [panelIDs, setPanelIDs] = useState([]);
    const [setamvals, setsetamvals] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    const mode = new URLSearchParams(location.search).get('mode'); // check mode (new or edit)
    const recordId = localStorage.getItem('recordId');

    // Fetch client names
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
                alert('Error fetching client names:', error);
            }
        };

        const getAreaManager = async () => {
            try {
                const response = await fetch(`${url}api/get_area_manager`);
                const data = await response.json();
                if (response.ok) {
                    setsetamvals(data["Area Manager"].map(name => ({ value: name, label: name })));
                } else {
                    setsetamvals([]);
                    alert(`Error: ${data.error}`);
                }
            } catch (error) {
                alert('Unable to fetch Area Manager:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClientNames();
        getAreaManager();

        if (mode === "edit" && recordId) {
            fetchDataForEdit(recordId);  // Fetch data for editing if mode is 'edit'
        }
    }, [mode, recordId]);

    const handleDateChange = (field, date) => {
        setFormData((prev) => ({ ...prev, [field]: date }));
    };

    // Fetch data for editing
    const fetchDataForEdit = async (id) => {
        try {
            const response = await fetch(`${url}getbyidppminfo/${id}`);
            const data = await response.json();
            if (response.ok) {
                // Update the formData state with the fetched data
                setFormData({
                    panel_id: data.panel_id,
                    client_id: data.client_id,
                    merg_id: data.merg_id,
                    checking_date: data.checking_date, // format date
                    secv_id: data.secv_id,
                    qcass_id: data.qcass_id,
                    am_name: data.am,
                    engineer_name: data.engineer_name,
                    e_code: data.e_code,
                    engineer_mobile: data.engineer_mobile,
                    address_pincode: data.address_pincode,
                    atm_id: data.atm_id
                });
                // Additional logic for fetching panel IDs and area manager if needed
                fetchPanelIDs(data.client_id);
                setsetamvals(prevOptions => {
                    const isExisting = prevOptions.some(option => option.value === data.am);
                    if (!isExisting) {
                        return [...prevOptions, { value: data.am, label: data.am }];
                    }
                    return prevOptions;
                });
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            alert('Error fetching data for edit:', error);
        }
    };

    // Fetch panel IDs based on selected client
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
            alert('Error fetching panel IDs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle field changes
    const handleChange = (e, actionMeta) => {
        const { name, value } = e.target || actionMeta;
        if (name === "client_id") {
            setFormData(prevState => ({
                ...prevState,
                client_id: value ? value.value : '',
                panel_id: '', 
                merg_id: '',  
                address_pincode: '', 
                atm_id: '' 
            }));

            fetchPanelIDs(value.value);
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
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };
    
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
            alert('Error fetching panel and client data:', error);
        }
    };

    // Validate form data
    const validateForm = () => {
        const newErrors = {};

        if (!formData.client_id) newErrors.client_id = "Client is required.";
        if (!formData.panel_id) newErrors.panel_id = "Panel ID is required.";
        if (!formData.merg_id) newErrors.merg_id = "Merg is required.";
        if (!formData.checking_date) newErrors.checking_date = "Checking date is required.";
        if (!formData.engineer_name) newErrors.engineer_name = "Engineer name is required.";
        if (!formData.e_code) newErrors.e_code = "E-Code is required.";
        if (!formData.engineer_mobile) newErrors.engineer_mobile = "Engineer mobile is required.";
        if (!formData.address_pincode) newErrors.address_pincode = "Address pincode is required.";
        if (!formData.atm_id) newErrors.atm_id = "ATM ID is required.";
        if (!formData.secv_id) newErrors.secv_id = "Second Visit is required.";
        if (!formData.qcass_id) newErrors.qcass_id = "QC name is required.";
        if (!formData.am_name) newErrors.am_name = "Area Manager name is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
                    merg_id: `${panel_id}${client_id}`
                }));
                getmapping(`${panel_id}${client_id}`);
            }
        }
    }

    // Get area manager eng_name eng_emp
    const getmapping = async (panel_id, client_id) => {
        try {
            const response = await fetch(`${url}api/mappings?Panel_Type=${panel_id}`);
            const data = await response.json();
            
            if (response.ok && data.length > 0) { 
                const mapping = data[0];
                
                // Update formData with the specific Area Manager and other mapping details
                setFormData(prevState => ({
                    ...prevState,
                    am_name: mapping.Area_Manager,
                    engineer_name: mapping.Engineer_Name,
                    e_code: mapping.Employee_Code
                }));
                
                // Conditionally add the Area Manager to setamvals if it's not already there
                setsetamvals(prevOptions => {
                    const isExisting = prevOptions.some(option => option.value === mapping.Area_Manager);
                    if (!isExisting) {
                        return [...prevOptions, { value: mapping.Area_Manager, label: mapping.Area_Manager }];
                    }
                    return prevOptions;  // Return the existing options if Area Manager is already listed
                });
            } else {
                alert('Mapping Not Found for this merge');
            }
        } catch (error) {
            alert('Error fetching mapping:', error);
        }
    };

    // Submit form data
    const submitData = async (redirect = false) => {
        if (!validateForm()) {
            alert("Please fill in all required fields.");
            return;
        }
        const updateddata = ({
            ...formData,
            checking_date: date
        })
        try {
            const response = await fetch(`${url}create-entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateddata),
            });

            const data = await response.json();
            if (response.ok) {
                const createdId = data.id;
                localStorage.setItem('recordId', createdId);
                localStorage.setItem('ppmInfoSaved', 'true'); // Save the status of PPM info
                alert('PPM Info Submitted Successfully');
                if (redirect) {
                    navigate('/dashboard/dvrnvr');
                }
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            alert('There was an error submitting the form.');
        }
    };

    //update Data
    const updateData = async () => {
        if (!validateForm()) {
            alert("Please fill in all required fields.");
            return;
        }
        try {
            const response = await fetch(`${url}update-entry/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert('PPM Info Updated Successfully');
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            alert('There was an error submitting the form.');
        }
    };

    // Save data
    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateData();
    };

    // Save & Next
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
                                {errors.client_id && <p className="text-danger">{errors.client_id}</p>}
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
                                {errors.panel_id && <p className="text-danger">{errors.panel_id}</p>}
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
                                {errors.merg_id && <p className="text-danger">{errors.merg_id}</p>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="checking_date" className="form-label">
                                    Checking Date:
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                    <BsCalendar2DateFill />
                                    </span>
                                    <DatePicker
                                    className="form-control"
                                    placeholderText="Select start date"
                                    selected={formData.checking_date}
                                    onChange={(date) => handleDateChange("checking_date", date)}
                                    dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                {errors.checking_date && (
                                    <small className="text-danger">{errors.checking_date}</small>
                                )}
                                </div>

                                <div className="mb-3">
                                <label htmlFor="secv_id" className="form-label">
                                    Second Visit:
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                    <BsCalendar2DateFill />
                                    </span>
                                    <DatePicker
                                    className="form-control"
                                    placeholderText="Select date"
                                    selected={formData.secv_id}
                                    onChange={(date) => handleDateChange("secv_id", date)}
                                    dateFormat="dd/MM/yyyy"
                                    />
                                </div>
                                {errors.secv_id && (
                                    <small className="text-danger">{errors.secv_id}</small>
                                )}
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
                                {errors.qcass_id && <p className="text-danger">{errors.qcass_id}</p>}
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
                                    id="am_name"
                                    name="am_name"
                                    value={setamvals.find(c => c.value === formData.am_name) || null}  // Added a fallback for null
                                    options={setamvals}
                                    onChange={(value) => handleChange({ target: { name: 'am_name', value: value ? value.value: ''} })}  // Corrected value assignment
                                    isClearable={isClearable}
                                    isSearchable={isSearchable}
                                    required
                                />
                                {errors.am_name && <p className="text-danger">{errors.am_name}</p>}
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
                                {errors.engineer_name && <p className="text-danger">{errors.engineer_name}</p>}
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
                                {errors.e_code && <p className="text-danger">{errors.e_code}</p>}
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
                                {errors.engineer_mobile && <p className="text-danger">{errors.engineer_mobile}</p>}
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
                                {errors.address_pincode && <p className="text-danger">{errors.address_pincode}</p>}
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
                                {errors.atm_id && <p className="text-danger">{errors.atm_id}</p>}
                            </div>

                            <div className="mb-3">
                            {mode === 'edit' ? (
                                // Show Update button when in edit mode
                                <button type="button" className="btn btn-success" onClick={handleUpdate}>
                                Update
                                </button>
                            ) : (
                                // Show Save and Save & Next buttons when not in edit mode
                                <>
                                <button type="button" className="btn btn-success" onClick={handleSaveAndNext}>
                                    Save & Next
                                </button>
                                </>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Ppminfo;
