import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LoginModal } from "..";
import { useAuth } from "../../context";
import { SignupModal } from "../SignupModal";
import "./header.scss";

export const Header = () => {
  const { user, isLoggedIn, logOut } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  return (
    <div className="header">
      <LoginModal
        isModalOpen={showLoginModal}
        closeModal={() => setShowLoginModal(false)}
      />
      <SignupModal
        isModalOpen={showSignupModal}
        closeModal={() => setShowSignupModal(false)}
      />
      <div className="left">
        <h1>
          <Link to="/" className="site_title">
            {" "}
            CodeZen
          </Link>
        </h1>
      </div>
      <div className="right">
        {isLoggedIn ? (
          <>
            <h2 id="user_name">{user?.data?.name}</h2>

            <button
              onClick={() => {
                logOut();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => {
                setShowLoginModal(!showLoginModal);
              }}
            >
              Login
            </button>

            <button
              onClick={(e) => {
                setShowSignupModal(!showSignupModal);
              }}
            >
              Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
};
