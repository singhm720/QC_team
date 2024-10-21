import React, { useState, useEffect } from 'react';
import { BsCalendar2DateFill } from 'react-icons/bs';
import { DayPicker } from 'react-day-picker';
import DataTable from 'react-data-table-component';
import './Reports.css';

const Reports = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);
    const [apiData, setApiData] = useState([]);
    const [records, setRecords] = useState([]);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/getallppminfo');
                const result = await response.json();
                const dataArray = Array.isArray(result) ? result : [result];
                setApiData(dataArray);
                setRecords(dataArray); // Initially display all records
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Function to handle the "Show" button click
    const handleShow = (row) => {
        alert(`Showing details for Panel ID: ${row.panel_id}`);
    };

    // Function to handle the "Edit" button click
    const handleEdit = (row) => {
        alert(`Editing data for Panel ID: ${row.panel_id}`);
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
            selector: row => new Date(row.checking_date).toLocaleDateString(),
            sortable: true
        },
        {
            name: "Final Status",
            selector: row => row.final_status,
            sortable: true
        },
        {
            name: "Action",
            cell: row => (
                <div>
                    <button className="btn btn-info btn-sm" onClick={() => handleShow(row)}>
                        Show
                    </button>{' '}
                    <button className="btn btn-primary btn-sm" onClick={() => handleEdit(row)}>
                        Edit
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    // Handle search input
    const handleChange = (e) => {
        const query = e.target.value.toLowerCase();
        const filteredRecords = apiData.filter(item =>
            item.panel_id.toString().toLowerCase().includes(query)
        );
        setRecords(filteredRecords);
    };

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

    return (
        <div className="row ml-auto">
            <div className="col-md-3">
                <div className="form-group row">
                    <label className="col-form-label">Download Reports</label>
                </div>
            </div>
            <div className="col-md-4">
                <div className="form-group row">
                    <label className="col-md-4 col-form-label">Start Date&nbsp;:</label>
                    <div className="col-md-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <BsCalendar2DateFill />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Select start date"
                                onClick={() => setIsStartOpen(!isStartOpen)}
                                value={startDate ? startDate.toLocaleDateString() : ''}
                                readOnly
                            />
                            {isStartOpen && (
                                <DayPicker
                                    onDayClick={(day) => {
                                        setStartDate(day);
                                        setIsStartOpen(false);
                                    }}
                                    selected={startDate}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="form-group row">
                    <label className="col-md-4 col-form-label">End Date&nbsp;:</label>
                    <div className="col-md-6">
                        <div className="input-group">
                            <span className="input-group-text">
                                <BsCalendar2DateFill />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Select end date"
                                onClick={() => setIsEndOpen(!isEndOpen)}
                                value={endDate ? endDate.toLocaleDateString() : ''}
                                readOnly
                            />
                            {isEndOpen && (
                                <DayPicker
                                    onDayClick={(day) => {
                                        setEndDate(day);
                                        setIsEndOpen(false);
                                    }}
                                    selected={endDate}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <input type="text" placeholder="Search By Panel ID" className="search" onChange={handleChange} />
            </div>
            <div className="homeDiv">
                <DataTable
                    columns={columns}
                    data={records}
                    customStyles={customStyles}
                    pagination
                />
            </div>
        </div>
    );
};

export default Reports;
