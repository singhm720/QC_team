import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'

const Infrastructure = () => {
    
  return (
    <div className="container">
      <div className="row col-lg-12">
        {/* Left aligned buttons */}
        <div className="col-lg-6">
        <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="corecab_id" className="form-label">Core Cable:</label>
              <input type="text" className="form-control" id="corecab_id" placeholder="Enter DVR Make" name="corecab_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="linenut_id" className="form-label">Line-Nutral:</label>
              <input type="text" className="form-control" id="linenut_id" placeholder="Enter Standalone Status" name="linenut_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="lineear_id" className="form-label">Line-Earth </label>
              <input type="text" className="form-control" id="lineear_id" placeholder="Enter HDD Recording" name="lineear_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="earthnu_id" className="form-label">Earth-Nutral</label>
              <input type="text" className="form-control" id="earthnu_id" placeholder="Enter HDD Recording start" name="earthnu_id" />
            </div>

            <div className="mb-3">
                <label htmlFor="panelbv_id" className="form-label">Panel Battery Voltage</label>
                <input type="text" className="form-control" id="panelbv_id" placeholder="Enter Dashboard Status" name="panelbv_id" />
            </div>

            <div className="mb-3">
                <button type="button" className="btn btn-success me-2" id="save_id">Save</button>
                <Link to='/finalstatus'>
                    <button type="button" className="btn btn-success" id="sane_id">Save & Next</button>
                </Link>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
};
export default Infrastructure