import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'

const RouterInfo = () => {
    
  return (
    <div className="container">
      <div className="row col-lg-12">
        {/* Left aligned buttons */}
        <div className="col-lg-6">
        <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="router_id" className="form-label">Router 20.24:</label>
              <input type="text" className="form-control" id="router_id" placeholder="Enter DVR Make" name="router_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="pinmgar_id" className="form-label">Ping Break After Reset:</label>
              <input type="text" className="form-control" id="pinmgar_id" placeholder="Enter Standalone Status" name="pinmgar_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="routers_id" className="form-label">Router Signal</label>
              <input type="text" className="form-control" id="routers_id" placeholder="Enter HDD Recording" name="routers_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="router_id" className="form-label">Router Sim</label>
              <input type="text" className="form-control" id="router_id" placeholder="Enter HDD Recording start" name="router_id" />
            </div>

            <div className="mb-3">
                <label htmlFor="smokes_id" className="form-label">Smoke Status</label>
                <input type="text" className="form-control" id="smokes_id" placeholder="Enter Dashboard Status" name="smokes_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="antinaloca_id" className="form-label">Anntina Location</label>
              <input type="text" className="form-control" id="antinaloca_id" placeholder="Enter NTP" name="antinaloca_id" />
            </div>
        </div>
        </div>

        {/* Right aligned buttons */}
        <div className="col-lg-6">
        <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="antinatyp_id" className="form-label">Anntina Type</label>
              <input type="text" className="form-control" id="antinatyp_id" placeholder="Enter Recording" name="antinatyp_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="cabling_id" className="form-label">Cabling</label>
              <input type="text" className="form-control" id="cabling_id" placeholder="Enter HDD Capacity" name="cabling_id"/>
            </div>

            <div className="mb-3">
              <label htmlFor="routersn_id" className="form-label">Router Serial Number</label>
              <input type="text" className="form-control" id="routersn_id" placeholder="Enter SD Recording" name="routersn_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="simnum_id" className="form-label">SIM Number</label>
              <input type="text" className="form-control" id="simnum_id" placeholder="Enter HDD Recording" name="simnum_id" />
            </div>
            
            <div className="mb-3">
                <button type="button" className="btn btn-success me-2" id="save_id">Save</button>
                <Link to='/infrastructure'>
                    <button type="button" className="btn btn-success" id="sane_id">Save & Next</button>
                </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default RouterInfo