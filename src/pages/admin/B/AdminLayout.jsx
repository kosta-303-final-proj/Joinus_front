import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './AdminLayout.css';

const AdminLayout = ({ children, title }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Header title={title} />
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;