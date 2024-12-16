import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import url from "../config";

const SenserStatus = () => {
    const [formData, setFormData] = useState({
        ups_id: '',
        emllock_id: '',
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

    const [comments, setComments] = useState({
        ntwowayComment: '',
        stwowayComment: '',
        smokesComment: '',
        panicComment: '',
        pirComment: '',
        senserComment: '',
        sirenComment: '',
        relayComment: '',
        videoCallComment: ''
    });

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    const navigate = useNavigate();
    const mode = new URLSearchParams(location.search).get('mode'); // check mode (new or edit)
    const recordId = localStorage.getItem('recordId');

    useEffect(() => {
        const storedData = sessionStorage.getItem("Fetch Data:");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            const firstItem = parsedData.data[0];
            setFormData((prevFormData) => ({
                ...prevFormData,
                hdd_serial_number: firstItem.panel_id || '',
            }));
        }
        if (mode === "edit" && recordId) {
            fetchDataForEdit(recordId); // Fetch data for editing if mode is 'edit'
          }
    }, [mode, recordId]);
    
    const fetchDataForEdit = async (id) => {
        try {
            const response = await fetch(`${url}getbyidppminfo/${id}`);
            const data = await response.json();
            if (response.ok) {
                const handleDropdownWithComment = (value) => {
                    if (value === "Yes" || value === "N/A") {
                        return { dropdownValue: value, comment: "" };
                    }
                    // alert(value);
                    return { dropdownValue: "No", comment: value };
                };
    
                setFormData({
                    ups_id: data.ups_id,
                    emllock_id: data.emllock_id,
                    ntwoway_id: handleDropdownWithComment(data.ntwoway_id).dropdownValue,
                    stwoway_id: handleDropdownWithComment(data.stwoway_id).dropdownValue,
                    smokes_id: handleDropdownWithComment(data.smokes_id).dropdownValue,
                    panic_id: handleDropdownWithComment(data.panic_id).dropdownValue,
                    pir_id: handleDropdownWithComment(data.pir_id).dropdownValue,
                    senser_id: handleDropdownWithComment(data.senser_id).dropdownValue,
                    siren_status: handleDropdownWithComment(data.siren_status).dropdownValue,
                    relays_id: handleDropdownWithComment(data.relays_id).dropdownValue,
                    videocal_id: handleDropdownWithComment(data.videocal_id).dropdownValue,
                });
                setComments({
                    ntwowayComment: handleDropdownWithComment(data.ntwoway_id).comment,
                    stwowayComment: handleDropdownWithComment(data.stwoway_id).comment,
                    smokesComment: handleDropdownWithComment(data.smokes_id).comment,
                    panicComment: handleDropdownWithComment(data.panic_id).comment,
                    pirComment: handleDropdownWithComment(data.pir_id).comment,
                    senserComment: handleDropdownWithComment(data.senser_id).comment,
                    sirenComment: handleDropdownWithComment(data.siren_status).comment,
                    relayComment: handleDropdownWithComment(data.relays_id).comment,
                    videoCallComment: handleDropdownWithComment(data.videocal_id).comment,
                });
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            alert(`Error fetching data for edit: ${error.message}`);
        }
    };
    
    const validateForm = () => {
        let validationErrors = {};
        let valid = true;

        ["ups_id", "emllock_id", "ntwoway_id", "stwoway_id", "smokes_id", "panic_id", "pir_id", "senser_id", "siren_status", "relays_id", "videocal_id"].forEach((field) => {
            if (!formData[field]) {
                validationErrors[field] = "This field is required";
                valid = false;
            }
        });

        const commentsToValidate = [
            { field: 'ntwoway_id', commentField: 'ntwowayComment' },
            { field: 'stwoway_id', commentField: 'stwowayComment' },
            { field: 'smokes_id', commentField: 'smokesComment' },
            { field: 'panic_id', commentField: 'panicComment' },
            { field: 'pir_id', commentField: 'pirComment' },
            { field: 'senser_id', commentField: 'senserComment' },
            { field: 'siren_status', commentField: 'sirenComment' },
            { field: 'relays_id', commentField: 'relayComment' },
            { field: 'videocal_id', commentField: 'videoCallComment' }
        ];

        commentsToValidate.forEach(({ field, commentField }) => {
            if (formData[field] === "No" && !comments[commentField]) {
                validationErrors[commentField] = "Comment is required for No status";
                valid = false;
            }
        });

        setErrors(validationErrors);
        setIsFormValid(valid);
        return valid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleCommentChange = (e, field) => {
        const { value } = e.target;
        setComments((prevComments) => ({
            ...prevComments,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            alert("Please fill in all required fields.");
            return;
        }
        try {
            const submissionData = {
                ...formData,
                ntwoway_id: formData.ntwoway_id === "No" ? comments.ntwowayComment : formData.ntwoway_id,
                stwoway_id: formData.stwoway_id === "No" ? comments.stwowayComment : formData.stwoway_id,
                smokes_id: formData.smokes_id === "No" ? comments.smokesComment : formData.smokes_id,
                panic_id: formData.panic_id === "No" ? comments.panicComment : formData.panic_id,
                pir_id: formData.pir_id === "No" ? comments.pirComment : formData.pir_id,
                senser_id: formData.senser_id === "No" ? comments.senserComment : formData.senser_id,
                siren_status: formData.siren_status === "No" ? comments.sirenComment : formData.siren_status,
                relays_id: formData.relays_id === "No" ? comments.relayComment : formData.relays_id,
                videocal_id: formData.videocal_id === "No" ? comments.videoCallComment : formData.videocal_id,
            };
            const response = await fetch(`${url}update-sensors/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submissionData)
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
            } else {
                alert(result.error);
            }
        } catch (error) {
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
        navigate('/dashboard/routerinfo');
    };

    return (
        <div className="container">
            <div className="row col-lg-12">
                <div className="col-lg-6">
                    <div className="border border-secondary p-3 rounded">
                        <div className="mb-3">
                            <label htmlFor="ups_id" className="form-label">Mains / UPS:</label>
                            <input type="text" className="form-control" id="ups_id" name="ups_id" value={formData.ups_id} onChange={handleChange} />
                            {errors.ups_id && <small className="text-danger">{errors.ups_id}</small>}
                        </div>
                        <div className="mb-3">
                        <label htmlFor="emllock_id" className="form-label">EML Lock:</label>
                            <select className="form-select" id="emllock_id" name="emllock_id" onChange={handleChange} value={formData.emllock_id}>
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="N/A">N/A</option>
                            </select>
                            {errors.emllock_id && <small className="text-danger">{errors.emllock_id}</small>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ntwoway_id" className="form-label">Normal Two Way Status:</label>
                            <select className="form-select" id="ntwoway_id" name="ntwoway_id" onChange={handleChange} value={formData.ntwoway_id}>
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="N/A">N/A</option>
                            </select>
                            {errors.ntwoway_id && <small className="text-danger">{errors.ntwoway_id}</small>}
                            {formData.ntwoway_id === "No" && (
                                <div className="mt-2">
                                    <label htmlFor="ntwowayComment" className="form-label">Comment:</label>
                                    <input type="text" className="form-control" id="ntwowayComment" value={comments.ntwowayComment} onChange={(e) => handleCommentChange(e, 'ntwowayComment')} />
                                    {errors.ntwowayComment && <small className="text-danger">{errors.ntwowayComment}</small>}
                                </div>
                            )}
                        </div>
                        
                        <div className="mb-3">
                            <label htmlFor="stwoway_id" className="form-label">Sim Base Two Way Status:</label>
                            <select className="form-select" id="stwoway_id" name="stwoway_id" onChange={handleChange} value={formData.stwoway_id}>
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="N/A">N/A</option>
                            </select>
                            {errors.ntwoway_id && <small className="text-danger">{errors.ntwoway_id}</small>}
                            {formData.stwoway_id === "No" && (
                                <div className="mt-2">
                                    <label htmlFor="stwowayComment" className="form-label">Comment:</label>
                                    <input type="text" className="form-control" id="stwowayComment" value={comments.stwowayComment} onChange={(e) => handleCommentChange(e, 'stwowayComment')} />
                                    {errors.ntwowayComment && <small className="text-danger">{errors.ntwowayComment}</small>}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="smokes_id" className="form-label">Smoke Status:</label>
                            <select className="form-select" id="smokes_id" name="smokes_id" onChange={handleChange} value={formData.smokes_id}>
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="N/A">N/A</option>
                            </select>
                            {errors.smokes_id && <small className="text-danger">{errors.smokes_id}</small>}
                            
                            {formData.smokes_id === "No" && (
                                <div className="mt-2">
                                    <label htmlFor="smokesComment" className="form-label">Comment:</label>
                                    <input type="text" className="form-control" id="smokesComment" value={comments.smokesComment} onChange={(e) => handleCommentChange(e, 'smokesComment')} />
                                    {errors.smokesComment && <small className="text-danger">{errors.smokesComment}</small>}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="panic_id" className="form-label">Panic Status:</label>
                            <select className="form-select" id="panic_id" name="panic_id" onChange={handleChange} value={formData.panic_id}>
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="N/A">N/A</option>
                            </select>
                            {errors.panic_id && <small className="text-danger">{errors.panic_id}</small>}
                            {formData.panic_id === "No" && (
                                <div className="mt-2">
                                    <label htmlFor="panicComment" className="form-label">Comment:</label>
                                    <input type="text" className="form-control" id="panicComment" value={comments.panicComment} onChange={(e) => handleCommentChange(e, 'panicComment')} />
                                    {errors.panicComment && <small className="text-danger">{errors.panicComment}</small>}
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>
                
                {/* Additional fields go here */}
                
                <div className="col-lg-6">
                    <div className="border border-secondary p-3 rounded">
                    <div className="mb-3">
                            <label htmlFor="pir_id" className="form-label">PIR Status:</label>
                            <select className="form-select" id="pir_id" name="pir_id" onChange={handleChange} value={formData.pir_id}>
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="N/A">N/A</option>
                            </select>
                            {errors.pir_id && <small className="text-danger">{errors.pir_id}</small>}
                            {formData.pir_id === "No" && (
                                <div className="mt-2">
                                    <label htmlFor="pirComment" className="form-label">Comment:</label>
                                    <input type="text" className="form-control" id="pirComment" value={comments.pirComment} onChange={(e) => handleCommentChange(e, 'pirComment')} />
                                    {errors.pirComment && <small className="text-danger">{errors.pirComment}</small>}
                                </div>
                            )}
                    </div>

                    <div className="mb-3">
                            <label htmlFor="senser_id" className="form-label">Senser Status:</label>
                            <select className="form-select" id="senser_id" name="senser_id" onChange={handleChange} value={formData.senser_id}>
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="N/A">N/A</option>
                            </select>
                            {errors.senser_id && <small className="text-danger">{errors.senser_id}</small>}
                            {formData.senser_id === "No" && (
                                <div className="mt-2">
                                    <label htmlFor="senserComment" className="form-label">Comment:</label>
                                    <input type="text" className="form-control" id="senserComment" value={comments.senserComment} onChange={(e) => handleCommentChange(e, 'senserComment')} />
                                    {errors.senserComment && <small className="text-danger">{errors.senserComment}</small>}
                                </div>
                            )}
                    </div>
                    
                    <div className="mb-3">
                            <label htmlFor="siren_status" className="form-label">Siren Status:</label>
                            <select className="form-select" id="siren_status" name="siren_status" onChange={handleChange} value={formData.siren_status}>
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="N/A">N/A</option>
                            </select>
                            {errors.siren_status && <small className="text-danger">{errors.siren_status}</small>}
                            {formData.siren_status === "No" && (
                                <div className="mt-2">
                                    <label htmlFor="sirenComment" className="form-label">Comment:</label>
                                    <input type="text" className="form-control" id="sirenComment" value={comments.sirenComment} onChange={(e) => handleCommentChange(e, 'sirenComment')} />
                                    {errors.sirenComment && <small className="text-danger">{errors.sirenComment}</small>}
                                </div>
                            )}
                    </div>

                    <div className="mb-3">
                            <label htmlFor="relays_id" className="form-label">Relay Status:</label>
                            <select className="form-select" id="relays_id" name="relays_id" onChange={handleChange} value={formData.relays_id}>
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="N/A">N/A</option>
                                {errors.relays_id && <small className="text-danger">{errors.relays_id}</small>}
                            </select>
                            {formData.relays_id === "No" && (
                                <div className="mt-2">
                                    <label htmlFor="relayComment" className="form-label">Comment:</label>
                                    <input type="text" className="form-control" id="relayComment" value={comments.relayComment} onChange={(e) => handleCommentChange(e, 'relayComment')} />
                                    {errors.relayComment && <small className="text-danger">{errors.relayComment}</small>}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="videocal_id" className="form-label">Video Call Status:</label>
                            <select className="form-select" id="videocal_id" name="videocal_id" onChange={handleChange} value={formData.videocal_id}>
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="N/A">N/A</option>
                            </select>
                            {errors.videocal_id && <small className="text-danger">{errors.videocal_id}</small>}
                            {formData.videocal_id === "No" && (
                                <div className="mt-2">
                                    <label htmlFor="videoCallComment" className="form-label">Comment:</label>
                                    <input type="text" className="form-control" id="videoCallComment" value={comments.videoCallComment} onChange={(e) => handleCommentChange(e, 'videoCallComment')} />
                                    {errors.videoCallComment && <small className="text-danger">{errors.videoCallComment}</small>}
                                </div>
                            )}
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
                </div>
            </div>
        </div>
        </div>
    );
};

export default SenserStatus;
