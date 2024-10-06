import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import Navbar from "../components/Navbar";

const DVRNVR = () => {
  return (
    <div className="container">
      <div className="row col-lg-12">
        {/* Left aligned buttons */}
        <div className="col-lg-6">
        <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="dvrmk_id" className="form-label">DVR Make:</label>
              <input type="text" className="form-control" id="dvrmk_id" placeholder="Enter DVR Make" name="dvrmk_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="stand_id" className="form-label">Standalone</label>
              <input type="text" className="form-control" id="stand_id" placeholder="Enter Standalone Status" name="stand_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="logsta_id" className="form-label">DVR Login Status</label>
              <input type="text" className="form-control" id="logsta_id" placeholder="Enter DVR Status" name="logsta_id" />
            </div>

            <div className="mb-3">
                <label htmlFor="Dashboard_id" className="form-label">Dashboard 118</label>
                <input type="text" className="form-control" id="Dashboard_id" placeholder="Enter Dashboard Status" name="Dashboard_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="ntp_id" className="form-label">NTP Setting</label>
              <input type="text" className="form-control" id="ntp_id" placeholder="Enter NTP" name="ntp_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="camera_id" className="form-label">Camera Count</label>
              <input type="text" className="form-control" id="camera_id" placeholder="Enter Camera Count" name="camera_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="hddrecend_id" className="form-label">HDD Recording End</label>
              <input type="text" className="form-control" id="hddrecend_id" placeholder="Enter Recording End time" name="hddrecend_id" />
            </div>
        </div>
        </div>

        {/* Right aligned buttons */}
        <div className="col-lg-6">
        <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="hddrec_id" className="form-label">HDD recording</label>
              <input type="text" className="form-control" id="hddrec_id" placeholder="Enter Recording" name="hddrec_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="hddcap_id" className="form-label">HDD Capacity</label>
              <input type="text" className="form-control" id="hddcap_id" placeholder="Enter HDD Capacity" name="hddcap_id"/>
            </div>

            <div className="mb-3">
              <label htmlFor="sdrec_id" className="form-label">SD Recording</label>
              <input type="text" className="form-control" id="sdrec_id" placeholder="Enter SD Recording" name="sdrec_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="hddrtec_id" className="form-label">HDD Recording</label>
              <input type="text" className="form-control" id="hddrtec_id" placeholder="Enter HDD Recording" name="hddrtec_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="hddrecst_id" className="form-label">HDD Recording Start</label>
              <input type="text" className="form-control" id="hddrecst_id" placeholder="Enter HDD Recording start" name="hddrecst_id" />
            </div>
            
            <div className="mb-3">
              <label htmlFor="atm_id" className="form-label">HDD Recording End</label>
              <input type="text" className="form-control" id="hddrec_id" placeholder="Enter ATM ID" name="atm_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="hddsrno_id" className="form-label">HDD Serial Number</label>
              <input type="text" className="form-control" id="hddsrno_id" placeholder="Enter HDD Serial Number" name="hddsrno_id" />
            </div>
            
            <div className="mb-3">
                <button type="button" className="btn btn-success me-2" id="save_id">Save</button>
                <Link to='/senserstatus'>
                    <button type="button" className="btn btn-success" id="sane_id">Save & Next</button>
                </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default DVRNVR