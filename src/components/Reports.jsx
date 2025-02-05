import React, { useState, useEffect } from 'react';
import { BsCalendar2DateFill } from 'react-icons/bs';
import { BsFileEarmarkExcelFill, BsFillFunnelFill  } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import DataTable from 'react-data-table-component';
import './Reports.css';
import Select from "react-select";
import SetLoading from '../webpage/setloading';
import url from '../config';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { encode as base64Encode } from 'base-64'; // Install base-64 package if not already installed

const Reports = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [apiData, setApiData] = useState([]);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Loader state
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState("");
    const [clientOptions, setClientOptions] = useState([]);
    const [selectedPanel, setSelectedPanel] = useState(null);
    const [panelOptions, setPanelOptions] = useState([]);

    const navigate = useNavigate();
    //function to handle new button click
    const handleNew = () => {
        localStorage.clear();
        navigate('/dashboard/ppminfo');
    }
    const handleReuseEntry = () => {
        setShowModal(true);
    };

    // Function to encrypt the ID
    const encrypt = (text) => {
        return base64Encode(text);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedClient("");
        setPanelIds([]);
    };
    // Function to handle edit button click
    const handleEdit = (row) => {
        // Save data to localStorage
        localStorage.setItem('ppmInfoSaved', true);
        localStorage.setItem('recordId', row.id); // Replace with the correct unique ID field (e.g., `row.id`)

        // Redirect to dashboard/ppminfo with query params
        navigate('/dashboard/ppminfo?mode=edit');
    };

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Start loading
            try {
                const response = await fetch(`${url}getallppminfo`); // Fetch all data
                const result = await response.json();
                const dataArray = Array.isArray(result) ? result : [result];
                
                // No filtering logic; include all data
                const sortedData = dataArray.sort((a, b) => {
                    if (a.status !== "Ok" && b.status === "Ok") return -1;
                    if (a.status === "Ok" && b.status !== "Ok") return 1;
                    return 0;
                });
                
                setApiData(sortedData); // Set the sorted data
                setRecords(sortedData); // Set the displayed records
            } catch (error) {
                alert('Error fetching data:', error);
            }
            finally {
                setIsLoading(false); // End loading
            }
        };
        if (showModal) {
            fetch(`${url}client_name`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch client names");
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.client_names) {
                        const options = data.client_names.map((name) => ({
                            value: name,
                            label: name,
                        }));
                        setClientOptions(options);
                    }
                })
                .catch((error) => console.error("Error fetching client names:", error));
        }
    
        fetchData();
    }, [url, showModal]);
    
    // Fetch panel IDs when a client is selected
    useEffect(() => {
        if (selectedClient) {
            fetch(`${url}get_panel_id/${encodeURIComponent(selectedClient.value)}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch panel IDs");
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.panel_ids) {
                        const options = data.panel_ids.map((id) => ({
                            value: id,
                            label: id,
                        }));
                        setPanelOptions(options);
                    }
                })
                .catch((error) => console.error("Error fetching panel IDs:", error));
        } else {
            setPanelOptions([]); // Clear panel options if no client is selected
        }
    }, [selectedClient]);
    
    // Function to get data for 2nd entry after his current quarter finished.
    const getpmdata = (selectedClient, selectedPanel) => {
        if (!selectedClient || !selectedPanel) {
            alert("Please select both a client and a panel ID.");
            return;
        }
    
        const merge = selectedPanel.value + selectedClient.value;
        fetch(`${url}getmergedata/${merge}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => {
                // Determine the current quarter start date
                const now = new Date();
                const currentQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                // Parse and find the latest entry within the current quarter
                let latestEntry = null;
                data.forEach((item) => {
                    const createdAt = new Date(item.created_at);
                    if (
                        item.merg_id === merge &&
                        createdAt >= currentQuarterStart &&
                        (!latestEntry || createdAt > new Date(latestEntry.created_at))
                    ) {
                        latestEntry = item;
                    }
                });
                if (latestEntry) {
                    alert("Data already exists. You can edit it from the edit function.");
                } else {
                    // If no matching entry was found, get the ID of the latest entry
                    const latestId = data.length > 0 ? data[data.length - 1].id : null; // Assuming latest ID is the last one
                    if (latestId) {
                        const encryptedId = encrypt(latestId.toString()); // Encrypt the ID
                        navigate(`/dashboard/ppminfo?mode=editnew&id=${encryptedId}`);
                    } else {
                        alert("No data available to proceed.");
                    }
                }
            })
            .catch((error) => {
                alert("Data Not Found in Database u can create New Entry.");
            });
    };
    // Columns for DataTable
    const columns = [
        {
            name: "Panel ID",
            selector: row => row.panel_id,
            sortable: true
        },
        {
            name: "Client ID",
            selector: row => row.client_id,
            sortable: true
        },
        {
            name: "QC Assign",
            selector: row => row.qcass_id,
            sortable: true
        },
        {
            name: "Engineer Name",
            selector: row => row.engineer_name,
            sortable: true
        },
        {
            name: "Checking Date",
            selector: row => {
                const date = new Date(row.checking_date);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            },
            sortable: true
        },
        {
            name: "Status",
            selector: row => row.status,
            sortable: true
        },
        {
            name: "Action",
            cell: row => (
                (!row.status || row.status.toUpperCase() !== "OK") ? (
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(row)}
                    >
                        Edit
                    </button>
                ) : (
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(row)}
                    >
                        Edit
                    </button>
                )
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    // Custom styles for DataTable
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "grey",
                color: "white",
                fontSize: "17px",
                fontWeight: "bolder"
            }
        }
    };

    // Function to handle report download
    const handleDownloadReport = async () => {
        const start = startDate.toISOString().split('T')[0];
        const end = endDate.toISOString().split('T')[0];
        if (!start || !end) {
            alert('Please select both start and end dates.');
            return;
        }
        if (start >= end) {
            alert('Start date must be earlier than end date.');
            return;
        }
        try {
            const response = await fetch(`${url}download-report?start_date=${start}&end_date=${end}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to download report');
            }

            const blob = await response.blob();
            const bloburl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = bloburl;
            link.setAttribute('download', 'report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(bloburl); // Clean up the Blob URL
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    // Handle input change for search
    const handleChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        // Filter records based on search term
        const filteredRecords = apiData.filter(record =>
            record.panel_id.toLowerCase().includes(value.toLowerCase()) // Adjust 'panel_id' based on your data structure
        );
        setRecords(filteredRecords);
    };

    // Function to filter data by date range
    const handleFilterData = () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }
        // Convert startDate and endDate to JavaScript Date objects for comparison
        const startDateObj = new Date(startDate.setHours(0, 0, 0, 0)); // Normalize to start of the day
        const endDateObj = new Date(endDate.setHours(23, 59, 59, 999)); // Normalize to end of the day
    
        const filteredData = apiData.filter((record) => {
            // Convert the `created_at` field from API to a Date object
            const recordDate = new Date(record.created_at.replace(' ', 'T'));
    
            // Compare the recordDate with the normalized startDate and endDate
            return recordDate >= startDateObj && recordDate <= endDateObj;
        });
    
        setRecords(filteredData); // Set filtered records to display
    };
    

   return (
    <div>
        { isLoading ?(
            <SetLoading />
        ) : (
            <>
            <div className="row align-items-center mb-3">
            <div className="col-md-3">
                <div className="form-group">
                    <label className="col-form-label">Start Date&nbsp;:</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <BsCalendar2DateFill />
                        </span>
                        <DatePicker
                            className="form-control"
                            placeholder="Select start date"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="dd/MM/yyyy" // Set display format in DatePicker
                            value={startDate ? format(new Date(startDate), 'dd/MM/yyyy') : ''}
                        />
                    </div>
                </div>
            </div>

            <div className="col-md-3">
                <div className="form-group">
                    <label className="col-form-label">End Date&nbsp;:</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <BsCalendar2DateFill />
                        </span>
                        <DatePicker
                            className="form-control"
                            placeholder="Select end date"
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="dd/MM/yyyy" // Set display format in DatePicker
                            value={endDate ? format(new Date(endDate), 'dd/MM/yyyy') : ''} // Format existing date
                        />
                    </div>
                </div>
            </div>

            <div className="col-md-1">
                <div className="form-group">
                    <label className="col-form-label">Filter:</label>
                    <div className="input-group">
                    <span 
                            className="input-group-text" 
                            onClick={handleFilterData}
                            style={{ cursor: 'pointer' }}
                        >
                            <BsFillFunnelFill  />
                        </span>
                    </div>
                </div>
            </div>

            <div className="col-md-1">
                <div className="form-group">
                    <label className="col-form-label">Report:</label>
                    <div className="input-group">
                        <span 
                            className="input-group-text" 
                            onClick={handleDownloadReport}
                            style={{ cursor: 'pointer' }}
                        >
                            <BsFileEarmarkExcelFill />
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="col-md-2">
                <input
                    type="text"
                    placeholder="Search By Panel ID"
                    className="form-control"
                    value={searchTerm}
                    onChange={handleChange}
                />
            </div>

            <div className='col-md-2'>
                <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleNew()}
                >
                    New
                </button>
                <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleReuseEntry()}
                >
                    Old
                </button>
            </div>
            </div>

            <div className="homeDiv">
                <DataTable
                    columns={columns}
                    data={records}
                    customStyles={customStyles}
                    pagination
                />
            </div>
            </>
        )} 
         {/* Modal */}
         {showModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select Options</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="client_select" className="form-label">
                                        Select Client:
                                    </label>
                                    <Select
                                        className="basic-single"
                                        id="client_select"
                                        name="client_select"
                                        value={selectedClient}
                                        onChange={setSelectedClient}
                                        options={clientOptions}
                                        isClearable={true}
                                        isSearchable={true}
                                        placeholder="Select a client..."
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="panel_select" className="form-label">
                                        Select Panel ID:
                                    </label>
                                    <Select
                                        className="basic-single"
                                        id="panel_select"
                                        name="panel_select"
                                        value={selectedPanel}
                                        onChange={setSelectedPanel}
                                        options={panelOptions}
                                        isClearable={true}
                                        isSearchable={true}
                                        placeholder="Select a panel ID..."
                                        isDisabled={!panelOptions.length}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => getpmdata(selectedClient, selectedPanel)}
                                >
                                    Next
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
    </div>
);

};

export default Reports;
