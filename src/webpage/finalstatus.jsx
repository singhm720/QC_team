import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'

const FinalStatus = () => {
    
  return (
    <div className="container">
      <div className="row col-lg-12">
        {/* Left aligned buttons */}
        <div className="col-lg-6">
        <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="remark_id" className="form-label">Remark:</label>
              <input type="text" className="form-control" id="remark_id" placeholder="Enter DVR Make" name="remark_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="status_id" className="form-label">Status:</label>
              <input type="text" className="form-control" id="status_id" placeholder="Enter Status" name="status_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="fstatus_id" className="form-label">Final Status</label>
              <input type="text" className="form-control" id="fstatus_id" placeholder="Enter HDD Recording" name="fstatus_id" />
            </div>

            <div className="mb-3">
                <label htmlFor="assignto_id" className="form-label">Assgined TO</label>
                <input type="text" className="form-control" id="assignto_id" placeholder="Enter Dashboard Status" name="assignto_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="today_id" className="form-label">Today</label>
              <input type="text" className="form-control" id="today_id" placeholder="Enter NTP" name="today_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="rectify_id" className="form-label">Rectify</label>
              <input type="text" className="form-control" id="rectify_id" placeholder="Enter Recording" name="rectify_id" />
            </div>

        </div>
        </div>

        {/* Right aligned buttons */}
        <div className="col-lg-6">
        <div className="border border-secondary p-3 rounded">
            
            <div className="mb-3">
              <label htmlFor="month_id" className="form-label">Month</label>
              <input type="text" className="form-control" id="month_id" placeholder="Enter HDD Capacity" name="month_id"/>
            </div>

            <div className="mb-3">
              <label htmlFor="quartly_id" className="form-label">Quarterly status</label>
              <input type="text" className="form-control" id="quartly_id" placeholder="Enter SD Recording" name="quartly_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="polist_id" className="form-label">Police Station No</label>
              <input type="text" className="form-control" id="polist_id" placeholder="Enter HDD Recording" name="polist_id" />
            </div>
            
            <div className="mb-3">
              <label htmlFor="firest_id" className="form-label">Fire Station No</label>
              <input type="text" className="form-control" id="firest_id" placeholder="Enter HDD Recording" name="firest_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="faulty_id" className="form-label">Faulty</label>
              <input type="text" className="form-control" id="faulty_id" placeholder="Enter HDD Recording" name="faulty_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="actiontk_id" className="form-label">Action</label>
              <input type="text" className="form-control" id="actiontk_id" placeholder="Enter HDD Recording" name="actiontk_id" />
            </div>

            <div className="mb-3">
                <button type="button" className="btn btn-success me-2" id="save_id">Save</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default FinalStatus