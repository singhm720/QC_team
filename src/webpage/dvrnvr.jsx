import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import url from "../config";
import Select from "react-select";
import { BsCalendar2DateFill } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const DVRNVR = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dvr_make: "",
    standalone: "",
    login_status: "",
    dashboard_status: "",
    ntp_setting: "",
    sd_recording: "",
    hddstatus_id:"",
    hddrecording_mode:"",
    dvr_serialno:"",
    hdd_recording_start: "",
    hdd_recording_end: "",
    camera_count: "",
    hdd_capacity: "",
    hdd_serial_number: "",
  });

  const [errors, setErrors] = useState({});
  const [comments, setComments] = useState({});
  const mode = new URLSearchParams(location.search).get("mode"); // check mode (new or edit)
  const recordId = localStorage.getItem("recordId");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [dvrs, setDvrs] = useState([{ dvr_make: "", camera_count: "" }]);
  const [hdds, setHdds] = useState([{ hdd_capacity: '', hdd_serial_number: '' }]);

  useEffect(() => {
    const storedData = sessionStorage.getItem("panelClientData");
    if (storedData) {
      const parsedData = JSON.parse(storedData).data[0];
      setFormData((prev) => ({
        ...prev,
        dvr_make: parsedData.dvr_type || "",
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
        // Function to handle dropdown values with comment fallback
        const handleDropdownWithComment = (value) => {
          if (value === "Yes" || value === "N/A") {
            return { dropdownValue: value, comment: "" };
          }
          // console.log("comment:" + value);
          return { dropdownValue: "No", comment: value };
        };
        
        // Split the concatenated data into arrays
        const dvrs = (data.dvr_make || "").split(" + ").map((make, index) => ({
          dvr_make: make,
          camera_count: (data.camera_count || "").split(" + ")[index] || "",
        }));

        const hdds = (data.hdd_capacity || "").split(" + ").map((capacity, index) => ({
          hdd_capacity: capacity,
          hdd_serial_number: (data.hdd_serial_number || "").split(" + ")[index] || "",
        }));

      setDvrs(dvrs); // Set the DVRs array
      setHdds(hdds); // Set the HDDs array
        setFormData({
          hdd_recording_start: data.hdd_recording_start || "",
          hdd_recording_end: data.hdd_recording_end || "",
          hddstatus_id: data.hddstatus_id,
          hddrecording_mode: data.hddrecording_mode,
          dvr_serialno: data.dvr_serialno,
          // Apply dropdown/comment logic for each specific field
          standalone: handleDropdownWithComment(data.standalone).dropdownValue,
          login_status: handleDropdownWithComment(data.login_status).dropdownValue,
          dashboard_status: handleDropdownWithComment(data.dashboard_status).dropdownValue,
          ntp_setting: handleDropdownWithComment(data.ntp_setting).dropdownValue,
          sd_recording: handleDropdownWithComment(data.sd_recording).dropdownValue,
        });
        // Setting comments separately if the field value requires it
        setComments({
          standaloneComment: handleDropdownWithComment(data.standalone).comment,
          login_statusComment: handleDropdownWithComment(data.login_status).comment,
          dashboard_statusComment: handleDropdownWithComment(data.dashboard_status).comment,
          ntp_settingComment: handleDropdownWithComment(data.ntp_setting).comment,
          sd_recordingComment: handleDropdownWithComment(data.sd_recording).comment,
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(`Error fetching data for edit: ${error}`);
    }
  };

  // Handle DVR Make and Camera Count changes
  const handleDvrChange = (index, field, value) => {
    const updatedDvrs = dvrs.map((dvr, i) =>
      i === index ? { ...dvr, [field]: value } : dvr
    );
    setDvrs(updatedDvrs);
  };

   // Handle HDD Capacity and HDD Serial Number changes
   const handleHddChange = (index, field, value) => {
    const updatedHdds = hdds.map((hdd, i) =>
      i === index ? { ...hdd, [field]: value } : hdd
    );
    setHdds(updatedHdds);
  };
  // Add a new DVR dropdown
  const addDvr = () => {
    setDvrs([...dvrs, { dvr_make: "", camera_count: "" }]);
  };
   // Add a new HDD and serial number entry
   const addHdd = () => {
    setHdds([...hdds, { hdd_capacity: '', hdd_serial_number: '' }]);
  };

  // Remove a DVR dropdown
  const removeDvr = (index) => {
    setDvrs(dvrs.filter((_, i) => i !== index));
  };
  // Remove an HDD entry
  const removeHdd = (index) => {
    setHdds(hdds.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value === "No") {
      setComments((prev) => ({ ...prev, [name]: "" }));
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
  
    // Validate DVR fields
    dvrs.forEach((dvr, index) => {
      if (!dvr.dvr_make) {
        newErrors[`dvr_make_${index}`] = `DVR make is required for DVR ${index + 1}`;
      }
      if (!dvr.camera_count) {
        newErrors[`camera_count_${index}`] = `Camera count is required for DVR ${index + 1}`;
      }
    });
  
    // Validate HDD fields
    hdds.forEach((hdd, index) => {
      if (!hdd.hdd_capacity) {
        newErrors[`hdd_capacity_${index}`] = `HDD capacity is required for HDD ${index + 1}`;
      }
      if (!hdd.hdd_serial_number) {
        newErrors[`hdd_serial_number_${index}`] = `HDD serial number is required for HDD ${index + 1}`;
      }
    });
    const fieldsWithComments = [
      { field: "standalone", commentField: "standaloneComment" },
      { field: "login_status", commentField: "login_statusComment" },
      { field: "dashboard_status", commentField: "dashboard_statusComment" },
      { field: "ntp_setting", commentField: "ntp_settingComment" },
      { field: "sd_recording", commentField: "sd_recordingComment" },
    ];
    fieldsWithComments.forEach(({ field, commentField }) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/_/g, " ")} is required`;
      } else if (formData[field] === "No" && !comments[commentField]) {
        newErrors[commentField] = `Comment is required for ${field.replace(/_/g, " ")} when "No" is selected`;
      }
    });
  
    // Validate HDD recording start and end dates
    if (!formData.hdd_recording_start) {
      newErrors.hdd_recording_start = "HDD recording start date is required";
    }
    if (!formData.dvr_serialno) {
      newErrors.dvr_serialno = "DVR serial Number is required";
    }
    if (!formData.hdd_recording_end) {
      newErrors.hdd_recording_end = "HDD recording end date is required";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleDateChange = (field, date) => {
    if (!date) {
        setFormData((prev) => ({ ...prev, [field]: "" }));
        return;
    }

    // Format date in local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`; // Format as 'YYYY-MM-DD'

    setFormData((prev) => ({ ...prev, [field]: formattedDate }));
};


  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }
     // Concatenate DVR fields
      const concatenatedDvrMake = dvrs.map((dvr) => dvr.dvr_make).join(" + ");
      const concatenatedCameraCount = dvrs.map((dvr) => dvr.camera_count).join(" + ");

      // Concatenate HDD fields
      const concatenatedHddCapacity = hdds.map((hdd) => hdd.hdd_capacity).join(" + ");
      const concatenatedHddSerialNumber = hdds.map((hdd) => hdd.hdd_serial_number).join(" + ");
    const dataToSubmit = {
      ...formData,
        dvr_make: concatenatedDvrMake,
        camera_count: concatenatedCameraCount,
        hdd_capacity: concatenatedHddCapacity,
        hdd_serial_number: concatenatedHddSerialNumber,
      comments,
      hdd_recording_start: formData.hdd_recording_start,
      hdd_recording_end: formData.hdd_recording_end,
    };

    Object.keys(dataToSubmit).forEach((field) => {
      if (dataToSubmit[field] === "No" && comments[`${field}Comment`]) {
        dataToSubmit[field] = comments[`${field}Comment`];
      }
    });
    try {
      const response = await fetch(`${url}update-dvr/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit data.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await handleSubmit();
  };

  const handleSaveAndNext = async (e) => {
    e.preventDefault();
    await handleSubmit();
    navigate("/dashboard/senserstatus");
  };

  return (
    <div className="container">
      <form>
        <div className="row col-lg-12">
          <div className="col-lg-6">
            <div className="border border-secondary p-3 rounded">
              <div className="mb-3">
                <label htmlFor="dvr_make" className="form-label">
                  DVR Make:
                </label>
                {dvrs.map((dvr, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    {/* DVR Make Dropdown */}
                    <select
                      className="form-select"
                      name="dvr_make"
                      value={dvr.dvr_make}
                      onChange={(e) =>
                        handleDvrChange(index, "dvr_make", e.target.value)
                      }
                    >
                      <option value="">Select DVR...</option>
                      <option value="HIKVISION">HIKVISION</option>
                      <option value="DAHUA">DAHUA</option>
                      <option value="CPPLUS">CPPLUS</option>
                      <option value="HIKVISION NVR">HIKVISION NVR</option>
                      <option value="DAHUA NVR">DAHUA NVR</option>
                      <option value="CPPLUS NVR">CPPLUS NVR</option>
                      <option value="Electronic Eye">Electronic Eye</option>
                    </select>
                    {errors[`dvr_make_${index}`] && (
                      <small className="text-danger">{errors[`dvr_make_${index}`]}</small>
                    )}
                    {/* Camera Count Dropdown */}
                    <select
                      className="form-select mx-2"
                      name="camera_count"
                      value={dvr.camera_count}
                      onChange={(e) =>
                        handleDvrChange(index, "camera_count", e.target.value)
                      }
                    >
                      <option value="">Camera Count...</option>
                      {[...Array(32).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    {errors[`camera_count_${index}`] && (
                      <small className="text-danger">{errors[`camera_count_${index}`]}</small>
                    )}
                    {/* Remove DVR Button */}
                    {index > 0 ? (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeDvr(index)}
                      >
                        -
                      </button>
                    ) : (
                      // "+" Button to add a new DVR
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addDvr}
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {/* HDD Section */}
      <label className="form-label mt-4">HDD Capacity:</label>
      {hdds.map((hdd, index) => (
        <div key={index} className="d-flex align-items-center mb-2">
          {/* HDD Capacity Dropdown */}
          <select
            className="form-select"
            name="hdd_capacity"
            value={hdd.hdd_capacity}
            onChange={(e) => handleHddChange(index, 'hdd_capacity', e.target.value)}
          >
            <option value="">Select HDD Capacity...</option>
            <option value="500GB">500GB</option>
            <option value="1TB">1TB</option>
            <option value="2TB">2TB</option>
            <option value="4TB">4TB</option>
            <option value="6TB">6TB</option>
            <option value="8TB">8TB</option>
            <option value="16TB">16TB</option>
          </select>

          {/* HDD Serial Number Input */}
          <input
            type="text"
            className="form-control mx-2"
            placeholder="HDD Serial Number"
            name="hdd_serial_number"
            value={hdd.hdd_serial_number}
            onChange={(e) => handleHddChange(index, 'hdd_serial_number', e.target.value)}
          />
          {errors[`hdd_serial_number_${index}`] && (
            <small className="text-danger">{errors[`hdd_serial_number_${index}`]}</small>
          )}
          {/* Remove HDD Button */}
          {index > 0 ? (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeHdd(index)}
            >
              -
            </button>
          ) : (
            // "+" Button to add a new HDD
            <button
              type="button"
              className="btn btn-primary"
              onClick={addHdd}
            >
              +
            </button>
          )}
        </div>
      ))}

      <div className="mb-3">
        <label htmlFor="hddstatus_id" className="form-label">HDD Status:</label>
        <Select
          className="basic-single"
          classNamePrefix="select"
          name="hddstatus_id"
          id="hddstatus_id"
          value={{ value: formData.hddstatus_id, label: formData.hddstatus_id }}
          onChange={(value) => handleChange({ target: { name: 'hddstatus_id', value: value?.value } })}
          options={[
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
          ]}
          isClearable={isClearable}
          isSearchable={isSearchable}
          required
        />
        {errors.hddstatus_id && <p className="text-danger">{errors.hddstatus_id}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="hddrecording_mode" className="form-label">HDD Recording Mode:</label>
        <Select
          className="basic-single"
          classNamePrefix="select"
          name="hddrecording_mode"
          id="hddrecording_mode"
          value={{ value: formData.hddrecording_mode, label: formData.hddrecording_mode }}
          onChange={(value) => handleChange({ target: { name: 'hddrecording_mode', value: value?.value } })}
          options={[
            { value: 'Motion', label: 'Motion' },
            { value: 'Continuous', label: 'Continuous' },
          ]}
          isClearable={isClearable}
          isSearchable={isSearchable}
          required
        />
        {errors.hddrecording_mode && <p className="text-danger">{errors.hddrecording_mode}</p>}
      </div>
      <div className="mb-3">
              <label htmlFor="fstatus_id" className="form-label">DVR Serial Number:</label>
              <input type="text" className="form-control" id="dvr_serialno" placeholder="Enter DVR Model" name="dvr_serialno" value={formData.dvr_serialno} onChange={handleChange} autoComplete="off"/>
              {errors.dvr_serialno && <div className="text-danger">{errors.dvr_serialno}</div>}
            </div>

      <div className="mb-3">
                <label htmlFor="hdd_recording_start" className="form-label">
                  HDD Recording Start:
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <BsCalendar2DateFill />
                  </span>
                  <DatePicker
                    className="form-control"
                    placeholderText="Select start date"
                    selected={formData.hdd_recording_start ? new Date(formData.hdd_recording_start) : null}
                    onChange={(date) =>
                      handleDateChange("hdd_recording_start", date)
                    }
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                {errors.hdd_recording_start && (
                  <small className="text-danger">
                    {errors.hdd_recording_start}
                  </small>
                )}
      </div>
      </div>
    </div>

          <div className="col-lg-6">
            <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
                <label htmlFor="hdd_recording_end" className="form-label">
                  HDD Recording End:
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <BsCalendar2DateFill />
                  </span>
                  <DatePicker
                    className="form-control"
                    placeholderText="Select end date"
                    selected={formData.hdd_recording_end ? new Date(formData.hdd_recording_end) : null}
                    onChange={(date) =>
                      handleDateChange("hdd_recording_end", date)
                    }
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                {errors.hdd_recording_end && (
                  <small className="text-danger">
                    {errors.hdd_recording_end}
                  </small>
                )}
              </div>
            {[
              "standalone","login_status","dashboard_status","ntp_setting","sd_recording",
              ].map((field) => (
                <div key={field} className="mb-3">
                  <label htmlFor={field} className="form-label">
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).toLowerCase().replace(/_/g, " ")}
                    :
                  </label>
                  <select
                    className="form-select"
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="N/A">N/A</option>
                  </select>
                  {errors[field] && (
                    <small className="text-danger">{errors[field]}</small>
                  )}
                  {formData[field] === "No" && (
                    <input
                      type="text"
                      className="form-control mt-2"
                      placeholder="Comment"
                      value={comments[`${field}Comment`] || ""}
                      onChange={(e) => {
                        handleCommentChange(e, `${field}Comment`)
                      }}
                      autoComplete="off"
                    />
                  )}
                  {errors[`${field}Comment`] && (
                    <small className="text-danger">
                      {errors[`${field}Comment`]}
                    </small>
                  )}
                </div>
              ))}

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
      </form>
    </div>
  );
};

export default DVRNVR;