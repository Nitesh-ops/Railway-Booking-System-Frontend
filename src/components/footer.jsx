import React from "react";
import "./footer.css";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaCopyright,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer text-center">
      <FaFacebook size={22} /> <FaInstagram size={22} />
      {"  "}
      <FaLinkedin size={22} /> <FaGithub size={22} />
      &nbsp;&nbsp;&nbsp;Copyright @Book My Train
    </div>
  );
};

export { Footer };
