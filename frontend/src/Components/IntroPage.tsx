import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./IntroPage.css";

import laravelIcon from "../assets/icons/laravel-icon.svg";
import reactIcon from "../assets/icons/react-icon.svg";
import typescriptIcon from "../assets/icons/typescript-icon.svg";

const IntroPage = () => {
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/crypto-analyzer");
    }, 1000);
  };

  return (
    <div
      className={`intro-page ${isExiting ? "fade-out" : ""}`}
      onClick={() => {
        if (!isExiting) handleNavigation();
      }}
    >
      <h1 className="intro-title">
        Welcome to <span className="bitnova">Bitnova</span>
      </h1>
      <p className="intro-description">
        Bitnova is built with modern technologies to provide cryptocurrency
        analysis.
      </p>
      <div className="tech-icons">
        <div className="icon">
          <img src={laravelIcon} alt="Laravel" />
          <p>Laravel</p>
        </div>
        <div className="icon">
          <img src={reactIcon} alt="React" />
          <p>React</p>
        </div>
        <div className="icon">
          <img src={typescriptIcon} alt="TypeScript" />
          <p>TypeScript</p>
        </div>
      </div>
      <p className="prompt-text">Click anywher to proceed</p>
      <button
        className="next-button"
        onClick={(e) => {
          e.stopPropagation();
          if (!isExiting) handleNavigation();
        }}
      >
        Explore Now
      </button>
    </div>
  );
};

export default IntroPage;
