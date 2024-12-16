import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";  // Import DataTable component
import url from "../../config";
import '../../components/Reports.css';  //for loader css

const MappingAdmin = () => {
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [mappingData, setMappingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loader state

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle template download
  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(`${url}download_template`, {
        responseType: "blob", // Expecting a binary file
      });

      // Create a download link for the file
      const mappedurl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = mappedurl;
      link.setAttribute("download", "mapping_template.xlsx"); // File name for download
      document.body.appendChild(link);
      link.click();
      link.remove();

      setAlert({ message: "Template downloaded successfully.", type: "success" });
    } catch (error) {
      setAlert({ message: "Failed to download the template.", type: "danger" });
    }
  };

  // Handle file upload
  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setAlert({ message: "Please select a file before uploading.", type: "danger" });
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(`${url}upload_excel_mapping`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setAlert({ message: response.data.success || "File uploaded successfully.", type: "success" });
      setFile(null); // Clear the file input
      fetchMappingData(); // Refresh the mapping data after upload
    } catch (error) {
      setAlert({
        message: error.response?.data?.error || "Failed to upload the file.",
        type: "danger",
      });
    }
  };

  // Fetch mapping data from backend
  const fetchMappingData = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(`${url}get_mapping_data`);
      const data = Array.isArray(response.data) ? response.data : []; // Ensure it's an array
      setIsLoading(false);
      setMappingData(data);
    } catch (error) {
      setAlert({ message: "Failed to fetch mapping data.", type: "danger" });
    }
  };

  // Filter data based on search term
  const filteredData = Array.isArray(mappingData)
    ? mappingData.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  useEffect(() => {
    fetchMappingData(); // Fetch data on component mount
  }, []);

  // Columns for DataTable
  const columns = [
    {
      name: "Panel",
      selector: row => row.Panel,
      sortable: true
    },
    {
      name: "Panel Type",
      selector: row => row.Panel_Type,
      sortable: true
    },
    {
      name: "Client",
      selector: row => row.Client,
      sortable: true
    },
    {
      name: "Area Manager",
      selector: row => row.Area_Manager,
      sortable: true
    },
    {
      name: "Engineer Name",
      selector: row => row.Engineer_Name,
      sortable: true
    },
    {
      name: "Employee Code",
      selector: row => row.Employee_Code,
      sortable: true
    }
  ];

  return (
    <div>
        {isLoading ? ( // Show loader when loading
            <div className="loader-container">
                <div className="spinner"></div>
                <p>Loading data...</p>
            </div>
        ) : (
            <>
            <div className="container mt-5">
            <div className="row mt-4">
                <div className="col-md-6">
                {/* <label htmlFor="file-input" className="form-label">Choose File</label> */}
                <input
                    type="file"
                    className="form-control"
                    id="file-input"
                    accept=".xls,.xlsx"
                    onChange={handleFileChange}
                />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                <button
                    className="btn btn-success w-100"
                    onClick={handleUpload}
                    disabled={!file}
                >
                    Upload
                </button>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                <button className="btn btn-primary w-100" onClick={handleDownloadTemplate}>
                    Download Excel Template
                </button>
                </div>
            </div>
            {alert.message && (
                <div className={`alert alert-${alert.type} mt-3`} role="alert">
                {alert.message}
                </div>
            )}

            <hr className="my-4" />

            <div className="row mt-4">
                <div className="col-md-12">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    subHeader
                    subHeaderComponent={
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control"
                    />
                    }
                    highlightOnHover
                    responsive
                />
                </div>
            </div>
            </div>
            </>
            )}
    </div>
)};

export default MappingAdmin;
