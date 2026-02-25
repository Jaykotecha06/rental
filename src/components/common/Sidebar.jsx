import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  FaTachometerAlt, 
  FaHome, 
  FaLightbulb, 
  FaMoneyBill, 
  FaWallet, 
  FaFileAlt,
  FaSignOutAlt,
  FaUserCircle
} from 'react-icons/fa';
import { logout } from '../../redux/actions/authActions';
import './Sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/rent', name: 'Rent', icon: <FaHome /> },
    { path: '/lightbill', name: 'Light Bill', icon: <FaLightbulb /> },
    { path: '/deposit', name: 'Deposit', icon: <FaMoneyBill /> },
    { path: '/expense', name: 'Expense', icon: <FaWallet /> },
    { path: '/document', name: 'Document', icon: <FaFileAlt /> }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Rental Manager</h3>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <NavLink 
            to={item.path} 
            key={index}
            className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt className="me-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;