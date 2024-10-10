import React, { useState } from 'react';
import { BsCalendar2DateFill } from 'react-icons/bs';
import { DayPicker } from 'react-day-picker';

const Reports = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);

    return (
        <div className="row ml-auto">
            <div className="col-md-4">
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
        </div>
    );
};

export default Reports;
