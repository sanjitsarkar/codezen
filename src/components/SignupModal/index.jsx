import React from "react";
import Modal from "react-modal";
import { useAuth } from "../../context";
const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(1, 1, 1, 0.75)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "25%",
    boxShadow: "0 0 1em rgba(0,0,0,.3)",
  },
};

Modal.setAppElement("#root");
export const SignupModal = ({ isModalOpen, closeModal }) => {
  const { user, signUp, signupCred, setSignupCred } = useAuth();
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Signup"
    >
      <form
        id="signup"
        onSubmit={async (e) => {
          e.preventDefault();
          await signUp(signupCred);
          closeModal();
        }}
      >
        <input
          type="text"
          value={signupCred.name}
          onChange={(e) => {
            setSignupCred({ ...signupCred, name: e.target.value });
          }}
          placeholder="Full name"
          required
        />
        <input
          type="email"
          value={signupCred.email}
          onChange={(e) => {
            setSignupCred({ ...signupCred, email: e.target.value });
          }}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={signupCred.password}
          onChange={(e) => {
            setSignupCred({ ...signupCred, password: e.target.value });
          }}
          placeholder="Confirm Password"
          required
        />
        <input
          type="password"
          value={signupCred.confirmPassword}
          onChange={(e) => {
            setSignupCred({
              ...signupCred,
              confirmPassword: e.target.value,
            });
          }}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={user.loading}>
          {!user.loading ? "Signup" : "Creating account...."}
        </button>
      </form>
    </Modal>
  );
};
