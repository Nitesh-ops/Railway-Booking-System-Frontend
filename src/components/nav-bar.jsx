import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCurrentUser } from "../store/actions/user";
import { Role } from "../models/role";
import { useNavigate } from "react-router-dom";
import { MdLogin, MdLogout } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { TiHome } from "react-icons/ti";
import { IoTicketOutline } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { AiOutlineSearch } from "react-icons/ai";
import "./nav-bar.css";
import { PnrStatus } from "./PnrStatus";

const NavBar = () => {
  const currentUser = useSelector((state) => state.user);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(clearCurrentUser());
    navigate("/login");
  };

  return (
    <nav className="navbar sticky-top navbar-expand-sm bg-primary navbar-dark">
      <div className="container-fluid">
        <a href="/home" className="navbar-brand">
          <img
            src="https://toppng.com/public/uploads/thumbnail/indian-train-white-background-11549889698anaad4mqde.png"
            alt="train_logo"
            height={40}
          />
          &nbsp;BookMyTrain
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <div className="navbar-nav me-auto">
            {currentUser?.role === Role.ADMIN && (
              <li className="nav-item">
                <NavLink to="/admin" className="nav-link">
                  <RiAdminFill /> Admin
                </NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink to="/home" className="nav-link">
                <TiHome /> Home
              </NavLink>
            </li>

            {/* added this */}
            {currentUser?.role === Role.USER && (
              <li className="nav-item">
                <NavLink to="/book" className="nav-link">
                  <IoTicketOutline /> Book Ticket
                </NavLink>
              </li>
            )}

            <li className="nav-item">
              <a onClick={handleShow} className="nav-link">
                <AiOutlineSearch /> PNR Status
              </a>
            </li>
          </div>

          <PnrStatus show={show} onHide={handleClose} />

          {!currentUser && (
            <div className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink to="/register" className="nav-link">
                  <FaUserPlus /> Sign Up
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link">
                  <MdLogin /> Sign In
                </NavLink>
              </li>
            </div>
          )}

          {currentUser && (
            <div className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink to="/profile" className="nav-link">
                  Welcome {currentUser.name}
                </NavLink>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link" onClick={() => logout()}>
                  <MdLogout /> Sign Out
                </a>
              </li>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export { NavBar };
