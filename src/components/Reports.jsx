import React, { useState, useEffect } from 'react';
import { BsCalendar2DateFill } from 'react-icons/bs';
import { BsFileEarmarkExcelFill } from "react-icons/bs";
import DatePicker from "react-datepicker";
import DataTable from 'react-data-table-component';
import './Reports.css';
import url from '../config';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

const Reports = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [apiData, setApiData] = useState([]);
    const [records, setRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}getallppminfo`);
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
            name: "Final Status",
            selector: row => row.final_status,
            sortable: true
        },
        // {
        //     name: "Action",
        //     cell: row => (
        //         <div>
        //             <button className="btn btn-info btn-sm" onClick={() => handleShow(row)}>
        //                 Show
        //             </button>{' '}
        //             <button className="btn btn-primary btn-sm" onClick={() => handleEdit(row)}>
        //                 Edit
        //             </button>
        //         </div>
        //     ),
        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     button: true,
        // }
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
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }

        const start = startDate.toISOString().split('T')[0]; // Format date
        const end = endDate.toISOString().split('T')[0]; // Format date

        try {
            const response = await fetch(`${url}api/download-report?start_date=${start}&end_date=${end}`, {
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

   return (
    <div>
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
                            selected={startDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="dd/MM/yyyy" // Set display format in DatePicker
                            value={endDate ? format(new Date(endDate), 'dd/MM/yyyy') : ''} // Format existing date
                            />
                    </div>
                </div>
            </div>

            <div className="col-md-2">
                <div className="form-group">
                    <label className="col-form-label">Download Report:</label>
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

            <div className="col-md-4">
                <input
                    type="text"
                    placeholder="Search By Panel ID"
                    className="form-control"
                    value={searchTerm}
                    onChange={handleChange}
                />
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
    </div>
);

};

export default Reports;
