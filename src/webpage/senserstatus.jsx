import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'

const SenserStatus = () => {
    
  return (
    <div className="container">
      <div className="row col-lg-12">
        {/* Left aligned buttons */}
        <div className="col-lg-6">
        <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="ups_id" className="form-label">Mains / UPS:</label>
              <input type="text" className="form-control" id="ups_id" placeholder="Enter DVR Make" name="ups_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="ntwoway_id" className="form-label">Normal Two Way Status:</label>
              <input type="text" className="form-control" id="ntwoway_id" placeholder="Enter Standalone Status" name="ntwoway_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="stwoway_id" className="form-label">Sim base Two way</label>
              <input type="text" className="form-control" id="stwoway_id" placeholder="Enter DVR Status" name="stwoway_id" />
            </div>

            <div className="mb-3">
                <label htmlFor="smokes_id" className="form-label">Smoke Status</label>
                <input type="text" className="form-control" id="smokes_id" placeholder="Enter Dashboard Status" name="smokes_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="panic_id" className="form-label">Panic</label>
              <input type="text" className="form-control" id="panic_id" placeholder="Enter NTP" name="panic_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="pir_id" className="form-label">PIR</label>
              <input type="text" className="form-control" id="pir_id" placeholder="Enter Camera Count" name="pir_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="senser_id" className="form-label">Senser Status</label>
              <input type="text" className="form-control" id="senser_id" placeholder="Enter Recording End time" name="senser_id" />
            </div>
        </div>
        </div>

        {/* Right aligned buttons */}
        <div className="col-lg-6">
        <div className="border border-secondary p-3 rounded">
            <div className="mb-3">
              <label htmlFor="senser_id" className="form-label">Siren working</label>
              <input type="text" className="form-control" id="senser_id" placeholder="Enter Recording" name="senser_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="relays_id" className="form-label">Relay status</label>
              <input type="text" className="form-control" id="relays_id" placeholder="Enter HDD Capacity" name="relays_id"/>
            </div>

            <div className="mb-3">
              <label htmlFor="videocal_id" className="form-label">Video Call</label>
              <input type="text" className="form-control" id="videocal_id" placeholder="Enter SD Recording" name="videocal_id" />
            </div>

            {/* <div className="mb-3">
              <label htmlFor="routers_id" className="form-label">Router Signal</label>
              <input type="text" className="form-control" id="routers_id" placeholder="Enter HDD Recording" name="routers_id" />
            </div>

            <div className="mb-3">
              <label htmlFor="router_id" className="form-label">Router Sim</label>
              <input type="text" className="form-control" id="router_id" placeholder="Enter HDD Recording start" name="router_id" />
            </div> */}
            
            <div className="mb-3">
                <button type="button" className="btn btn-success me-2" id="save_id">Save</button>
                <Link to='/routerinfo'>
                    <button type="button" className="btn btn-success" id="sane_id">Save & Next</button>
                </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default SenserStatus