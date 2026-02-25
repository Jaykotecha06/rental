import React from "react";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav
      className="navbar navbar-light bg-white shadow-sm px-4"
      style={{
        marginLeft: "10px",
        height: "60px",
      }}
    >
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h5">
          Rental Management System
        </span>

        <div className="d-flex align-items-center">
          <FaUserCircle size={30} className="me-2 text-primary" />
          <span>{user?.name || user?.email}</span>
        </div>
      </div>
    </nav>
  );
};

export default Header;