import React, { useState } from 'react';
import '../components/Reports.css';

const SetLoading = () => {

    const [isLoading, setIsLoading] = useState(true); // Loader state
    return(
        <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading data...</p>
        </div>
)}
export default SetLoading;