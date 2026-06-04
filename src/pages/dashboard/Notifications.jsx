import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';

function Notifications(){
    return (
         <div className="d-flex" style={{ backgroundColor: '#020205', minHeight: '100vh', fontFamily: 'system-ui' }}>
            <Sidebar />
            <div className="p-4">
                <p>Welcome to the Notifications Page!</p>
            </div>
        </div>
    )
}

export default Notifications;