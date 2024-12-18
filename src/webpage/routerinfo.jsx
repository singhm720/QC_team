import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from "react-select";
import url from "../config";

const RouterInfo = () => {
  const [formData, setFormData] = useState({
    router_id: '',
    ping_break_after_reset: '',
    router_signal: '',
    router_sim: '1', // Default to 1
    antenna_location: '',
    antenna_type: '',
    cabling: '',
    router_serial_number: '',
    sim_number1: '',
    sim_number2: ''
  });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [isReasonInputVisible, setIsReasonInputVisible] = useState(false);

  const navigate = useNavigate();
  const mode = new URLSearchParams(location.search).get('mode'); // check mode (new or edit)
  const recordId = localStorage.getItem('recordId');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "router_sim" && value === "1" && { sim_number2: '' }) // Clear sim_number2 if router_sim is 1
    }));
  };
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption?.value || '';
    setFormData((prev) => ({
      ...prev,
      ping_break_after_reset: value, // Update with just the selected value for now
    }));

    // Show the reason input only when a valid option is selected
    setIsReasonInputVisible(value === 'Network Break No');
  };
  const handleReasonChange = (e) => {
    const reason = e.target.value;
    const currentSelection = formData.ping_break_after_reset ? formData.ping_break_after_reset.split('|')[0] : '';
 // Extract only the selected value

    // Update `ping_break_after_reset` to include the selected value and the reason
    setFormData((prev) => ({
      ...prev,
      ping_break_after_reset: `${currentSelection}|${reason}`,
    }));
  };
  const antennaOptions = [
    { value: 'Lobby', label: 'Lobby' },
    { value: 'Backroom', label: 'Backroom' },
    { value: 'Outside', label: 'Outside' },
  ];
  const antennaTypeOptions = [
    { value: 'Yagi', label: 'Yagi' },
    { value: 'Omni', label: 'Omni' },
    { value: 'Patch', label: 'Patch'}
  ]
  const pingBreakOptions = [
    { value: 'Network Break Yes', label: 'Network Break Yes' },
    { value: 'Network Break No', label: 'Network Break No' },
  ];
  const routerOptions = [
    { value: '20 & 24', label: '20 & 24' },
    { value: 'R+R-', label: 'R+R-' },
    { value: '12V', label: '12V' },
    { value: 'Broadband', label: 'Broadband' },
  ];
  const routerSimOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
  ];
  const cablingoption = [
    {value : 'Yes', label: 'Yes'},
    {value : 'No', label :'No' },
  ]

  useEffect(() => {
    const storedData = sessionStorage.getItem("Fetch Data:");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const firstItem = parsedData.data[0];
      setFormData({
        ...formData,
        sim_number1: firstItem.sim_1_no || '',
        sim_number2: firstItem.sim_2_no || ''
      });
    }
    if (mode === "edit" && recordId) {
      fetchDataForEdit(recordId);  // Fetch data for editing if mode is 'edit'
  }
  }, [mode, recordId]);

  const fetchDataForEdit = async (id) => {
    try {
        const response = await fetch(`${url}getbyidppminfo/${id}`);
        const data = await response.json();
        if (response.ok) {
            // Determine the value for router_sim
            const routerSimValue = data.sim_number2 !== null ? '2' : '1';

            // Update the formData state with the fetched data
            setFormData({
                router_id: data.router_id,
                ping_break_after_reset: data.ping_break_after_reset,
                router_signal: data.router_signal,
                router_sim: routerSimValue, // use updated value
                antenna_location: data.antenna_location,
                antenna_type: data.antenna_type,
                cabling: data.cabling,
                router_serial_number: data.router_serial_number,
                sim_number1: data.sim_number1,
                sim_number2: data.sim_number2,
            });
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Error fetching data for edit:', error);
    }
  };

  const validateForm = () => {
    debugger;
    const newErrors = {};
    if (!formData.router_id) newErrors.router_id = 'Router Name is required';
    if (!formData.ping_break_after_reset) newErrors.ping_break_after_reset = 'Ping Break After Reset is required';
    if (!formData.router_signal) newErrors.router_signal = 'Router Signal is required';
    if (!formData.antenna_location) newErrors.antenna_location = 'Antenna Location is required';
    if (!formData.antenna_type) newErrors.antenna_type = 'Antenna Type is required';
    if (!formData.cabling) newErrors.cabling = 'Cabling is required';
    if (!formData.router_serial_number) newErrors.router_serial_number = 'Router Serial Number is required';
    if (!formData.sim_number1) newErrors.sim_number1 = 'SIM Number 1 required';
    if (formData.router_sim === '2' && !formData.sim_number2) newErrors.sim_number2 = 'SIM Number 2 is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitData = async (redirect = false) => {

    try {
      const formToSubmit = { ...formData };
      if (formToSubmit.router_sim === '1') delete formToSubmit.sim_number2;

      const response = await fetch(`${url}update-router/${recordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formToSubmit)
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        if (redirect) navigate('/dashboard/infrastructure');
      } else alert(`Error: ${data.error}`);
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting the form.');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (validateForm()) submitData();
  };

  const handleSaveAndNext = (e) => {
    e.preventDefault();
    if (validateForm()) submitData(true);
  };

  return (
    <div className="container">
      <div className="row col-lg-12">
        <div className="col-lg-6">
          <div className="border border-secondary p-3 rounded">
          <div className="mb-3">
            <label htmlFor="router_id" className="form-label">Router Connection:</label>
            <Select
              className="basic-single"
              id="router_id"
              name="router_id"
              value={routerOptions.find(option => option.value === formData.router_id)}
              onChange={(selectedOption) =>
                handleChange({ target: { name: 'router_id', value: selectedOption?.value } })
              }
              options={routerOptions}
              isClearable={true} // Allow clearing the selection
              isSearchable={true} // Allow searching through options
              placeholder="Select Router Connection.."
            />
            {errors.router_id && <div className="text-danger">{errors.router_id}</div>}
          </div>

          <div className="mb-3">
      <label htmlFor="ping_break_after_reset" className="form-label">
        Ping Break After Reset:
      </label>
      <Select
        className="basic-single"
        id="ping_break_after_reset"
        name="ping_break_after_reset"
        value={pingBreakOptions.find(
          (option) => option.value === formData.ping_break_after_reset ? formData.ping_break_after_reset.split('|')[0] : ''// Match only the selected value
        )}
        onChange={handleSelectChange}
        options={pingBreakOptions}
        isClearable={true}
        isSearchable={true}
        placeholder="Select Ping Break After Reset.."
      />
      {errors.ping_break_after_reset && (
        <div className="text-danger">{errors.ping_break_after_reset}</div>
      )}

      {/* Conditionally render the reason input field */}
      {isReasonInputVisible && (
        <div className="mt-3">
          <label htmlFor="ping_break_reason" className="form-label">
            Reason for Ping Break:
          </label>
          <input
            type="text"
            id="ping_break_reason"
            name="ping_break_reason"
            value={formData.ping_break_after_reset.split('|')[1] || ''} // Extract reason if available
            onChange={handleReasonChange}
            className="form-control"
            placeholder="Enter the reason..."
          />
          {errors.ping_break_reason && (
            <div className="text-danger">{errors.ping_break_reason}</div>
          )}
        </div>
      )}
    </div>

            <div className="mb-3">
              <label htmlFor="router_signal" className="form-label">Router Signal:</label>
              <input
                type="text"
                className="form-control"
                id="router_signal"
                placeholder="Enter Router Signal"
                name="router_signal"
                value={formData.router_signal}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.router_signal && <div className="text-danger">{errors.router_signal}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="router_sim" className="form-label">Router SIM:</label>
              <Select
                className="basic-single"
                id="router_sim"
                name="router_sim"
                value={routerSimOptions.find(option => option.value === formData.router_sim)}
                onChange={(selectedOption) =>
                  handleChange({ target: { name: 'router_sim', value: selectedOption?.value } })
                }
                options={routerSimOptions}
                isClearable={true} // Allow clearing the selection
                isSearchable={true} // Allow searching through options
                placeholder="Select Router SIM.."
              />
              {errors.router_sim && <div className="text-danger">{errors.router_sim}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="antenna_location" className="form-label">Antenna Location:</label>
              <Select
                className="basic-single"
                id="antenna_location"
                name="antenna_location"
                value={antennaOptions.find(option => option.value === formData.antenna_location)}
                onChange={(selectedOption) =>
                  handleChange({ target: { name: 'antenna_location', value: selectedOption?.value } })
                }
                options={antennaOptions}
                isClearable={isClearable}
                isSearchable={isSearchable}
                placeholder="Select Antenna Location.."
              />
              {errors.antenna_location && <div className="text-danger">{errors.antenna_location}</div>}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="border border-secondary p-3 rounded">
          
          <div className="mb-3">
          <label htmlFor="antenna_type" className="form-label">Antenna Type:</label>
          <Select
            className="basic-single"
            id="antenna_type"
            name="antenna_type"
            value={antennaTypeOptions.find(option => option.value === formData.antenna_type)}
            onChange={(selectedOption) =>
              handleChange({ target: { name: 'antenna_type', value: selectedOption?.value } })
            }
            options={antennaTypeOptions}
            isClearable={isClearable}
            isSearchable={isSearchable}
            placeholder="Select Antenna Type.."
          />
          {errors.antenna_type && <div className="text-danger">{errors.antenna_type}</div>}
        </div>


            {/* Cabling */}
            {/* <div className="mb-3">
              <label htmlFor="cabling" className="form-label">Cabling:</label>
              <input
                type="text"
                className="form-control"
                id="cabling"
                placeholder="Enter Cabling"
                name="cabling"
                value={formData.cabling}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.cabling && <div className="text-danger">{errors.cabling}</div>}
            </div> */}
            
            <div className="mb-3">
              <label htmlFor="cabling" className="form-label">Cabling:</label>
              <Select
                className="basic-single"
                id="cabling"
                name="cabling"
                value={cablingoption.find(option => option.value === formData.cablingoption)}
                onChange={(selectedOption) =>
                  handleChange({ target: { name: 'cablingoption', value: selectedOption?.value } })
                }
                options={cablingoption}
                isClearable={isClearable}
                isSearchable={isSearchable}
                placeholder="Select cabling..."
              />
              {errors.cablingoption && <div className="text-danger">{errors.cablingoption}</div>}
            </div>



          <div className="mb-3">
              <label htmlFor="router_serial_number" className="form-label">Router Serial Number:</label>
              <input
                type="text"
                className="form-control"
                id="router_serial_number"
                placeholder="Enter Router Serial Number"
                name="router_serial_number"
                value={formData.router_serial_number}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.router_serial_number && <div className="text-danger">{errors.router_serial_number}</div>}
            </div>
            
            {/* SIM Number 1 */}
            <div className="mb-3">
              <label htmlFor="sim_number1" className="form-label">SIM Number 1:</label>
              <input
                type="text"
                className="form-control"
                id="sim_number1"
                placeholder="Enter SIM Number 1"
                name="sim_number1"
                value={formData.sim_number1}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.sim_number1 && <div className="text-danger">{errors.sim_number1}</div>}
            </div>

            {/* SIM Number 2 */}
            {formData.router_sim === '2' && (
              <div className="mb-3">
                <label htmlFor="sim_number2" className="form-label">SIM Number 2:</label>
                <input
                  type="text"
                  className="form-control"
                  id="sim_number2"
                  placeholder="Enter SIM Number 2"
                  name="sim_number2"
                  value={formData.sim_number2}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors.sim_number2 && <div className="text-danger">{errors.sim_number2}</div>}
              </div>
            )}
            <div className="mt-4">
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

export default RouterInfo;
