import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import url from "../../config"; // Import API URL from your config
import '../../components/Reports.css'; // For loader CSS

const MasterAdmin = () => {
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [mappingData, setMappingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [errorDetails, setErrorDetails] = useState([]); // Store backend errors

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Handle template download
  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(`${url}download_mastertemplate`, {
        responseType: "blob", // Expecting a binary file
      });

      // Create a download link for the file
      const mappedurl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = mappedurl;
      link.setAttribute("download", "master_template.xlsx"); // File name for download
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
      const response = await axios.post(`${url}upload_excel_master`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAlert({
        message: response.data.success || "File uploaded successfully.",
        type: response.data.errors?.length ? "warning" : "success",
      });

      setFile(null); // Clear the file input

      // Handle backend errors
      if (response.data.errors?.length > 0) {
        setErrorDetails(response.data.errors);
        // Automatically open the error modal
        const errorModal = new window.bootstrap.Modal(document.getElementById("errorDetailsModal"));
        errorModal.show();
      } else {
        setErrorDetails([]); // Clear previous errors if upload is clean
      }

      fetchallmasterdata(); // Refresh the mapping data after upload
    } catch (error) {
      setAlert({
        message: error.response?.data?.error || "Failed to upload the file.",
        type: "danger",
      });
      setErrorDetails([]);
    }
  };

  // Fetch mapping data from backend
  const fetchallmasterdata = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(`${url}get_all_masterdata`);
      const data = response.data?.data || []; // Access the `data` key and ensure it's an array
      setMappingData(data);
      setIsLoading(false);
    } catch (error) {
      setAlert({ message: "Failed to fetch mapping data.", type: "danger" });
      setIsLoading(false);
    }
  };
  

  // Filter data based on search term
  const filteredData = Array.isArray(mappingData)
    ? mappingData.filter((item) =>  
        Object.values(item).some(
          (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  useEffect(() => {
    fetchallmasterdata(); // Fetch data on component mount
  }, []);

  const handleDelete = async (row) => {
    debugger;
    // Display a confirmation dialog before proceeding
    const isConfirmed = window.confirm(`Are you sure you want to delete this Panel: ${row.panel_id}?`);
    if (!isConfirmed) {
      return; // Exit if the user cancels the action
    }
  
    // Proceed with deletion if confirmed
    setAlert({ message: `Deleting entry with ID: ${row.id}` });
  
    try {
      const response = await axios.delete(`${url}deletemasteruser/${row.id}`);
      if (response.status === 200) {
        setAlert({ message: `Entry with Panel: ${row.panel_id} deleted successfully!` });
        // Optionally update your local state to reflect the deletion
        fetchallmasterdata()
      } else {
        setAlert({ message: `Failed to delete entry with ID: ${row.id}` });
      }
    } catch (error) {
      setAlert({ message: `Error deleting entry with ID: ${row.id}: ${error.message}` });
    }
  };
  
  const columns = [
    { name: "Panel ID", selector: (row) => row.panel_id, sortable: true },
    { name: "State", selector: (row) => row.state, sortable: true },
    { name: "City", selector: (row) => row.city, sortable: true },
    // { name: "Address", selector: (row) => row.address, sortable: true },
    // { name: "Branch Name", selector: (row) => row.branch_name, sortable: true },
    // { name: "Panel location", selector: (row) => row.panel_location, sortable: true },

    {
      name: "Action",
      cell: row => (
              <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(row)}
              >
                  Delete
              </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
  }
  ];

  return (
    <div className="container mt-5">
      {isLoading ? ( // Show loader when loading
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          {/* Error Details Modal */}
          <div className="modal fade" id="errorDetailsModal" tabIndex="-1" aria-labelledby="errorDetailsModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="errorDetailsModalLabel">Error Details</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {errorDetails.length > 0 ? (
                    <div className="error-list">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Panel ID</th>
                            <th>Client ID</th>
                            <th>Merg ID</th>
                            <th>Error</th>
                          </tr>
                        </thead>
                        <tbody>
                          {errorDetails.map((error, index) => (
                            <tr key={index}>
                              <td>{error.panel_id || "N/A"}</td>
                              <td>{error.client_id || "N/A"}</td>
                              <td>{error.merg_id || "N/A"}</td>
                              <td>{error.error}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No errors to display.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6">
              <input
                type="file"
                className="form-control"
                id="file-input"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-success w-100" onClick={handleUpload} disabled={!file}>
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
        </>
      )}
    </div>
  );
};

export default MasterAdmin;
