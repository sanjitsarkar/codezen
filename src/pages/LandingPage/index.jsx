import React, { useState } from "react";
import { HomePage } from "..";
import { SignupModal } from "../../components";
import { useAuth } from "../../context";
import "./landing_page.scss";

export const LandingPage = () => {
  const { isLoggedIn } = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);
  if (isLoggedIn) return <HomePage />;
  return (
    <>
      <div id="landing-page">
        <SignupModal
          isModalOpen={showSignupModal}
          closeModal={() => setShowSignupModal(false)}
        />
        <div className="top">
          <h2>Share and run your Code in realtime</h2>
          <p>
            An online editor for competitive coder, interviews, teaching and
            many more...
          </p>
          <button
            onClick={(e) => {
              setShowSignupModal(!showSignupModal);
            }}
          >
            Register Now
          </button>
        </div>
      </div>
    </>
  );
};
