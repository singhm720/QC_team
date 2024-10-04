import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'

const ppminfo = () => {

    const today = new Date().toISOString().split('T')[0];
  
    const [date, setDate] = useState(today);
  return (
    <div className="container">
      <div className="row col-lg-12">
        {/* Left aligned buttons */}
        <div className="col-lg-6">
        <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="panel_id" className="form-label">Panel ID:</label>
              <input type="text" className="form-control" id="panel_id" placeholder="Enter Panel ID" name="panel_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="client_id" className="form-label">Client</label>
              <input type="text" className="form-control" id="client_id" placeholder="Enter Client" name="client_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="Merg_id" className="form-label">Merg</label>
              <input type="text" className="form-control" id="Merg_id" placeholder="Merg" name="Merg_id" />
            </div>

            <div className="mb-3">
                <label htmlFor="checkingDate" className="form-label">Checking Date</label>
                <input 
                    type="date" 
                    className="form-control" 
                    id="checkingDate" 
                    name="checkingDate"
                    value={date} // Sets default value to today's date
                    onChange={(e) => setDate(e.target.value)} // Allows user to update the date
                />
            </div>

            <div className="mb-3">
              <label htmlFor="secv_id" className="form-label">Second Visit</label>
              <input type="text" className="form-control" id="secv_id" placeholder="Enter Contact No." name="secv_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="qcass_id" className="form-label">QC Assigned</label>
              <input type="text" className="form-control" id="qcass_id" placeholder="Enter QC Name." name="qcass_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="dvrs_id" className="form-label">DVR Serial Number</label>
              <input type="text" className="form-control" id="dvrs_id" placeholder="Enter DVR S/N No." name="dvrs_id" />
            </div>
        </div>
        </div>

        {/* Right aligned buttons */}
        <div className="col-lg-6">
        <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label className="form-label">AM</label>
              <select className="form-select" id="am" name="am">
                <option value="M">AM-1</option>
                <option value="F">AM-2</option>
                <option value="O">AM-3</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="engna_id" className="form-label">Enginner Name</label>
              <input type="text" className="form-control" id="engna_id" placeholder="Enter Engineer Name" name="engna_id"/>
            </div>

            <div className="mb-3">
              <label htmlFor="ecode_id" className="form-label">E-Code</label>
              <input type="text" className="form-control" id="ecode_id" placeholder="Enter Employee Code" name="ecode_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="engnu_id" className="form-label">Enginner Mobile Number</label>
              <input type="text" className="form-control" id="engnu_id" placeholder="Enter Number" name="engnu_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="addpin_id" className="form-label">Address Pincode</label>
              <input type="text" className="form-control" id="addpin_id" placeholder="Enter Pincode" name="addpin_id" />
            </div>
            
            <div className="mb-3">
              <label htmlFor="atm_id" className="form-label">ATM ID</label>
              <input type="text" className="form-control" id="atm_id" placeholder="Enter ATM ID" name="atm_id" />
            </div>
            
            <div className="mb-3">
                <button type="button" className="btn btn-success me-2" id="save_id">Save</button>
                <Link to='/dvrnvr'>
                    <button type="button" className="btn btn-success" id="sane_id">Save & Next</button>
                </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ppminfo;
