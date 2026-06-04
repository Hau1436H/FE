import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';

function Jobs(){
    return (
         <div className="d-flex" style={{ backgroundColor: '#020205', minHeight: '100vh', fontFamily: 'system-ui' }}>
            <Sidebar />
            <div className="p-4">
                <p>Welcome to the Jobs Page!</p>
            </div>
        </div>
    )
}

export default Jobs;